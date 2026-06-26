import { Tournament } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import FadeInView from '@/components/FadeInView';

interface TournamentPickupSectionProps {
  tournaments: Tournament[];
}

export default function TournamentPickupSection({ tournaments }: TournamentPickupSectionProps) {
  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <FadeInView tag="h2" direction="left" className="text-2xl md:text-3xl font-bold flex items-center gap-4">
            <div className="w-3 h-10 bg-gradient-to-b from-white to-zinc-650 rounded-sm" />
            <span className="text-white">注目の大会</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sei-running.png" alt="running" className="w-10 h-10 md:w-14 md:h-14 -mt-1 md:-mt-2 object-contain animate-bounce shrink-0" />
          </FadeInView>
          {tournaments.length > 2 && (
            <Link href="/tournaments" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1">
              大会一覧へ <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {tournaments.slice(0, 2).map((t, index) => (
            <FadeInView
              key={t.id}
              delay={index * 0.15}
              className="glass-panel flex flex-col md:flex-row items-stretch group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white to-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {/* 画像 + タイトルオーバーレイ */}
              <div className="w-full md:w-72 h-44 md:h-auto shrink-0 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 text-white font-black text-lg leading-tight drop-shadow">{t.title}</h3>
              </div>
              {/* メタ情報 + ボタン */}
              <div className="flex-grow px-5 py-4 flex flex-col justify-between gap-3 min-w-0">
                <div className="text-sm text-zinc-400 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <span className="font-bold text-zinc-300">開催日</span>
                    {new Date(t.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', timeZone: 'Asia/Tokyo' })}
                    {' '}{new Date(t.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                  </p>
                  {!t.external_registration_url && (
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-zinc-300">空き枠</span>
                      <span className={t.max_participants - t.participants <= 5 ? 'text-red-500 font-bold' : 'text-zinc-300'}>
                        残り {t.max_participants - t.participants}人
                      </span>
                      <span className="text-zinc-500 text-xs">(定員 {t.max_participants}人)</span>
                    </p>
                  )}
                </div>
                <Link href={`/tournaments/${t.id}`} className="w-full px-6 py-3 bg-white hover:bg-zinc-200 text-black font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95">
                  詳細を見る <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
