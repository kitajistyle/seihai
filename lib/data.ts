export const TOURNAMENTS = [
  {
    id: '1',
    title: 'バトルカップ 予選',
    date: '6月15日',
    participants: 45,
    maxParticipants: 50,
    imageUrl: 'https://picsum.photos/seed/tcg1/800/400',
    status: 'open' as const,
  },
  {
    id: '2',
    title: 'オールスター杯',
    date: '6月18日',
    participants: 20,
    maxParticipants: 32,
    imageUrl: 'https://picsum.photos/seed/tcg2/800/400',
    status: 'open' as const,
  },
  {
    id: '3',
    title: 'ナイトゲームバトル',
    date: '6月22日',
    participants: 12,
    maxParticipants: 32,
    imageUrl: 'https://picsum.photos/seed/tcg3/800/400',
    status: 'open' as const,
  },
];

export const RANKINGS = [
  { rank: 1, name: 'KAZUYA', points: 1235, avatarUrl: 'https://i.pravatar.cc/150?u=kazuya' },
  { rank: 2, name: 'SHIRO', points: 989, avatarUrl: 'https://i.pravatar.cc/150?u=shiro' },
  { rank: 3, name: 'TAKERU', points: 861, avatarUrl: 'https://i.pravatar.cc/150?u=takeru' },
  { rank: 4, name: 'YUTO', points: 850, avatarUrl: 'https://i.pravatar.cc/150?u=yuto' },
  { rank: 5, name: 'EMI', points: 810, avatarUrl: 'https://i.pravatar.cc/150?u=emi' },
];

export const ORGANIZERS = [
  {
    id: '1',
    name: 'Takahashi',
    title: 'エースゲーミング主催',
    description: '人気FPS大会を多数開催。',
    imageUrl: 'https://i.pravatar.cc/300?u=takahashi',
  },
  {
    id: '2',
    name: 'Megumi',
    title: 'ネクストコンペ代表',
    description: '女性向け大会を中心に運営。',
    imageUrl: 'https://i.pravatar.cc/300?u=megumi',
  },
  {
    id: '3',
    name: 'Suzuki',
    title: 'ストリームアリーナ担当',
    description: '配信ゲームイベントに精通。',
    imageUrl: 'https://i.pravatar.cc/300?u=suzuki',
  },
  {
    id: '4',
    name: 'Kurosawa',
    title: 'ブラックナイトリーグ代表',
    description: '大規模大会をプロデュース。',
    imageUrl: 'https://i.pravatar.cc/300?u=kurosawa',
  },
];

export const REPORTS = [
  { id: '1', title: '「Xross Stars はっちcs（個人戦）」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep1/400/250' },
  { id: '2', title: '【外部サイト】「混沌の女神様CS in はっちEXPO2025」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep2/400/250', external: true },
  { id: '3', title: '【外部サイト】「シャドウバースエボルヴ はっち×東京エボル部CS」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep3/400/250', external: true },
  { id: '4', title: '「デュエル・マスターズ はっちcs（チーム戦）」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep4/400/250' },
];

export const NAV_ITEMS = ['HOME', '大会一覧', '主催者一覧', 'ランキング', '大会レポート'];
export const NAV_LINKS: Record<string, string> = {
  HOME: '/',
  '大会一覧': '/tournaments',
  '主催者一覧': '/organizers',
  'ランキング': '/rankings',
  '大会レポート': '/reports',
};
