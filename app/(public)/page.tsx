import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';
import { getRankings, getTournaments, getOrganizers, getReports } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: 'せい杯 | eスポーツ大会プラットフォーム',
  description: '全国のeスポーツ・カードゲーム大会の情報を発信。大会参加登録、ランキング、イベントレポートを一元管理。',
};

export default async function HomePage() {
  // Fetch data in parallel on the server
  const [rankings, tournaments, organizers, reports] = await Promise.all([
    getRankings(5),
    getTournaments(),
    getOrganizers(),
    getReports(4)
  ]);

  return (
    <>
      <HeroSection />
      <RankingSection rankings={rankings} />
      <TournamentPickupSection tournaments={tournaments} />
      <OrganizerPickupSection organizers={organizers} />
      <ReportPickupSection reports={reports} />
    </>
  );
}
