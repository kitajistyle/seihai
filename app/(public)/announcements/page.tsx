import type { Metadata } from 'next';
import Link from 'next/link';
import { Bell, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { getAnnouncements } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'お知らせ',
  description: 'せい祭からの最新のお知らせ・更新情報をご確認いただけます。',
};

const typeStyles: Record<string, { badge: string; label: string }> = {
  info:    { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   label: 'INFO' },
  new:     { badge: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'NEW' },
  warning: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: '注意' },
  success: { badge: 'bg-white/10 text-gray-300 border-white/10',          label: '完了' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  });
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements(true);

  return (
    <div className="relative bg-[var(--color-bg-dark)]/80 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          ホームへ戻る
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white flex items-center gap-3 mb-2">
            <Bell size={28} className="text-[var(--color-brand-blue)]" />
            お知らせ
          </h1>
          <p className="text-gray-500 text-sm">最新の更新情報をご確認ください</p>
        </div>

        {announcements.length === 0 ? (
          <div className="glass-panel p-16 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-4 opacity-30" />
            <p>現在お知らせはありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => {
              const style = typeStyles[a.type] ?? typeStyles.info;
              const isExternal = !!a.url;
              const hasDetail = !a.url && !!a.content;

              const inner = (
                <div className={`flex items-center gap-4 p-4 rounded-2xl border glass-panel transition-all ${isExternal || hasDetail ? 'hover:bg-white/8 hover:border-white/20 cursor-pointer' : ''}`}>
                  <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>
                    {style.label}
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-white text-sm leading-snug">{a.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{formatDate(a.created_at)}</p>
                  </div>
                  {isExternal && <ExternalLink size={14} className="shrink-0 text-gray-500" />}
                  {hasDetail && <ChevronRight size={14} className="shrink-0 text-gray-500" />}
                </div>
              );

              if (isExternal) {
                return (
                  <a key={a.id} href={a.url!} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                );
              }
              if (hasDetail) {
                return (
                  <Link key={a.id} href={`/announcements/${a.id}`}>
                    {inner}
                  </Link>
                );
              }
              return <div key={a.id}>{inner}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
