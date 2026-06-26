import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import FadeInView from '@/components/FadeInView';
import { EventReport } from '@/types';

interface ReportPickupSectionProps {
  reports: EventReport[];
}

export default function ReportPickupSection({ reports }: ReportPickupSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <FadeInView tag="h2" direction="left" className="text-2xl md:text-3xl font-bold flex items-center gap-4">
            <span className="text-gradient-premium">イベントレポート</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sei-peace.png" alt="peace" className="w-10 h-10 md:w-14 md:h-14 -mt-1 md:-mt-2 object-contain animate-bounce shrink-0" />
          </FadeInView>
          {reports.length > 4 && (
            <Link href="/reports" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1 shrink-0">
              すべて見る <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.slice(0, 4).map((report, index) => (
            <FadeInView
              key={report.id}
              delay={index * 0.1}
              className="glass-panel overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-28 sm:h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.image_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                {report.is_external && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-2 rounded-full z-20">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-zinc-200 font-bold text-sm sm:text-base mb-4 line-clamp-3 leading-relaxed">
                  {report.title}
                </h3>
                <div className="mt-auto flex justify-end">
                  <Link href={report.is_external ? (report.url || '#') : `/reports/${report.id}`} target={report.is_external ? "_blank" : "_self"}>
                    <button className="w-10 h-10 bg-zinc-800/80 border border-zinc-700/80 rounded-full flex items-center justify-center text-zinc-300 hover:text-black hover:bg-white hover:border-transparent transition-all duration-300 cursor-pointer">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
