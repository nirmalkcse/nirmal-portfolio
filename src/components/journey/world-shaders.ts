/* ═══════════════════════════════════════════════════════════════════════
   The world.

   One landscape, lit by one sun, seen by one camera, all driven by the
   element weights. The terrain's own height function carries five
   landforms at once (terraced canyon, river delta, caldera, alpine
   ridge, night silhouette) and blends between them; the sky, the water,
   the mist and the particles follow the same weights. Everything renders
   in linear HDR and is tone-mapped after bloom, so sun, lava, embers and
   stars actually glow.
   ═══════════════════════════════════════════════════════════════════════ */

const noise = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float hash31(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
      value += amplitude * vnoise(p);
      p = rotate * p * 2.02 + vec2(1.7, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  float fbm4(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      value += amplitude * vnoise(p);
      p = rotate * p * 2.02 + vec2(1.7, 9.2);
      amplitude *= 0.5;
    }
    return value;
  }

  float ridged(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      float n = 1.0 - abs(2.0 * vnoise(p) - 1.0);
      value += amplitude * n * n;
      p = rotate * p * 2.1 + vec2(3.3, 1.7);
      amplitude *= 0.5;
    }
    return value;
  }
`;

/* The five landforms, as one height field. */
const terrainHeight = /* glsl */ `
  uniform float uW[5];

  float terrainHeight(vec2 p) {
    float dist = length(p);
    float far = smoothstep(60.0, 160.0, dist);
    vec2 q = p * 0.02;
    float base = fbm(q) * 2.0 - 1.0;
    float ridge = ridged(q * 2.2 + 7.0);
    float detail = fbm4(p * 0.12 + 2.0) - 0.5;

    /* Earth: mesas and terraces cut by slow water */
    float eRaw = base * 4.0 + ridge * 5.0 + detail * 0.8;
    float steps = 1.1;
    float eQ = floor(eRaw * steps) / steps;
    float eF = fract(eRaw * steps);
    float terrace = eQ + smoothstep(0.3, 0.7, eF) / steps;
    float earth = mix(eRaw, terrace, 0.8) + far * 10.0 * ridge + 2.0;

    /* Water: open sea, a coast rising to the west, headlands far out */
    float coast = smoothstep(-18.0, -52.0, p.x);
    float islands = smoothstep(0.3, 0.7, fbm4(p * 0.01 + 3.0));
    float head = smoothstep(80.0, 150.0, dist) * islands;
    float seabed = base * 1.2 + detail * 0.3 - 1.6;
    float shoreLand = base * 2.5 + ridge * 4.0 + detail * 0.6 + 2.5;
    float water = mix(seabed, shoreLand, coast) + head * ridge * 16.0;

    /* Fire: a caldera ring around a lava floor */
    float r = length(p - vec2(0.0, -70.0));
    float rim = exp(-pow((r - 42.0) * 0.045, 2.0)) * 11.0;
    float bowl = -exp(-pow(r * 0.025, 2.0)) * 6.0;
    float fire = base * 2.5 + ridge * 4.0 + rim + bowl + detail * 1.2 + far * 8.0 * ridge + 1.0;

    /* Air: alpine ridges */
    float air = base * 5.0 + ridge * 16.0 + detail * 1.4 + far * 16.0 * ridge + 3.0;

    /* Ether: the same ridges, lower, as silhouettes */
    float ether = air * 0.85 - 1.0;

    return uW[0] * earth + uW[1] * water + uW[2] * fire + uW[3] * air + uW[4] * ether;
  }
`;

export const terrainVertex = /* glsl */ `
  ${noise}
  ${terrainHeight}

  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vHeight;

  void main() {
    vec2 xz = vec2(position.x, -position.y - 90.0);
    float e = 0.6;
    float h = terrainHeight(xz);
    float hx = terrainHeight(xz + vec2(e, 0.0));
    float hz = terrainHeight(xz + vec2(0.0, e));
    vec3 world = vec3(xz.x, h, xz.y);
    vNormal = normalize(vec3(h - hx, e, h - hz));
    vWorld = world;
    vHeight = h;
    gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  }
