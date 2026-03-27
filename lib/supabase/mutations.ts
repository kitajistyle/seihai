'use server';

import { createAdminClient } from './server';
import { revalidatePath } from 'next/cache';

/**
 * 大会情報の作成・更新
 */
export async function upsertTournament(formData: any) {
  const supabase = await createAdminClient();
  
  // organizers などの結合データを除外する
  const { id, organizers, organizer_ids, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('tournaments')
      .update(rest)
      .eq('id', id)
      .select()
      .single();
  } else {
    result = await supabase
      .from('tournaments')
      .insert([rest])
      .select()
      .single();
  }

  if (result.error) throw new Error(result.error.message);
  
  // 主催者の同期 (新しい中間テーブルを使用)
  if (formData.organizer_ids && result.data) {
    await syncTournamentOrganizers(result.data.id, formData.organizer_ids);
  }

  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
  return result.data;
}

/**
 * 大会の主催者リストを同期
 */
export async function syncTournamentOrganizers(tournamentId: string, organizerIds: string[]) {
  const supabase = await createAdminClient();

  // 1. 既存の紐付けを削除
  const { error: deleteError } = await supabase
    .from('tournament_organizers')
    .delete()
    .eq('tournament_id', tournamentId);

  if (deleteError) throw new Error(deleteError.message);

  // 2. 新しい紐付けを追加
  if (organizerIds.length > 0) {
    const inserts = organizerIds.map(orgId => ({
      tournament_id: tournamentId,
      organizer_id: orgId
    }));

    const { error: insertError } = await supabase
      .from('tournament_organizers')
      .insert(inserts);

    if (insertError) throw new Error(insertError.message);
  }
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

/**
 * 入賞者情報の同期
 */
export async function syncTournamentResults(tournamentId: string, results: any[]) {
  const supabase = await createAdminClient();
  
  // 1. 既存の入賞データを削除
  const { error: deleteError } = await supabase
    .from('tournament_results')
    .delete()
    .eq('tournament_id', tournamentId);
    
  if (deleteError) throw new Error(deleteError.message);
  
  // 2. 新しいデータを挿入
  if (results.length > 0) {
    const records = results.map(r => ({
      tournament_id: tournamentId,
      player_id: r.player_id || null,
      rank: r.rank,
      display_name: r.display_name || null
    }));
    
    const { error: insertError } = await supabase
      .from('tournament_results')
      .insert(records);
      
    if (insertError) throw new Error(insertError.message);
  }
}

/**
 * 主催者情報の作成・更新
 */
export async function upsertOrganizer(formData: any) {
  const supabase = await createAdminClient();
  const { id, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('organizers')
      .update(rest)
      .eq('id', id);
  } else {
    result = await supabase
      .from('organizers')
      .insert([rest]);
  }

  if (result.error) throw new Error(result.error.message);
  
  revalidatePath('/organizers');
  revalidatePath('/admin/organizers');
  return result.data;
}

/**
 * 主催者の削除
 */
export async function deleteOrganizer(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from('organizers').delete().eq('id', id);
  
  if (error) throw new Error(error.message);
  
  revalidatePath('/organizers');
  revalidatePath('/admin/organizers');
}

/**
 * 大会へのエントリー（予約）登録
 */
export async function registerForTournament(data: {
  tournament_id: string;
  player_name: string;
  email: string;
  x_id?: string;
  message?: string;
}) {
  const supabase = await createAdminClient();
  
  // 1. 既に同じメールアドレスでエントリー済みかチェック
  const { data: existing } = await supabase
    .from('tournament_registrations')
    .select('*')
    .eq('tournament_id', data.tournament_id)
    .eq('email', data.email)
    .maybeSingle();

  if (existing) {
    return existing; // 既に存在する場合は新規作成せずに終了
  }

  // 1.5. プレイヤーが players テーブルに存在するかチェック、なければ作成
  // email または x_id で検索
  let playerQuery = supabase.from('players').select('id');
  if (data.x_id) {
    playerQuery = playerQuery.or(`email.eq.${data.email},x_id.eq.${data.x_id}`);
  } else {
    playerQuery = playerQuery.eq('email', data.email);
  }

  const { data: existingPlayer } = await playerQuery.maybeSingle();

  if (!existingPlayer) {
    // 新規プレイヤーとして登録
    const { error: playerError } = await supabase
      .from('players')
      .insert([{
        name: data.player_name,
        email: data.email,
        x_id: data.x_id,
        avatar_url: data.x_id ? `https://unavatar.io/x/${data.x_id}` : `https://unavatar.io/gravatar/${data.email}`,
        points: 0
      }]);
    if (playerError) console.error('Error creating player auto-entry:', playerError.message);
  }

  // 2. エントリー情報の挿入
  const { data: registration, error: regError } = await supabase
    .from('tournament_registrations')
    .insert([{
      ...data,
      status: 'pending'
    }])
    .select()
    .single();

  if (regError) throw new Error(regError.message);

  // 3. 大会の参加者数を更新 (簡易的にインクリメント)
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('participants')
    .eq('id', data.tournament_id)
    .single();

  if (tournament) {
    await supabase
      .from('tournaments')
      .update({ participants: (tournament.participants || 0) + 1 })
      .eq('id', data.tournament_id);
  }

  revalidatePath(`/tournaments/${data.tournament_id}`);
  revalidatePath('/tournaments');
  
  return registration;
}
