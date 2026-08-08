'use server';

import { sql, db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendApprovalEmail } from '@/lib/resend';
import crypto from 'crypto';

function serializeJsonFields(data: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Array.isArray(v) || (v !== null && typeof v === 'object') ? JSON.stringify(v) : v])
  );
}

/**
 * 大会情報の作成・更新
 */
export async function upsertTournament(formData: any) {
  const { id, organizers, organizer_ids, ...rest } = formData;
  const serialized = serializeJsonFields(rest);

  const client = await db.connect();
  try {
    let tournamentId: string;
    if (id) {
      const keys = Object.keys(serialized);
      const values = Object.values(serialized);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      const { rows } = await client.query(
        `UPDATE tournaments SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id`,
        [...values, id]
      );
      tournamentId = rows[0].id;
    } else {
      const keys = Object.keys(serialized);
      const values = Object.values(serialized);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const { rows } = await client.query(
        `INSERT INTO tournaments (${cols}) VALUES (${placeholders}) RETURNING id`,
        values
      );
      tournamentId = rows[0].id;
    }

    if (organizer_ids) {
      await _syncTournamentOrganizersWithClient(client, tournamentId, organizer_ids);
    }

    revalidatePath('/tournaments');
    revalidatePath(`/tournaments/${tournamentId}`);
    revalidatePath('/admin/tournaments');
    revalidatePath(`/admin/tournaments/${tournamentId}/edit`);
    return { id: tournamentId };
  } finally {
    client.release();
  }
}

