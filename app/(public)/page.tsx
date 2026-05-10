import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
// import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';
import NewsSection from '@/components/NewsSection';
import { getRankings, getTournaments, getOrganizers, getReports, getHeroTournaments, getAnnouncements } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'せい杯 | eスポーツ大会プラットフォーム',
  description: '全国のeスポーツ・カードゲーム大会の情報を発信。大会参加登録、ランキング、イベントレポートを一元管理。',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch data in parallel on the server
  const [rankings, tournaments, organizers, reports, heroTournaments, announcements] = await Promise.all([
    getRankings(6),
    getTournaments(),
    getOrganizers(),
    getReports(5),
    getHeroTournaments(),
    getAnnouncements(true),
  ]);

  return (
    <>
      <HeroSection tournaments={heroTournaments} />
      <NewsSection announcements={announcements} />
      {/* <RankingSection rankings={rankings} /> */}
      <TournamentPickupSection tournaments={tournaments} />
      <OrganizerPickupSection organizers={organizers} />
      <ReportPickupSection reports={reports} />
    </>
  );
}
