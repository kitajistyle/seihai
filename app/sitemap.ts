import { MetadataRoute } from 'next';
import { getTournaments, getReports } from '@/lib/db/queries';

const BASE_URL = 'https://seisai.vercel.app';

export const revalidate = 3600; // 1時間ごとに再生成

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tournaments, reports] = await Promise.all([
    getTournaments(),
    getReports(100),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tournaments`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/organizers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/rankings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/announcements`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  const tournamentRoutes: MetadataRoute.Sitemap = tournaments.map((t) => ({
    url: `${BASE_URL}/tournaments/${t.id}`,
    lastModified: t.date ? new Date(t.date) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const reportRoutes: MetadataRoute.Sitemap = reports.map((r) => ({
    url: `${BASE_URL}/reports/${r.id}`,
    lastModified: r.created_at ? new Date(r.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...tournamentRoutes, ...reportRoutes];
}
