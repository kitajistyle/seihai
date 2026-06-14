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
    sitemap: 'https://every1-fes.vercel.app/sitemap.xml',
    host: 'https://every1-fes.vercel.app',
  };
}
