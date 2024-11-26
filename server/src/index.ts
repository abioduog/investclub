import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload';
import { initDb } from './lib/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database
initDb().catch(console.error);

// Routes
app.use('/api/upload', uploadRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 