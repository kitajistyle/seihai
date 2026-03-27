import { getTournaments, getReportDetail } from '@/lib/supabase/queries';
import ReportForm from '@/components/admin/ReportForm';
import { notFound } from 'next/navigation';

export default async function EditReportPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [report, tournaments] = await Promise.all([
    getReportDetail(params.id),
    getTournaments()
  ]);

  if (!report) {
    notFound();
  }

  return (
    <ReportForm 
      initialData={report.report} 
      tournaments={tournaments} 
    />
  );
}
