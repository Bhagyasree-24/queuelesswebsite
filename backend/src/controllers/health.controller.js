import { getDatabaseStatus } from '../config/db.js';

export function getHealth(_req, res) {
  const database = getDatabaseStatus();

  res.status(200).json({
    success: true,
    message: 'QueueLess backend is running',
    database,
  });
}