`;

export const terrainFragment = /* glsl */ `
  ${noise}

  uniform float uW[5];
  uniform float uTime;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uGroundColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uSnowLine;
  uniform float uWaterLevel;
  uniform float uExposure;

  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vHeight;

  void main() {
    vec2 p = vWorld.xz;
    /* Fine relief, so the ground keeps its grain right up to the camera. */
    float relief = fbm4(p * 1.6);
    float reliefX = fbm4(p * 1.6 + vec2(0.08, 0.0));
    float reliefZ = fbm4(p * 1.6 + vec2(0.0, 0.08));
    float bumpStrength = uW[0] * 0.9 + uW[1] * 0.5 + uW[2] * 1.1 + uW[3] * 0.8 + uW[4] * 0.6;
    vec3 N = normalize(normalize(vNormal) + vec3(relief - reliefX, 0.0, relief - reliefZ) * bumpStrength * 4.0);
    float slope = 1.0 - N.y;
    float micro = vnoise(p * 2.5) * 0.5 + vnoise(p * 9.0) * 0.5;
    float h = vHeight;

    /* Earth: sedimentary bands, darker at every seam */
    float band = h * 0.75 + micro * 0.25;
    float bandIndex = floor(band);
    float bandFract = fract(band);
    float bandHue = hash21(vec2(bandIndex, 1.0));
    vec3 sand = vec3(0.86, 0.76, 0.60);
    vec3 ochre = vec3(0.72, 0.50, 0.30);
    vec3 umber = vec3(0.42, 0.26, 0.15);
    vec3 cream = vec3(0.93, 0.88, 0.78);
    vec3 earthCol = mix(mix(sand, ochre, bandHue), cream, step(0.75, bandHue) * 0.6);
    earthCol = mix(earthCol, umber, smoothstep(0.85, 1.0, bandFract) * 0.6 + smoothstep(0.1, 0.0, bandFract) * 0.4);
    earthCol = mix(earthCol, umber * 0.9, slope * 0.9);
    earthCol *= 0.9 + micro * 0.2;

    /* Water: pale sand at the tideline, darker where the sea has just been,
       dune grass further up, rock on the headlands */
    float aboveSea = h - uWaterLevel;
    float wet = 1.0 - smoothstep(0.0, 1.6, aboveSea);
    vec3 drySand = vec3(0.82, 0.74, 0.58);
    vec3 wetSand = vec3(0.46, 0.42, 0.34);
    vec3 moss = vec3(0.34, 0.44, 0.32);
    vec3 rock = vec3(0.40, 0.40, 0.38);
    vec3 waterCol = mix(drySand, moss, smoothstep(2.0, 6.0, aboveSea) * (1.0 - slope));
    waterCol = mix(waterCol, rock, slope);
    waterCol = mix(waterCol, wetSand, wet);
    waterCol *= 0.9 + micro * 0.2;

    /* Fire: basalt, veined with lava where the ground is low */
    vec3 basalt = vec3(0.07, 0.06, 0.06);
    float veins = smoothstep(0.52, 0.62, fbm4(p * 0.35 + 4.0)) * (1.0 - smoothstep(-2.0, 4.0, h));
    float pulse = 0.85 + 0.15 * sin(uTime * 1.3 + p.x * 0.2);
    vec3 lava = mix(vec3(1.0, 0.25, 0.05), vec3(1.0, 0.75, 0.3), veins) * pulse;
    vec3 fireCol = basalt * (0.8 + micro * 0.4);
    vec3 fireEmissive = lava * veins * 3.0;

    /* Air: granite and snow above the line, where it can rest */
    vec3 granite = vec3(0.46, 0.47, 0.50);
    vec3 snow = vec3(0.96, 0.97, 1.0);
    float snowMask = smoothstep(uSnowLine - 2.0, uSnowLine + 2.0, h + micro * 2.0) * (1.0 - smoothstep(0.35, 0.7, slope));
    vec3 airCol = mix(granite * (0.85 + micro * 0.3), snow, snowMask);

    /* Ether: silhouettes */
    vec3 etherCol = vec3(0.05, 0.06, 0.10) * (0.8 + micro * 0.4);

    vec3 albedo = uW[0] * earthCol + uW[1] * waterCol + uW[2] * fireCol + uW[3] * airCol + uW[4] * etherCol;
    float specStrength = uW[3] * snowMask * 0.5 + uW[1] * (0.1 + wet * 0.7);

    vec3 L = normalize(uSunDir);
    float ndl = max(dot(N, L), 0.0);
    float hemi = N.y * 0.5 + 0.5;
    vec3 ambient = mix(uGroundColor, uSkyColor, hemi) * 0.55;
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 32.0) * specStrength;
    vec3 color = albedo * (ambient + uSunColor * ndl * 1.1) + uSunColor * spec;

    float dist = length(cameraPosition - vWorld);
    float fog = 1.0 - exp(-dist * uFogDensity);
    float sunAmount = pow(max(dot(-V, L), 0.0), 6.0);
    vec3 fogCol = mix(uFogColor, uSunColor, sunAmount * 0.45);
    color = mix(color, fogCol, fog);

    vec3 linear = pow(max(color, 0.0), vec3(2.2)) + uW[2] * fireEmissive * (1.0 - fog);
    gl_FragColor = vec4(linear * uExposure, 1.0);
  }
