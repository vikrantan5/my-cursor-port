import type { Metadata } from "next";

export const SITE_URL = "https://vikrantsingh.dev";
export const SITE_NAME = "vikrantan5";
export const SITE_TITLE = "Vikrant Singh — full stack developer";
export const SITE_DESCRIPTION =
  "Vikrant Singh's software engineering portfolio, themed as a Cursor window. IT undergraduate at Netaji Subhash Engineering College shipping HireAI and MovieLab. 300+ LeetCode problems solved. FactDefiner Vikrant on YouTube.";
export const SITE_TAGLINE = "Full stack by day. FactDefiner by night.";

export const SITE_AUTHOR = {
  name: "Vikrant Singh",
  jobTitle: "IT Undergraduate & Full Stack Developer",
  company: "Netaji Subhash Engineering College",
  location: "Kolkata, India",
};

export const SITE_LINKS = {
  github: "https://github.com/vikrantan5",
  linkedin: "https://www.linkedin.com/in/vikrant-singh5/",
  youtube: "https://www.youtube.com/@Factdefiner",
} as const;

export const OG_ALT =
  "Vikrant Singh — full stack developer and IT undergraduate. Portfolio themed as a Cursor window.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR.name, url: SITE_URL }],
  creator: SITE_AUTHOR.name,
  publisher: SITE_AUTHOR.name,
  keywords: [
    "Vikrant Singh",
    "full stack developer",
    "IT undergraduate",
    "Netaji Subhash Engineering College",
    "Kolkata",
    "HireAI",
    "MovieLab",
    "React",
    "Next.js",
    "Node.js",
    "DSA",
    "LeetCode",
    "FactDefiner",
  ],
  category: "portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function projectJsonLd(project: {
  slug: string;
  title: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.description,
    url: `${SITE_URL}/projects/${project.slug}`,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_AUTHOR.name,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        jobTitle: SITE_AUTHOR.jobTitle,
        worksFor: {
          "@type": "Organization",
          name: SITE_AUTHOR.company,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kolkata",
          addressCountry: "IN",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Netaji Subhash Engineering College",
        },
        description: SITE_DESCRIPTION,
        sameAs: Object.values(SITE_LINKS),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}
