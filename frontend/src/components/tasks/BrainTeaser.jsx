import React, { useState, useEffect } from 'react';
import { Puzzle } from 'lucide-react';

const PUZZLES = [
  {
    question: "What comes next in this sequence: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "38", "44"],
    answer: "42",
    explanation: "Each number follows the pattern n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42"
  },
  {
    question: "If you rearrange the letters 'CALM' + 'MIND', you can make which word?",
    options: ["MEDICAN", "CLAIMED", "DECIMAL", "MAGICAL"],
    answer: "CLAIMED",
    explanation: "CALM + MIND contains the letters C-L-A-I-M-E-D when rearranged."
  },
  {
    question: "A man lives on the 20th floor. Every morning he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest of the way... except on rainy days, when he takes the elevator all the way to the 20th floor. Why?",
    options: ["He's exercising", "He's too short to reach the 20th floor button", "The elevator is broken", "He forgets his key"],
    answer: "He's too short to reach the 20th floor button",
    explanation: "He can only reach up to the 10th floor button. On rainy days, he has an umbrella to help him reach higher buttons."
  },
  {
    question: "What number should replace the question mark? 8, 11, 16, 23, 32, ?",
    options: ["43", "41", "45", "47"],
    answer: "43",
    explanation: "The differences between consecutive numbers are: 3, 5, 7, 9, 11 (odd numbers). So 32 + 11 = 43."
  }
];

const BrainTeaser = ({ onComplete, isCompleted = false }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!isCompleted) {
      // Select a random puzzle
      const randomPuzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
      setCurrentPuzzle(randomPuzzle);
    }
  }, [isCompleted]);

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === currentPuzzle.answer;
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setTimeout(() => {
        onComplete({
          type: 'brain-teaser',
          data: {
            puzzle: currentPuzzle.question,
            selectedAnswer,
            isCorrect: true,
            attempts: 1
          }
        });
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Puzzle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Brain Teaser Complete!</span>
        </div>
        <p className="text-green-700 text-sm mt-2">
          Excellent problem-solving! Your cognitive flexibility is improving.
        </p>
      </div>
    );
  }

  if (!currentPuzzle) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">Loading puzzle...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Puzzle className="w-6 h-6 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-800">Brain Teaser</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Challenge your logical thinking with this puzzle:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
        <p className="text-indigo-900 font-medium">{currentPuzzle.question}</p>
      </div>

      <div className="space-y-2 mb-4">
        {currentPuzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`
              w-full text-left p-3 rounded-lg border transition-all
              ${selectedAnswer === option 
                ? isAnswered 
                  ? isCorrect 
                    ? 'bg-green-100 border-green-300 text-green-800' 
                    : 'bg-red-100 border-red-300 text-red-800'
                  : 'bg-indigo-100 border-indigo-300 text-indigo-800'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }
              ${isAnswered && option === currentPuzzle.answer && selectedAnswer !== option
                ? 'bg-green-100 border-green-300 text-green-800'
                : ''
              }
              ${isAnswered ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {option}
            {isAnswered && option === currentPuzzle.answer && (
              <span className="ml-2 text-green-600">✓</span>
            )}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
          <p className="text-blue-800 text-sm">{currentPuzzle.explanation}</p>
        </div>
      )}

      <div className="text-center">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : isCorrect ? (
          <div className="text-green-600 font-medium">
            🎉 Correct! Well done!
          </div>
        ) : (
          <button
            onClick={handleTryAgain}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default BrainTeaser;