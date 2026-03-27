export const TOURNAMENTS = [
  {
    id: 'e56f9e8a-e555-4a7b-a4db-1e5b84b65634',
    organizerId: 'b29f9e8a-e555-4a7b-a4db-1e5b84b65631',
    title: 'バトルカップ 予選',
    date: '2026-06-15T10:00:00Z',
    participants: 45,
    maxParticipants: 50,
    imageUrl: 'https://picsum.photos/seed/tcg1/800/400',
    status: 'closed' as const,
    location: '東京ビッグサイト 西展示棟',
    locationUrl: 'https://maps.app.goo.gl/example',
    description: '全国から猛者が集う公式予選大会。成績上位者はそのまま本戦への出場権を獲得できます。',
    firstPrize: 'ゲーミングPC (Core i7 / RTX 4070)',
    participationPrize: '特製クリアファイル',
    entryFee: '1500円',
    contactInfo: '当日は必ず身分証と参加チケットをお持ちください。',
    guests: 'プロゲーマー Tanaka, 実況: Sato',
    format: 'スイスドロー（予選）＋ シングルエリミネーション',
  },
  {
    id: 'f65f9e8a-e555-4a7b-a4db-1e5b84b65635',
    organizerId: 'c38f9e8a-e555-4a7b-a4db-1e5b84b65632',
    title: 'オールスター杯',
    date: '2026-06-18T12:00:00Z',
    participants: 20,
    maxParticipants: 32,
    imageUrl: 'https://picsum.photos/seed/tcg2/800/400',
    status: 'open' as const,
    location: 'オンライン開催 (Discord)',
    locationUrl: 'https://discord.gg/example',
    description: 'どなたでも気軽に参加できるカジュアルなオンライン大会です。初心者大歓迎！',
    firstPrize: '限定プロモカード（ホイル仕様）',
    participationPrize: '参加記念限定アバター',
    entryFee: '無料',
    contactInfo: 'Discordサーバーへの事前参加が必須です。',
    format: 'ダブルエリミネーション',
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
  { id: 'a1111111-1111-1111-1111-111111111111', rank: 1, name: 'KAZUYA', points: 1235, xId: 'kazuya_esports', avatarUrl: 'https://unavatar.io/x/kazuya_esports' },
  { id: 'a2222222-2222-2222-2222-222222222222', rank: 2, name: 'SHIRO', points: 989, xId: 'shiro_gamer', avatarUrl: 'https://unavatar.io/x/shiro_gamer' },
  { id: 'a3333333-3333-3333-3333-333333333333', rank: 3, name: 'TAKERU', points: 861, xId: 'takeru_jp', avatarUrl: 'https://unavatar.io/x/takeru_jp' },
  { id: 'a4444444-4444-4444-4444-444444444444', rank: 4, name: 'YUTO', points: 850, xId: 'yuto_play', avatarUrl: 'https://unavatar.io/x/yuto_play' },
  { id: 'a5555555-5555-5555-5555-555555555555', rank: 5, name: 'EMI', points: 810, xId: 'emi_chan', avatarUrl: 'https://unavatar.io/x/emi_chan' },
];

export const ORGANIZERS = [
  {
    id: 'b29f9e8a-e555-4a7b-a4db-1e5b84b65631',
    name: 'Takahashi',
    title: 'エースゲーミング主催',
    description: '人気FPS大会を多数開催。',
    xId: 'PlayStation',
    imageUrl: 'https://unavatar.io/x/PlayStation',
  },
  {
    id: 'c38f9e8a-e555-4a7b-a4db-1e5b84b65632',
    name: 'Megumi',
    title: 'ネクストコンペ代表',
    description: '女性向け大会を中心に運営。',
    xId: 'Nintendo',
    imageUrl: 'https://unavatar.io/x/Nintendo',
  },
  {
    id: 'd47f9e8a-e555-4a7b-a4db-1e5b84b65633',
    name: 'Suzuki',
    title: 'ストリームアリーナ担当',
    description: '配信ゲームイベントに精通。',
    xId: 'Xbox',
    imageUrl: 'https://unavatar.io/x/Xbox',
  },
  {
    id: '4',
    name: 'Kurosawa',
    title: 'ブラックナイトリーグ代表',
    description: '大規模大会をプロデュース。',
    xId: 'Steam',
    imageUrl: 'https://unavatar.io/x/Steam',
  },
];

export const REPORTS = [
  { 
    id: '1', 
    title: '「Xross Stars はっちcs（個人戦）」イベントレポート', 
    imageUrl: 'https://picsum.photos/seed/rep1/400/250',
    content: '## 波乱の予選を制したのはKAZUYA\n\n今回のバトルカップ予選は、例年以上の熱気に包まれました。参加者45名の中から見事1位をもぎ取ったのはKAZUYA。スイスドローから無敗での優勝という圧倒的な強さを見せつけました！\n\n**会場の様子**\n当日は東京ビッグサイト西展示棟にて開催され、プロゲーマーのTanaka氏をゲストに迎え、大盛況のまま幕を閉じました。次回の本戦に向けて、ますます盛り上がりが期待されます！',
    tournamentId: 'e56f9e8a-e555-4a7b-a4db-1e5b84b65634',
  },
  { id: '2', title: '【外部サイト】「混沌の女神様CS in はっちEXPO2025」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep2/400/250', external: true, url: 'https://example.com/report2' },
  { id: '3', title: '【外部サイト】「シャドウバースエボルヴ はっち×東京エボル部CS」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep3/400/250', external: true, url: 'https://example.com/report3' },
  { id: '4', title: '「デュエル・マスターズ はっちcs（チーム戦）」イベントレポート', imageUrl: 'https://picsum.photos/seed/rep4/400/250' },
];

export const TOURNAMENT_RESULTS = [
  { id: 'r1', tournamentId: 'e56f9e8a-e555-4a7b-a4db-1e5b84b65634', rank: 1, playerId: 'a1111111-1111-1111-1111-111111111111' },
  { id: 'r2', tournamentId: 'e56f9e8a-e555-4a7b-a4db-1e5b84b65634', rank: 2, playerId: 'a2222222-2222-2222-2222-222222222222' },
  { id: 'r3', tournamentId: 'e56f9e8a-e555-4a7b-a4db-1e5b84b65634', rank: 3, displayName: '一般参加プレイヤーA' },
];

export const NAV_ITEMS = ['HOME', '大会一覧', '主催者一覧', 'ランキング', '大会レポート'];
export const NAV_LINKS: Record<string, string> = {
  HOME: '/',
  '大会一覧': '/tournaments',
  '主催者一覧': '/organizers',
  'ランキング': '/rankings',
  '大会レポート': '/reports',
};
