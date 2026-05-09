import PlayerForm from '@/components/admin/PlayerForm';
import { getPlayerById } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

export default async function EditPlayerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const player = await getPlayerById(params.id);

  if (!player) {
    notFound();
  }

  return <PlayerForm initialData={player} />;
}
