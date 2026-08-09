import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FadeInView from '@/components/FadeInView';
import { Organizer } from '@/types';

interface OrganizerPickupSectionProps {
  organizers: Organizer[];
}

export default function OrganizerPickupSection({ organizers }: OrganizerPickupSectionProps) {
  return (
    <section className="relative py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium flex items-center justify-center gap-2">
            主催者一覧
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sei-dancing.png" alt="dancing" className="w-10 h-10 md:w-14 md:h-14 object-contain animate-pulse shrink-0" />
          </h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-zinc-450 mx-auto mb-6 rounded-sm" />
          <p className="text-white mb-8 md:mb-0 font-medium tracking-widest">大会を開催する主催者たち</p>
        </FadeInView>
        {organizers.length > 2 && (
          <Link href="/organizers" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-white hover:text-white transition-colors hidden md:flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizers.slice(0, 2).map((org, index) => (
          <FadeInView
            key={org.id}
            delay={index * 0.15}
            className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.image_url || ''} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl object-cover group-hover:scale-105 transition-all duration-500 shadow-md shrink-0" alt={org.name} />
            <div className="flex-grow min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 text-black transition-all">{org.name}</h3>
              <p className="text-black text-sm font-bold mb-3 tracking-wide">{org.title}</p>
              <p className="text-black text-sm leading-relaxed line-clamp-2 font-medium">{org.description}</p>
              {org.x_id && (
                <a
                  href={`https://x.com/${org.x_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-white hover:underline"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631ZM17.083 20.08h1.833L7.084 4.126H5.117Z"/></svg>
                  @{org.x_id}
                </a>
              )}
            </div>
          </FadeInView>
        ))}
      </div>

      {organizers.length > 2 && (
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/organizers" className="text-sm text-white hover:text-white transition-colors flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
