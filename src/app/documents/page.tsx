import type { Metadata } from "next";
import { DocumentsHub } from "@/components/documents";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Role-aware document packet hub for Nirmal Kumar, with public resume downloads, proof routes, credential packet concepts, and honest project export placeholders."
};

export default function DocumentsPage() {
  return (
    <RoleLensProvider>
      <DocumentsHub />
    </RoleLensProvider>
  );
}
