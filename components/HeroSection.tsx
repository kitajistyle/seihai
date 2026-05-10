'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Tournament } from '@/types';
import { Calendar, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  tournaments?: Tournament[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short', timeZone: 'Asia/Tokyo' });
}

export default function HeroSection({ tournaments = [] }: HeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          className="w-full h-full object-cover opacity-30 blur-sm"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-dark)]/0 via-[var(--color-bg-dark)]/50 to-[var(--color-bg-dark)]" />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black mb-4 tracking-tight"
        >
          熱いバトルに<span className="text-[var(--color-brand-blue)]">参加しよう！</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl text-gray-400 mb-8"
        >
          全国のeスポーツ大会 受付中！
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tournaments"
            className="px-8 py-4 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(0,162,255,0.4)]"
          >
            大会一覧
          </Link>
        </div>

        {tournaments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center gap-2"
          >
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">近日開催</p>
            {tournaments.map((t) => (
              <Link
                key={t.id}
                href={`/tournaments/${t.id}`}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all group w-full max-w-xs sm:max-w-sm"
              >
                <Calendar size={13} className="text-[var(--color-brand-blue)] shrink-0" />
                <span className="font-bold text-white truncate flex-1 text-left">{t.title}</span>
                <span className="text-gray-500 text-xs shrink-0">{formatDate(t.date)}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  t.status === 'open' ? 'bg-green-500/20 text-green-400' :
                  t.status === 'closed' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {t.status === 'open' ? '受付中' : t.status === 'closed' ? '終了' : '準備中'}
                </span>
                <ChevronRight size={13} className="text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors" />
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
