import type { Metadata } from "next";
import { ResumeLens } from "@/components/resume-lens";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume preview and download lens for Nirmal Kumar, with one-page and master resume files plus role-aware recommendations."
};

export default function ResumePage() {
  return (
    <RoleLensProvider>
      <ResumeLens />
    </RoleLensProvider>
  );
}
