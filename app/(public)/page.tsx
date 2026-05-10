import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
// import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';
import NewsSection from '@/components/NewsSection';
import { getTournaments, getOrganizers, getReports, getHeroTournaments, getAnnouncements } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'せい祭 | eスポーツ大会プラットフォーム',
  description: '全国のeスポーツ・カードゲーム大会の情報を発信。大会参加登録、ランキング、イベントレポートを一元管理。',
};

export const revalidate = 60;

export default async function HomePage() {
  const [tournaments, organizers, reports, heroTournaments, announcements] = await Promise.all([
    getTournaments(),
    getOrganizers(),
    getReports(5),
    getHeroTournaments(),
    getAnnouncements(true),
  ]);

  return (
    <>
      {/* Fixed Background Image (Home only) */}
      <div className="fixed inset-0 z-[-1] bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seisai-bg.jpg"
          className="w-220 object-contain mx-auto"
          alt="Background"
        />
      </div>

      {/* Wafu Kasumi & Shigure Lines Background (Home only) */}
      <div className="wafu-lines-bg">
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-kasumi-line" />
        <div className="wafu-shigure-line" />
        <div className="wafu-shigure-line" />
        <div className="wafu-shigure-line" />
      </div>

      <HeroSection tournaments={heroTournaments} />
      <NewsSection announcements={announcements} />
      {/* <RankingSection rankings={rankings} /> */}
      <TournamentPickupSection tournaments={tournaments} />
      <OrganizerPickupSection organizers={organizers} />
      <ReportPickupSection reports={reports} />
    </>
  );
}
