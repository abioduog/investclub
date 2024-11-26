const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs').promises;

async function getMigrationFiles() {
  const migrationPath = path.join(__dirname, 'migrations');
  const files = await fs.readdir(migrationPath);
  return files
    .filter(f => f.endsWith('.js'))
    .sort()
    .map(f => ({
      id: parseInt(f.split('_')[0]),
      name: f.replace('.js', ''),
      path: path.join(migrationPath, f)
    }));
}

async function getCurrentVersion(db) {
  try {
    const result = await db.get('SELECT version FROM migrations_meta LIMIT 1');
    return result ? result.version : 0;
  } catch (err) {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS migrations_meta (
        version INTEGER NOT NULL DEFAULT 0
      );
      INSERT INTO migrations_meta (version) VALUES (0);
    `);
    return 0;
  }
}

async function updateVersion(db, version) {
  await db.run('UPDATE migrations_meta SET version = ?', version);
}

async function migrate() {
  const dbPath = path.join(__dirname, 'alumni_investment.db');
  
  // Open database connection
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  try {
    const currentVersion = await getCurrentVersion(db);
    const migrations = await getMigrationFiles();
    
    console.log(`Current database version: ${currentVersion}`);
    console.log(`Found ${migrations.length} migration files`);

    // Begin transaction
    await db.exec('BEGIN TRANSACTION');

    try {
      for (const migration of migrations) {
        if (migration.id > currentVersion) {
          console.log(`Running migration: ${migration.name}`);
          const { up } = require(migration.path);
          await up(db);
          await updateVersion(db, migration.id);
          console.log(`Completed migration: ${migration.name}`);
        }
      }

      // Commit transaction
      await db.exec('COMMIT');
      console.log('All migrations completed successfully');
    } catch (err) {
      // Rollback transaction on error
      await db.exec('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  migrate().catch(console.error);
}

module.exports = migrate; 