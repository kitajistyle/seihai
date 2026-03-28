import PlayerForm from '@/components/admin/PlayerForm';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditPlayerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: player } = await supabase
    .from('players')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!player) {
    notFound();
  }

  return <PlayerForm initialData={player} />;
}
