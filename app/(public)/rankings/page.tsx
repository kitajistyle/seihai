import type { Metadata } from 'next';
import { Trophy, ChevronRight } from 'lucide-react';
import { getRankings } from '@/lib/supabase/queries';
import { PlayerRank } from '@/types';

export const metadata: Metadata = {
  title: 'ランキング',
  description: '全プレイヤーのポイントランキング一覧です。',
};

export default async function RankingsPage() {
  const rankings = await getRankings();
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-1 h-8 bg-[var(--color-brand-blue)]" />
          ランキング <span className="text-sm font-normal text-gray-500 ml-2 uppercase tracking-widest">Ranking</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {rankings.slice(0, 3).map((player: PlayerRank, idx: number) => (
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
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">{player.name}</h3>
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
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Player</th>
              <th className="px-6 py-4 font-medium">Points</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rankings.map((player: PlayerRank) => (
              <tr key={player.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-mono text-[var(--color-brand-blue)]">{player.rank}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={player.avatar_url} className="w-8 h-8 rounded-full" alt="" />
                    <div className="flex flex-col">
                      <span className="font-bold">{player.name}</span>
                      {player.x_id && (
                        <a href={`https://x.com/${player.x_id}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-blue-400 transition-colors">
                          𝕏 @{player.x_id}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{player.points}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 group-hover:text-[var(--color-brand-blue)] transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
