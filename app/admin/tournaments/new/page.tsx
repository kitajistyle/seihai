import { getOrganizers } from '@/lib/supabase/queries';
import TournamentForm from '@/components/admin/TournamentForm';

export default async function NewTournamentPage() {
  const organizers = await getOrganizers();

  return (
    <TournamentForm organizers={organizers} />
  );
}
