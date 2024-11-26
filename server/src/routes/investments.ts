import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { db } from '../lib/db';

const router = Router();

const investmentValidation = [
  body('title').notEmpty().trim().escape(),
  body('description').notEmpty().trim().escape(),
  body('amount').isNumeric(),
  body('minParticipants').isInt({ min: 1 }),
  body('maxParticipants').isInt({ min: 1 }),
  body('status').isIn(['open', 'closed', 'completed'])
];

router.post('/', validate(investmentValidation), async (req, res) => {
  try {
    const { title, description, amount, minParticipants, maxParticipants, status } = req.body;
    
    const result = await db.run(
      `INSERT INTO investments (title, description, amount, min_participants, max_participants, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, amount, minParticipants, maxParticipants, status]
    );

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Failed to create investment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const investments = await db.get('SELECT * FROM investments ORDER BY created_at DESC');
    res.json(investments);
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ error: 'Failed to get investments' });
  }
});

export default router; 