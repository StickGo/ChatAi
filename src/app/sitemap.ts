import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { 
      url: 'https://your-site.vercel.app', 
      lastModified: new Date(), 
      changeFrequency: 'yearly',
      priority: 1 
    },
    { 
      url: 'https://your-site.vercel.app/about', 
      lastModified: new Date(), 
      changeFrequency: 'monthly',
      priority: 0.8 
    },
    // Add other routes here
  ]
}
