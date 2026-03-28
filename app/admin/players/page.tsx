import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Award,
  ExternalLink,
  Users
} from 'lucide-react';
import { getRankings } from '@/lib/supabase/queries';
import { deletePlayer } from '@/lib/supabase/mutations';

export default async function AdminPlayersPage() {
  // Use a larger limit for admin
  const players = await getRankings(100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 uppercase">プレイヤー管理</h1>
          <p className="text-gray-500 text-sm">ランキング、ポイント、SNS連携情報の管理が可能です。</p>
        </div>
        <Link 
          href="/admin/players/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] whitespace-nowrap"
        >
          <Plus size={18} /> <span className="sm:inline">新規プレイヤー作成</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="名前や Twitter ID で検索..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {players.map((p) => (
          <div key={p.id} className="glass-panel p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex w-7 h-7 items-center justify-center rounded font-mono text-xs ${
                  p.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                  p.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                  p.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                  'bg-white/5 text-gray-500'
                }`}>
                  {p.rank}
                </span>
                <img src={p.avatar_url || `https://unavatar.io/x/${p.name}`} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                <p className="font-bold text-white">{p.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/players/${p.id}/edit`}
                  className="p-2 bg-white/5 text-gray-400 rounded-lg"
                >
                  <Edit3 size={16} />
                </Link>
                {/* 削除ボタンは簡易化のためここでは省略、またはフォームにする */}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ポイント</p>
                <div className="flex items-center gap-2 font-mono text-white text-sm">
                  <Award size={14} className="text-[var(--color-brand-blue)]" />
                  {p.points}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Twitter (𝕏)</p>
                {p.x_id ? (
                  <span className="text-xs text-blue-400 font-bold truncate block">@{p.x_id}</span>
                ) : (
                  <span className="text-[10px] text-gray-600 italic">未設定</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="glass-panel overflow-hidden hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 text-center">順位</th>
              <th className="px-6 py-4">プレイヤー</th>
              <th className="px-6 py-4 text-center">ポイント</th>
              <th className="px-6 py-4">Twitter (𝕏)</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg font-mono text-sm ${
                    p.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                    p.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                    p.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    {p.rank}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar_url || `https://unavatar.io/x/${p.name}`} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                    <div>
                      <p className="font-bold text-white mb-0.5">{p.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{p.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 font-mono text-white">
                    <Award size={14} className="text-[var(--color-brand-blue)]" />
                    {p.points}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.x_id ? (
                    <a 
                      href={`https://x.com/${p.x_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors font-bold"
                    >
                      𝕏 @{p.x_id}
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-600 italic">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/players/${p.id}/edit`}
                      className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
