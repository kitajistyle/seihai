import { getOrganizers, getTournamentDetail } from '@/lib/supabase/queries';
import TournamentForm from '@/components/admin/TournamentForm';
import { notFound } from 'next/navigation';

export default async function EditTournamentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [tournament, organizers] = await Promise.all([
    getTournamentDetail(params.id),
    getOrganizers()
  ]);

  if (!tournament) {
    notFound();
  }

  return (
    <TournamentForm 
      initialData={tournament} 
      organizers={organizers} 
    />
  );
}
