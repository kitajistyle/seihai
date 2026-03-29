import Link from 'next/link';
import {
  Plus,
  Search,
  Edit3,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { getReports } from '@/lib/supabase/queries';
import { deleteReport } from '@/lib/supabase/mutations';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminReportsPage() {
  const reports = await getReports(50);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 uppercase">レポート管理</h1>
          <p className="text-gray-500 text-sm">大会結果レポートや記事、外部リンク情報の管理が可能です。</p>
        </div>
        <Link 
          href="/admin/reports/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] whitespace-nowrap"
        >
          <Plus size={18} /> <span className="sm:inline">新規レポート作成</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="タイトルで検索..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {reports.map((r) => (
          <div key={r.id} className="glass-panel p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                <img src={r.image_url} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-white mb-1 truncate">{r.title}</p>
                <p className="text-[10px] text-gray-500">{new Date(r.date).toLocaleDateString('ja-JP')}</p>
              </div>
              <Link
                href={`/admin/reports/${r.id}/edit`}
                className="p-2 bg-white/5 text-gray-400 rounded-lg shrink-0"
              >
                <Edit3 size={16} />
              </Link>
              <DeleteButton
                action={deleteReport.bind(null, r.id)}
                confirmMessage={`「${r.title}」を削除しますか？`}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">形式</p>
                {r.is_external ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400">
                    <ExternalLink size={10} /> 外部リンク
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <FileText size={10} /> 内部
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ステータス</p>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">公開中</span>
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
              <th className="px-6 py-4">タイトル</th>
              <th className="px-6 py-4">ステータス</th>
              <th className="px-6 py-4">形式</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                      <img src={r.image_url} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-0.5">{r.title}</p>
                      <p className="text-[10px] text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">公開中</span>
                </td>
                <td className="px-6 py-4">
                  {r.is_external ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase">
                      <ExternalLink size={10} /> 外部リンク
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                      <FileText size={10} /> 内部コンテンツ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/reports/${r.id}/edit`}
                      className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <DeleteButton
                      action={deleteReport.bind(null, r.id)}
                      confirmMessage={`「${r.title}」を削除しますか？`}
                    />
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
