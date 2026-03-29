'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { upsertRegistration } from '@/lib/supabase/mutations';
import { Registration } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tournamentId: string;
  registration?: Registration | null;
}

export default function RegistrationModal({ isOpen, onClose, onSuccess, tournamentId, registration }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    player_name: '',
    email: '',
    x_id: '',
    message: '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: 'pending' as any
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        player_name: registration.player_name || '',
        email: registration.email || '',
        x_id: registration.x_id || '',
        message: registration.message || '',
        status: registration.status || 'pending'
      });
    } else {
      setFormData({
        player_name: '',
        email: '',
        x_id: '',
        message: '',
        status: 'pending'
      });
    }
    setError(null);
  }, [registration, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await upsertRegistration({
        id: registration?.id,
        tournament_id: tournamentId,
        ...formData,
        email: formData.email.trim() || null,
        x_id: formData.x_id?.trim() || null
      });
      onSuccess?.();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || '保存に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              {registration ? 'エントリーを編集' : '新規エントリー追加'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">プレイヤー名</label>
                  <input
                    name="player_name"
                    type="text"
                    required
                    value={formData.player_name}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">メールアドレス <span className="text-gray-600 normal-case font-normal">(任意)</span></label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">𝕏 (Twitter) ID</label>
                  <input
                    name="x_id"
                    type="text"
                    value={formData.x_id}
                    onChange={handleChange}
                    placeholder="sei_hai"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">ステータス</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all appearance-none"
                  >
                    <option value="pending" className="bg-[#0a0a0b]">承認待ち (pending)</option>
                    <option value="confirmed" className="bg-[#0a0a0b]">確定 (confirmed)</option>
                    <option value="cancelled" className="bg-[#0a0a0b]">キャンセル (cancelled)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">メッセージ</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    {registration ? '更新する' : '登録する'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
