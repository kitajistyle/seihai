import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Filter, Calendar, Users, ChevronRight } from 'lucide-react';
import { getTournaments } from '@/lib/supabase/queries';

export const metadata: Metadata = {
  title: '大会一覧',
  description: '現在受付中および過去のeスポーツ・カードゲーム大会一覧です。',
};

export default async function TournamentsPage() {
  const tournaments = await getTournaments();
  return (
    <section className="bg-white/5 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-1 h-8 bg-[var(--color-brand-red)]" />
            大会一覧 <span className="text-sm font-normal text-gray-500 ml-2 uppercase tracking-widest">Tournaments</span>
          </h1>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select className="appearance-none bg-[var(--color-bg-dark)] border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)]">
                <option>開催日</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="大会を検索..."
                className="bg-[var(--color-bg-dark)] border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] w-full md:w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
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

        <div className="mt-12 flex justify-center gap-2">
          {[1, 2, 3, '...', 10, 11, 12].map((p, i) => (
            <button
              key={i}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                p === 1 ? 'bg-[var(--color-brand-blue)] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
