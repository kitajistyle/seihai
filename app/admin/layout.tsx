import Link from 'next/link';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-white/5 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto hidden md:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-8 h-8 bg-[var(--color-brand-blue)] rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="font-black text-xl tracking-tighter uppercase text-white">管理者コンソール</span>
          </Link>

          <nav className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">メイン</h3>
            <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />}>ダッシュボード</AdminNavLink>
            
            <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">コンテンツ管理</h3>
            <AdminNavLink href="/admin/tournaments" icon={<Trophy size={18} />}>大会管理</AdminNavLink>
            <AdminNavLink href="/admin/players" icon={<Users size={18} />}>プレイヤー管理</AdminNavLink>
            <AdminNavLink href="/admin/reports" icon={<FileText size={18} />}>レポート管理</AdminNavLink>
            
            <h3 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">プラットフォーム</h3>
            <AdminNavLink href="/" icon={<Home size={18} />}>公開サイト</AdminNavLink>
            <AdminNavLink href="/admin/settings" icon={<Settings size={18} />}>設定</AdminNavLink>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm font-bold w-full">
            <LogOut size={18} /> ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="font-bold text-sm text-gray-400">環境: <span className="text-green-500">本番 (Production)</span></h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-white">管理者</p>
              <p className="text-[10px] text-gray-500">admin@seihai.jp</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50" />
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
    >
      <span className="text-gray-500 group-hover:text-[var(--color-brand-blue)] transition-colors">{icon}</span>
      {children}
    </Link>
  );
}
