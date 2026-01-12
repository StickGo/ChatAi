import React from 'react';

export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '[Nama]',
    url: 'https://your-site.vercel.app',
    jobTitle: 'Web Developer',
    knowsAbout: ['Next.js', 'React', 'TypeScript'],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
