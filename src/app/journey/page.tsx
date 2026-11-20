import type { Metadata } from "next";
import { JourneyStory } from "@/components/journey";
import { storyMono, storySans } from "@/components/story/story-fonts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Journey",
  description:
    "Nirmal Kumar's work told through five elements: foundations in earth, pipelines in water, validation in fire, analytics in air, and entity resolution in ether.",
  path: "/journey"
});

export default function JourneyPage() {
  return <JourneyStory className={`${storySans.variable} ${storyMono.variable}`} />;
}
