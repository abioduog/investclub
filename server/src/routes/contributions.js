const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all contributions
router.get('/', async (req, res) => {
  try {
    const contributions = await db.all(
      `SELECT c.*, u.name as user_name 
       FROM contributions c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.contribution_date DESC`
    );
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contributions for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const contributions = await db.all(
      `SELECT * FROM contributions 
       WHERE user_id = ? 
       ORDER BY contribution_date DESC`,
      [req.params.userId]
    );
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific contribution
router.get('/:id', async (req, res) => {
  try {
    const contribution = await db.get(
      `SELECT c.*, u.name as user_name 
       FROM contributions c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }
    res.json(contribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new contribution
router.post('/', async (req, res) => {
  const {
    user_id,
    amount,
    transaction_reference,
    payment_proof_url,
    contribution_date
  } = req.body;

  try {
    const result = await db.run(
      `INSERT INTO contributions (
        user_id, amount, transaction_reference,
        payment_proof_url, contribution_date,
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))`,
      [user_id, amount, transaction_reference, payment_proof_url, contribution_date]
    );

    const newContribution = await db.get('SELECT * FROM contributions WHERE id = ?', [result.lastID]);
    res.status(201).json(newContribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a contribution status
router.put('/:id/status', async (req, res) => {
  const { status, validated_by } = req.body;

  try {
    await db.run(
      `UPDATE contributions SET
        status = ?,
        validated_by = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
      [status, validated_by, req.params.id]
    );

    const updatedContribution = await db.get('SELECT * FROM contributions WHERE id = ?', [req.params.id]);
    if (!updatedContribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }
    res.json(updatedContribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get contribution statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await db.get(
      `SELECT 
        COUNT(*) as total_contributions,
        SUM(CASE WHEN status = 'validated' THEN amount ELSE 0 END) as total_amount_validated,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_amount_pending,
        AVG(CASE WHEN status = 'validated' THEN amount END) as average_contribution
       FROM contributions`
    );
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get monthly contribution summary
router.get('/stats/monthly', async (req, res) => {
  try {
    const monthlySummary = await db.all(
      `SELECT 
        strftime('%Y-%m', contribution_date) as month,
        COUNT(*) as contribution_count,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
       FROM contributions
       WHERE status = 'validated'
       GROUP BY strftime('%Y-%m', contribution_date)
       ORDER BY month DESC`
    );
    res.json(monthlySummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 