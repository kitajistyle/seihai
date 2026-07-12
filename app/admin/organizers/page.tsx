import { getOrganizers } from '@/lib/db/queries';
import { deleteOrganizer } from '@/lib/db/mutations';
import Link from 'next/link';
import { Plus, Edit, Trash2, User, Globe } from 'lucide-react';

export default async function AdminOrganizersPage() {
  const organizers = await getOrganizers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-black">主催者管理</h1>
          <p className="text-sm text-black mt-1">大会の主催者情報を管理します</p>
        </div>
        <Link 
          href="/admin/organizers/new"
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
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">主催者</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">肩書き</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest">SNS / X(Twitter)</th>
              <th className="px-6 py-4 text-[10px] font-black text-black uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {organizers.map((org) => (
              <tr key={org.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-250 flex items-center justify-center overflow-hidden shrink-0">
                      {org.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-zinc-500" size={20} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-black block">{org.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-black">{org.title || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  {org.x_id ? (
                    <a 
                      href={`https://x.com/${org.x_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-250 rounded-full text-xs font-bold text-zinc-700 hover:text-black transition-colors"
                    >
                      <Globe size={12} /> @{org.x_id}
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">未設定</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/organizers/${org.id}/edit`}
                      className="p-2 text-zinc-750 hover:text-[var(--color-brand-blue)] hover:bg-zinc-100 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteOrganizer(org.id);
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
        {organizers.map((org) => (
          <div key={org.id} className="glass-panel p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-250 flex items-center justify-center overflow-hidden shrink-0">
                {org.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-zinc-500" size={24} />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-black">{org.name}</h3>
                <p className="text-xs text-black">{org.title || '肩書きなし'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-zinc-250">
              <div className="text-xs">
                {org.x_id && (
                  <a href={`https://x.com/${org.x_id}`} target="_blank" className="flex items-center gap-1.5 text-blue-600 font-bold">
                    <Globe size={12} /> @{org.x_id}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/organizers/${org.id}/edit`}
                  className="p-2 text-zinc-700 hover:text-black"
                >
                  <Edit size={20} />
                </Link>
                <form action={async () => {
                  'use server';
                  await deleteOrganizer(org.id);
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
