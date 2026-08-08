import StallForm from '@/components/admin/StallForm';
import { getStallById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

export default async function EditStallPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const stall = await getStallById(params.id);

  if (!stall) {
    notFound();
  }

  return <StallForm initialData={stall} />;
}
