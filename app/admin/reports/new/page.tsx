import { getTournaments, getRankings } from '@/lib/supabase/queries';
import ReportForm from '@/components/admin/ReportForm';

export default async function NewReportPage() {
  const [tournaments, players] = await Promise.all([
    getTournaments(),
    getRankings(100)
  ]);

  return (
    <ReportForm tournaments={tournaments} players={players} />
  );
}
