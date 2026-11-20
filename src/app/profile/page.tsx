import type { Metadata } from "next";
import { ProfessionalProfile } from "@/components/profile";
import { JsonLd } from "@/components/seo";
import { createPageMetadata, profilePageJsonLd } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Nirmal Kumar through LinkedIn, download the one-page PDF resume, and explore selected Data Engineer work.",
  path: "/profile"
});

export default function ProfilePage() {
  return (
    <>
      <JsonLd data={profilePageJsonLd} />
      <ProfessionalProfile />
    </>
  );
}
