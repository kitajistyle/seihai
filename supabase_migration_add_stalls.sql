CREATE TABLE IF NOT EXISTS stalls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  image_url TEXT,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stalls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public stalls are viewable by everyone." ON stalls FOR SELECT USING (true);
