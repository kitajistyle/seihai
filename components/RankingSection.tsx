import Link from 'next/link';
import { Trophy, ChevronRight } from 'lucide-react';
import { PlayerRank } from '@/types';

interface RankingSectionProps {
  rankings: PlayerRank[];
}

export default function RankingSection({ rankings }: RankingSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-1 h-8 bg-[var(--color-brand-blue)]" />
          TOP RANKING
        </h2>
        <Link href="/rankings" className="text-sm text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors flex items-center gap-1">
          すべて見る <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {rankings.slice(0, 3).map((player, idx) => (
          <div
            key={player.id}
            className={`relative overflow-hidden rounded-2xl p-6 border border-white/10 hover:scale-105 transition-transform duration-300 ${
              idx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
              idx === 1 ? 'bg-gray-400/10 border-gray-400/30' :
              'bg-orange-500/10 border-orange-500/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={player.avatar_url} className="w-16 h-16 rounded-full border-2 border-white/20" alt={player.name} />
                <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'rank-gold' : idx === 1 ? 'rank-silver' : 'rank-bronze'
                }`}>
                  {player.rank}
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-xl font-bold mb-1 truncate" title={player.name}>{player.name}</h3>
                <p className="text-[var(--color-brand-blue)] font-mono text-sm">{player.points} PT</p>
                {player.x_id && (
                  <a 
                    href={`https://x.com/${player.x_id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-white/10 rounded-lg text-[10px] font-bold text-white transition-all hover:scale-105"
                  >
                    𝕏 Follow @{player.x_id}
                  </a>
                )}
              </div>
              <Trophy className={`w-12 h-12 opacity-30 group-hover:opacity-50 transition-opacity ${
                idx === 0 ? 'text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 
                idx === 1 ? 'text-gray-400' : 'text-orange-500'
              }`} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left whitespace-nowrap md:table block">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider hidden md:table-header-group">
            <tr>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Player</th>
              <th className="px-6 py-4 font-medium">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 flex flex-col md:table-row-group">
            {rankings.map((player) => (
              <tr key={player.id} className="hover:bg-white/5 transition-colors group flex items-center p-4 md:p-0 md:table-row gap-4 md:gap-0">
                <td className="md:px-6 md:py-4 font-mono text-[var(--color-brand-blue)] font-bold text-xl md:text-base w-8 md:w-auto text-center md:text-left">{player.rank}</td>
                <td className="md:px-6 md:py-4 flex-1 overflow-hidden">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={player.avatar_url} className="w-10 h-10 md:w-8 md:h-8 rounded-full shrink-0" alt="" />
                    <div className="flex flex-col gap-1 items-start min-w-0">
                      <span className="font-bold text-base md:text-base truncate w-full">{player.name}</span>
                      {player.x_id && (
                        <a 
                          href={`https://x.com/${player.x_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-black/40 hover:bg-[var(--color-brand-blue)] border border-white/10 rounded-lg text-[10px] md:text-xs font-medium text-gray-300 hover:text-white transition-all w-fit"
                        >
                          𝕏 <span className="hidden sm:inline">Follow </span>@{player.x_id}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="md:px-6 md:py-4 font-mono text-lg font-bold text-right shrink-0">{player.points}<span className="md:hidden text-xs text-gray-500 ml-1 font-sans font-normal block">PT</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
