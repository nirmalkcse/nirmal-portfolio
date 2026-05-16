import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getOrderedProjects,
  getProjectBySlug,
  ProjectCaseFileDetail
} from "@/components/project-case-file";

type ProjectCaseFilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ProjectCaseFilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.title,
    description: project.summary
  };
}

export function generateStaticParams() {
  return getOrderedProjects("balanced").map((project) => ({
    slug: project.slug
  }));
}

export default async function ProjectCaseFilePage({
  params
}: ProjectCaseFilePageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectCaseFileDetail project={project} />;
}
