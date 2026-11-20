/**
 * Soft, felt-hammer sounds for the identity card. Same voice as the scroll
 * chimes in `use-scroll-sfx`: filtered sines, tiny gains, long exhales.
 * Nothing here plays without a preceding user gesture (the folio opens from a
 * click), so autoplay policy never blocks it.
 */

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!sharedContext) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      sharedContext = new Ctor();
    } catch {
      return null;
    }
  }

  if (sharedContext.state === "suspended") {
    void sharedContext.resume().catch(() => {});
  }

  return sharedContext;
}

/** A muted thump: the card meeting the table. */
function tap(ctx: AudioContext, at: number, frequency: number, peak: number) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.14);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, at);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.55, at + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(at);
  osc.stop(at + 0.16);
}

/** A whisper of filtered noise: the edge of the card brushing the surface. */
function brush(ctx: AudioContext, at: number, peak: number) {
  const length = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 0.9;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peak, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(at);
  source.stop(at + 0.06);
}

/** The music-box chime from the scroll SFX, pitched per event. */
function chime(ctx: AudioContext, at: number, frequency: number, peak: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1700;
  filter.Q.value = 0.3;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, at);
  master.gain.linearRampToValueAtTime(peak, at + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, at + 0.85);

  filter.connect(master);
  master.connect(ctx.destination);

  const partials: Array<[number, number]> = [
    [frequency, 1],
    [frequency * 2, 0.22]
  ];
  for (const [partialFrequency, amplitude] of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(partialFrequency, at);
    const gain = ctx.createGain();
    gain.gain.value = amplitude;
    osc.connect(gain);
    gain.connect(filter);
    osc.start(at);
    osc.stop(at + 0.9);
  }
}

/** Card lifted and turned over: brush, soft thump, rising chime (G5),
 *  then the weight of it landing face-down as the flip completes. */
export function playCardOpen() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  brush(ctx, now, 0.012);
  tap(ctx, now + 0.02, 170, 0.028);
  chime(ctx, now + 0.5, 783.99, 0.012);
  tap(ctx, now + 1.24, 130, 0.022);
}

/** Card set back down: lift, a lower resolving chime (C5), then landing. */
export function playCardClose() {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  tap(ctx, now, 150, 0.02);
  brush(ctx, now + 0.03, 0.009);
  chime(ctx, now + 0.32, 523.25, 0.01);
  tap(ctx, now + 0.9, 125, 0.024);
}
