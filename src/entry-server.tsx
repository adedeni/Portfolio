import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { caseStudies, contact, education, experience, person, site, skills } from "./data/content";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

/** JSON-LD Person schema, generated from the content file. */
export function jsonLd() {
  const current = experience[0];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.handle,
    url: site.url,
    image: site.ogImage,
    jobTitle: person.role,
    description: site.description,
    email: `mailto:${contact.email}`,
    telephone: contact.phone.display.replace(/\s/g, ""),
    address: { "@type": "PostalAddress", addressCountry: "NG" },
    sameAs: [contact.linkedin.href, contact.github.href],
    worksFor: { "@type": "Organization", name: current.company },
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    knowsAbout: skills.flatMap((g) => g.items),
    subjectOf: caseStudies
      .filter((c) => c.url.href)
      .map((c) => ({ "@type": "CreativeWork", name: c.name, url: c.url.href, description: c.kind })),
  }).replace(/</g, "\\u003c");
}

export const meta = site;
