'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

interface Props {
  action: () => Promise<void>;
  confirmMessage?: string;
}

export default function DeleteButton({ action, confirmMessage = '本当に削除しますか？この操作は取り消せません。' }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    if (!confirm(confirmMessage)) return;
    setIsPending(true);
    try {
      await action();
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all disabled:opacity-50"
      title="削除"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
