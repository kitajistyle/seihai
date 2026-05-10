import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Organizer } from '@/types';

interface OrganizerPickupSectionProps {
  organizers: Organizer[];
}

export default function OrganizerPickupSection({ organizers }: OrganizerPickupSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-gradient-premium">主催者一覧</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-brand-blue)] to-[var(--color-brand-blue-dark)] mx-auto mb-4 rounded-full" />
        <p className="text-gray-400 mb-8 md:mb-0 font-medium">大会を開催する主催者たち</p>
        {organizers.length > 2 && (
          <Link href="/organizers" className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors hidden md:flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizers.slice(0, 2).map((org) => (
          <div key={org.id} className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 hover:border-white/20 transition-all duration-300 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.image_url || ''} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 shadow-md group-hover:shadow-[0_0_20px_rgba(0,225,255,0.3)]" alt={org.name} />
            <div className="flex-grow">
              <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--color-brand-blue)] group-hover:to-blue-200 transition-all">{org.name}</h3>
              <p className="text-[var(--color-brand-blue)] text-sm font-bold mb-3 tracking-wide">{org.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium">{org.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {organizers.length > 2 && (
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/organizers" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1">
            すべて見る <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
