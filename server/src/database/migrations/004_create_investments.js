const createInvestmentsTable = `
CREATE TABLE IF NOT EXISTS investment_opportunities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  minimum_investment DECIMAL(10,2) NOT NULL,
  expected_returns DECIMAL(5,2) NOT NULL,
  duration INTEGER NOT NULL,
  risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')) NOT NULL,
  status TEXT CHECK(status IN ('draft', 'open', 'closed', 'completed')) NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  created_by INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS investment_participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  investment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK(status IN ('pending', 'active', 'completed')) NOT NULL DEFAULT 'pending',
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  returns_amount DECIMAL(10,2),
  FOREIGN KEY (investment_id) REFERENCES investment_opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS investment_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  investment_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  update_type TEXT CHECK(update_type IN ('progress', 'returns', 'completion')) NOT NULL,
  created_by INTEGER NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (investment_id) REFERENCES investment_opportunities(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_investments_status ON investment_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_investments_risk ON investment_opportunities(risk_level);
CREATE INDEX IF NOT EXISTS idx_investment_participants ON investment_participants(investment_id, user_id);
CREATE INDEX IF NOT EXISTS idx_investment_updates ON investment_updates(investment_id);
`;

const dropInvestmentsTable = `
DROP TABLE IF EXISTS investment_updates;
DROP TABLE IF EXISTS investment_participants;
DROP TABLE IF EXISTS investment_opportunities;
`;

module.exports = {
  up: (db) => db.exec(createInvestmentsTable),
  down: (db) => db.exec(dropInvestmentsTable)
}; 