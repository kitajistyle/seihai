import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FadeInView from '@/components/FadeInView';
import { Organizer } from '@/types';

interface OrganizerPickupSectionProps {
  organizers: Organizer[];
}

export default function OrganizerPickupSection({ organizers }: OrganizerPickupSectionProps) {
  return (
    <section className="relative bg-[var(--color-bg-dark)]/80 py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium">主催者一覧</h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-gray-500 mx-auto mb-6 rounded-sm" />
          <p className="text-gray-400 mb-8 md:mb-0 font-medium tracking-widest">大会を開催する主催者たち</p>
        </FadeInView>
        {organizers.length > 2 && (
          <Link href="/organizers" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white transition-colors hidden md:flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizers.slice(0, 2).map((org, index) => (
          <FadeInView
            key={org.id}
            delay={index * 0.15}
            className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 hover:border-white/20 transition-all duration-300 group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.image_url || ''} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" alt={org.name} />
            <div className="flex-grow">
              <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{org.name}</h3>
              <p className="text-white text-sm font-bold mb-3 tracking-wide">{org.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium">{org.description}</p>
            </div>
          </FadeInView>
        ))}
      </div>
      
      {organizers.length > 2 && (
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/organizers" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
