import Link from 'next/link';
import { Bell, ChevronRight } from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

const typeStyles: Record<string, string> = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
  new: 'bg-green-500/10 border-green-500/20 text-green-300',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
  success: 'bg-white/5 border-white/10 text-gray-300',
};

const typeBadgeStyles: Record<string, string> = {
  info: 'bg-blue-500/20 text-blue-300',
  new: 'bg-green-500/20 text-green-300',
  warning: 'bg-yellow-500/20 text-yellow-300',
  success: 'bg-white/10 text-gray-300',
};

const typeLabels: Record<string, string> = {
  info: 'INFO',
  new: 'NEW',
  warning: '注意',
  success: '完了',
};

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  if (announcements.length === 0) return null;

  return (
    <div className="bg-[#0a0a0c] border-b border-white/5 py-3 px-4">
      <div className="max-w-7xl mx-auto space-y-2">
        {announcements.map((a) => {
          const rowStyle = typeStyles[a.type] ?? typeStyles.info;
          const badgeStyle = typeBadgeStyles[a.type] ?? typeBadgeStyles.info;
          const label = typeLabels[a.type] ?? 'INFO';

          const inner = (
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${rowStyle} ${a.url ? 'hover:brightness-110 transition-all' : ''}`}>
              <Bell size={14} className="shrink-0 opacity-70" />
              <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyle}`}>
                {label}
              </span>
              <span className="flex-grow font-medium">{a.title}</span>
              {a.content && (
                <span className="hidden sm:block text-xs opacity-60 truncate max-w-xs">{a.content}</span>
              )}
              {a.url && <ChevronRight size={14} className="shrink-0 opacity-60" />}
            </div>
          );

          return a.url ? (
            <Link key={a.id} href={a.url} target={a.url.startsWith('http') ? '_blank' : '_self'}>
              {inner}
            </Link>
          ) : (
            <div key={a.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
