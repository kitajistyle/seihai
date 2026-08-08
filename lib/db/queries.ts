import { cache } from 'react';
import { sql, db } from '@/lib/db';
import { Tournament, PlayerRank, Organizer, EventReport, Registration, Announcement, Stall } from '@/types';

export const getHeroTournaments = cache(async (): Promise<Tournament[]> => {
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
});

const _getTournaments = cache(async (page: number, limit: number | undefined, search: string | undefined, sort: string): Promise<Tournament[]> => {
  const offset = limit ? (page - 1) * limit : 0;

  let client;
  try {
    client = await db.connect();
    let queryText = `
      SELECT
        t.*,
        COALESCE(json_agg(o.*) FILTER (WHERE o.id IS NOT NULL), '[]') AS organizers
      FROM tournaments t
      LEFT JOIN tournament_organizers to_ ON t.id = to_.tournament_id
      LEFT JOIN organizers o ON to_.organizer_id = o.id
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` WHERE t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    queryText += ` GROUP BY t.id`;

    if (sort === 'date_asc') {
      queryText += ` ORDER BY t.date ASC`;
    } else if (sort === 'title_asc') {
      queryText += ` ORDER BY t.title ASC`;
    } else {
      queryText += ` ORDER BY t.date DESC`;
    }

    if (limit !== undefined) {
      queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
    }

    const { rows } = await client.query(queryText, queryParams);
    return rows as Tournament[];
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  } finally {
    if (client) {
      client.release();
    }
  }
});

export function getTournaments(options?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}): Promise<Tournament[]> {
  return _getTournaments(
    options?.page ?? 1,
    options?.limit,
    options?.search,
    options?.sort ?? 'date_desc',
  );
}

const _getTournamentsCount = cache(async (search: string | undefined): Promise<number> => {
  let client;
  try {
    client = await db.connect();
    let queryText = `SELECT COUNT(*) as count FROM tournaments t`;
    const queryParams: any[] = [];

    if (search) {
      queryText += ` WHERE t.title ILIKE $1 OR t.description ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    const { rows } = await client.query(queryText, queryParams);
    return parseInt(rows[0]?.count || '0', 10);
  } catch (error) {
    console.error('Error fetching tournaments count:', error);
    return 0;
  } finally {
    if (client) {
      client.release();
    }
  }
});

export function getTournamentsCount(options?: { search?: string }): Promise<number> {
  return _getTournamentsCount(options?.search);
}

export const getRankings = cache(async (limit = 10): Promise<PlayerRank[]> => {
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
});

export const getOrganizers = cache(async (): Promise<Organizer[]> => {
  try {
    const { rows } = await sql`SELECT * FROM organizers ORDER BY name`;
    return rows as Organizer[];
  } catch (error) {
    console.error('Error fetching organizers:', error);
    return [];
  }
});

export const getReports = cache(async (limit = 4): Promise<EventReport[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM event_reports ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows as EventReport[];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
});

export const getReportDetail = cache(async (id: string) => {
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
});

export const getTournamentDetail = cache(async (id: string): Promise<Tournament | null> => {
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
});

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

export const getPlayerById = cache(async (id: string) => {
  try {
    const { rows } = await sql`SELECT * FROM players WHERE id = ${id}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching player:', error);
    return null;
  }
});

export const getAnnouncements = cache(async (activeOnly = false): Promise<Announcement[]> => {
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
});

export const getAnnouncementById = cache(async (id: string): Promise<Announcement | null> => {
  try {
    const { rows } = await sql`SELECT * FROM announcements WHERE id = ${id}`;
    return (rows[0] as Announcement) || null;
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }
});

export const getOrganizerById = cache(async (id: string) => {
  try {
    const { rows } = await sql`SELECT * FROM organizers WHERE id = ${id}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching organizer:', error);
    return null;
  }
});

export const getStalls = cache(async (): Promise<Stall[]> => {
  try {
    const { rows } = await sql`
      SELECT * FROM stalls
      ORDER BY display_order ASC, created_at ASC
    `;
    return rows as Stall[];
  } catch (error) {
    console.error('Error fetching stalls:', error);
    return [];
  }
});

export const getStallById = cache(async (id: string): Promise<Stall | null> => {
  try {
    const { rows } = await sql`SELECT * FROM stalls WHERE id = ${id}`;
    return (rows[0] as Stall) || null;
  } catch (error) {
    console.error('Error fetching stall:', error);
    return null;
  }
});
