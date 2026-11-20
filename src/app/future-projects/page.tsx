import type { Metadata } from "next";
import { FutureProjectsObservatory } from "@/components/future-projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Learning Roadmap",
  description:
    "Learning roadmap for future public demos grounded in Nirmal Kumar's existing Fabric, Databricks, BI, and data-agent work.",
  path: "/future-projects"
});

export default function FutureProjectsPage() {
  return <FutureProjectsObservatory />;
}
