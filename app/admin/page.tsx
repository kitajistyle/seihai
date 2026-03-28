import { 
  Trophy, 
  Users, 
  FileText, 
  TrendingUp, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { getTournaments, getRankings, getReports } from '@/lib/supabase/queries';

export default async function AdminDashboardPage() {
  const [tournaments, players, reports] = await Promise.all([
    getTournaments(),
    getRankings(50),
    getReports(10)
  ]);

  const stats = [
    { label: '総大会数', value: tournaments.length, icon: <Trophy />, color: 'text-blue-500' },
    { label: '登録プレイヤー数', value: players.length, icon: <Users />, color: 'text-green-500' },
    { label: '公開レポート数', value: reports.length, icon: <FileText />, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">オーバービュー</h1>
        <p className="text-gray-500">こんにちは。現在のプラットフォームの状況を確認できます。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 border-l-4 border-l-[var(--color-brand-blue)]">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-white/5 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" /> +0%
              </span>
            </div>
            <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <section className="glass-panel p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
            <Activity className="text-[var(--color-brand-blue)]" />
            システム状態
          </h2>
          <div className="space-y-4">
            <StatusItem label="Supabase 接続" status="稼働中" />
            <StatusItem label="ストレージ (S3互換)" status="稼働中" />
            <StatusItem label="サイト監視" status="稼働中" />
          </div>
        </section>

        {/* Quick Tips */}
        <section className="glass-panel p-8 bg-blue-500/5 border-blue-500/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <AlertCircle className="text-blue-500" />
            管理アドバイス
          </h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>• 大会を作成すると自動的にトップページに掲載されます。</li>
            <li>• プレイヤーのポイントは自動的にランキングに反映されます。</li>
            <li>• レポートを外部リンクとして設定すると公式X等に誘導できます。</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <span className="text-sm font-bold text-gray-300">{label}</span>
      <span className="text-xs font-bold text-green-500 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        {status}
      </span>
    </div>
  );
}
