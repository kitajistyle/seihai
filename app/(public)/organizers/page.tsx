import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getOrganizers } from '@/lib/db/queries';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '主催者一覧',
  description: '大会を開催する主催者・オーガナイザーの一覧です。',
};

export default async function OrganizersPage() {
  const organizers = await getOrganizers();
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
        <ArrowLeft size={16} />
        ホームへ戻る
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">主催者一覧</h1>
        <div className="w-24 h-1 bg-[var(--color-brand-blue)] mx-auto mb-4" />
        <p className="text-gray-400">大会を開催する主催者たち</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {organizers.map((org) => (
          <div key={org.id} className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.image_url || ''} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl object-cover transition-all duration-500 shrink-0 shadow-md" alt={org.name} />
            <div className="flex-grow min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 text-black">{org.name}</h3>
              <p className="text-black text-sm font-bold mb-3 tracking-wide">{org.title}</p>
              <p className="text-black text-sm leading-relaxed font-medium mb-3">{org.description}</p>
              {org.x_id && (
                <a
                  href={`https://x.com/${org.x_id.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-full text-xs font-bold bg-black text-white hover:bg-zinc-800 transition-all shadow-sm"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631ZM17.083 20.08h1.833L7.084 4.126H5.117Z"/></svg>
                  @{org.x_id.replace(/^@/, '')}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
