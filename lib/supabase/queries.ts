import { createClient } from './server';
import { Tournament, PlayerRank, Organizer, EventReport, TournamentResult } from '@/types';

/**
 * 大会一覧を取得します
 */
export async function getTournaments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, tournament_organizers(organizers(*))')
    .order('date', { ascending: false });

  if (error || !data) {
    console.error('Error fetching tournaments:', error);
    return [];
  }

  return data.map((t: any) => ({
    ...t,
    organizers: t.tournament_organizers?.map((to: any) => to.organizers) || []
  }));
}

/**
 * プレイヤーランキング（上位）を取得します
 */
export async function getRankings(limit = 10): Promise<PlayerRank[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('points', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('Error fetching rankings:', error);
    return [];
  }
  
  // UIのPlayerRank型に合わせるためのランク付与（簡易的）
  return data.map((player: any, index: number) => ({
    ...player,
    id: player.id.toString(), // Ensure id is string if necessary, but according to type it is string
    rank: index + 1
  }));
}

/**
 * 主催者一覧を取得します
 */
export async function getOrganizers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizers')
    .select('*')
    .order('name');

  if (error || !data) {
    console.error('Error fetching organizers:', error);
    return [];
  }
  return data;
}

/**
 * 最新のイベントレポート一覧を取得します
 */
export async function getReports(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('event_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('Error fetching reports:', error);
    return [];
  }
  return data;
}

/**
 * レポートの詳細情報を一括取得します
 */
export async function getReportDetail(id: string) {
  const supabase = await createClient();
  
  // 1. レポート本体
  const { data: report, error: reportError } = await supabase
    .from('event_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (reportError || !report) {
    console.error('Error fetching report detail:', reportError);
    return null;
  }

  // 2. 関連する大会情報と主催者
  let tournament = null;
  let organizers = [];
  if (report.tournament_id) {
    const { data: tData } = await supabase
      .from('tournaments')
      .select('*, tournament_organizers(organizers(*))')
      .eq('id', report.tournament_id)
      .single();
    if (tData) {
      tournament = tData;
      // 複数の主催者を配列として取得
      organizers = tData.tournament_organizers?.map((to: any) => to.organizers) || [];
    }
  }

  // 3. 大会結果（入賞者）
  let results = [];
  if (report.tournament_id) {
    const { data: rData } = await supabase
      .from('tournament_results')
      .select('*, players(*)')
      .eq('tournament_id', report.tournament_id)
      .order('rank', { ascending: true });
    results = rData || [];
  }

  return { report, tournament, organizers, results };
}
/**
 * 指定した大会の詳細情報を取得します
 */
export async function getTournamentDetail(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tournaments')
    .select('*, tournament_organizers(organizers(*))')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching tournament detail:', error);
    return null;
  }
  return data;
}
