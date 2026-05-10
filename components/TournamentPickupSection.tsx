'use client';

import { Tournament } from '@/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface TournamentPickupSectionProps {
  tournaments: Tournament[];
}

export default function TournamentPickupSection({ tournaments }: TournamentPickupSectionProps) {
  return (
    <section className="relative bg-[var(--color-bg-dark)]/80 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold flex items-center gap-4"
          >
            <div className="w-3 h-10 bg-gradient-to-b from-white to-gray-500 rounded-sm" />
            <span className="text-white">注目の大会</span>
          </motion.h2>
          {tournaments.length > 2 && (
            <Link href="/tournaments" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1">
              大会一覧へ <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="space-y-4">
          {tournaments.slice(0, 2).map((t, index) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:-translate-y-1 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-brand-blue)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-gray-300 transition-colors">{t.title}</h3>
                <p className="text-sm text-gray-400 font-medium">
                  開催日: {new Date(t.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', timeZone: 'Asia/Tokyo' })} 
                  {' '} {new Date(t.date).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                  <span className="inline-block mx-3 text-white/20">|</span> 
                  <span className={t.max_participants - t.participants <= 5 ? 'text-white font-bold' : 'text-gray-300'}>
                    残り {t.max_participants - t.participants}人
                  </span> 
                  <span className="text-gray-500 text-xs"> / 定員 {t.max_participants}人</span>
                </p>
              </div>
              <Link href={`/tournaments/${t.id}`} className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-white to-gray-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] text-black font-black rounded-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                詳細を見る <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
