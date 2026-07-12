import Link from 'next/link';
import { Plus, Edit3, Bell, CheckCircle, XCircle } from 'lucide-react';
import { getAnnouncements } from '@/lib/db/queries';
import { deleteAnnouncement } from '@/lib/db/mutations';
import DeleteButton from '@/components/admin/DeleteButton';

const typeLabels: Record<string, { label: string; className: string }> = {
  info: { label: 'インフォ', className: 'bg-blue-100 text-blue-800' },
  new: { label: '新着', className: 'bg-green-100 text-green-800' },
  warning: { label: '注意', className: 'bg-yellow-100 text-yellow-800' },
  success: { label: '完了', className: 'bg-zinc-100 text-zinc-800' },
};

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-2 uppercase flex items-center gap-3">
            <Bell size={24} className="text-[var(--color-brand-blue)]" />
            お知らせ管理
          </h1>
          <p className="text-black text-sm">サイトに表示するお知らせの管理が可能です。</p>
        </div>
        <Link
          href="/admin/announcements/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-bold rounded-xl transition-all shadow-sm whitespace-nowrap"
        >
          <Plus size={18} /> 新規作成
        </Link>
      </div>

      {announcements.length === 0 ? (
        <div className="glass-panel p-12 text-center text-black">
          <Bell size={32} className="mx-auto mb-4 opacity-35" />
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
                      <p className="font-bold text-black truncate">{a.title}</p>
                      {a.content && <p className="text-xs text-zinc-700 mt-1 line-clamp-2">{a.content}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/announcements/${a.id}/edit`} className="p-2 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 rounded-lg">
                        <Edit3 size={16} />
                      </Link>
                      <DeleteButton
                        action={deleteAnnouncement.bind(null, a.id)}
                        confirmMessage={`「${a.title}」を削除しますか？`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-250">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${type.className}`}>
                      {type.label}
                    </span>
                    {a.is_active ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                        <CheckCircle size={10} /> 公開中
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-650">
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
              <thead className="bg-zinc-50 text-[10px] font-bold text-black uppercase tracking-widest border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">タイトル</th>
                  <th className="px-6 py-4">種別</th>
                  <th className="px-6 py-4">ステータス</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {announcements.map((a) => {
                  const type = typeLabels[a.type] ?? typeLabels.info;
                  return (
                    <tr key={a.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-black">{a.title}</p>
                        {a.content && <p className="text-xs text-zinc-700 mt-0.5 line-clamp-1">{a.content}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${type.className}`}>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {a.is_active ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                            <CheckCircle size={10} /> 公開中
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                            <XCircle size={10} /> 非公開
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/announcements/${a.id}/edit`}
                            className="p-2 hover:bg-blue-50 text-zinc-700 hover:text-blue-600 rounded-lg transition-all"
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
