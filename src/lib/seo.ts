import type { Metadata } from "next";
import { profile, projects } from "@/data";
import { plannedRoutes } from "@/lib/constants/routes";

const fallbackSiteUrl = "http://localhost:3000";

function resolveSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    fallbackSiteUrl;

  return new URL(configuredUrl);
}

export const siteConfig = {
  name: "Nirmal Kumar",
  title: "Nirmal Kumar | Data Engineer Portfolio",
  description:
    "Data Engineer portfolio for Nirmal Kumar: Microsoft Fabric, Databricks, SQL, PySpark, Power BI, validation-led migration work, credentials, and case studies.",
  url: resolveSiteUrl(),
  ogImage: "/opengraph-image",
  twitterImage: "/twitter-image",
  locale: "en_US",
  keywords: [
    "Nirmal Kumar",
    "Data Engineer",
    "Microsoft Fabric",
    "Databricks",
    "SQL",
    "PySpark",
    "Power BI",
    "Lakehouse",
    "BI migration",
    "Data validation"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createPageMetadata({
  description,
  path,
  title
}: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "Nirmal Kumar data engineering portfolio"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.twitterImage]
    }
  };
}

export const publicRoutes = [
  { path: "/", label: "Home" },
  ...plannedRoutes.map((route) => ({ path: route.href, label: route.label })),
  ...projects.map((project) => ({
    path: `/projects/${project.slug}`,
    label: project.title
  }))
] as const;

const sameAs = profile.socialLinks.map((link) => link.url);

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.displayName,
  alternateName: profile.name,
  jobTitle: "Data Engineer",
  description: profile.shortBio,
  url: absoluteUrl("/profile"),
  sameAs,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressCountry: "IN"
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: profile.education.institution
  },
  knowsAbout: [
    "Microsoft Fabric",
    "Databricks",
    "SQL",
    "PySpark",
    "Power BI",
    "Data validation",
    "Lakehouse architecture",
    "BI modernization"
  ]
} as const;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.title,
  description: siteConfig.description,
  url: absoluteUrl("/"),
  inLanguage: "en",
  publisher: personJsonLd
} as const;

export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `${profile.displayName} contact and professional profile`,
  description:
    "Contact route, one-page resume download, and public proof links for Nirmal Kumar.",
  url: absoluteUrl("/profile"),
  mainEntity: personJsonLd
} as const;
