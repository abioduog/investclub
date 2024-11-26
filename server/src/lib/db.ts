import { Database as SQLiteDatabase } from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export const initDb = async () => {
  if (!dbInstance) {
    dbInstance = await open({
      filename: process.env.DATABASE_URL || ':memory:',
      driver: SQLiteDatabase
    });

    // Create tables if they don't exist
    await createTables();
  }
  return dbInstance;
};

const createTables = async () => {
  const db = await getDb();
  
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Files table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      filename TEXT NOT NULL,
      size INTEGER NOT NULL,
      type TEXT NOT NULL,
      purpose TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
};

export const getDb = async (): Promise<Database> => {
  if (!dbInstance) {
    await initDb();
  }
  if (!dbInstance) {
    throw new Error('Database not initialized');
  }
  return dbInstance;
};

export const closeDb = async () => {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
};

export const db = {
  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const instance = await getDb();
    return instance.get(sql, params);
  },

  async run(sql: string, params: any[] = []): Promise<{ lastID: number }> {
    const instance = await getDb();
    const result = await instance.run(sql, params);
    return { lastID: result.lastID };
  }
}; 