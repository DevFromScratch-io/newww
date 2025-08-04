import express from 'express';
import { unlockAchievement, getMyBadges } from '../controllers/badgeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all user achievements (same as badges)
router.route('/').get(protect, getMyBadges);

// Route to unlock achievements
router.route('/unlock').post(protect, unlockAchievement);

export default router;