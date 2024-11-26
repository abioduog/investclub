const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK(role IN ('admin', 'member')) NOT NULL,
  status TEXT CHECK(status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
  profile_picture_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
`;

const dropUsersTable = `
DROP TABLE IF EXISTS users;
`;

module.exports = {
  up: (db) => db.exec(createUsersTable),
  down: (db) => db.exec(dropUsersTable)
}; 