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
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft size={16} />
          ホームへ戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-pink-400 rounded-sm" />
            大会一覧
          </h1>

          <SearchForm initialSearch={search} initialSort={sort} />
        </div>

        <div className="space-y-4">
          {tournaments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <Image src="/shiba-character.png" alt="キャラクター" width={150} height={180} className="opacity-80" />
              <p className="text-gray-400 font-bold text-lg">現在開催中の大会はありません</p>
              <p className="text-gray-600 text-sm">近日公開予定ですのでお楽しみに！</p>
            </div>
          )}
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:translate-x-2 transition-transform duration-300"
            >
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[var(--color-brand-blue)]" />
                    開催日: {new Date(t.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', timeZone: 'Asia/Tokyo' })}
                    {' '}
                    {new Date(t.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[var(--color-brand-blue)]" />
                    残り {t.max_participants - (t.participants || 0)}人 / 定員 {t.max_participants}人
                  </div>
                </div>
              </div>

              <Link href={`/tournaments/${t.id}`} className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                詳細を見る
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
