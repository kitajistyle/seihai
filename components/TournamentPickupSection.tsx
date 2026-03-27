import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { TOURNAMENTS } from '@/lib/data';

export default function TournamentPickupSection() {
  return (
    <section className="bg-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="w-1 h-8 bg-[var(--color-brand-red)]" />
            注目の大会
          </h2>
          <Link href="/tournaments" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1">
            大会一覧へ <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {TOURNAMENTS.slice(0, 2).map((t) => (
            <div key={t.id} className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:-translate-y-1 transition-transform duration-300">
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                <p className="text-sm text-gray-400">開催日: {t.date} ／ 残り {t.maxParticipants - t.participants}人 / 定員 {t.maxParticipants}人</p>
              </div>
              <Link href={`/tournaments/${t.id}`} className="w-full md:w-auto px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
                詳細を見る <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
