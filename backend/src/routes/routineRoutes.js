import express from 'express';
import { 
  getCurrentRoutine, 
  getTodaysTasks, 
  completeTask, 
  getRoutineStats 
} from '../controllers/routineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/current', getCurrentRoutine);
router.get('/today', getTodaysTasks);
router.get('/stats', getRoutineStats);
router.post('/complete-task', completeTask);

export default router;