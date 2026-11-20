import type { Metadata } from "next";
import { TimelineStory } from "@/components/timeline";
import { storyMono, storySans } from "@/components/story/story-fonts";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Timeline",
  description:
    "Career timeline for Nirmal Kumar covering education, BI validation, Fabric migration, Databricks work, credentials, and projects.",
  path: "/timeline"
});

export default function TimelinePage() {
  return <TimelineStory className={`${storySans.variable} ${storyMono.variable}`} />;
}
