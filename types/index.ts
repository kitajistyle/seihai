export type SectionType = 'text' | 'image' | 'image_text' | 'callout';

export interface Section {
  id: string;
  type: SectionType;
  // text / callout
  heading?: string;
  content?: string;
  // image / image_text
  image_url?: string;
  caption?: string;
  // image_text
  image_position?: 'left' | 'right';
  // callout
  style?: 'info' | 'highlight' | 'warning';
}

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
  format?: string;
  external_registration_url?: string;
  featured_in_hero?: boolean;
  organizers?: Organizer[];
  sections?: Section[];
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
  date: string;
  created_at?: string;
  sections?: Section[];
}

export interface Announcement {
  id: string;
  title: string;
  content?: string;
  type: 'info' | 'warning' | 'success' | 'new';
  is_active: boolean;
  url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  tournament_id: string;
  player_name: string;
  email?: string | null;
  x_id?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  approval_token?: string;
  token_expires_at?: string;
  created_at: string;
}
