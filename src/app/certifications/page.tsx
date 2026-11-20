import type { Metadata } from "next";
import { CertificationConsole } from "@/components/certification-console";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Credentials",
  description:
    "Role-relevant credentials for Nirmal Kumar across Fabric, Databricks, BI, governance, and public verification links.",
  path: "/certifications"
});

export default function CertificationsPage() {
  return <CertificationConsole />;
}
