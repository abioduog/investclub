const createContributionsTable = `
CREATE TABLE IF NOT EXISTS contributions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_reference TEXT UNIQUE NOT NULL,
  payment_proof_url TEXT,
  contribution_date DATE NOT NULL,
  status TEXT CHECK(status IN ('pending', 'validated', 'rejected')) NOT NULL DEFAULT 'pending',
  validated_by INTEGER,
  validation_date DATETIME,
  rejection_reason TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (validated_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_date ON contributions(contribution_date);
CREATE INDEX IF NOT EXISTS idx_contributions_transaction ON contributions(transaction_reference);
`;

const dropContributionsTable = `
DROP TABLE IF EXISTS contributions;
`;

module.exports = {
  up: (db) => db.exec(createContributionsTable),
  down: (db) => db.exec(dropContributionsTable)
}; 