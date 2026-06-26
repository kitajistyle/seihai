import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-6 bg-[var(--color-bg-dark)]">
      <Image
        src="/sei-cleaning.png"
        alt="キャラクター"
        width={180}
        height={220}
        className="drop-shadow-2xl"
        priority
      />
      <div className="space-y-2">
        <p className="text-6xl font-black text-gray-300/30">404</p>
        <h1 className="text-2xl font-black text-[var(--color-brand-blue)]">ページが見つかりません</h1>
        <p className="text-gray-500 text-sm">お探しのページは削除されたか、URLが変更された可能性があります。</p>
      </div>
      <Link
        href="/"
        className="px-8 py-3 bg-[var(--color-brand-blue)] text-white font-black rounded-xl hover:bg-[var(--color-brand-blue)]/80 transition-colors"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
