import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const client = await pool.connect();

try {
  await client.query(`
    ALTER TABLE tournaments
    ADD COLUMN IF NOT EXISTS featured_in_hero BOOLEAN DEFAULT false
  `);
  console.log('✓ tournaments テーブルに featured_in_hero カラムを追加しました');
} finally {
  client.release();
  await pool.end();
}
