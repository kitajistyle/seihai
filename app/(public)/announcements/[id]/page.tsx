import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Bell, ArrowLeft, Calendar } from 'lucide-react';
import { getAnnouncementById } from '@/lib/db/queries';

export const revalidate = 300;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  const announcement = await getAnnouncementById(id);
  if (!announcement) return { title: '見つかりません' };
  const description = announcement.content?.slice(0, 120) || 'せい祭からのお知らせです。';
  const BASE_URL = 'https://seisai.vercel.app';
  return {
    title: `${announcement.title} | せい祭`,
    description,
    openGraph: {
      title: `${announcement.title} | せい祭`,
      description,
      url: `${BASE_URL}/announcements/${announcement.id}`,
      siteName: 'せい祭',
      images: [
        {
          url: `${BASE_URL}/og-image-v2.png`,
          width: 1200,
          height: 630,
          alt: 'せい祭 - トレーディングカードゲーム大会プラットフォーム',
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${announcement.title} | せい祭`,
      description,
      images: [`${BASE_URL}/og-image-v2.png`],
    },
  };
}

const typeStyles: Record<string, { badge: string; label: string }> = {
  info:    { badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',       label: 'INFO' },
  new:     { badge: 'bg-green-500/20 text-green-300 border-green-500/30',    label: 'NEW' },
  warning: { badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: '注意' },
  success: { badge: 'bg-white/10 text-white border-white/10',             label: '完了' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tokyo',
  });
}

export default async function AnnouncementDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const announcement = await getAnnouncementById(id);

  if (!announcement || (!announcement.content && !announcement.url)) {
    notFound();
  }

  if (announcement.url) {
    notFound();
  }

  const style = typeStyles[announcement.type] ?? typeStyles.info;

  return (
    <div className="relative bg-[var(--color-bg-dark)]/80 min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          お知らせ一覧に戻る
        </Link>

        <article className="glass-panel p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-brand-blue)]/10 shrink-0">
              <Bell size={20} className="text-[var(--color-brand-blue)]" />
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${style.badge}`}>
                  {style.label}
                </span>
                <span className="flex items-center gap-1 text-xs text-white">
                  <Calendar size={11} />
                  {formatDate(announcement.created_at)}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white leading-snug">
                {announcement.title}
              </h1>
            </div>
          </div>

          {announcement.content && (
            <div className="pt-4 border-t border-white/10">
              <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {announcement.content}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
