const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await db.all(
      `SELECT id, name, email, role, status, created_at, updated_at 
       FROM users 
       ORDER BY name`
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const user = await db.get(
      `SELECT id, name, email, role, status, created_at, updated_at 
       FROM users 
       WHERE id = ?`,
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const result = await db.run(
      `INSERT INTO users (name, email, role, status, created_at)
       VALUES (?, ?, ?, 'active', datetime('now'))`,
      [name, email, role]
    );

    const newUser = await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { name, email, role, status } = req.body;

  try {
    // Check if email already exists for another user
    if (email) {
      const existingUser = await db.get(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.params.id]
      );
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered to another user' });
      }
    }

    await db.run(
      `UPDATE users SET
        name = COALESCE(?, name),
        email = COALESCE(?, email),
        role = COALESCE(?, role),
        status = COALESCE(?, status),
        updated_at = datetime('now')
       WHERE id = ?`,
      [name, email, role, status, req.params.id]
    );

    const updatedUser = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get('/:id/profile', async (req, res) => {
  try {
    const profile = await db.get(
      `SELECT 
        u.*,
        COUNT(DISTINCT c.id) as total_contributions,
        SUM(CASE WHEN c.status = 'validated' THEN c.amount ELSE 0 END) as total_contribution_amount,
        COUNT(DISTINCT ip.investment_id) as total_investments
       FROM users u
       LEFT JOIN contributions c ON u.id = c.user_id
       LEFT JOIN investment_participants ip ON u.id = ip.user_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [req.params.id]
    );
    
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user settings
router.put('/:id/settings', async (req, res) => {
  const { notification_preferences, communication_preferences } = req.body;

  try {
    await db.run(
      `UPDATE user_settings SET
        notification_preferences = ?,
        communication_preferences = ?,
        updated_at = datetime('now')
       WHERE user_id = ?`,
      [
        JSON.stringify(notification_preferences),
        JSON.stringify(communication_preferences),
        req.params.id
      ]
    );

    const updatedSettings = await db.get('SELECT * FROM user_settings WHERE user_id = ?', [req.params.id]);
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await db.get(
      `SELECT 
        COUNT(DISTINCT c.id) as total_contributions,
        SUM(CASE WHEN c.status = 'validated' THEN c.amount ELSE 0 END) as total_contribution_amount,
        COUNT(DISTINCT ip.investment_id) as total_investments,
        SUM(ip.amount) as total_investment_amount,
        (
          SELECT COUNT(*)
          FROM contributions
          WHERE user_id = ? AND status = 'validated'
          AND contribution_date >= date('now', '-12 months')
        ) as contributions_last_12_months
       FROM users u
       LEFT JOIN contributions c ON u.id = c.user_id
       LEFT JOIN investment_participants ip ON u.id = ip.user_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [req.params.id, req.params.id]
    );
    
    if (!stats) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 