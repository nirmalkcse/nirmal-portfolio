import type { Metadata } from "next";
import { CareerTimeline } from "@/components/timeline";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Scroll-driven career timeline for Nirmal Kumar's education, work, credentials, projects, and current exploration."
};

export default function TimelinePage() {
  return (
    <RoleLensProvider>
      <CareerTimeline />
    </RoleLensProvider>
  );
}
