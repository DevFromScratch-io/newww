import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

const PerspectiveShift = ({ onComplete, isCompleted = false }) => {
  const [negativeThought, setNegativeThought] = useState('');
  const [reframedThought, setReframedThought] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (negativeThought.trim() === '' || reframedThought.trim() === '') {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    onComplete({
      type: 'perspective-shift',
      data: {
        negativeThought: negativeThought.trim(),
        reframedThought: reframedThought.trim()
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Perspective Shift Complete!</span>
        </div>
        <p className="text-green-700 text-sm mt-2">
          Great job reframing that thought! You're building stronger mental resilience.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-800">Perspective Shift</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Think of a negative thought you've had recently. Write it down, then reframe it in a more positive or balanced way.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Negative thought or worry:
          </label>
          <textarea
            value={negativeThought}
            onChange={(e) => setNegativeThought(e.target.value)}
            placeholder="e.g., 'I always mess things up'"
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reframed, balanced thought:
          </label>
          <textarea
            value={reframedThought}
            onChange={(e) => setReframedThought(e.target.value)}
            placeholder="e.g., 'Sometimes I make mistakes, but I also do many things well and I can learn from this'"
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Complete Task
        </button>
      </form>
    </div>
  );
};

export default PerspectiveShift;