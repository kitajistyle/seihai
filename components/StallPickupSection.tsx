import FadeInView from '@/components/FadeInView';
import { Stall } from '@/types';
import { ExternalLink, ShoppingBag } from 'lucide-react';

function isXUrl(url: string) {
  return /^https?:\/\/(www\.)?(x\.com|twitter\.com)/.test(url);
}

interface StallPickupSectionProps {
  stalls: Stall[];
}

export default function StallPickupSection({ stalls }: StallPickupSectionProps) {
  return (
    <section className="relative py-24">
      <div className="text-center mb-16 relative">
        <FadeInView>
          <h2 className="text-2xl sm:text-4xl font-black mb-6 uppercase tracking-tighter text-gradient-premium flex items-center justify-center gap-2">
            出店一覧
            <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 shrink-0" />
          </h2>
          <div className="w-32 h-3 bg-gradient-to-r from-white to-zinc-450 mx-auto mb-6 rounded-sm" />
          <p className="text-white font-medium tracking-widest">イベント会場で出店中のショップ</p>
        </FadeInView>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stalls.map((stall, index) => (
          <FadeInView
            key={stall.id}
            delay={index * 0.15}
            className="glass-panel p-6 flex gap-6 items-center hover:-translate-y-1 transition-all duration-300 group"
          >
            {stall.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stall.image_url}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl object-cover group-hover:scale-105 transition-all duration-500 shadow-md shrink-0"
                alt={stall.name}
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                <ShoppingBag className="text-zinc-500 w-8 h-8" />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold mb-1 text-black transition-all">{stall.name}</h3>
              {stall.genre && (
                <p className="text-black text-sm font-bold mb-3 tracking-wide">{stall.genre}</p>
              )}
              {stall.description && (
                <p className="text-black text-sm leading-relaxed line-clamp-2 font-medium">{stall.description}</p>
              )}
              {stall.url && (
                <a
                  href={stall.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isXUrl(stall.url)
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {isXUrl(stall.url) ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631ZM17.083 20.08h1.833L7.084 4.126H5.117Z"/></svg>
                      X でフォロー
                    </>
                  ) : (
                    <><ExternalLink size={12} /> 公式サイト</>
                  )}
                </a>
              )}
            </div>
          </FadeInView>
        ))}
      </div>
    </section>
  );
}
