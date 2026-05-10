import Link from 'next/link';
import { Announcement } from '@/types';

interface NewsSectionProps {
  announcements: Announcement[];
}

export default function NewsSection({ announcements }: NewsSectionProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 -mt-12 relative z-20 mb-20">
      <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-6 sm:p-8 shadow-2xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white tracking-wide">
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
              <>
                <span className="text-sm text-gray-300">
                  {dateStr}
                </span>
                <span className="text-base sm:text-lg text-white font-medium line-clamp-2 ml-2 sm:ml-4">
                  {announcement.title}
                </span>
              </>
            );

            return (
              <div 
                key={announcement.id} 
                className={`py-4 ${index !== announcements.length - 1 && index !== 4 ? 'border-b border-white/20' : ''}`}
              >
                {isClickable ? (
                  <Link 
                    href={targetUrl} 
                    target={isExternal && targetUrl.startsWith('http') ? "_blank" : "_self"}
                    className="group flex flex-col gap-1.5 hover:opacity-80 transition-opacity"
                  >
                    {innerContent}
                  </Link>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {innerContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
