import type { Metadata } from "next";
import { CertificationConsole } from "@/components/certification-console";

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "Premium credential console for Nirmal Kumar's certifications, verification states, and public proof links."
};

export default function CertificationsPage() {
  return <CertificationConsole />;
}
