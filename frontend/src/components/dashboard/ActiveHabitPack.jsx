import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Package, Trophy } from 'lucide-react';
import API from '../../api';
import DynamicTask from '../tasks/DynamicTask.jsx';

// Helper functions for task naming and icons
const getTaskName = (taskType) => {
  switch (taskType) {
    case 'textInput': return 'Reflection';
    case 'multipleChoice': return 'Quiz';
    case 'memorySequence': return 'Memory';
    default: return 'Task';
  }
};

const getTaskIcon = (taskType) => {
  switch (taskType) {
    case 'textInput': return '✍️';
    case 'multipleChoice': return '🧩';
    case 'memorySequence': return '🎯';
    default: return '📝';
  }
};

const ActiveHabitPack = () => {
  const [activePack, setActivePack] = useState(null);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchActivePack = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get('/habit-packs/active');
      setActivePack(data);
      
      if (data && data.progress) {
        // Get today's completed tasks
        const today = new Date().toISOString().split('T')[0];
        const todayProgress = data.progress.find(p => p.date === today);
        setCompletedTasks(todayProgress?.completedTasks || []);
        setCurrentTaskIndex(todayProgress?.completedTasks?.length || 0);
      } else {
        // Reset state if no valid data
        setCompletedTasks([]);
        setCurrentTaskIndex(0);
      }
      
      // Fetch today's tasks
      const tasksResponse = await API.get('/habit-packs/daily-task');
      if (tasksResponse.data && tasksResponse.data.tasks) {
        setDailyTasks(tasksResponse.data.tasks);
      }
    } catch (err) {
      console.error("Failed to fetch active pack", err);
      if (err.response?.status === 404) {
        setActivePack(null); // No active pack
      } else {
        setError("Could not load your current habit pack.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePack();
  }, []);

  const handleTaskComplete = async (taskData) => {
    setIsSubmitting(true);
    try {
      // Mark task as complete
      await API.post('/habit-packs/progress', {
        taskIndex: currentTaskIndex,
        taskData
      });

      // Update local state
      const newCompletedTasks = [...completedTasks, currentTaskIndex];
      setCompletedTasks(newCompletedTasks);
      setCurrentTaskIndex(newCompletedTasks.length);

      // Check if all tasks completed
      if (newCompletedTasks.length === dailyTasks.length) {
        try {
          await API.post('/achievements/unlock', { 
            type: 'daily-complete' 
          });
        } catch (achievementErr) {
          console.error('Failed to unlock achievement:', achievementErr);
        }
      }

      // Refresh pack data
      await fetchActivePack();
    } catch (err) {
      console.error('Failed to complete task:', err);
      setError('Failed to save your progress. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchActivePack}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!activePack) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Habit Pack</h3>
        <p className="text-gray-600 mb-4">
          You haven't started a habit pack yet. Why not start one today?
        </p>
        <Link to="/habit-packs">
          <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
            Browse Packs
          </button>
        </Link>
      </div>
    );
  }

  const allTasksCompleted = completedTasks.length === dailyTasks.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Daily Tasks</h3>
          <p className="text-gray-600">
            {activePack?.name || 'Loading...'} • Day {activePack?.currentDay || 1}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {completedTasks.length}/{dailyTasks.length}
            </div>
            <div className="text-xs text-gray-500">completed</div>
          </div>
          {allTasksCompleted && (
            <Trophy className="w-8 h-8 text-yellow-500" />
          )}
        </div>
      </div>

      {allTasksCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Amazing work!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            You've completed all your daily tasks! Come back tomorrow for new challenges.
          </p>
        </div>
      )}

      {/* Task Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {dailyTasks.map((task, index) => {
            const isCompleted = completedTasks.includes(index);
            const isCurrent = index === currentTaskIndex && !allTasksCompleted;
            const isLocked = index > currentTaskIndex;

            return (
              <div key={task.taskId || index} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white animate-pulse' 
                        : isLocked
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    getTaskIcon(task.taskType)
                  )}
                </div>
                <span className={`text-xs text-center ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {getTaskName(task.taskType)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedTasks.length / dailyTasks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Task */}
      {!allTasksCompleted && currentTaskIndex < dailyTasks.length && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Current Task: {getTaskName(dailyTasks[currentTaskIndex].taskType)}
          </h4>
          
          <DynamicTask 
            task={dailyTasks[currentTaskIndex]}
            onComplete={handleTaskComplete}
            isCompleted={false}
            disabled={isSubmitting}
          />
        </div>
      )}

      {/* Completed Tasks Summary */}
      {completedTasks.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h4 className="text-md font-medium text-gray-700 mb-2">Completed Today:</h4>
          <div className="flex flex-wrap gap-2">
            {completedTasks.map((taskIndex) => (
              <span
                key={taskIndex}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {getTaskName(dailyTasks[taskIndex]?.taskType)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveHabitPack;
