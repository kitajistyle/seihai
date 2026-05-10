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
    ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb
  `);
  console.log('✓ tournaments.sections カラムを追加しました');

  await client.query(`
    ALTER TABLE event_reports
    ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb
  `);
  console.log('✓ event_reports.sections カラムを追加しました');
} finally {
  client.release();
  await pool.end();
}
