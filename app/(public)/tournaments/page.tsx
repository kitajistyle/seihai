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

// 1ページあたりの表示件数 (動作確認のため1件に設定)
const ITEMS_PER_PAGE = 1;

function getPageRange(current: number, total: number) {
  const range: (number | string)[] = [];
  const delta = 2; // 現在のページの前後に表示するページ数

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }
  return range;
}

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  let currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  const search = resolvedSearchParams.search || '';
  const sort = resolvedSearchParams.sort || 'date_desc';

  const [tournaments, totalCount] = await Promise.all([
    getTournaments({ page: currentPage, limit: ITEMS_PER_PAGE, search, sort }),
    getTournamentsCount({ search }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  const pageRange = getPageRange(currentPage, totalPages);

  return (
    <section className="relative bg-[var(--color-bg-dark)]/80 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          ホームへ戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-1 h-8 bg-[var(--color-brand-red)]" />
            大会一覧
          </h1>

          <SearchForm initialSearch={search} initialSort={sort} />
        </div>

        <div className="space-y-4">
          {tournaments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <Image src="/sei-cleaning.png" alt="せい" width={150} height={180} className="opacity-80" />
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

              <Link href={`/tournaments/${t.id}`} className="w-full md:w-auto px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                詳細を見る
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {pageRange.map((p, i) => {
              if (p === '...') {
                return (
                  <span
                    key={i}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500"
                  >
                    ...
                  </span>
                );
              }
              const isActive = p === currentPage;
              return (
                <Link
                  key={i}
                  href={`/tournaments?page=${p}${search ? `&search=${encodeURIComponent(search)}` : ''}${sort ? `&sort=${sort}` : ''}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    isActive ? 'bg-[var(--color-brand-blue)] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
