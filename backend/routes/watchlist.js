import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's watchlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [watchlist] = await pool.query(
      'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    res.json({ watchlist });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Server error fetching watchlist' });
  }
});

// Add to watchlist
router.post('/add',
  authenticateToken,
  [
    body('media_type').isIn(['movie', 'tv']),
    body('media_id').isInt(),
    body('title').notEmpty(),
    body('poster_path').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { media_type, media_id, title, poster_path } = req.body;

      await pool.query(
        `INSERT INTO watchlist (user_id, media_type, media_id, title, poster_path) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), poster_path = VALUES(poster_path)`,
        [req.user.id, media_type, media_id, title, poster_path || null]
      );

      res.status(201).json({ message: 'Added to watchlist successfully' });
    } catch (error) {
      console.error('Add to watchlist error:', error);
      res.status(500).json({ error: 'Server error adding to watchlist' });
    }
  }
);

// Remove from watchlist
router.delete('/remove/:mediaType/:mediaId', authenticateToken, async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    await pool.query(
      'DELETE FROM watchlist WHERE user_id = ? AND media_type = ? AND media_id = ?',
      [req.user.id, mediaType, mediaId]
    );

    res.json({ message: 'Removed from watchlist successfully' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Server error removing from watchlist' });
  }
});

// Check if item is in watchlist
router.get('/check/:mediaType/:mediaId', authenticateToken, async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const [items] = await pool.query(
      'SELECT id FROM watchlist WHERE user_id = ? AND media_type = ? AND media_id = ?',
      [req.user.id, mediaType, mediaId]
    );

    res.json({ inWatchlist: items.length > 0 });
  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ error: 'Server error checking watchlist' });
  }
});

export default router;
