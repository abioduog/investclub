const createUserSettingsTable = `
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  notification_preferences TEXT NOT NULL DEFAULT '{}',
  communication_preferences TEXT NOT NULL DEFAULT '{}',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
`;

const dropUserSettingsTable = `
DROP TABLE IF EXISTS user_settings;
`;

module.exports = {
  up: (db) => db.exec(createUserSettingsTable),
  down: (db) => db.exec(dropUserSettingsTable)
}; 