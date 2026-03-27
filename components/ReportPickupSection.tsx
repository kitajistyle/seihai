import Link from 'next/link';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { REPORTS } from '@/lib/data';

export default function ReportPickupSection() {
  return (
    <section className="bg-white/5 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-4">
            イベントレポート
            <div className="hidden md:block h-px flex-grow bg-white/10 ml-4" />
          </h2>
          <Link href="/reports" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1 shrink-0">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPORTS.slice(0, 4).map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                {report.external && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-[var(--color-bg-dark)] font-bold text-sm mb-6 line-clamp-3 leading-relaxed">
                  {report.title}
                </h3>
                <button className="w-10 h-10 bg-[var(--color-bg-dark)] rounded-full flex items-center justify-center text-white ml-auto hover:bg-[var(--color-brand-blue)] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
