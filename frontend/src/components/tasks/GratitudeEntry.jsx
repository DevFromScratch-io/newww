import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const GratitudeEntry = ({ onComplete, isCompleted = false }) => {
  const [gratitudeText, setGratitudeText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gratitudeText.trim() === '') {
      setError('Please write what you\'re grateful for.');
      return;
    }
    if (gratitudeText.trim().length < 10) {
      setError('Please write at least a few words about what you\'re grateful for.');
      return;
    }
    setError('');
    onComplete({
      type: 'gratitude-entry',
      data: {
        gratitudeText: gratitudeText.trim(),
        timestamp: new Date().toISOString()
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-pink-600" />
          <span className="text-pink-800 font-medium">Gratitude Entry Complete!</span>
        </div>
        <p className="text-pink-700 text-sm mt-2">
          Thank you for taking time to appreciate the good in your life. Gratitude strengthens mental well-being!
        </p>
      </div>
    );
  }

  const prompts = [
    "What made you smile today?",
    "Who in your life are you thankful for?",
    "What simple pleasure brought you joy recently?",
    "What skill or ability are you grateful to have?",
    "What in nature do you appreciate?"
  ];

  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-6 h-6 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-800">Gratitude Moment</h3>
      </div>
      
      <p className="text-gray-600 mb-2">
        Take a moment to reflect on something positive in your life.
      </p>
      
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-4">
        <p className="text-pink-800 text-sm font-medium">💭 Reflection prompt:</p>
        <p className="text-pink-700 italic">{randomPrompt}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you grateful for today?
          </label>
          <textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="I'm grateful for..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {gratitudeText.length}/500 characters
            </span>
            {gratitudeText.length >= 10 && (
              <span className="text-xs text-green-600">✓ Good length</span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
        >
          Save Gratitude Entry
        </button>
      </form>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-xs">
          💡 <strong>Did you know?</strong> Regular gratitude practice can improve sleep, boost mood, and strengthen relationships.
        </p>
      </div>
    </div>
  );
};

export default GratitudeEntry;