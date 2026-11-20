/*
 * The story pages share the site's faces (src/app/fonts.ts): SF Pro on Apple
 * devices, Inter elsewhere. tokens.css maps --font-story-sans and
 * --font-story-mono onto them, so these classes only make sure the faces are
 * attached wherever a story page mounts.
 */
export { fontSans as storySans, fontMono as storyMono } from "@/app/fonts";
