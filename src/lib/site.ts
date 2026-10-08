import type { Metadata } from "next";

export const SITE_URL = "https://iresharma.com";
export const SITE_NAME = "iresharma";
export const SITE_TITLE = "Iresh Sharma — fullstack engineer";
export const SITE_DESCRIPTION =
  "Iresh Sharma's software engineering portfolio, themed as a Cursor window. Member of Technical Staff at Salesforce in Bengaluru. Previously Twilio and SuperTokens. WatchIreshStruggle by night.";
export const SITE_TAGLINE = "Fullstack by day. WatchIreshStruggle by night.";

export const SITE_AUTHOR = {
  name: "Iresh Sharma",
  jobTitle: "Member of Technical Staff",
  company: "Salesforce",
  location: "Bengaluru, India",
};

export const SITE_LINKS = {
  github: "https://github.com/iresharma",
  linkedin: "https://linkedin.com/in/iresharma",
  youtube: "https://www.youtube.com/@iresharma",
  blog: "https://blog.iresharma.com",
  leetcode: "https://leetcode.com/u/iresharma/",
  hashnode: "https://hashnode.com/@Iresharma",
} as const;

export const OG_ALT =
  "Iresh Sharma — fullstack engineer at Salesforce. Portfolio themed as a Cursor window.";

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
    "Iresh Sharma",
    "fullstack engineer",
    "Salesforce",
    "Twilio",
    "SuperTokens",
    "Bengaluru",
    "software engineer",
    "Voice infra",
    "TypeScript",
    "WatchIreshStruggle",
    "CodeLoom",
    "Lens Distill",
    "SeekSphere",
    "Reach",
    "G-Notify",
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
          addressLocality: "Bengaluru",
          addressCountry: "IN",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "The National Institute of Engineering, Mysuru",
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
