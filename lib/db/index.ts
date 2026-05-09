import { Pool, type PoolClient } from 'pg';

let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    _pool = new Pool({ connectionString });
  }
  return _pool;
}

/**
 * タグ付きテンプレートリテラルでパラメータ化SQLを実行します
 * const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<{ rows: any[] }> {
  const text = strings.reduce<string>(
    (query, str, i) => query + str + (i < values.length ? `$${i + 1}` : ''),
    ''
  );
  return getPool().query(text, values as unknown[]);
}

/**
 * トランザクション・動的クエリ用のクライアント接続
 */
export const db = {
  connect: (): Promise<PoolClient> => getPool().connect(),
};
