'use server';

import { createAdminClient } from './server';
import { revalidatePath } from 'next/cache';
import { sendApprovalEmail } from '@/lib/resend';
import crypto from 'crypto';

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
    if (existing.status === 'confirmed') {
      console.log('User already registered and confirmed');
      return existing;
    }
    console.log('User already registered but pending. Updating token and resending email.');
    // 下の処理に進んでトークンを更新し、メールを再送する
  }

  // 1.5. プレイヤーが players テーブルに存在するかチェック、なければ作成
  // 空文字を null に変換して UNIQUE 制約エラーを回避
  const playerEmail = data.email.trim();
  const playerXId = data.x_id?.trim() || null;

  let playerQuery = supabase.from('players').select('id');
  if (playerXId) {
    playerQuery = playerQuery.or(`email.eq.${playerEmail},x_id.eq.${playerXId}`);
  } else {
    playerQuery = playerQuery.eq('email', playerEmail);
  }

  const { data: existingPlayer, error: playerFetchError } = await playerQuery.maybeSingle();

  if (playerFetchError) {
    console.error('Error fetching existing player:', playerFetchError.message);
  }

  if (!existingPlayer) {
    // 新規プレイヤーとして登録
    const { error: playerError } = await supabase
      .from('players')
      .insert([{
        name: data.player_name,
        email: playerEmail,
        x_id: playerXId,
        avatar_url: playerXId ? `https://unavatar.io/x/${playerXId}` : `https://unavatar.io/gravatar/${playerEmail}`,
        points: 0
      }]);
    if (playerError) {
      console.error('Error creating player auto-entry:', playerError.message);
      // UNIQUE 制約エラーなどの場合は無視して続行（既に別のメール/X ID で登録されている可能性があるため）
    }
  }

  // 2. エントリー情報の保存 (承認トークン付き)
  console.log('Saving registration for:', data.player_name, data.email);
  const approvalToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  let registrationResult;
  if (existing) {
    // 既存レコード（保留中）を更新
    registrationResult = await supabase
      .from('tournament_registrations')
      .update({
        player_name: data.player_name,
        x_id: playerXId,
        message: data.message,
        approval_token: approvalToken,
        token_expires_at: expiresAt,
        status: 'pending' // 念のため再設定
      })
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // 新規挿入
    registrationResult = await supabase
      .from('tournament_registrations')
      .insert([{
        ...data,
        x_id: playerXId,
        status: 'pending',
        approval_token: approvalToken,
        token_expires_at: expiresAt
      }])
      .select()
      .single();
  }

  const { data: registration, error: regError } = registrationResult;

  if (regError) {
    console.error('Registration save error:', regError.message);
    throw new Error(regError.message);
  }
  console.log('Registration saved successfully:', registration.id);

  // 3. 大会情報の取得 (メール用)
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('title')
    .eq('id', data.tournament_id)
    .single();

  // 4. 承認メールの送信
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const approvalLink = `${appUrl}/approve?token=${approvalToken}`;
  console.log('App URL:', appUrl);
  console.log('Approval Link:', approvalLink);
  
  if (tournament) {
    console.log('Sending approval email for tournament:', tournament.title);
    const emailResult = await sendApprovalEmail({
      email: data.email,
      player_name: data.player_name,
      tournament_title: tournament.title,
      approval_link: approvalLink
    });
    console.log('Email send result:', emailResult);
  } else {
    console.warn('Tournament not found for notification:', data.tournament_id);
  }

  revalidatePath(`/tournaments/${data.tournament_id}`);
  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
  
  return registration;
}

/**
 * エントリーの作成・更新 (管理者用)
 */
export async function upsertRegistration(formData: any) {
  const supabase = await createAdminClient();
  const { id, tournament_id, ...rest } = formData;
  
  let result;
  if (id) {
    result = await supabase
      .from('tournament_registrations')
      .update(rest)
      .eq('id', id);
  } else {
    // 新規追加の場合は参加人数をインクリメント
    result = await supabase
      .from('tournament_registrations')
      .insert([{ ...rest, tournament_id, status: rest.status || 'pending' }]);
      
    if (!result.error) {
      const { data: tournament } = await supabase
        .from('tournaments')
        .select('participants')
        .eq('id', tournament_id)
        .single();
      if (tournament) {
        await supabase
          .from('tournaments')
          .update({ participants: (tournament.participants || 0) + 1 })
          .eq('id', tournament_id);
      }
    }
  }

  if (result.error) throw new Error(result.error.message);
  
  revalidatePath(`/admin/tournaments/${tournament_id}/registrations`);
  revalidatePath('/admin/tournaments');
  return result.data;
}

/**
 * エントリーの削除
 */
export async function deleteRegistration(id: string, tournamentId: string) {
  const supabase = await createAdminClient();
  
  // 削除前に存在確認
  const { data: existing } = await supabase
    .from('tournament_registrations')
    .select('id')
    .eq('id', id)
    .single();
    
  if (!existing) return;

  const { error } = await supabase.from('tournament_registrations').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  // 参加人数をデクリメント
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('participants')
    .eq('id', tournamentId)
    .single();
    
  if (tournament && (tournament.participants || 0) > 0) {
    await supabase
      .from('tournaments')
      .update({ participants: tournament.participants - 1 })
      .eq('id', tournamentId);
  }
  
  revalidatePath(`/admin/tournaments/${tournamentId}/registrations`);
  revalidatePath('/admin/tournaments');
}

/**
 * トークンによるエントリー承認
 */
export async function approveRegistration(token: string) {
  const supabase = await createAdminClient();
  
  // 1. トークンでエントリーを検索
  const { data: registration, error: fetchError } = await supabase
    .from('tournament_registrations')
    .select('*')
    .eq('approval_token', token)
    .single();

  if (fetchError || !registration) {
    throw new Error('無効な承認トークンです。');
  }

  // 2. 有効期限チェック
  if (registration.token_expires_at && new Date(registration.token_expires_at) < new Date()) {
    throw new Error('承認トークンの有効期限が切れています。再度エントリーをお願いします。');
  }

  // 3. 既に承認済みかチェック
  if (registration.status === 'confirmed') {
    return { success: true, message: '既に承認済みです。', tournament_id: registration.tournament_id };
  }

  // 4. ステータスを承認済みに更新
  const { error: updateError } = await supabase
    .from('tournament_registrations')
    .update({ 
      status: 'confirmed',
      approval_token: null // 使用済みトークンをクリア
    })
    .eq('id', registration.id);

  if (updateError) throw new Error('承認処理に失敗しました。');

  // 5. 大会の参加者数を更新
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('participants')
    .eq('id', registration.tournament_id)
    .single();

  if (tournament) {
    await supabase
      .from('tournaments')
      .update({ participants: (tournament.participants || 0) + 1 })
      .eq('id', registration.tournament_id);
  }

  revalidatePath(`/tournaments/${registration.tournament_id}`);
  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
  revalidatePath(`/admin/tournaments/${registration.tournament_id}/registrations`);

  return { success: true, tournament_id: registration.tournament_id };
}
