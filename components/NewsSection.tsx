'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Announcement } from '@/types';

interface NewsSectionProps {
  announcements: Announcement[];
}

export default function NewsSection({ announcements }: NewsSectionProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 -mt-12 relative z-20 mb-20">
      <div className="absolute inset-0 bg-[var(--color-bg-dark)]/70" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-6 sm:p-8 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-shadow duration-500"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-white/10 transition-colors duration-700" />
        <h2 className="text-xl sm:text-2xl font-bold mb-6 tracking-wide text-gradient-premium">
          ニュース・お知らせ
        </h2>
        
        <div className="flex flex-col">
          {announcements.slice(0, 5).map((announcement, index) => {
            // "02月13日" format
            const d = new Date(announcement.created_at || new Date());
            const dateStr = isNaN(d.getTime()) 
              ? '' 
              : `${String(d.getMonth() + 1).padStart(2, '0')}月${String(d.getDate()).padStart(2, '0')}日`;

            const isExternal = !!announcement.url;
            const hasDetail = !announcement.url && !!announcement.content;
            const isClickable = isExternal || hasDetail;
            const targetUrl = isExternal ? announcement.url! : (hasDetail ? `/announcements/${announcement.id}` : '#');

            const innerContent = (
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors font-mono tracking-wider">
                    {dateStr}
                  </span>
                  <span className="text-base sm:text-lg text-gray-200 font-medium line-clamp-2 ml-2 sm:ml-4 group-hover:text-white transition-colors">
                    {announcement.title}
                  </span>
                </div>
                {isClickable && (
                  <ChevronRight className="w-5 h-5 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                )}
              </div>
            );

            return (
              <div 
                key={announcement.id} 
                className={`py-4 px-3 relative group cursor-pointer rounded-lg transition-all duration-300 hover:bg-white/5 ${index !== announcements.length - 1 && index !== 4 ? 'border-b border-white/10 hover:border-transparent' : ''}`}
              >
                <div className="absolute left-0 top-2 bottom-2 w-2 rounded-sm bg-gradient-to-b from-white to-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-y-50 group-hover:scale-y-100" />
                {isClickable ? (
                  <Link 
                    href={targetUrl} 
                    target={isExternal && targetUrl.startsWith('http') ? "_blank" : "_self"}
                    className="block pl-4 group-hover:pl-6 transition-all duration-300"
                  >
                    {innerContent}
                  </Link>
                ) : (
                  <div className="block pl-4 group-hover:pl-6 transition-all duration-300">
                    {innerContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
