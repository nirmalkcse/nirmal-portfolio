import type { Metadata } from "next";
import { ProjectCaseFilesIndex } from "@/components/project-case-file";
import { RoleLensProvider } from "@/context/role-lens-context";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Role-aware project case files for Nirmal Kumar's data engineering, BI modernization, research, and AI/data-agent proof points."
};

export default function ProjectsPage() {
  return (
    <RoleLensProvider>
      <ProjectCaseFilesIndex />
    </RoleLensProvider>
  );
}
