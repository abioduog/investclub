const express = require('express');
const router = express.Router();
const db = require('../database');
const { investmentValidation } = require('../middleware/validation');

// Get all investments
router.get('/', async (req, res) => {
  try {
    const investments = await db.all('SELECT * FROM investment_opportunities ORDER BY created_at DESC');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific investment
router.get('/:id', investmentValidation.getPerformance, async (req, res) => {
  try {
    const investment = await db.get('SELECT * FROM investment_opportunities WHERE id = ?', [req.params.id]);
    res.json(investment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new investment opportunity
router.post('/', investmentValidation.create, async (req, res) => {
  const {
    title,
    description,
    target_amount,
    minimum_investment,
    expected_returns,
    duration,
    risk_level,
    start_date,
    end_date
  } = req.body;

  try {
    const result = await db.run(
      `INSERT INTO investment_opportunities (
        title, description, target_amount, minimum_investment,
        expected_returns, duration, risk_level, status,
        start_date, end_date, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'))`,
      [title, description, target_amount, minimum_investment, expected_returns, duration, risk_level, start_date, end_date]
    );

    const newInvestment = await db.get('SELECT * FROM investment_opportunities WHERE id = ?', [result.lastID]);
    res.status(201).json(newInvestment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an investment opportunity
router.put('/:id', investmentValidation.update, async (req, res) => {
  const {
    title,
    description,
    target_amount,
    minimum_investment,
    expected_returns,
    duration,
    risk_level,
    status,
    start_date,
    end_date
  } = req.body;

  try {
    await db.run(
      `UPDATE investment_opportunities SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        target_amount = COALESCE(?, target_amount),
        minimum_investment = COALESCE(?, minimum_investment),
        expected_returns = COALESCE(?, expected_returns),
        duration = COALESCE(?, duration),
        risk_level = COALESCE(?, risk_level),
        status = COALESCE(?, status),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        updated_at = datetime('now')
      WHERE id = ?`,
      [title, description, target_amount, minimum_investment, expected_returns, duration, risk_level, status, start_date, end_date, req.params.id]
    );

    const updatedInvestment = await db.get('SELECT * FROM investment_opportunities WHERE id = ?', [req.params.id]);
    if (!updatedInvestment) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json(updatedInvestment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an investment opportunity
router.delete('/:id', investmentValidation.getPerformance, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM investment_opportunities WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    res.json({ message: 'Investment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all participants for an investment
router.get('/:id/participants', investmentValidation.getPerformance, async (req, res) => {
  try {
    const participants = await db.all(
      `SELECT u.id, u.name, u.email, ip.amount, ip.joined_at
       FROM investment_participants ip
       JOIN users u ON ip.user_id = u.id
       WHERE ip.investment_id = ?
       ORDER BY ip.joined_at DESC`,
      [req.params.id]
    );
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a participant to an investment
router.post('/:id/participants', investmentValidation.participate, async (req, res) => {
  const { user_id, amount } = req.body;

  try {
    await db.run(
      `INSERT INTO investment_participants (investment_id, user_id, amount, status, joined_at)
       VALUES (?, ?, ?, 'pending', datetime('now'))`,
      [req.params.id, user_id, amount]
    );

    res.status(201).json({ message: 'Successfully joined investment' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's investment participations
router.get('/user/:userId/participations', investmentValidation.getUserParticipations, async (req, res) => {
  try {
    const participations = await db.all(
      `SELECT 
        ip.*,
        io.title,
        io.description,
        io.expected_returns,
        io.duration,
        io.risk_level,
        io.status as investment_status
       FROM investment_participants ip
       JOIN investment_opportunities io ON ip.investment_id = io.id
       WHERE ip.user_id = ?
       ORDER BY ip.joined_at DESC`,
      [req.params.userId]
    );
    res.json(participations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get investment performance metrics
router.get('/:id/performance', investmentValidation.getPerformance, async (req, res) => {
  try {
    const performance = await db.get(
      `SELECT 
        COUNT(ip.id) as total_participants,
        SUM(ip.amount) as total_invested,
        MIN(ip.amount) as min_investment,
        MAX(ip.amount) as max_investment,
        AVG(ip.amount) as avg_investment,
        io.target_amount,
        ROUND((SUM(ip.amount) * 100.0 / io.target_amount), 2) as funding_percentage
       FROM investment_opportunities io
       LEFT JOIN investment_participants ip ON io.id = ip.investment_id
       WHERE io.id = ?
       GROUP BY io.id`,
      [req.params.id]
    );

    if (!performance) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json(performance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update participation status
router.put('/participations/:participationId/status', investmentValidation.updateParticipationStatus, async (req, res) => {
  const { status, returns_amount } = req.body;

  try {
    await db.run(
      `UPDATE investment_participants SET
        status = ?,
        returns_amount = ?,
        completed_at = CASE WHEN ? = 'completed' THEN datetime('now') ELSE completed_at END
       WHERE id = ?`,
      [status, returns_amount, status, req.params.participationId]
    );

    const updatedParticipation = await db.get(
      'SELECT * FROM investment_participants WHERE id = ?',
      [req.params.participationId]
    );

    if (!updatedParticipation) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    res.json(updatedParticipation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get investment updates
router.get('/:id/updates', investmentValidation.getPerformance, async (req, res) => {
  try {
    const updates = await db.all(
      `SELECT 
        iu.*,
        u.name as created_by_name
       FROM investment_updates iu
       JOIN users u ON iu.created_by = u.id
       WHERE iu.investment_id = ?
       ORDER BY iu.created_at DESC`,
      [req.params.id]
    );
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add investment update
router.post('/:id/updates', investmentValidation.createUpdate, async (req, res) => {
  const { title, description, update_type, created_by } = req.body;

  try {
    const result = await db.run(
      `INSERT INTO investment_updates (
        investment_id, title, description, update_type, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [req.params.id, title, description, update_type, created_by]
    );

    const newUpdate = await db.get(
      `SELECT 
        iu.*,
        u.name as created_by_name
       FROM investment_updates iu
       JOIN users u ON iu.created_by = u.id
       WHERE iu.id = ?`,
      [result.lastID]
    );

    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 