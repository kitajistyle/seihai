-- ==========================================
-- (開発・検証用) 古いデータとテーブルをリセット
-- ==========================================
DROP TABLE IF EXISTS tournament_registrations CASCADE;
DROP TABLE IF EXISTS tournament_results CASCADE;
DROP TABLE IF EXISTS event_reports CASCADE;
DROP TABLE IF EXISTS tournament_organizers CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS organizers CASCADE;

-- ==========================================
-- Enable necessary extensions
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Organizers Table
-- ==========================================
CREATE TABLE organizers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  description TEXT,
  x_id TEXT, -- X (Twitter) ID
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public organizers are viewable by everyone." ON organizers FOR SELECT USING (true);


-- ==========================================
-- 2. Tournaments Table
-- ==========================================
CREATE TABLE tournaments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  participants INTEGER DEFAULT 0,
  max_participants INTEGER NOT NULL,
  image_url TEXT,
  status TEXT CHECK (status IN ('open', 'closed', 'upcoming')) DEFAULT 'upcoming',
  location TEXT,
  location_url TEXT,
  description TEXT,
  first_prize TEXT,
  participation_prize TEXT,
  entry_fee TEXT,
  contact_info TEXT,
  guests TEXT,
  format TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public tournaments are viewable by everyone." ON tournaments FOR SELECT USING (true);


-- ==========================================
-- 3. Players (Rankings) Table
-- ==========================================
CREATE TABLE players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE, -- Email address
  points INTEGER DEFAULT 0,
  x_id TEXT UNIQUE, -- X (Twitter) ID
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_players_points ON players(points DESC);
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public players are viewable by everyone." ON players FOR SELECT USING (true);


-- ==========================================
-- 4. Event Reports Table
-- ==========================================
CREATE TABLE event_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT,
  content TEXT, -- レポート本文（長文/Markdown対応等）
  is_external BOOLEAN DEFAULT false,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reports are viewable by everyone." ON event_reports FOR SELECT USING (true);


-- ==========================================
-- 5. Tournament Results (入賞者) Table
-- ==========================================
CREATE TABLE tournament_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  rank INTEGER NOT NULL, -- 1=優勝, 2=準優勝...
  display_name TEXT, -- 未登録の一般プレイヤー用
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tournament_results_tournament ON tournament_results(tournament_id);
ALTER TABLE tournament_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public tournament results are viewable by everyone." ON tournament_results FOR SELECT USING (true);


-- ==========================================
-- 6. Tournament Organizers (中間テーブル)
-- ==========================================
CREATE TABLE tournament_organizers (
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  organizer_id UUID REFERENCES organizers(id) ON DELETE CASCADE,
  PRIMARY KEY (tournament_id, organizer_id)
);

ALTER TABLE tournament_organizers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public tournament organizers are viewable by everyone." ON tournament_organizers FOR SELECT USING (true);


-- ==========================================
-- 7. Tournament Registrations (大会予約/エントリー)
-- ==========================================
CREATE TABLE tournament_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  email TEXT NOT NULL,
  x_id TEXT,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tournament_id, email)
);

CREATE INDEX idx_registrations_tournament ON tournament_registrations(tournament_id);
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Registrations are insertable by everyone." ON tournament_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public registrations are viewable by everyone." ON tournament_registrations FOR SELECT USING (true);


-- ==============================================================
-- 🚀 MOCK DATA SEEDING (With Multiple Organizers support)
-- ==============================================================

-- Inserting sample organizers
INSERT INTO organizers (id, name, title, description, x_id, image_url) VALUES
('b29f9e8a-e555-4a7b-a4db-1e5b84b65631', 'Takahashi', 'エースゲーミング主催', '人気FPS大会を多数開催。', 'PlayStation', 'https://unavatar.io/x/PlayStation'),
('c38f9e8a-e555-4a7b-a4db-1e5b84b65632', 'Megumi', 'ネクストコンペ代表', '女性向け大会を中心に運営。', 'Nintendo', 'https://unavatar.io/x/Nintendo'),
('d47f9e8a-e555-4a7b-a4db-1e5b84b65633', 'Suzuki', 'ストリームアリーナ担当', '配信ゲームイベントに精通。', 'Xbox', 'https://unavatar.io/x/Xbox');

