import type { Metadata } from "next";
import { FutureProjectsObservatory } from "@/components/future-projects";

export const metadata: Metadata = {
  title: "Future Projects",
  description:
    "Currently-exploring roadmap for public-safe future portfolio artifacts, grounded in existing case files and proof signals."
};

export default function FutureProjectsPage() {
  return <FutureProjectsObservatory />;
}
