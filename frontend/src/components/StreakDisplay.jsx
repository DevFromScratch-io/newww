import React from 'react';
import { motion } from 'framer-motion';

const StreakDisplay = ({ currentStreak = 0, longestStreak = 0, className = "" }) => {
  const getFireEmojis = (streak) => {
    if (streak === 0) return '';
    if (streak < 3) return '🔥';
    if (streak < 7) return '🔥🔥';
    if (streak < 14) return '🔥🔥🔥';
    if (streak < 30) return '🔥🔥🔥🔥';
    return '🔥🔥🔥🔥🔥';
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start!";
    if (streak < 7) return "Building momentum!";
    if (streak < 14) return "You're on fire!";
    if (streak < 30) return "Incredible dedication!";
    return "Legendary streak!";
  };

  return (
    <div className={`bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl mr-2">{getFireEmojis(currentStreak)}</span>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-orange-600"
          >
            {currentStreak}
          </motion.div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {getStreakMessage(currentStreak)}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-orange-100 pt-2">
          <span>Current Streak</span>
          <span>Best: {longestStreak} days</span>
        </div>
      </div>
    </div>
  );
};

export default StreakDisplay;