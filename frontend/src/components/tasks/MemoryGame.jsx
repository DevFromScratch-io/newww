import React, { useState, useEffect } from 'react';
import { Brain, RotateCcw } from 'lucide-react';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const COLOR_CLASSES = {
  red: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  blue: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
  green: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
  yellow: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
};

const MemoryGame = ({ onComplete, isCompleted = false }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [level, setLevel] = useState(1);

  // Generate initial 3-step sequence
  useEffect(() => {
    if (!gameStarted && !isCompleted) {
      generateSequence();
    }
  }, [gameStarted, isCompleted]);

  const generateSequence = () => {
    const newSequence = [];
    for (let i = 0; i < 3; i++) {
      newSequence.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }
    setSequence(newSequence);
  };

  const showSequence = async () => {
    setIsShowingSequence(true);
    setUserSequence([]);
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveColor(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(null);
    }
    
    setIsShowingSequence(false);
  };

  const handleColorClick = (color) => {
    if (isShowingSequence || gameWon) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if the move is correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong move - reset
      setUserSequence([]);
      setTimeout(() => {
        alert('Wrong sequence! Try again.');
        showSequence();
      }, 300);
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      setGameWon(true);
      setTimeout(() => {
        onComplete({
          type: 'memory-game',
          data: {
            completed: true,
            sequenceLength: sequence.length,
            attempts: 1
          }
        });
      }, 500);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    showSequence();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameWon(false);
    setUserSequence([]);
    setActiveColor(null);
    generateSequence();
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Memory Game Complete!</span>
        </div>
        <p className="text-green-700 text-sm mt-2">
          Excellent memory skills! You've successfully completed the sequence.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-800">Memory Challenge</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Watch the sequence of colors, then repeat it by clicking the buttons in the same order.
      </p>

      {gameWon && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-md mb-4">
          🎉 Perfect! You completed the sequence correctly!
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorClick(color)}
            disabled={isShowingSequence || !gameStarted || gameWon}
            className={`
              h-20 rounded-lg transition-all duration-150 border-2 border-gray-300
              ${COLOR_CLASSES[color]}
              ${activeColor === color ? 'scale-95 brightness-125' : ''}
              ${isShowingSequence || !gameStarted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Start Memory Game
          </button>
        ) : (
          <div className="space-y-2">
            {isShowingSequence && (
              <p className="text-purple-600 font-medium">Watch the sequence...</p>
            )}
            {!isShowingSequence && !gameWon && (
              <p className="text-gray-600">
                Your turn: {userSequence.length}/{sequence.length}
              </p>
            )}
            <button
              onClick={resetGame}
              className="flex items-center space-x-1 mx-auto text-gray-500 hover:text-gray-700 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryGame;