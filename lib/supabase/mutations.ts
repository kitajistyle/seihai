'use server';

import { createAdminClient } from './server';
import { revalidatePath } from 'next/cache';

/**
 * 大会情報の作成・更新
 */
export async function upsertTournament(formData: any) {
  const supabase = await createAdminClient();
  
  // organizers などの結合データを除外する
  const { id, organizers, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('tournaments')
      .update(rest)
      .eq('id', id);
  } else {
    result = await supabase
      .from('tournaments')
      .insert([rest]);
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
  
  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
  return result.data;
}

/**
 * 大会の削除
 */
export async function deleteTournament(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('tournaments').delete().eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
}

/**
 * プレイヤー情報の作成・更新
 */
export async function upsertPlayer(formData: any) {
  const supabase = await createAdminClient();
  // rank は手動付与されたデータなので除外する
  const { id, rank, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('players')
      .update(rest)
      .eq('id', id);
  } else {
    result = await supabase
      .from('players')
      .insert([rest]);
  }

  if (result.error) throw new Error(result.error.message);
  
  revalidatePath('/rankings');
  revalidatePath('/admin/players');
  return result.data;
}

/**
 * プレイヤーの削除
 */
export async function deletePlayer(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('players').delete().eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/rankings');
  revalidatePath('/admin/players');
}

/**
 * レポートの作成・更新
 */
export async function upsertReport(formData: any) {
  const supabase = await createAdminClient();
  // 関係のない結合データや、スキーマにないフィールドを除外する
  const { id, tournament, organizer, results, date, summary, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('event_reports')
      .update(rest)
      .eq('id', id);
  } else {
    result = await supabase
      .from('event_reports')
      .insert([rest]);
  }

  if (result.error) throw new Error(result.error.message);
  
  revalidatePath('/reports');
  revalidatePath('/admin/reports');
  return result.data;
}

/**
 * レポートの削除
 */
export async function deleteReport(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('event_reports').delete().eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/reports');
  revalidatePath('/admin/reports');
}
