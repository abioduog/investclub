const express = require('express');
const router = express.Router();

// Temporary role switcher
router.get('/switch-role/:role', (req, res) => {
  const { role } = req.params;
  
  if (!['admin', 'member'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  // In a real app, this would involve JWT tokens
  // For now, we'll just send back the role
  res.json({
    success: true,
    role,
    message: `Switched to ${role} role`
  });
});

module.exports = router; 