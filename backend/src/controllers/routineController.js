import asyncHandler from 'express-async-handler';
import UserHabitPack from '../models/userHabitPackModel.js';
import HabitPack from '../models/habitPackModel.js';

// @desc    Get user's current routine
// @route   GET /api/routines/current
// @access  Private
const getCurrentRoutine = asyncHandler(async (req, res) => {
  const userHabitPacks = await UserHabitPack.find({ 
    userId: req.user.id,
    isActive: true 
  }).populate('habitPackId');

  if (!userHabitPacks || userHabitPacks.length === 0) {
    return res.status(404).json({ message: 'No active routines found' });
  }

  res.json(userHabitPacks);
});

// @desc    Get today's tasks
// @route   GET /api/routines/today
// @access  Private
const getTodaysTasks = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const userHabitPacks = await UserHabitPack.find({
    userId: req.user.id,
    isActive: true,
    createdAt: { $lt: endOfDay }
  }).populate('habitPackId');

  let todaysTasks = [];

  userHabitPacks.forEach(userPack => {
    if (userPack.habitPackId && userPack.habitPackId.tasks) {
      const currentDay = userPack.getCurrentDay();
      if (currentDay <= userPack.habitPackId.tasks.length) {
        const todaysTask = userPack.habitPackId.tasks[currentDay - 1];
        todaysTasks.push({
          packId: userPack.habitPackId._id,
          packName: userPack.habitPackId.name,
          task: todaysTask,
          currentDay: currentDay,
          completed: userPack.completedDays.includes(currentDay),
          userPackId: userPack._id
        });
      }
    }
  });

  res.json(todaysTasks);
});

// @desc    Mark task as completed
// @route   POST /api/routines/complete-task
// @access  Private
const completeTask = asyncHandler(async (req, res) => {
  const { userPackId, day } = req.body;

  const userHabitPack = await UserHabitPack.findOne({
    _id: userPackId,
    userId: req.user.id
  });

  if (!userHabitPack) {
    res.status(404);
    throw new Error('Habit pack not found');
  }

  // Check if already completed
  if (userHabitPack.completedDays.includes(day)) {
    return res.status(400).json({ message: 'Task already completed' });
  }

  // Add to completed days
  userHabitPack.completedDays.push(day);
  
  // Update streak
  userHabitPack.currentStreak = userHabitPack.calculateCurrentStreak();
  
  // Update longest streak if current is higher
  if (userHabitPack.currentStreak > userHabitPack.longestStreak) {
    userHabitPack.longestStreak = userHabitPack.currentStreak;
  }

  await userHabitPack.save();

  res.json({
    message: 'Task completed successfully',
    currentStreak: userHabitPack.currentStreak,
    longestStreak: userHabitPack.longestStreak
  });
});

// @desc    Get routine stats
// @route   GET /api/routines/stats
// @access  Private
const getRoutineStats = asyncHandler(async (req, res) => {
  const userHabitPacks = await UserHabitPack.find({ 
    userId: req.user.id 
  }).populate('habitPackId');

  let totalStreaks = 0;
  let longestStreak = 0;
  let completedPacks = 0;
  let activePacks = 0;

  userHabitPacks.forEach(pack => {
    totalStreaks += pack.currentStreak;
    if (pack.longestStreak > longestStreak) {
      longestStreak = pack.longestStreak;
    }
    if (pack.isCompleted) {
      completedPacks++;
    }
    if (pack.isActive) {
      activePacks++;
    }
  });

  res.json({
    totalPacks: userHabitPacks.length,
    activePacks,
    completedPacks,
    totalCurrentStreaks: totalStreaks,
    longestStreak
  });
});

export { 
  getCurrentRoutine, 
  getTodaysTasks, 
  completeTask, 
  getRoutineStats 
};