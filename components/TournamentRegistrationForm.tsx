'use client';

import { useState } from 'react';
import Image from 'next/image';
import { registerForTournament } from '@/lib/db/mutations';
import { AlertCircle, Loader2, Send } from 'lucide-react';
import { motion } from 'motion/react';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-4"
        >
          <Image src="/shiba-character.png" alt="キャラクター" width={120} height={150} className="drop-shadow-xl" />
        </motion.div>
        <h3 className="text-2xl font-black mb-4 text-black">エントリー完了！</h3>
        <p className="text-black leading-relaxed mb-8">
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
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black">
        <Send className="w-5 h-5 text-black" />
        エントリーフォーム
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="player_name" className="text-xs font-bold text-black uppercase tracking-widest">
            プレイヤー名 <span className="text-red-500">*</span>
          </label>
          <input
            id="player_name"
            name="player_name"
            type="text"
            required
            value={formData.player_name}
            onChange={handleChange}
            placeholder="例: せい祭 太郎"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold text-black uppercase tracking-widest">
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
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="x_id" className="text-xs font-bold text-black uppercase tracking-widest">
            𝕏 (Twitter) ID
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
            <input
              id="x_id"
              name="x_id"
              type="text"
              value={formData.x_id}
              onChange={handleChange}
              placeholder="sei_hai"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-4 py-3 text-black focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-bold text-black uppercase tracking-widest">
            メッセージ / 意気込み
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="意気込みなどがあれば入力してください"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400 resize-none"
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
          className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-black text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-md cursor-pointer"
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
