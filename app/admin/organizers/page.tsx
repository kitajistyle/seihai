import { getOrganizers } from '@/lib/supabase/queries';
import { deleteOrganizer } from '@/lib/supabase/mutations';
import Link from 'next/link';
import { Plus, Edit, Trash2, User, Globe } from 'lucide-react';

export default async function AdminOrganizersPage() {
  const organizers = await getOrganizers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">主催者管理</h1>
          <p className="text-sm text-gray-500 mt-1">大会の主催者情報を管理します</p>
        </div>
        <Link 
          href="/admin/organizers/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} /> 新規作成
        </Link>
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">主催者</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">肩書き</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">SNS / X(Twitter)</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {organizers.map((org) => (
              <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {org.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-gray-500" size={20} />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-white block">{org.name}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300">{org.title || '-'}</span>
                </td>
                <td className="px-6 py-4">
                  {org.x_id ? (
                    <a 
                      href={`https://x.com/${org.x_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      <Globe size={12} /> @{org.x_id}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 italic">未設定</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/organizers/${org.id}/edit`}
                      className="p-2 text-gray-500 hover:text-[var(--color-brand-blue)] hover:bg-white/5 rounded-lg transition-all"
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
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {org.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.image_url} alt={org.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-gray-500" size={24} />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-white">{org.name}</h3>
                <p className="text-xs text-gray-500">{org.title || '肩書きなし'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="text-xs">
                {org.x_id && (
                  <a href={`https://x.com/${org.x_id}`} target="_blank" className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Globe size={12} /> @{org.x_id}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/organizers/${org.id}/edit`}
                  className="p-2 text-gray-500 hover:text-white"
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
