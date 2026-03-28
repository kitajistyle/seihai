import { getTournaments, getReportDetail, getRankings } from '@/lib/supabase/queries';
import ReportForm from '@/components/admin/ReportForm';
import { notFound } from 'next/navigation';

export default async function EditReportPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [reportDetail, tournaments, players] = await Promise.all([
    getReportDetail(params.id),
    getTournaments(),
    getRankings(100)
  ]);

  if (!reportDetail) {
    notFound();
  }

  return (
    <ReportForm 
      initialData={reportDetail.report} 
      initialResults={reportDetail.results}
      tournaments={tournaments} 
      players={players}
    />
  );
}
