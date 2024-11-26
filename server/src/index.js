const express = require('express');
const cors = require('cors');
const db = require('./database');
const userRoutes = require('./routes/users');
const contributionRoutes = require('./routes/contributions');
const investmentRoutes = require('./routes/investments');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5008;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/investments', investmentRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Add error handling for the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy. Trying ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('Server error:', err);
  }
}); 