import { supportsFlags } from "framer-motion";

/*
 * Keep every scroll-linked motion value on Framer's JS scroll path.
 *
 * Since 12.38, `useScroll({ target })` + `useTransform` hands opacity,
 * transform and clip-path to the browser's native ViewTimeline when it can.
 * The native ranges don't line up with the offsets these stories were tuned
 * on (and ignore Lenis' smoothed position), so chapters that should have
 * faded out on /profile and /timeline faded back in over the next one.
 *
 * Imported once from the root client shell, before any component renders.
 */
supportsFlags.scrollTimeline = false;
supportsFlags.viewTimeline = false;

export {};
