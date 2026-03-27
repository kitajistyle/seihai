export interface Tournament {
  id: string;
  title: string;
  date: string;
  participants: number;
  maxParticipants: number;
  imageUrl: string;
  status: 'open' | 'closed' | 'upcoming';
  location?: string;
  locationUrl?: string;
  description?: string;
  firstPrize?: string;
  participationPrize?: string;
  entryFee?: string;
  contactInfo?: string;
  guests?: string;
  format?: string;
}

export interface PlayerRank {
  rank: number;
  name: string;
  points: number;
  xId?: string;
  avatarUrl: string;
}

export interface Organizer {
  id: string;
  name: string;
  title: string;
  description: string;
  xId?: string;
  imageUrl: string;
}

export interface TournamentResult {
  id: string;
  tournamentId: string;
  playerId?: string;
  rank: number;
  displayName?: string;
}

export interface EventReport {
  id: string;
  title: string;
  imageUrl: string;
  content?: string;
  external?: boolean;
}