`;

export const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const skyFragment = /* glsl */ `
  ${noise}

  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uSunColor;
  uniform vec3 uSunDir;
  uniform vec3 uNebula;
  uniform float uStars;
  uniform float uClouds;
  uniform float uSunGlow;
  uniform float uTime;
  uniform float uExposure;

  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    float up = clamp(d.y, -1.0, 1.0);
    float t = pow(smoothstep(-0.08, 0.5, up), 0.7);
    vec3 col = mix(uHorizon, uZenith, t);
    col *= 1.0 - smoothstep(0.0, -0.3, up) * 0.6;

    vec3 L = normalize(uSunDir);
    float sd = max(dot(d, L), 0.0);
    vec3 sun = uSunColor * (pow(sd, 900.0) * 6.0 + pow(sd, 40.0) * 0.6 + pow(sd, 4.0) * 0.2) * uSunGlow;

    if (uClouds > 0.001 && d.y > 0.02) {
      vec2 cp = d.xz / (d.y + 0.08) * 1.4 + vec2(uTime * 0.012, 0.0);
      float c = fbm(cp);
      float mask = smoothstep(0.48, 0.72, c) * smoothstep(0.02, 0.2, d.y);
      vec3 cloudCol = mix(vec3(0.75, 0.80, 0.88), vec3(1.0), smoothstep(0.5, 0.85, c));
      cloudCol += uSunColor * pow(sd, 3.0) * 0.3;
      col = mix(col, cloudCol, mask * uClouds);
    }

    vec3 stars = vec3(0.0);
    if (uStars > 0.001) {
      vec3 sp = d * 260.0;
      vec3 cell = floor(sp);
      vec3 f = fract(sp);
      float seed = hash31(cell);
      float star = 0.0;
      if (seed > 0.985) {
        vec3 c = vec3(hash31(cell + 1.3), hash31(cell + 5.1), hash31(cell + 9.7));
        float dd = length(f - c);
        float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + seed * 4.0) + seed * 80.0);
        star = smoothstep(0.12, 0.0, dd) * twinkle * (0.5 + 0.5 * seed);
      }
      vec3 starCol = mix(vec3(0.85, 0.90, 1.0), vec3(1.0, 0.85, 0.65), step(0.995, seed));
      float band = exp(-pow(dot(d, normalize(vec3(0.6, 0.35, -0.7))) * 4.0, 2.0));
      float nebula = fbm4(d.xy * 6.0 + d.z * 3.0);
      stars = (starCol * star * 2.2 + uNebula * band * nebula * 0.9) * uStars * smoothstep(-0.1, 0.15, up);
    }

    vec3 linear = pow(max(col, 0.0), vec3(2.2)) + pow(max(sun, 0.0), vec3(1.6)) + stars;
    gl_FragColor = vec4(linear * uExposure, 1.0);
  }
