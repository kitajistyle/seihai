import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
// import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';
import NewsSection from '@/components/NewsSection';
import MapSection from '@/components/MapSection';
import StallPickupSection from '@/components/StallPickupSection';
import { getTournaments, getOrganizers, getReports, getHeroTournaments, getAnnouncements, getStalls } from '@/lib/db/queries';

export const metadata: Metadata = {
  // absoluteを使うことでlayout.tsxのtemplateが重複適用されるのを防ぐ
  title: {
    absolute: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
  },
  description: '「せい祭」は全国のカードゲーム大会・トレーディングカードゲーム大会の情報を一元管理するプラットフォームです。大会参加登録・イベントレポート・主催者情報をご確認いただけます。',
  alternates: {
    canonical: 'https://seisai.vercel.app',
  },
  openGraph: {
    title: 'せい祭 | トレーディングカードゲーム大会プラットフォーム',
    description: '「せい祭」は全国のカードゲーム大会・トレーディングカードゲーム大会の情報を一元管理するプラットフォームです。',
    url: 'https://seisai.vercel.app',
    siteName: 'せい祭',
    images: [
      {
        url: 'https://seisai.vercel.app/og-image-v2.png',
        width: 1200,
        height: 630,
        alt: 'せい祭 - トレーディングカードゲーム大会プラットフォーム',
      },
    ],
    type: 'website',
    locale: 'ja_JP',
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const [tournaments, organizers, reports, heroTournaments, announcements, stalls] = await Promise.all([
    getTournaments(),
    getOrganizers(),
    getReports(5),
    getHeroTournaments(),
    getAnnouncements(true),
    getStalls(),
  ]);

  return (
    <>
      {/* Fixed Background Image (Home only) */}
      <div className="fixed top-0 left-0 z-[-1] w-full bg-black flex items-center justify-center pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seisai-bg.png"
          className="max-w-[450px] sm:max-w-[550px] md:max-w-[650px] aspect-square object-contain"
          alt="Background"
        />
      </div>

      {/* Wafu (Japanese Style) Mist Background (Home only) */}
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
      {tournaments && tournaments.length > 0 && <TournamentPickupSection tournaments={tournaments} />}
      {organizers && organizers.length > 0 && <OrganizerPickupSection organizers={organizers} />}
      {stalls && stalls.length > 0 && <StallPickupSection stalls={stalls} />}
      <MapSection />
      {reports && reports.length > 0 && <ReportPickupSection reports={reports} />}
    </>
  );
}
