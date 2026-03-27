import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';

export const metadata: Metadata = {
  title: 'E-SPORTS HUB | eスポーツ大会プラットフォーム',
  description: '全国のeスポーツ・カードゲーム大会の情報を発信。大会参加登録、ランキング、イベントレポートを一元管理。',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RankingSection />
      <TournamentPickupSection />
      <OrganizerPickupSection />
      <ReportPickupSection />
    </>
  );
}
