'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
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
          <Link
            href="/rankings"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg backdrop-blur-md border border-white/10 transition-all flex items-center justify-center"
          >
            ランキング
          </Link>
        </div>
      </div>
    </section>
  );
}
