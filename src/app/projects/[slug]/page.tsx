import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrawlerContent } from "@/components/seo/CrawlerContent";
import { AppShell } from "@/components/shell/AppShell";
import { getProjectPage, PROJECT_PAGES } from "@/lib/projects";
import { jsonLdScript, projectJsonLd, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return PROJECT_PAGES.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectPage(slug);
  if (!project) return {};

  const url = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.description,
    keywords: [
      project.title,
      project.product,
      "Iresh Sharma",
      "WatchIreshStruggle",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: `${project.title} — ${SITE_NAME}`,
      description: project.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${SITE_NAME}`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectPage(slug);
  if (!project) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(projectJsonLd(project)),
        }}
      />
      <CrawlerContent ids={[project.id]} />
      <AppShell initialFileId={project.id} />
    </>
  );
}

export const dynamicParams = false;