`;

/* The sea surface: four directional swells with sharpened crests, plus
   chop. Shared by the vertex shader (displacement, normals, depth) and the
   fragment shader (foam on the crests). */
const ocean = /* glsl */ `
  uniform float uWaveScale;

  float crested(float x) {
    float s = sin(x) * 0.5 + 0.5;
    return (1.0 - pow(1.0 - s, 1.8)) * 2.0 - 1.0;
  }

  float oceanHeight(vec2 p, float t) {
    float h = 0.0;
    h += 0.55 * crested(dot(p, normalize(vec2(0.8, 0.5))) * 0.11 - t * 0.55);
    h += 0.32 * crested(dot(p, normalize(vec2(-0.4, 0.9))) * 0.19 - t * 0.75);
    h += 0.18 * crested(dot(p, normalize(vec2(0.6, -0.7))) * 0.33 - t * 1.05);
    h += 0.10 * crested(dot(p, normalize(vec2(-0.9, 0.2))) * 0.6 - t * 1.4);
    h += (fbm4(p * 0.35 + vec2(t * 0.12, t * 0.07)) - 0.5) * 0.35;
    return h * uWaveScale;
  }
`;

export const waterVertex = /* glsl */ `
  ${noise}
  ${terrainHeight}
  ${ocean}

  uniform float uTime;

  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vDepth;
  varying float vSwell;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec2 p = world.xz;
    float e = 0.8;
    float h = oceanHeight(p, uTime);
    float hx = oceanHeight(p + vec2(e, 0.0), uTime);
    float hz = oceanHeight(p + vec2(0.0, e), uTime);
    world.y += h;
    vNormal = normalize(vec3(h - hx, e, h - hz));
    vWorld = world.xyz;
    vDepth = world.y - terrainHeight(p);
    vSwell = h / max(uWaveScale, 0.001);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const waterFragment = /* glsl */ `
  ${noise}

  uniform float uW[5];
  uniform float uTime;
  uniform float uLava;
  uniform float uWaveScale;
  uniform float uExposure;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uFogColor;
  uniform float uFogDensity;

  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vDepth;
  varying float vSwell;

  void main() {
    vec2 p = vWorld.xz;
    float t = uTime;
    float dist = length(cameraPosition - vWorld);

    /* fine ripples on top of the swell, fading with distance so the far sea
       never shimmers */
    float e = 0.18;
    float r0 = fbm4(p * 1.6 + vec2(t * 0.22, t * 0.11));
    float rx = fbm4(p * 1.6 + vec2(t * 0.22, t * 0.11) + vec2(e, 0.0));
    float rz = fbm4(p * 1.6 + vec2(t * 0.22, t * 0.11) + vec2(0.0, e));
    float rippleStrength = (0.55 + 0.45 * uWaveScale) * (1.0 - smoothstep(40.0, 180.0, dist));
    vec3 N = normalize(normalize(vNormal) + vec3(r0 - rx, 0.0, r0 - rz) * rippleStrength * 2.2);

    vec3 V = normalize(cameraPosition - vWorld);
    vec3 L = normalize(uSunDir);
    float fresnel = 0.03 + 0.97 * pow(1.0 - max(dot(V, N), 0.0), 5.0);
    vec3 R = reflect(-V, N);
    vec3 skyRef = mix(uHorizon, uZenith, clamp(R.y * 1.6, 0.0, 1.0));
    skyRef += uSunColor * pow(max(dot(R, L), 0.0), 36.0) * 0.45;
    vec3 H = normalize(L + V);
    float ndh = max(dot(N, H), 0.0);
    float spec = pow(ndh, 420.0) * 1.8 + pow(ndh, 48.0) * 0.14;

    /* colour by depth: turquoise shallows, navy deeps */
    float depth = max(vDepth, 0.0);
    vec3 shallow = vec3(0.30, 0.68, 0.66);
    vec3 mid = vec3(0.06, 0.34, 0.42);
    vec3 deepSea = vec3(0.02, 0.12, 0.22);
    vec3 seaCol = mix(shallow, mid, smoothstep(0.0, 3.0, depth));
    seaCol = mix(seaCol, deepSea, smoothstep(3.0, 14.0, depth));

    vec3 other =
      uW[0] * vec3(0.12, 0.20, 0.20) +
      uW[2] * vec3(0.05, 0.02, 0.02) +
      uW[3] * vec3(0.05, 0.10, 0.18) +
      uW[4] * vec3(0.02, 0.03, 0.06);
    float otherWeight = uW[0] + uW[2] + uW[3] + uW[4];
    vec3 body = mix(seaCol, other, otherWeight);

    /* light through the crests, when the sun is behind them */
    float sss = pow(max(dot(V, -L), 0.0), 2.5) * max(vSwell, 0.0) * 0.6 * uW[1];
    body += vec3(0.1, 0.45, 0.4) * sss;

    vec3 col = mix(body, skyRef, fresnel);

    /* foam: on the crests, and where the sea runs out of depth */
    float foamNoise = fbm4(p * 0.9 + vec2(t * 0.05, -t * 0.03));
    float crestFoam = smoothstep(0.52, 0.9, vSwell) * smoothstep(0.42, 0.62, foamNoise);
    float shoreFoam = (1.0 - smoothstep(0.0, 1.4, depth)) * smoothstep(0.35, 0.6, foamNoise + 0.15 * sin(t * 1.3 + p.x * 0.4));
    float foam = clamp(crestFoam + shoreFoam, 0.0, 1.0) * uW[1] * (1.0 - smoothstep(60.0, 200.0, dist));
    col = mix(col, vec3(0.96, 0.98, 1.0), foam * 0.85);

    vec3 glint = uSunColor * spec * (1.0 - foam);

    float crust = fbm4(p * 0.25 + vec2(t * 0.03, 0.0));
    float hot = smoothstep(0.45, 0.65, crust);
    vec3 lavaCol = mix(vec3(0.12, 0.04, 0.02), mix(vec3(1.0, 0.3, 0.05), vec3(1.0, 0.8, 0.35), smoothstep(0.6, 0.8, crust)), hot);
    lavaCol *= 0.9 + 0.1 * sin(t * 2.0 + p.x);

    float fog = 1.0 - exp(-dist * uFogDensity);
    float sunAmount = pow(max(dot(-V, L), 0.0), 6.0);
    vec3 fogCol = mix(uFogColor, uSunColor, sunAmount * 0.45);
    col = mix(col, fogCol, fog);

    float alpha = mix(0.6, 0.97, smoothstep(0.0, 2.5, depth));
    alpha = mix(alpha, 1.0, max(fog, foam));
    alpha = mix(alpha, 1.0, uLava);

    vec3 linear = pow(max(col, 0.0), vec3(2.2)) + pow(max(glint, 0.0), vec3(1.5)) * (1.0 - fog) * (1.0 - uLava);
    linear = mix(linear, lavaCol * 2.6 * (1.0 - fog) + pow(uFogColor, vec3(2.2)) * fog, uLava);
    gl_FragColor = vec4(linear * uExposure, alpha);
  }
`;

