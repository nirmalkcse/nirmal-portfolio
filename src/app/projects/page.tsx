import type { Metadata } from "next";
import { storyMono, storySans } from "@/components/story/story-fonts";
import { WorkShowcase } from "@/components/work";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Work",
  description:
    "Project case studies for Nirmal Kumar's Fabric, Databricks, BI validation, research, and data product work.",
  path: "/projects"
});

export default function ProjectsPage() {
  return <WorkShowcase className={`${storySans.variable} ${storyMono.variable}`} />;
}
