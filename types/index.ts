export interface Tournament {
  id: string;
  title: string;
  date: string;
  participants: number;
  maxParticipants: number;
  imageUrl: string;
  status: 'open' | 'closed' | 'upcoming';
}

export interface PlayerRank {
  rank: number;
  name: string;
  points: number;
  avatarUrl: string;
}

export interface Organizer {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface EventReport {
  id: string;
  title: string;
  imageUrl: string;
  external?: boolean;
}
