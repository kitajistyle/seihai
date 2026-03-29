'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Mail, 
  Calendar,
  User,
  MessageSquare,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { deleteRegistration } from '@/lib/supabase/mutations';
import RegistrationModal from '@/components/admin/RegistrationModal';
import { Registration } from '@/types';

interface Props {
  tournamentId: string;
  initialRegistrations: Registration[];
}

export default function RegistrationsClient({ tournamentId, initialRegistrations }: Props) {
  const router = useRouter();
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

  const handleAdd = () => {
    setSelectedRegistration(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reg: Registration) => {
    setSelectedRegistration(reg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このエントリーを削除してもよろしいですか？参加人数カウントも減少します。')) return;
    
    try {
      await deleteRegistration(id, tournamentId);
      // 再検証は mutations 側で行われるが、クライアント側でも即座に反映
      setRegistrations(prev => prev.filter(r => r.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert('削除に失敗しました: ' + err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
        >
          <Plus size={18} /> 新規エントリー追加
        </button>
      </div>

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <div className="glass-panel p-12 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-10" />
            <p>まだエントリーはありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {registrations.map((reg) => (
              <div key={reg.id} className="glass-panel p-6 hover:border-white/20 transition-all group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-brand-blue)]/20 flex items-center justify-center text-[var(--color-brand-blue)]">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-0.5">{reg.player_name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} /> {reg.email}
                          </span>
                          {reg.x_id && (
                            <span className="flex items-center gap-1.5 text-blue-400">
                              𝕏 @{reg.x_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {reg.message && (
                      <div className="flex gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                        <MessageSquare size={16} className="text-gray-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                          &ldquo;{reg.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(reg)}
                        className="p-2 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500 rounded-lg transition-all"
                        title="編集"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                        title="削除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">登録日時</p>
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                        <Calendar size={12} />
                        {new Date(reg.created_at).toLocaleString('ja-JP', { 
                          year: 'numeric', 
                          month: '2-digit', 
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      reg.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      reg.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                      {reg.status === 'confirmed' ? '確定' : reg.status === 'cancelled' ? 'キャンセル' : '承認待ち'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => router.refresh()}
        tournamentId={tournamentId}
        registration={selectedRegistration}
      />
    </div>
  );
}
