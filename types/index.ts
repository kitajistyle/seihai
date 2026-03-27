export interface Tournament {
  id: string;
  organizer_id?: string;
  title: string;
  date: string;
  participants: number;
  max_participants: number;
  image_url: string;
  status: 'open' | 'closed' | 'upcoming';
  location?: string;
  location_url?: string;
  description?: string;
  first_prize?: string;
  participation_prize?: string;
  entry_fee?: string;
  contact_info?: string;
  guests?: string;
  format?: string;
  organizers?: Organizer;
}

export interface PlayerRank {
  id: string;
  rank: number;
  name: string;
  email?: string;
  points: number;
  x_id?: string;
  avatar_url: string;
}

export interface Organizer {
  id: string;
  name: string;
  title: string;
  description: string;
  x_id?: string;
  image_url: string;
}

export interface TournamentResult {
  id: string;
  tournament_id: string;
  player_id?: string;
  rank: number;
  display_name?: string;
  players?: PlayerRank;
}

export interface EventReport {
  id: string;
  tournament_id?: string;
  title: string;
  image_url: string;
  content?: string;
  is_external?: boolean;
  url?: string;
}

export interface Registration {
  id: string;
  tournament_id: string;
  player_name: string;
  email: string;
  x_id?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
