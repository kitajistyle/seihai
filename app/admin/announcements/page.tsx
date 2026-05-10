import Link from 'next/link';
import { Plus, Edit3, Bell, CheckCircle, XCircle } from 'lucide-react';
import { getAnnouncements } from '@/lib/db/queries';
import { deleteAnnouncement } from '@/lib/db/mutations';
import DeleteButton from '@/components/admin/DeleteButton';

const typeLabels: Record<string, { label: string; className: string }> = {
  info: { label: 'インフォ', className: 'bg-blue-500/10 text-blue-400' },
  new: { label: '新着', className: 'bg-green-500/10 text-green-400' },
  warning: { label: '注意', className: 'bg-yellow-500/10 text-yellow-400' },
  success: { label: '完了', className: 'bg-gray-500/10 text-gray-400' },
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 uppercase flex items-center gap-3">
            <Bell size={24} className="text-[var(--color-brand-blue)]" />
            お知らせ管理
          </h1>
          <p className="text-gray-500 text-sm">サイトに表示するお知らせの管理が可能です。</p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] whitespace-nowrap"
        >
          <Plus size={18} /> 新規作成
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-500">
          <Bell size={32} className="mx-auto mb-4 opacity-30" />
          <p>お知らせがありません</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {announcements.map((a) => {
              const type = typeLabels[a.type] ?? typeLabels.info;
              return (
                <div key={a.id} className="glass-panel p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-white truncate">{a.title}</p>
                      {a.content && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.content}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/announcements/${a.id}/edit`} className="p-2 bg-white/5 text-gray-400 rounded-lg">
                        <Edit3 size={16} />
                      </Link>
                      <DeleteButton
                        action={deleteAnnouncement.bind(null, a.id)}
                        confirmMessage={`「${a.title}」を削除しますか？`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${type.className}`}>
                      {type.label}
                    </span>
                    {a.is_active ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                        <CheckCircle size={10} /> 公開中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                        <XCircle size={10} /> 非公開
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table */}
          <div className="glass-panel overflow-hidden hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">タイトル</th>
                  <th className="px-6 py-4">種別</th>
                  <th className="px-6 py-4">ステータス</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {announcements.map((a) => {
                  const type = typeLabels[a.type] ?? typeLabels.info;
                  return (
                    <tr key={a.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{a.title}</p>
                        {a.content && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.content}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${type.className}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {a.is_active ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                            <CheckCircle size={10} /> 公開中
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                            <XCircle size={10} /> 非公開
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/announcements/${a.id}/edit`}
                            className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <DeleteButton
                            action={deleteAnnouncement.bind(null, a.id)}
                            confirmMessage={`「${a.title}」を削除しますか？`}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
