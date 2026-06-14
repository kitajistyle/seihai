'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useTransition, useEffect, useState, useRef } from 'react';

export default function SearchForm({
  initialSearch,
  initialSort,
}: {
  initialSearch: string;
  initialSort: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 最初のレンダリング時はスキップ
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      startTransition(() => {
        replace(`${pathname}?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, replace, searchParams]);

  const handleSort = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (sortVal) {
      params.set('sort', sortVal);
    } else {
      params.delete('sort');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative">
        <select
          value={initialSort}
          onChange={(e) => handleSort(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:border-gray-900 cursor-pointer text-gray-700"
        >
          <option value="date_desc">開催日 (新しい順)</option>
          <option value="date_asc">開催日 (古い順)</option>
          <option value="title_asc">大会名順</option>
        </select>
        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="大会を検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[var(--color-bg-dark)] border border-white/10 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-[var(--color-brand-blue)] w-full md:w-64 text-gray-200"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>
      {isPending && (
        <span className="text-xs text-gray-500 animate-pulse ml-2">検索中...</span>
      )}
    </div>
  );
}
