import { getTournaments } from '@/lib/supabase/queries';
import ReportForm from '@/components/admin/ReportForm';

export default async function NewReportPage() {
  const tournaments = await getTournaments();

  return (
    <ReportForm tournaments={tournaments} />
  );
}
