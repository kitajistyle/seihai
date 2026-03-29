import OrganizerForm from '@/components/admin/OrganizerForm';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function EditOrganizerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  
  const { data: organizer } = await supabase
    .from('organizers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!organizer) {
    notFound();
  }

  return (
    <OrganizerForm initialData={organizer} />
  );
}
