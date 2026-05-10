import { sql } from '@/lib/db';
import { Tournament, PlayerRank, Organizer, EventReport, Registration, Announcement } from '@/types';

/**
 * ヒーローセクションに掲載する大会を取得します（最大3件）
 */
export async function getHeroTournaments(): Promise<Tournament[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM tournaments
      WHERE featured_in_hero = true
      ORDER BY date ASC
      LIMIT 3
    `;
    return rows as Tournament[];
  } catch (error) {
    console.error('Error fetching hero tournaments:', error);
    return [];
  }
}

/**
 * 大会一覧を取得します
 */
export async function getTournaments(): Promise<Tournament[]> {
  try {
    const { rows } = await sql`
      SELECT
        t.*,
        COALESCE(json_agg(o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS organizers
      FROM tournaments t
      LEFT JOIN tournament_organizers to_ ON t.id = to_.tournament_id
      LEFT JOIN organizers o ON to_.organizer_id = o.id
      GROUP BY t.id
      ORDER BY t.date DESC
    `;
    return rows as Tournament[];
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }
}

/**
 * プレイヤーランキング（上位）を取得します
 */
export async function getRankings(limit = 10): Promise<PlayerRank[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM players ORDER BY points DESC LIMIT ${limit}
    `;
    return rows.map((player: any, index: number) => ({
      ...player,
      id: player.id.toString(),
      rank: index + 1
    }));
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return [];
  }
}

/**
 * 主催者一覧を取得します
 */
export async function getOrganizers(): Promise<Organizer[]> {
  try {
    const { rows } = await sql`SELECT * FROM organizers ORDER BY name`;
    return rows as Organizer[];
  } catch (error) {
    console.error('Error fetching organizers:', error);
    return [];
  }
}

/**
 * 最新のイベントレポート一覧を取得します
 */
export async function getReports(limit = 4): Promise<EventReport[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM event_reports ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows as EventReport[];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

/**
 * レポートの詳細情報を一括取得します
 */
export async function getReportDetail(id: string) {
  try {
    const { rows: reportRows } = await sql`SELECT * FROM event_reports WHERE id = ${id}`;
    const report = reportRows[0];
    if (!report) return null;

    let tournament = null;
    let organizers: any[] = [];
    let results: any[] = [];

    if (report.tournament_id) {
      const { rows: tRows } = await sql`
        SELECT
          t.*,
          COALESCE(json_agg(o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS organizers
        FROM tournaments t
        LEFT JOIN tournament_organizers to_ ON t.id = to_.tournament_id
        LEFT JOIN organizers o ON to_.organizer_id = o.id
        WHERE t.id = ${report.tournament_id}
        GROUP BY t.id
      `;
      if (tRows[0]) {
        tournament = tRows[0];
        organizers = tRows[0].organizers || [];
      }

      const { rows: rRows } = await sql`
        SELECT tr.*, row_to_json(p.*) AS players
        FROM tournament_results tr
        LEFT JOIN players p ON tr.player_id = p.id
        WHERE tr.tournament_id = ${report.tournament_id}
        ORDER BY tr.rank ASC
      `;
      results = rRows;
    }

    return { report, tournament, organizers, results };
  } catch (error) {
    console.error('Error fetching report detail:', error);
    return null;
  }
}

/**
 * 指定した大会の詳細情報を取得します
 */
export async function getTournamentDetail(id: string): Promise<Tournament | null> {
  try {
    const { rows } = await sql`
      SELECT
        t.*,
        COALESCE(json_agg(o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS organizers
      FROM tournaments t
      LEFT JOIN tournament_organizers to_ ON t.id = to_.tournament_id
      LEFT JOIN organizers o ON to_.organizer_id = o.id
      WHERE t.id = ${id}
      GROUP BY t.id
    `;
    return (rows[0] as Tournament) || null;
  } catch (error) {
    console.error('Error fetching tournament detail:', error);
    return null;
  }
}

/**
 * 大会のエントリー（予約）一覧を取得します
 */
export async function getTournamentRegistrations(tournamentId: string): Promise<Registration[]> {
  try {
    const { rows } = await sql`
      SELECT * FROM tournament_registrations
      WHERE tournament_id = ${tournamentId}
      ORDER BY created_at DESC
    `;
    return rows as Registration[];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }
}

/**
 * プレイヤーをIDで取得します
 */
export async function getPlayerById(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM players WHERE id = ${id}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching player:', error);
    return null;
  }
}

/**
 * お知らせ一覧を取得します
 */
export async function getAnnouncements(activeOnly = false): Promise<Announcement[]> {
  try {
    if (activeOnly) {
      const { rows } = await sql`
        SELECT * FROM announcements WHERE is_active = true ORDER BY created_at DESC
      `;
      return rows as Announcement[];
    }
    const { rows } = await sql`
      SELECT * FROM announcements ORDER BY created_at DESC
    `;
    return rows as Announcement[];
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

/**
 * お知らせをIDで取得します
 */
export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  try {
    const { rows } = await sql`SELECT * FROM announcements WHERE id = ${id}`;
    return (rows[0] as Announcement) || null;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
}

/**
 * 主催者をIDで取得します
 */
export async function getOrganizerById(id: string) {
  try {
    const { rows } = await sql`SELECT * FROM organizers WHERE id = ${id}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching organizer:', error);
    return null;
  }
}
