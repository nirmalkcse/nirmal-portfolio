import type { Metadata } from "next";
import { ProofGraph } from "@/components/proof-graph";
import { RoleLensProvider } from "@/context/role-lens-context";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Skills",
  description:
    "Skills mapped to Nirmal Kumar's project work, credentials, metrics, and public proof points.",
  path: "/proof"
});

export default function ProofPage() {
  return (
    <RoleLensProvider>
      <ProofGraph />
    </RoleLensProvider>
  );
}
