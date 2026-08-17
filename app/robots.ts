import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/approve/'],
      },
    ],
    sitemap: 'https://seisai.vercel.app/sitemap.xml',
    host: 'https://seisai.vercel.app',
  };
}
