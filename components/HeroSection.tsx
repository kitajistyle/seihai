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
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-dark)]/40 via-[var(--color-bg-dark)]/70 to-[var(--color-bg-dark)]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-brand-blue)]/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-brand-gold)]/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-2xl"
        >
          <span className="text-gradient-premium">熱いバトルに</span><br className="sm:hidden" /><span className="text-gradient-blue drop-shadow-[0_0_15px_rgba(0,225,255,0.4)]">参加しよう！</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl text-gray-400 mb-10 font-medium tracking-wide"
        >
          全国のeスポーツ大会 受付中！
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-20">
          <Link
            href="/tournaments"
            className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-blue-dark)] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,225,255,0.3)] hover:shadow-[0_0_30px_rgba(0,225,255,0.6)] hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10">大会一覧を見る</span>
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
                className="flex items-center gap-3 px-5 py-3 glass-panel hover:scale-[1.02] hover:bg-white/5 text-sm transition-all group w-full max-w-xs sm:max-w-sm relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-brand-blue)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Calendar size={14} className="text-[var(--color-brand-blue)] shrink-0" />
                <span className="font-bold text-gray-200 group-hover:text-white truncate flex-1 text-left transition-colors">{t.title}</span>
                <span className="text-gray-400 font-mono text-xs shrink-0">{formatDate(t.date)}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 tracking-wider ${
                  t.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  t.status === 'closed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {t.status === 'open' ? '受付中' : t.status === 'closed' ? '終了' : '準備中'}
                </span>
                <ChevronRight size={14} className="text-gray-500 group-hover:text-white shrink-0 transition-colors" />
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
