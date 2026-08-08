import { getStalls } from '@/lib/db/queries';
import { deleteStall } from '@/lib/db/mutations';
import Link from 'next/link';
import { Plus, Edit, Trash2, ShoppingBag, ExternalLink } from 'lucide-react';

export default async function AdminStallsPage() {
  const stalls = await getStalls();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">出店者管理</h1>
          <p className="text-sm text-black mt-1">イベントに出店する店舗情報を管理します</p>
        </div>
        <Link
          href="/admin/stalls/new"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <Plus size={18} /> 新規作成
        </Link>
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">出店者</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">ジャンル</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">表示順</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {stalls.map((stall) => (
              <tr key={stall.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                      {stall.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={stall.image_url} alt={stall.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="text-zinc-500" size={20} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-black block">{stall.name}</span>
                      {stall.url && (
                        <a href={stall.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 flex items-center gap-1 hover:text-black">
                          <ExternalLink size={10} /> サイト
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-black">{stall.genre || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-black">{stall.display_order}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/stalls/${stall.id}/edit`}
                      className="p-2 text-zinc-750 hover:text-[var(--color-brand-blue)] hover:bg-zinc-100 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteStall(stall.id);
                    }}>
                      <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {stalls.map((stall) => (
          <div key={stall.id} className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                {stall.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={stall.image_url} alt={stall.name} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="text-zinc-500" size={24} />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-black">{stall.name}</h3>
                <p className="text-xs text-black">{stall.genre || 'ジャンル未設定'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
              <span className="text-xs text-zinc-500">表示順: {stall.display_order}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/stalls/${stall.id}/edit`}
                  className="p-2 text-zinc-700 hover:text-black"
                >
                  <Edit size={20} />
                </Link>
                <form action={async () => {
                  'use server';
                  await deleteStall(stall.id);
                }}>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
