import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  Users,
  ExternalLink
} from 'lucide-react';
import { getTournaments } from '@/lib/supabase/queries';
import { deleteTournament } from '@/lib/supabase/mutations';

export default async function AdminTournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 uppercase">大会管理</h1>
          <p className="text-gray-500 text-sm">全ての大会登録情報の閲覧、編集、削除が可能です。</p>
        </div>
        <Link 
          href="/admin/tournaments/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] whitespace-nowrap"
        >
          <Plus size={18} /> <span className="sm:inline">新規大会作成</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="大会名で検索..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tournaments.map((t) => (
          <div key={t.id} className="glass-panel p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                t.status === 'open' ? 'bg-green-500/10 text-green-500' :
                t.status === 'closed' ? 'bg-red-500/10 text-red-500' :
                'bg-yellow-500/10 text-yellow-500'
              }`}>
                {t.status === 'open' ? 'エントリー中' : t.status === 'closed' ? '終了' : '準備中'}
              </span>
              <div className="flex gap-2">
                <Link 
                  href={`/admin/tournaments/${t.id}/registrations`}
                  className="p-2 bg-white/5 text-gray-400 rounded-lg"
                >
                  <Users size={16} />
                </Link>
                <Link 
                  href={`/admin/tournaments/${t.id}/edit`}
                  className="p-2 bg-white/5 text-gray-400 rounded-lg"
                >
                  <Edit3 size={16} />
                </Link>
              </div>
            </div>
            
            <div>
              <p className="font-bold text-white mb-1">{t.title}</p>
              <p className="text-[10px] text-gray-500 font-mono">ID: {t.id.substring(0, 8)}...</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">開催日時</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar size={12} className="text-[var(--color-brand-blue)]" />
                  {new Date(t.date).toLocaleDateString('ja-JP')}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">参加人数</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Users size={12} className="text-[var(--color-brand-blue)]" />
                  {t.participants} / {t.max_participants}
                </div>
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
              <th className="px-6 py-4">ステータス</th>
              <th className="px-6 py-4">タイトル</th>
              <th className="px-6 py-4">開催日時 (JST)</th>
              <th className="px-6 py-4">参加人数</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tournaments.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    t.status === 'open' ? 'bg-green-500/10 text-green-500' :
                    t.status === 'closed' ? 'bg-red-500/10 text-red-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {t.status === 'open' ? 'エントリー中' : t.status === 'closed' ? '終了' : '準備中'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-white mb-0.5">{t.title}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    ID: {t.id.substring(0, 8)}... <ExternalLink size={10} />
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} className="text-[var(--color-brand-blue)]" />
                    {new Date(t.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' })}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-[var(--color-brand-blue)]" />
                    {t.participants} / {t.max_participants}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/tournaments/${t.id}/registrations`}
                      className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                      title="エントリーリストを表示"
                    >
                      <Users size={16} />
                    </Link>
                    <Link 
                      href={`/admin/tournaments/${t.id}/edit`}
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
