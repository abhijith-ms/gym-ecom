import express from 'express';
const router = express.Router();

// Just a placeholder route
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Payments temporarily disabled.' });
});

export default router; 