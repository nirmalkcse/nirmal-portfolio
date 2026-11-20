import type { Metadata } from "next";
import { ResumeLens } from "@/components/resume-lens";
import { RoleLensProvider } from "@/context/role-lens-context";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "PDF and DOCX resume downloads for Nirmal Kumar, including one-page and master Data Engineer resume files.",
  path: "/resume"
});

export default function ResumePage() {
  return (
    <RoleLensProvider>
      <ResumeLens />
    </RoleLensProvider>
  );
}