-- Inserting sample tournaments
INSERT INTO tournaments (id, title, date, participants, max_participants, image_url, status, location, location_url, description, first_prize, participation_prize, entry_fee, contact_info, guests, format) VALUES
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', 'バトルカップ 予選', '2026-06-15T10:00:00Z', 45, 50, 'https://picsum.photos/seed/tcg1/800/400', 'closed', '東京ビッグサイト 西展示棟', 'https://maps.app.goo.gl/example', '全国から猛者が集う公式予選大会。成績上位者はそのまま本戦への出場権を獲得できます。', 'ゲーミングPC (Core i7 / RTX 4070)', '特製クリアファイル', '1500円', '当日は必ず身分証と参加チケットをお持ちください。', 'プロゲーマー Tanaka, 実況: Sato', 'スイスドロー（予選）＋ シングルエリミネーション'),
('f65f9e8a-e555-4a7b-a4db-1e5b84b65635', 'オールスター杯', '2026-06-18T12:00:00Z', 20, 32, 'https://picsum.photos/seed/tcg2/800/400', 'open', 'オンライン開催 (Discord)', 'https://discord.gg/example', 'どなたでも気軽に参加できるカジュアルなオンライン大会です。初心者大歓迎！', '限定プロモカード（ホイル仕様）', '参加記念限定アバター', '無料', 'Discordサーバーへの事前参加が必須です。', NULL, 'ダブルエリミネーション');

-- Seeding tournament organizers
INSERT INTO tournament_organizers (tournament_id, organizer_id) VALUES
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', 'b29f9e8a-e555-4a7b-a4db-1e5b84b65631'),
('f65f9e8a-e555-4a7b-a4db-1e5b84b65635', 'c38f9e8a-e555-4a7b-a4db-1e5b84b65632'),
('f65f9e8a-e555-4a7b-a4db-1e5b84b65635', 'd47f9e8a-e555-4a7b-a4db-1e5b84b65633'); -- Multiple organizers example

-- Inserting sample players
INSERT INTO players (id, name, points, x_id, avatar_url) VALUES
('a1111111-1111-1111-1111-111111111111', 'KAZUYA', 1235, 'kazuya_esports', 'https://unavatar.io/x/kazuya_esports'),
('a2222222-2222-2222-2222-222222222222', 'SHIRO', 989, 'shiro_gamer', 'https://unavatar.io/x/shiro_gamer'),
('a3333333-3333-3333-3333-333333333333', 'TAKERU', 861, 'takeru_jp', 'https://unavatar.io/x/takeru_jp'),
('a4444444-4444-4444-4444-444444444444', 'YUTO', 850, 'yuto_play', 'https://unavatar.io/x/yuto_play'),
('a5555555-5555-5555-5555-555555555555', 'EMI', 810, 'emi_chan', 'https://unavatar.io/x/emi_chan');

-- Inserting tournament results (上位入賞者)
INSERT INTO tournament_results (tournament_id, player_id, rank, display_name) VALUES
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', 'a1111111-1111-1111-1111-111111111111', 1, NULL),
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', 'a2222222-2222-2222-2222-222222222222', 2, NULL),
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', NULL, 3, '一般参加プレイヤーA');

-- Inserting sample reports
INSERT INTO event_reports (tournament_id, title, image_url, content, is_external, url) VALUES
('e56f9e8a-e555-4a7b-a4db-1e5b84b65634', '「Xross Stars はっちcs（個人戦）」イベントレポート', 'https://picsum.photos/seed/rep1/400/250', 
E'## 波乱の予選を制したのはKAZUYA選手！\n\n今回のバトルカップ予選は、例年以上の熱気に包まれました。参加者45名の中から見事1位をもぎ取ったのはKAZUYA選手。スイスドローから無敗での優勝という圧倒的な強さを見せつけました！\n\n**会場の様子**\n当日は東京ビッグサイト西展示棟にて開催され、プロゲーマーのTanaka氏を迎え、大盛況のまま幕を閉じました。次回の本戦に向けて、ますます盛り上がりが期待されます！', 
false, NULL),
(NULL, '【外部サイト】「混沌の女神様CS in はっちEXPO2025」イベントレポート', 'https://picsum.photos/seed/rep2/400/250', NULL, true, 'https://example.com/report2');
