import type { Metadata } from "next";
import { ProfessionalProfile } from "@/components/profile";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "Professional profile for Nirmal Kumar, connecting role positioning, proof links, social links, resume access, and public-safe contact context."
};

export default function ProfilePage() {
  return (
    <RoleLensProvider>
      <ProfessionalProfile />
    </RoleLensProvider>
  );
}
