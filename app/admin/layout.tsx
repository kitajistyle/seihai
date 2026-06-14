'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  User,
  Bell
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto hidden md:block relative shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 w-72 bg-white border-r border-gray-200 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="font-black text-lg tracking-tighter uppercase text-gray-800">メニュー</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-hidden h-full">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 bg-white shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 md:hidden hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-bold text-xs text-gray-500 hidden sm:block">
              環境: <span className="text-green-600">本番 (Production)</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden xs:block">
              <p className="text-xs font-bold text-gray-800">管理者</p>
              <p className="text-[10px] text-gray-400">admin@seihai.jp</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50" />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-grow">
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-8 h-8 bg-[var(--color-brand-blue)] rounded-lg flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
            S
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-gray-800">管理者コンソール</span>
        </Link>

        <nav className="space-y-1">
          <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">メイン</h3>
          <AdminNavLink href="/admin" icon={<LayoutDashboard size={18} />} onClick={onItemClick}>ダッシュボード</AdminNavLink>

          <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">コンテンツ管理</h3>
          <AdminNavLink href="/admin/tournaments" icon={<Trophy size={18} />} onClick={onItemClick}>大会管理</AdminNavLink>
          <AdminNavLink href="/admin/reports" icon={<FileText size={18} />} onClick={onItemClick}>レポート管理</AdminNavLink>
          <AdminNavLink href="/admin/organizers" icon={<User size={18} />} onClick={onItemClick}>主催者管理</AdminNavLink>
          <AdminNavLink href="/admin/announcements" icon={<Bell size={18} />} onClick={onItemClick}>お知らせ管理</AdminNavLink>

          <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8 mb-4">プラットフォーム</h3>
          <AdminNavLink href="/" icon={<Home size={18} />} onClick={onItemClick}>公開サイト</AdminNavLink>
          <AdminNavLink href="/admin/settings" icon={<Settings size={18} />} onClick={onItemClick}>設定</AdminNavLink>
        </nav>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <button className="flex items-center gap-3 text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold w-full">
          <LogOut size={18} /> ログアウト
        </button>
      </div>
    </div>
  );
}

function AdminNavLink({ href, icon, children, onClick }: { href: string; icon: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all group"
    >
      <span className="text-gray-400 group-hover:text-[var(--color-brand-blue)] transition-colors">{icon}</span>
      {children}
    </Link>
  );
}
