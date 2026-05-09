import OrganizerForm from '@/components/admin/OrganizerForm';
import { getOrganizerById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

export default async function EditOrganizerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const organizer = await getOrganizerById(params.id);

  if (!organizer) {
    notFound();
  }

  return (
    <OrganizerForm initialData={organizer} />
  );
}
