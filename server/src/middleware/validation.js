const { body, param, query, validationResult } = require('express-validator');

// Helper function to validate results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Contribution Validations
const contributionValidation = {
  create: [
    body('user_id').isInt().withMessage('Valid user ID is required'),
    body('amount')
      .isFloat({ min: 5000 })
      .withMessage('Minimum contribution amount is ₦5,000'),
    body('transaction_reference')
      .isString()
      .notEmpty()
      .withMessage('Transaction reference is required'),
    body('contribution_date')
      .isDate()
      .withMessage('Valid contribution date is required'),
    validate
  ],
  updateStatus: [
    param('id').isInt().withMessage('Valid contribution ID is required'),
    body('status')
      .isIn(['pending', 'validated', 'rejected'])
      .withMessage('Invalid status value'),
    body('validated_by')
      .optional()
      .isInt()
      .withMessage('Valid validator ID is required'),
    body('rejection_reason')
      .if(body('status').equals('rejected'))
      .notEmpty()
      .withMessage('Rejection reason is required when rejecting a contribution'),
    validate
  ]
};

// Investment Validations
const investmentValidation = {
  create: [
    body('title')
      .notEmpty().withMessage('Investment title is required')
      .isLength({ max: 100 }).withMessage('Title must be less than 100 characters'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('target_amount')
      .isFloat({ min: 100000 })
      .withMessage('Target amount must be at least ₦100,000'),
    body('minimum_investment')
      .isFloat({ min: 5000 })
      .withMessage('Minimum investment must be at least ₦5,000')
      .custom((value, { req }) => {
        if (value > req.body.target_amount) {
          throw new Error('Minimum investment cannot be greater than target amount');
        }
        return true;
      }),
    body('expected_returns')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Expected returns must be between 0% and 100%'),
    body('duration')
      .isInt({ min: 1, max: 120 })
      .withMessage('Duration must be between 1 and 120 months'),
    body('risk_level')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Valid risk level is required'),
    body('start_date')
      .optional()
      .isISO8601()
      .withMessage('Valid start date is required')
      .custom((value) => {
        if (new Date(value) < new Date()) {
          throw new Error('Start date cannot be in the past');
        }
        return true;
      }),
    body('end_date')
      .optional()
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (req.body.start_date && new Date(value) <= new Date(req.body.start_date)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    validate
  ],

  participate: [
    param('id').isInt().withMessage('Valid investment ID is required'),
    body('user_id').isInt().withMessage('Valid user ID is required'),
    body('amount')
      .isFloat({ min: 0 })
      .withMessage('Valid investment amount is required')
      .custom(async (amount, { req }) => {
        const db = require('../database');
        const investment = await db.get(
          'SELECT minimum_investment, target_amount, status FROM investment_opportunities WHERE id = ?',
          [req.params.id]
        );
        
        if (!investment) {
          throw new Error('Investment opportunity not found');
        }
        
        if (investment.status !== 'open') {
          throw new Error('Investment is not open for participation');
        }
        
        if (amount < investment.minimum_investment) {
          throw new Error(`Amount must be at least ₦${investment.minimum_investment.toLocaleString()}`);
        }

        // Check if adding this amount would exceed target amount
        const currentTotal = await db.get(
          'SELECT COALESCE(SUM(amount), 0) as total FROM investment_participants WHERE investment_id = ?',
          [req.params.id]
        );

        if (currentTotal.total + amount > investment.target_amount) {
          throw new Error('This investment would exceed the target amount');
        }

        return true;
      }),
    validate
  ],

  update: [
    param('id').isInt().withMessage('Valid investment ID is required'),
    body('status')
      .optional()
      .isIn(['draft', 'open', 'closed', 'completed'])
      .withMessage('Invalid status value')
      .custom(async (status, { req }) => {
        if (status === 'open') {
          const db = require('../database');
          const investment = await db.get(
            'SELECT start_date, end_date FROM investment_opportunities WHERE id = ?',
            [req.params.id]
          );
          
          if (!investment.start_date || !investment.end_date) {
            throw new Error('Start and end dates must be set before opening investment');
          }
        }
        return true;
      }),
    body('title')
      .optional()
      .notEmpty()
      .isLength({ max: 100 })
      .withMessage('Title must be less than 100 characters'),
    body('description')
      .optional()
      .notEmpty()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    validate
  ],

  updateParticipationStatus: [
    param('participationId').isInt().withMessage('Valid participation ID is required'),
    body('status')
      .isIn(['pending', 'active', 'completed'])
      .withMessage('Invalid status value'),
    body('returns_amount')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Valid returns amount is required')
      .custom(async (returns, { req }) => {
        if (req.body.status === 'completed' && !returns) {
          throw new Error('Returns amount is required when completing an investment');
        }
        return true;
      }),
    validate
  ],

  createUpdate: [
    param('id').isInt().withMessage('Valid investment ID is required'),
    body('title')
      .notEmpty()
      .isLength({ max: 100 })
      .withMessage('Update title must be less than 100 characters'),
    body('description')
      .notEmpty()
      .isLength({ max: 2000 })
      .withMessage('Update description must be less than 2000 characters'),
    body('update_type')
      .isIn(['progress', 'returns', 'completion'])
      .withMessage('Invalid update type'),
    body('created_by').isInt().withMessage('Valid creator ID is required'),
    validate
  ],

  getPerformance: [
    param('id')
      .isInt()
      .withMessage('Valid investment ID is required')
      .custom(async (id) => {
        const db = require('../database');
        const investment = await db.get(
          'SELECT id FROM investment_opportunities WHERE id = ?',
          [id]
        );
        if (!investment) {
          throw new Error('Investment not found');
        }
        return true;
      }),
    validate
  ],

  getUserParticipations: [
    param('userId')
      .isInt()
      .withMessage('Valid user ID is required')
      .custom(async (userId) => {
        const db = require('../database');
        const user = await db.get(
          'SELECT id FROM users WHERE id = ?',
          [userId]
        );
        if (!user) {
          throw new Error('User not found');
        }
        return true;
      }),
    validate
  ]
};

// User Settings Validations
const userSettingsValidation = {
  update: [
    param('id').isInt().withMessage('Valid user ID is required'),
    body('notification_preferences')
      .optional()
      .isObject()
      .withMessage('Valid notification preferences required'),
    body('communication_preferences')
      .optional()
      .isObject()
      .withMessage('Valid communication preferences required'),
    validate
  ]
};

// Support/Inquiry Validations
const supportValidation = {
  createInquiry: [
    body('user_id').isInt().withMessage('Valid user ID is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority level'),
    validate
  ],
  respondToInquiry: [
    param('id').isInt().withMessage('Valid inquiry ID is required'),
    body('responder_id').isInt().withMessage('Valid responder ID is required'),
    body('message').notEmpty().withMessage('Response message is required'),
    validate
  ]
};

module.exports = {
  contributionValidation,
  investmentValidation,
  userSettingsValidation,
  supportValidation
}; 