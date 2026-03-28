'use client';

import { useState } from 'react';
import { registerForTournament } from '@/lib/supabase/mutations';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  tournamentId: string;
  tournamentTitle: string;
  onSuccess?: () => void;
}

export default function TournamentRegistrationForm({ tournamentId, tournamentTitle, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    player_name: '',
    email: '',
    x_id: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await registerForTournament({
        tournament_id: tournamentId,
        ...formData
      });
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'エントリーに失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black mb-4">エントリー完了！</h3>
        <p className="text-gray-400 leading-relaxed mb-8">
          {tournamentTitle} へのエントリーを受け付けました。<br />
          ご登録いただいたメールアドレス宛に確認メールをお送りします。
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-sm text-[var(--color-brand-blue)] font-bold hover:underline"
        >
          別のエントリーを行う
        </button>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel p-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Send className="w-5 h-5 text-[var(--color-brand-blue)]" />
        エントリーフォーム
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="player_name" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            プレイヤー名 <span className="text-red-500">*</span>
          </label>
          <input
            id="player_name"
            name="player_name"
            type="text"
            required
            value={formData.player_name}
            onChange={handleChange}
            placeholder="例: せい杯 太郎"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors placeholder:text-gray-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="x_id" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            𝕏 (Twitter) ID
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
            <input
              id="x_id"
              name="x_id"
              type="text"
              value={formData.x_id}
              onChange={handleChange}
              placeholder="sei_hai"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            メッセージ / 意気込み
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="意気込みなどがあれば入力してください"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-colors placeholder:text-gray-600 resize-none"
          />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.2)] flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              エントリー送信中...
            </>
          ) : (
            <>
              大会にエントリーする
            </>
          )}
        </button>
      </form>
    </div>
  );
}
