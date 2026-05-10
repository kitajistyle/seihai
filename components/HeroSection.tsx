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

      <div className="relative z-10 text-center px-4 mt-96 sm:mt-100 md:mt-110 lg:mt-120">
        {tournaments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-gray-600" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">近日開催</p>
              <div className="w-8 h-px bg-gray-600" />
            </div>
            
            <div className="flex flex-col w-full max-w-md gap-1">
              {tournaments.map((t) => (
                <Link
                  key={t.id}
                  href={`/tournaments/${t.id}`}
                  className="flex items-center justify-between py-3 sm:py-4 group w-full relative"
                >
                  {/* Hover underline */}
                  <div className="absolute bottom-0 left-0 h-px w-full bg-white/10 group-hover:bg-white transition-colors duration-500" />
                  
                  <div className="flex flex-col items-start gap-1.5 w-full pr-4 min-w-0">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="font-bold text-gray-200 group-hover:text-white truncate transition-colors text-base sm:text-lg flex-1">{t.title}</span>
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-sm shrink-0 tracking-widest ${
                        t.status === 'open' ? 'bg-white text-black' :
                        t.status === 'closed' ? 'text-gray-500 border border-gray-600' :
                        'text-gray-400 border border-gray-500'
                      }`}>
                        {t.status === 'open' ? '受付中' : t.status === 'closed' ? '終了' : '準備中'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-gray-200 transition-colors">
                      <Calendar size={14} />
                      <span className="font-mono text-xs sm:text-sm">{formatDate(t.date)}</span>
                    </div>
                  </div>
                  
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-white shrink-0 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
