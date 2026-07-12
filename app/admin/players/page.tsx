import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  Award
} from 'lucide-react';
import { getRankings } from '@/lib/db/queries';

export default async function AdminPlayersPage() {
  // Use a larger limit for admin
  const players = await getRankings(100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-2 uppercase">プレイヤー管理</h1>
          <p className="text-black text-sm">ランキング、ポイント、SNS連携情報の管理が可能です。</p>
        </div>
        <Link 
          href="/admin/players/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
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
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-black focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {players.map((p) => (
          <div key={p.id} className="glass-panel p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex w-7 h-7 items-center justify-center rounded font-mono text-xs ${
                  p.rank === 1 ? 'bg-yellow-500/20 text-yellow-600' :
                  p.rank === 2 ? 'bg-zinc-300 text-zinc-700' :
                  p.rank === 3 ? 'bg-orange-500/20 text-orange-600' :
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  {p.rank}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar_url || `https://unavatar.io/x/${p.name}`} className="w-8 h-8 rounded-full border border-zinc-250" alt="" />
                <p className="font-bold text-black">{p.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/players/${p.id}/edit`}
                  className="p-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-lg"
                >
                  <Edit3 size={16} />
                </Link>
                {/* 削除ボタンは簡易化のためここでは省略、またはフォームにする */}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200">
              <div>
                <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">ポイント</p>
                <div className="flex items-center gap-2 font-mono text-black text-sm">
                  <Award size={14} className="text-[var(--color-brand-blue)]" />
                  {p.points}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-1">Twitter (𝕏)</p>
                {p.x_id ? (
                  <span className="text-xs text-blue-600 font-bold truncate block">@{p.x_id}</span>
                ) : (
                  <span className="text-[10px] text-zinc-500 italic">未設定</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="glass-panel overflow-hidden hidden md:block">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 text-[10px] font-bold text-black uppercase tracking-widest border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-center">順位</th>
              <th className="px-6 py-4">プレイヤー</th>
              <th className="px-6 py-4 text-center">ポイント</th>
              <th className="px-6 py-4">Twitter (𝕏)</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {players.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg font-mono text-sm ${
                    p.rank === 1 ? 'bg-yellow-500/20 text-yellow-600 font-bold' :
                    p.rank === 2 ? 'bg-zinc-200 text-zinc-700' :
                    p.rank === 3 ? 'bg-orange-500/20 text-orange-650' :
                    'bg-zinc-100 text-zinc-600'
                  }`}>
                    {p.rank}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.avatar_url || `https://unavatar.io/x/${p.name}`} className="w-10 h-10 rounded-full border border-zinc-200" alt="" />
                    <div>
                      <p className="font-bold text-black mb-0.5">{p.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{p.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 font-mono text-black">
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
                      className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors font-bold"
                    >
                      𝕏 @{p.x_id}
                    </a>
                  ) : (
                    <span className="text-[10px] text-zinc-500 italic">Not set</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/players/${p.id}/edit`}
                      className="p-2 hover:bg-blue-50 text-zinc-700 hover:text-blue-600 rounded-lg transition-all"
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
