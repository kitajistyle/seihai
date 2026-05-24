import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { getReports } from '@/lib/db/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'イベントレポート',
  description: '開催された大会のイベントレポート一覧です。',
};

export default async function ReportsPage() {
  const reports = await getReports();
  return (
    <section className="relative bg-[var(--color-bg-dark)]/80 py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          ホームへ戻る
        </Link>

        <h1 className="text-3xl font-bold mb-12 flex items-center gap-4">
          イベントレポート
          <div className="h-px flex-grow bg-white/10" />
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-28 sm:h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={report.image_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                {report.is_external && (
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-2 rounded-full">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="text-[var(--color-bg-dark)] font-bold text-xs sm:text-sm mb-3 sm:mb-6 line-clamp-3 leading-relaxed">
                  {report.title}
                </h3>
                <Link href={report.is_external ? (report.url || '#') : `/reports/${report.id}`} target={report.is_external ? "_blank" : "_self"}>
                  <button className="w-10 h-10 bg-[var(--color-bg-dark)] rounded-full flex items-center justify-center text-white ml-auto hover:bg-[var(--color-brand-blue)] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
