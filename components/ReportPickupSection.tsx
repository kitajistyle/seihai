'use client';

import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { EventReport } from '@/types';

interface ReportPickupSectionProps {
  reports: EventReport[];
}

export default function ReportPickupSection({ reports }: ReportPickupSectionProps) {
  return (
    <section className="relative bg-[var(--color-bg-dark)]/80 py-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold flex items-center gap-4"
          >
            <span className="text-gradient-premium">イベントレポート</span>
            <div className="hidden md:block h-px flex-grow bg-gradient-to-r from-white/20 to-transparent ml-4" />
          </motion.h2>
          {reports.length > 4 && (
            <Link href="/reports" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1 shrink-0">
              すべて見る <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.slice(0, 4).map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[var(--color-bg-card)] border border-white/5 rounded-xl overflow-hidden shadow-2xl group hover:-translate-y-2 hover:border-white/10 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-28 sm:h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent z-10 opacity-60" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.image_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                {report.is_external && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-full z-20 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-20">
                <h3 className="text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 font-bold text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed transition-all">
                  {report.title}
                </h3>
                <div className="mt-auto flex justify-end">
                  <Link href={report.is_external ? (report.url || '#') : `/reports/${report.id}`} target={report.is_external ? "_blank" : "_self"}>
                    <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:text-black hover:bg-gradient-to-r hover:from-white hover:to-gray-300 hover:border-transparent hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:scale-110">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
