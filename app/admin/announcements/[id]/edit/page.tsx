import { notFound } from 'next/navigation';
import { getAnnouncementById } from '@/lib/db/queries';
import AnnouncementForm from '@/components/admin/AnnouncementForm';

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncementById(params.id);
  if (!announcement) notFound();

  return <AnnouncementForm initialData={announcement} />;
}
