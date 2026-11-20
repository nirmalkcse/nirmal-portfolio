import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study/case-study";
import {
  getOrderedProjects,
  getProjectBySlug
} from "@/components/project-case-file";
import { createPageMetadata } from "@/lib/seo";

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

  return createPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`
  });
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

  return <CaseStudy project={project} />;
}
