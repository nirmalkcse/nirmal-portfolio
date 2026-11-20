import { Geist_Mono, Inter } from "next/font/google";

/*
 * Apple's type system: SF Pro everywhere, set tight and confident. On Apple
 * devices the stacks in tokens.css resolve to SF Pro itself (-apple-system);
 * everywhere else they fall to Inter, the closest open match, loaded here
 * with its optical-size axis so large headlines get Inter Display's tighter
 * forms the way SF Pro Display does.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-inter"
});

/* Code surfaces and data labels only. */
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-geist-mono"
});

export const fontVariables = [fontSans.variable, fontMono.variable].join(" ");
