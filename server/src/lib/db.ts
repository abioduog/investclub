import { Database } from 'sqlite3';
import { open } from 'sqlite';

let dbInstance: Database | null = null;

export async function initDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: process.env.DATABASE_URL || ':memory:',
      driver: Database
    });

    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        filename TEXT NOT NULL,
        size INTEGER NOT NULL,
        type TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        purpose TEXT NOT NULL
      )
    `);
  }
  return dbInstance;
}

export const db = {
  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const instance = await initDb();
    return instance.get(sql, params);
  },

  async run(sql: string, params: any[] = []): Promise<{ lastID: number }> {
    const instance = await initDb();
    const result = await instance.run(sql, params);
    return { lastID: result.lastID };
  }
}; 