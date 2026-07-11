import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { getTournaments, getTournamentsCount } from '@/lib/db/queries';
import SearchForm from './search-form';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '大会一覧',
  description: '現在受付中および過去のeスポーツ・カードゲーム大会一覧です。',
};



export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search || '';
  const sort = resolvedSearchParams.sort || 'date_desc';

  const tournaments = await getTournaments({ search, sort });

  return (
    <section className="relative py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          ホームへ戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-white to-zinc-650 rounded-sm" />
            大会一覧
          </h1>

          <SearchForm initialSearch={search} initialSort={sort} />
        </div>

        <div className="space-y-4">
          {tournaments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <Image src="/sei-cleaning.png" alt="キャラクター" width={150} height={180} className="opacity-80" />
              <p className="text-white font-bold text-lg">現在開催中の大会はありません</p>
              <p className="text-white text-sm">近日公開予定ですのでお楽しみに！</p>
            </div>
          )}
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="glass-panel flex flex-col md:flex-row items-stretch group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white to-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {/* 画像 + タイトルオーバーレイ */}
              <div className="w-full md:w-72 h-44 md:h-auto shrink-0 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-black text-lg leading-tight drop-shadow">{t.title}</h3>
              </div>
              {/* メタ情報 + ボタン */}
              <div className="flex-grow px-5 py-4 flex flex-col justify-between gap-3 min-w-0">
                <div className="text-sm text-white space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                    <span className="font-bold text-white">開催日</span>
                    {new Date(t.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', timeZone: 'Asia/Tokyo' })}
                    {' '}{new Date(t.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                  </div>
                  {!t.external_registration_url && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--color-brand-blue)] shrink-0" />
                      <span className="font-bold text-white">定員</span>
                      <span className="text-white">{t.max_participants}人</span>
                    </div>
                  )}
                </div>
                <Link href={`/tournaments/${t.id}`} className="w-full px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
                  詳細を見る <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
