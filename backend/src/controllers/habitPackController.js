import asyncHandler from 'express-async-handler';
import HabitPack from '../models/habitPackModel.js';
import UserHabitPack from '../models/userHabitPackModel.js';

// Helper function to check if two dates are on the same day
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// @desc    Get all available habit packs
const getAllPacks = asyncHandler(async (req, res) => {
  const packs = await HabitPack.find({});
  res.json(packs);
});

// @desc    Start a new habit pack for the user
const startPack = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const packId = req.params.id;

  const existingPack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' });
  if (existingPack) {
    res.status(400);
    throw new Error('You already have a habit pack in progress.');
  }

  const packTemplate = await HabitPack.findById(packId);
  if (!packTemplate) {
    res.status(404);
    throw new Error('Habit pack not found.');
  }

  // --- NEW LOGIC: Generate tasks for Day 1 ---
  const shuffledTasks = packTemplate.taskPool.sort(() => 0.5 - Math.random());
  const todayTasks = shuffledTasks.slice(0, packTemplate.tasksPerDay).map(task => ({
    taskId: task._id,
    prompt: task.prompt,
    taskType: task.taskType,
    options: task.options,
  }));

  const userHabitPack = await UserHabitPack.create({
    user: userId,
    habitPack: packId,
    dailyProgress: [{ day: 1, tasks: todayTasks }],
  });

  res.status(201).json(userHabitPack);
});

// @desc    Get the user's daily tasks for their active pack
const getDailyTasks = asyncHandler(async (req, res) => {
  const activePack = await UserHabitPack.findOne({ user: req.user._id, status: 'in-progress' })
    .populate('habitPack');

  if (!activePack) {
    return res.json(null); // No active pack
  }

  const today = new Date();
  const lastProgress = activePack.dailyProgress[activePack.dailyProgress.length - 1];
  
  // Check if the last entry was from a previous day
  if (lastProgress && !isSameDay(new Date(lastProgress.createdAt), today)) {
    // It's a new day, so generate new tasks
    const packTemplate = activePack.habitPack;
    const shuffledTasks = packTemplate.taskPool.sort(() => 0.5 - Math.random());
    const newDayTasks = shuffledTasks.slice(0, packTemplate.tasksPerDay).map(task => ({
      taskId: task._id,
      prompt: task.prompt,
      taskType: task.taskType,
      options: task.options,
    }));
    
    activePack.dailyProgress.push({
      day: lastProgress.day + 1,
      tasks: newDayTasks,
    });
    await activePack.save();
  }
  
  // Return the latest daily progress
  res.json(activePack.dailyProgress[activePack.dailyProgress.length - 1]);
});

// @desc    Submit a response for a specific task
const submitTaskResponse = asyncHandler(async (req, res) => {
  const { taskId, response } = req.body;
  const userId = req.user._id;

  const activePack = await UserHabitPack.findOne({ user: userId, status: 'in-progress' })
    .populate('habitPack');

  if (!activePack) {
    res.status(404);
    throw new Error('No active habit pack found.');
  }
  
  const todayProgress = activePack.dailyProgress[activePack.dailyProgress.length - 1];
  const taskToComplete = todayProgress.tasks.find(t => t.taskId.toString() === taskId);
  const originalTask = activePack.habitPack.taskPool.id(taskId);

  if (!taskToComplete || !originalTask) {
    res.status(404);
    throw new Error('Task not found for today.');
  }

  // --- Verification Logic ---
  let isCorrect = null;
  if (originalTask.correctAnswer) {
    isCorrect = response.toLowerCase() === originalTask.correctAnswer.toLowerCase();
  }

  // Add the entry
  todayProgress.entries.push({
    taskId: taskId,
    taskType: originalTask.taskType,
    response: response,
    isCorrect: isCorrect,
  });

  // Check if all of today's tasks are now complete
  if (todayProgress.entries.length >= todayProgress.tasks.length) {
    todayProgress.isCompleted = true;
  }

  await activePack.save();
  res.json(todayProgress); // Send back the updated progress for today
});


// @desc    Get user's active habit pack
// @route   GET /api/habit-packs/active  
// @access  Private
const getActivePack = asyncHandler(async (req, res) => {
  const activePack = await UserHabitPack.findOne({ 
    user: req.user._id, 
    status: 'in-progress' 
  }).populate('habitPack');

  if (!activePack) {
    return res.status(404).json({ message: 'No active habit pack found' });
  }

  // Get today's progress
  const today = new Date().toISOString().split('T')[0];
  const todayProgress = activePack.dailyProgress.find(p => 
    new Date(p.createdAt).toISOString().split('T')[0] === today
  );

  const response = {
    _id: activePack._id,
    name: activePack.habitPack.name,
    currentDay: activePack.currentDay,
    progress: activePack.dailyProgress.map(p => ({
      date: new Date(p.createdAt).toISOString().split('T')[0],
      completedTasks: p.entries ? p.entries.map((_, index) => index) : []
    }))
  };

  res.json(response);
});

// @desc    Mark task progress
// @route   POST /api/habit-packs/progress
// @access  Private
const markTaskProgress = asyncHandler(async (req, res) => {
  const { taskIndex, taskData } = req.body;
  const userId = req.user._id;

  const activePack = await UserHabitPack.findOne({ 
    user: userId, 
    status: 'in-progress' 
  }).populate('habitPack');

  if (!activePack) {
    res.status(404);
    throw new Error('No active habit pack found.');
  }

  const today = new Date().toISOString().split('T')[0];
  let todayProgress = activePack.dailyProgress.find(p => 
    new Date(p.createdAt).toISOString().split('T')[0] === today
  );

  // If no progress for today, create it
  if (!todayProgress) {
    todayProgress = {
      day: activePack.currentDay,
      createdAt: new Date(),
      entries: []
    };
    activePack.dailyProgress.push(todayProgress);
  }

  // Add task completion entry
  todayProgress.entries.push({
    taskIndex,
    taskType: taskData.type,
    response: taskData.data,
    completedAt: new Date()
  });

  // Update current day if all tasks completed
  if (todayProgress.entries.length === 5) { // 5 daily tasks
    activePack.currentDay += 1;
    
    // Check if pack is completed
    if (activePack.currentDay > activePack.habitPack.duration) {
      activePack.status = 'completed';
    }
  }

  await activePack.save();
  res.json({ success: true, progress: todayProgress });
});

export { getAllPacks, startPack, getDailyTasks, submitTaskResponse, getActivePack, markTaskProgress };
