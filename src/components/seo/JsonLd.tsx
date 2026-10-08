import { jsonLdScript, personJsonLd } from "@/lib/site";

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }}
    />
  );
}
