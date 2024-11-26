const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const migrate = require('./migrate');

let db = null;

async function initializeDatabase() {
  if (db) return db;

  const dbPath = path.join(__dirname, 'alumni_investment.db');
  
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');

    // Run migrations
    await migrate();

    return db;
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

// Initialize database when this module is imported
initializeDatabase().catch(console.error);

module.exports = {
  async get(...args) {
    const connection = await initializeDatabase();
    return connection.get(...args);
  },

  async all(...args) {
    const connection = await initializeDatabase();
    return connection.all(...args);
  },

  async run(...args) {
    const connection = await initializeDatabase();
    return connection.run(...args);
  },

  async exec(...args) {
    const connection = await initializeDatabase();
    return connection.exec(...args);
  },

  async close() {
    if (db) {
      await db.close();
      db = null;
    }
  }
}; 