async function _syncTournamentOrganizersWithClient(client: any, tournamentId: string, organizerIds: string[]) {
  await client.query('BEGIN');
  try {
    await client.query('DELETE FROM tournament_organizers WHERE tournament_id = $1', [tournamentId]);
    for (const orgId of organizerIds) {
      await client.query(
        'INSERT INTO tournament_organizers (tournament_id, organizer_id) VALUES ($1, $2)',
        [tournamentId, orgId]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

/**
 * 大会の主催者リストを同期
 */
export async function syncTournamentOrganizers(tournamentId: string, organizerIds: string[]) {
  const client = await db.connect();
  try {
    await _syncTournamentOrganizersWithClient(client, tournamentId, organizerIds);
  } finally {
    client.release();
  }
}

/**
 * 大会の削除
 */
export async function deleteTournament(id: string) {
  await sql`DELETE FROM tournaments WHERE id = ${id}`;
  revalidatePath('/tournaments');
  revalidatePath('/admin/tournaments');
}

/**
 * プレイヤー情報の作成・更新
 */
export async function upsertPlayer(formData: any) {
  const { id, rank, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE players SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO players (${cols}) VALUES (${placeholders})`,
        values
      );
    }
  } finally {
    client.release();
  }
  revalidatePath('/rankings');
  revalidatePath('/admin/players');
}

/**
 * プレイヤーの削除
 */
export async function deletePlayer(id: string) {
  await sql`DELETE FROM players WHERE id = ${id}`;
  revalidatePath('/rankings');
  revalidatePath('/admin/players');
}

/**
 * レポートの作成・更新
 */
export async function upsertReport(formData: any) {
  const { id, tournament, organizer, results, date, summary, ...rest } = formData;
  const serialized = serializeJsonFields(rest);
  const client = await db.connect();
  let reportId: string | undefined = id;
  try {
    if (id) {
      const keys = Object.keys(serialized);
      const values = Object.values(serialized);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE event_reports SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(serialized);
      const values = Object.values(serialized);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const { rows } = await client.query(
        `INSERT INTO event_reports (${cols}) VALUES (${placeholders}) RETURNING id`,
        values
      );
      reportId = rows[0].id;
    }
  } finally {
    client.release();
  }
  revalidatePath('/reports');
  if (reportId) revalidatePath(`/reports/${reportId}`);
  revalidatePath('/admin/reports');
  if (reportId) revalidatePath(`/admin/reports/${reportId}/edit`);
}

/**
 * レポートの削除
 */
export async function deleteReport(id: string) {
  await sql`DELETE FROM event_reports WHERE id = ${id}`;
  revalidatePath('/reports');
  revalidatePath('/admin/reports');
}

/**
 * 入賞者情報の同期
 */
export async function syncTournamentResults(tournamentId: string, results: any[]) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM tournament_results WHERE tournament_id = $1', [tournamentId]);
    for (const r of results) {
      await client.query(
        'INSERT INTO tournament_results (tournament_id, player_id, rank, display_name) VALUES ($1, $2, $3, $4)',
        [tournamentId, r.player_id || null, r.rank, r.display_name || null]
      );
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * 主催者情報の作成・更新
 */
export async function upsertOrganizer(formData: any) {
  const { id, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE organizers SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO organizers (${cols}) VALUES (${placeholders})`,
        values
      );
    }
  } finally {
    client.release();
  }
  revalidatePath('/organizers');
  revalidatePath('/admin/organizers');
}

/**
 * 主催者の削除
 */
export async function deleteOrganizer(id: string) {
  await sql`DELETE FROM organizers WHERE id = ${id}`;
  revalidatePath('/organizers');
  revalidatePath('/admin/organizers');
}

/**
 * お知らせの作成・更新
 */
export async function upsertAnnouncement(formData: any) {
  const { id, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE announcements SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO announcements (${cols}) VALUES (${placeholders})`,
        values
      );
    }
  } finally {
    client.release();
  }
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/admin/announcements');
}

/**
 * お知らせの削除
 */
export async function deleteAnnouncement(id: string) {
  await sql`DELETE FROM announcements WHERE id = ${id}`;
  revalidatePath('/');
  revalidatePath('/announcements');
  revalidatePath('/admin/announcements');
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
  const playerEmail = data.email.trim();
  const playerXId = data.x_id?.trim() || null;

  // 1. 既に同じメールアドレスでエントリー済みかチェック
  const { rows: existingRows } = await sql`
    SELECT * FROM tournament_registrations
    WHERE tournament_id = ${data.tournament_id} AND email = ${playerEmail}
    LIMIT 1
  `;
  const existing = existingRows[0] || null;

  if (existing?.status === 'confirmed') {
    console.log('User already registered and confirmed');
    return existing;
  }
  if (existing) {
    console.log('User already registered but pending. Updating token and resending email.');
  }

  // 1.5. プレイヤーが players テーブルに存在するかチェック、なければ作成
  let existingPlayer = null;
  if (playerXId) {
    const { rows } = await sql`
      SELECT id FROM players WHERE email = ${playerEmail} OR x_id = ${playerXId} LIMIT 1
    `;
    existingPlayer = rows[0] || null;
  } else {
    const { rows } = await sql`SELECT id FROM players WHERE email = ${playerEmail} LIMIT 1`;
    existingPlayer = rows[0] || null;
  }

  if (!existingPlayer) {
    try {
      const avatarUrl = playerXId
        ? `https://unavatar.io/x/${playerXId}`
        : `https://unavatar.io/gravatar/${playerEmail}`;
      await sql`
        INSERT INTO players (name, email, x_id, avatar_url, points)
        VALUES (${data.player_name}, ${playerEmail}, ${playerXId}, ${avatarUrl}, 0)
      `;
    } catch (e) {
      console.error('Error creating player auto-entry:', e);
    }
  }

  // 2. エントリー情報の保存 (承認トークン付き)
  console.log('Saving registration for:', data.player_name, data.email);
  const approvalToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  let registration: any;
  if (existing) {
    const { rows } = await sql`
      UPDATE tournament_registrations SET
        player_name = ${data.player_name},
        x_id = ${playerXId},
        message = ${data.message || null},
        approval_token = ${approvalToken},
        token_expires_at = ${expiresAt},
        status = 'pending'
      WHERE id = ${existing.id}
      RETURNING *
    `;
    registration = rows[0];
  } else {
    const { rows } = await sql`
      INSERT INTO tournament_registrations
        (tournament_id, player_name, email, x_id, message, status, approval_token, token_expires_at)
      VALUES
        (${data.tournament_id}, ${data.player_name}, ${playerEmail}, ${playerXId},
         ${data.message || null}, 'pending', ${approvalToken}, ${expiresAt})
      RETURNING *
    `;
    registration = rows[0];
  }

  if (!registration) throw new Error('エントリー情報の保存に失敗しました。');
  console.log('Registration saved successfully:', registration.id);

  // 3. 大会情報の取得 (メール用)
  const { rows: tRows } = await sql`SELECT title FROM tournaments WHERE id = ${data.tournament_id}`;
  const tournament = tRows[0] || null;

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
  const { id, tournament_id, status: rawStatus, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const dataToUpdate = rawStatus ? { status: rawStatus, ...rest } : rest;
      const keys = Object.keys(dataToUpdate);
      const values = Object.values(dataToUpdate);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE tournament_registrations SET ${setClause} WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const status = rawStatus || 'pending';
      const insertData = { tournament_id, status, ...rest };
      const keys = Object.keys(insertData);
      const values = Object.values(insertData);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO tournament_registrations (${cols}) VALUES (${placeholders})`,
        values
      );
      await client.query(
        'UPDATE tournaments SET participants = COALESCE(participants, 0) + 1 WHERE id = $1',
        [tournament_id]
      );
    }
  } finally {
    client.release();
  }
  revalidatePath(`/admin/tournaments/${tournament_id}/registrations`);
  revalidatePath('/admin/tournaments');
}

/**
 * エントリーの削除
 */
export async function deleteRegistration(id: string, tournamentId: string) {
  const { rows } = await sql`SELECT id FROM tournament_registrations WHERE id = ${id}`;
  if (!rows[0]) return;

  await sql`DELETE FROM tournament_registrations WHERE id = ${id}`;
  await sql`
    UPDATE tournaments
    SET participants = GREATEST(COALESCE(participants, 0) - 1, 0)
    WHERE id = ${tournamentId}
  `;

  revalidatePath(`/admin/tournaments/${tournamentId}/registrations`);
  revalidatePath('/admin/tournaments');
}

/**
 * トークンによるエントリー承認
 */
export async function approveRegistration(token: string) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT * FROM tournament_registrations WHERE approval_token = $1',
      [token]
    );
    const registration = rows[0];

    if (!registration) {
      await client.query('ROLLBACK');
      throw new Error('無効な承認トークンです。');
    }

    if (registration.token_expires_at && new Date(registration.token_expires_at) < new Date()) {
      await client.query('ROLLBACK');
      throw new Error('承認トークンの有効期限が切れています。再度エントリーをお願いします。');
    }

    if (registration.status === 'confirmed') {
      await client.query('ROLLBACK');
      return { success: true, message: '既に承認済みです。', tournament_id: registration.tournament_id };
    }

    await client.query(
      'UPDATE tournament_registrations SET status = $1, approval_token = NULL WHERE id = $2',
      ['confirmed', registration.id]
    );

    await client.query(
      'UPDATE tournaments SET participants = COALESCE(participants, 0) + 1 WHERE id = $1',
      [registration.tournament_id]
    );

    await client.query('COMMIT');

    revalidatePath(`/tournaments/${registration.tournament_id}`);
    revalidatePath('/tournaments');
    revalidatePath('/admin/tournaments');
    revalidatePath(`/admin/tournaments/${registration.tournament_id}/registrations`);

    return { success: true, tournament_id: registration.tournament_id };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * 出店者情報の作成・更新
 */
export async function upsertStall(formData: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, created_at, updated_at, ...rest } = formData;
  const client = await db.connect();
  try {
    if (id) {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
      await client.query(
        `UPDATE stalls SET ${setClause}, "updated_at" = NOW() WHERE id = $${keys.length + 1}`,
        [...values, id]
      );
    } else {
      const keys = Object.keys(rest);
      const values = Object.values(rest);
      const cols = keys.map(k => `"${k}"`).join(', ');
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      await client.query(
        `INSERT INTO stalls (${cols}) VALUES (${placeholders})`,
        values
      );
    }
  } finally {
    client.release();
  }
  revalidatePath('/');
  revalidatePath('/admin/stalls');
}

/**
 * 出店者の削除
 */
export async function deleteStall(id: string) {
  await sql`DELETE FROM stalls WHERE id = ${id}`;
  revalidatePath('/');
  revalidatePath('/admin/stalls');
}
