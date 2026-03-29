import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowRight, Home } from 'lucide-react';
import { approveRegistration } from '@/lib/supabase/mutations';
import { getTournamentDetail } from '@/lib/supabase/queries';

export default async function ApprovePage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return <ErrorState message="承認トークンが見つかりません。メールのリンクを正しくクリックしてください。" />;
  }

  try {
    const result = await approveRegistration(token);
    const tournament = await getTournamentDetail(result.tournament_id);

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel max-w-lg w-full p-10 text-center space-y-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--color-brand-blue)]/10 blur-[100px] -z-10" />
          
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              エントリー承認完了
            </h1>
            <p className="text-gray-400 leading-relaxed font-medium">
              ご本人様確認が完了しました。<br />
              「<span className="text-white font-bold">{tournament?.title}</span>」へのエントリーが確定しました。
            </p>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/tournaments/${result.tournament_id}`}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/80 text-white font-bold rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(37,99,235,0.2)]"
            >
              大会詳細を見る <ArrowRight size={18} />
            </Link>
            <Link 
              href="/"
              className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} /> トップへ
            </Link>
          </div>
        </div>
      </div>
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return <ErrorState message={err.message} />;
  }
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-10 text-center space-y-8">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
            承認エラー
          </h1>
          <p className="text-red-400/80 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[var(--color-brand-blue)] font-bold hover:underline"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
