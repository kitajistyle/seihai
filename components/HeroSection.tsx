'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
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
    <section className="relative min-h-[70vh] flex items-end md:items-center justify-center md:justify-start py-16 px-6 md:px-16 lg:px-32">
      {/* SEO用H1 - 視覚的に非表示、クローラー向け */}
      <h1 className="sr-only">EVERY1 FES - トレーディングカードゲーム大会プラットフォーム</h1>

      {/* マスコットキャラクター */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="absolute bottom-0 right-4 sm:right-12 md:right-16 lg:right-32 z-20 pointer-events-none"
      >
        <Image
          src="/shiba-character.png"
          alt="キャラクター"
          width={160}
          height={200}
          className="drop-shadow-2xl md:w-[200px] md:h-[250px] lg:w-[240px] lg:h-[300px]"
          priority
        />
      </motion.div>

      <div className="relative z-10 w-full md:max-w-xl lg:max-w-2xl text-center md:text-left mt-48 md:mt-0 pb-8 md:pb-0">
        {tournaments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-start gap-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gray-300" />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">近日開催</p>
              <div className="w-12 h-px bg-gray-300" />
            </div>

            <div className="flex flex-col self-start gap-0">
              {tournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="flex items-center justify-between py-4 sm:py-5 group relative"
                >
                  <div className="absolute bottom-0 left-0 h-px w-full bg-gray-200 group-hover:bg-gray-900 transition-colors duration-500" />

                  <div className="flex flex-col items-start gap-2 pr-4 min-w-0">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 group-hover:text-gray-900 truncate transition-colors text-lg sm:text-xl">{t.title}</span>
                      <span className={`text-xs sm:text-sm font-bold px-1.5 py-1 rounded-sm shrink-0 tracking-widest ${
                        t.status === 'open' ? 'bg-gray-900 text-white' :
                        t.status === 'closed' ? 'text-gray-400 border border-gray-300' :
                        'text-gray-400 border border-gray-300'
                      }`}>
                        {t.status === 'open' ? '受付中' : t.status === 'closed' ? '終了' : '準備中'}
                      </span>
                        </div>
                    <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-700 transition-colors">
                      <Calendar size={16} />
                      <span className="font-mono text-sm sm:text-base">{formatDate(t.date)}</span>
                    </div>
                  </div>

                  <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-900 shrink-0 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
