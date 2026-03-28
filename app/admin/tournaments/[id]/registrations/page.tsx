import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  Users, 
  Mail, 
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { getTournamentDetail, getTournamentRegistrations } from '@/lib/supabase/queries';
import RegistrationsClient from './RegistrationsClient';

export default async function TournamentRegistrationsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tournament = await getTournamentDetail(params.id);
  const registrations = await getTournamentRegistrations(params.id);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/tournaments"
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm w-fit"
        >
          <ChevronLeft size={16} /> 大会管理へ戻る
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-2 uppercase">
              エントリーリスト
            </h1>
            <p className="text-[var(--color-brand-blue)] font-bold">{tournament.title}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <Users size={18} className="text-[var(--color-brand-blue)]" />
            <span className="text-xl font-black text-white">{registrations.length}</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Entries</span>
          </div>
        </div>
      </div>

      {/* Registrations List (Client Side) */}
      <RegistrationsClient tournamentId={params.id} initialRegistrations={registrations} />
    </div>
  );
}
