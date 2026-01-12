import React from 'react';
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: PORTFOLIO_DATA.identity.nama,
    url: 'https://your-site.vercel.app',
    jobTitle: 'App Developer & Music Producer',
    knowsAbout: ['Next.js', 'React', 'TypeScript', 'Game Development', 'Music Production'],
    sameAs: [
      PORTFOLIO_DATA.identity.social.github,
      PORTFOLIO_DATA.identity.social.linkedin,
      PORTFOLIO_DATA.identity.social.instagram
    ]
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
