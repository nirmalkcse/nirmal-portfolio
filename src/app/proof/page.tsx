import type { Metadata } from "next";
import { ProofGraph } from "@/components/proof-graph";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Proof Graph",
  description:
    "Role-aware graph connecting Nirmal Kumar's skills to project evidence, credentials, metrics, and proof gaps."
};

export default function ProofPage() {
  return (
    <RoleLensProvider>
      <ProofGraph />
    </RoleLensProvider>
  );
}
