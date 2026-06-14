import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
// import RankingSection from '@/components/RankingSection';
import TournamentPickupSection from '@/components/TournamentPickupSection';
import OrganizerPickupSection from '@/components/OrganizerPickupSection';
import ReportPickupSection from '@/components/ReportPickupSection';
import NewsSection from '@/components/NewsSection';
import { getTournaments, getOrganizers, getReports, getHeroTournaments, getAnnouncements } from '@/lib/db/queries';

export const metadata: Metadata = {
  // absoluteを使うことでlayout.tsxのtemplateが重複適用されるのを防ぐ
  title: {
    absolute: 'EVERY1 FES | トレーディングカードゲーム大会プラットフォーム',
  },
  description: '「EVERY1 FES」は全国のカードゲーム大会・トレーディングカードゲーム大会の情報を一元管理するプラットフォームです。大会参加登録・イベントレポート・主催者情報をご確認いただけます。',
  alternates: {
    canonical: 'https://seisai.vercel.app',
  },
  openGraph: {
    title: 'EVERY1 FES | トレーディングカードゲーム大会プラットフォーム',
    description: '「EVERY1 FES」は全国のカードゲーム大会・トレーディングカードゲーム大会の情報を一元管理するプラットフォームです。',
    url: 'https://seisai.vercel.app',
    siteName: 'EVERY1 FES',
    images: [
      {
        url: 'https://seisai.vercel.app/seisai-bg.png',
        width: 1200,
        height: 630,
        alt: 'EVERY1 FES - トレーディングカードゲーム大会プラットフォーム',
      },
    ],
    type: 'website',
    locale: 'ja_JP',
  },
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
      <div className="fixed inset-0 z-[-1] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/seisai-bg.png"
          className="w-220 object-contain mx-auto mt-20"
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