export const mistVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const mistFragment = /* glsl */ `
  ${noise}

  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSeed;

  varying vec2 vUv;

  void main() {
    vec2 c = vUv - 0.5;
    float radial = smoothstep(0.5, 0.05, length(c * vec2(1.0, 1.6)));
    float swirl = fbm4(vUv * 3.0 + vec2(uTime * 0.025 + uSeed, uSeed));
    float alpha = radial * (0.35 + 0.65 * swirl) * uOpacity;
    gl_FragColor = vec4(pow(uColor, vec3(2.2)), alpha);
  }
`;

export const particleVertex = /* glsl */ `
  attribute vec4 aSeed;

  uniform float uW[5];
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uWaterLevel;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float s1 = aSeed.x;
    float s2 = aSeed.y;
    float s3 = aSeed.z;
    float s4 = aSeed.w;
    float t = uTime;
    float pi = 3.14159265;

    /* Earth: fine dust in the morning light, hanging over the valley */
    float ec = fract(s2 - t * (0.006 + 0.01 * s3));
    vec3 earthPos = vec3((s1 * 2.0 - 1.0) * 40.0 + sin(t * 0.3 + s4 * 6.28) * 0.6, 2.0 + ec * 14.0, 4.0 - s4 * 60.0);
    float earthAlpha = (0.12 + 0.22 * s4) * sin(pi * ec);
    float earthSize = 0.5 + 0.9 * s3;
    vec3 earthColor = vec3(1.0, 0.86, 0.62) * 0.7;

    /* Water: spray lifted off the crests, blown along the wind */
    float wc = fract(s1 + t * (0.02 + 0.03 * s3));
    vec3 waterPos = vec3((wc * 2.0 - 1.0) * 70.0, uWaterLevel + 0.8 + s2 * 3.0, -2.0 - s4 * 80.0);
    float waterAlpha = (0.08 + 0.22 * s4) * sin(pi * wc) * (0.5 + 0.5 * sin(t * 6.0 + s4 * 40.0));
    float waterSize = 0.6 + 1.0 * s3;
    vec3 waterColor = vec3(0.9, 1.0, 1.0) * 1.1;

    /* Fire: embers rising from the caldera floor */
    float fc = fract(s2 + t * (0.03 + 0.05 * s3));
    vec3 firePos = vec3((s1 * 2.0 - 1.0) * 46.0 + sin(t * 1.4 + s4 * 6.28 + fc * 9.0) * 2.5, -3.0 + fc * 40.0, -70.0 + (s4 * 2.0 - 1.0) * 46.0);
    float fireAlpha = (0.5 + 0.5 * s4) * sin(pi * fc) * (0.7 + 0.3 * sin(t * 9.0 + s4 * 30.0));
    float fireSize = 1.6 + 3.0 * s3 * (1.0 - fc);
    vec3 fireColor = mix(vec3(1.0, 0.35, 0.08), vec3(1.0, 0.8, 0.45), s4 * s4) * 3.0;

    /* Air: wind-borne snow crossing the summit */
    float ac = fract(s1 + t * (0.05 + 0.08 * s3));
    vec3 airPos = vec3((ac * 2.0 - 1.0) * 80.0, 12.0 + s2 * 30.0 + sin(ac * 8.0 + t + s4 * 6.28) * 1.5, 10.0 - s4 * 90.0);
    float airAlpha = (0.25 + 0.45 * s4) * sin(pi * ac);
    float airSize = 1.0 + 1.6 * s3;
    vec3 airColor = vec3(0.95, 0.98, 1.0) * 1.3;

    /* Ether: slow golden motes, like the last warmth of the day */
    float kc = fract(s2 + t * 0.004 * (0.5 + s3));
    vec3 etherPos = vec3((s1 * 2.0 - 1.0) * 50.0, 8.0 + kc * 36.0, -6.0 - s4 * 70.0);
    float etherAlpha = (0.15 + 0.4 * s4) * sin(pi * kc) * (0.5 + 0.5 * sin(t * (0.8 + 2.0 * s3) + s4 * 6.28));
    float etherSize = 0.5 + 1.1 * s3 * s3;
    vec3 etherColor = mix(vec3(0.95, 0.97, 1.0), vec3(1.0, 0.8, 0.5), step(0.6, s4)) * 1.6;

    vec3 pos = uW[0] * earthPos + uW[1] * waterPos + uW[2] * firePos + uW[3] * airPos + uW[4] * etherPos;
    float alpha = uW[0] * earthAlpha + uW[1] * waterAlpha + uW[2] * fireAlpha + uW[3] * airAlpha + uW[4] * etherAlpha;
    float size = uW[0] * earthSize + uW[1] * waterSize + uW[2] * fireSize + uW[3] * airSize + uW[4] * etherSize;
    vec3 color = uW[0] * earthColor + uW[1] * waterColor + uW[2] * fireColor + uW[3] * airColor + uW[4] * etherColor;

    vec4 mv = viewMatrix * vec4(pos, 1.0);
    float depth = max(1.0, -mv.z);
    vColor = color;
    vAlpha = alpha * smoothstep(2.0, 12.0, depth);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(size * uPixelRatio * 120.0 / depth, 14.0 * uPixelRatio);
  }
`;

export const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.1, d);
    float halo = smoothstep(0.5, 0.0, d) * 0.3;
    float alpha = (core + halo) * vAlpha;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`;
