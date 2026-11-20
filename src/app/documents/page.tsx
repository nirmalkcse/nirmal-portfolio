import type { Metadata } from "next";
import { DocumentsHub } from "@/components/documents";
import { RoleLensProvider } from "@/context/role-lens-context";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Documents",
  description:
    "Interview documents for Nirmal Kumar, including PDF resume downloads, editable DOCX copies, and proof routes.",
  path: "/documents"
});

export default function DocumentsPage() {
  return (
    <RoleLensProvider>
      <DocumentsHub />
    </RoleLensProvider>
  );
}
