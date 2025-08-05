import React, { useState } from 'react';
import { CheckCircle, Edit3, HelpCircle } from 'lucide-react';

const DynamicTask = ({ task, onComplete, isCompleted = false, disabled = false }) => {
  const [response, setResponse] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    let finalResponse = '';
    
    if (task.taskType === 'textInput') {
      if (!response.trim()) {
        setError('Please enter your response.');
        return;
      }
      if (task.minWords && response.trim().split(' ').length < task.minWords) {
        setError(`Please write at least ${task.minWords} words.`);
        return;
      }
      finalResponse = response.trim();
    } else if (task.taskType === 'multipleChoice') {
      if (!selectedOption) {
        setError('Please select an option.');
        return;
      }
      finalResponse = selectedOption;
    }

    onComplete({
      type: task.taskType,
      data: {
        response: finalResponse,
        taskId: task.taskId,
        prompt: task.prompt
      }
    });
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Task Complete!</span>
        </div>
        <p className="text-green-700 text-sm mt-2">
          Great job! You've completed this task.
        </p>
      </div>
    );
  }

  const renderTaskInput = () => {
    switch (task.taskType) {
      case 'textInput':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Your Response:
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
              rows={4}
            />
          </div>
        );

      case 'multipleChoice':
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select your answer:
            </label>
            {task.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="taskOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 disabled:opacity-50"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            Unsupported task type: {task.taskType}
          </div>
        );
    }
  };

  const getTaskIcon = () => {
    switch (task.taskType) {
      case 'textInput': return <Edit3 className="w-6 h-6 text-blue-500" />;
      case 'multipleChoice': return <HelpCircle className="w-6 h-6 text-purple-500" />;
      default: return <CheckCircle className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        {getTaskIcon()}
        <h3 className="text-lg font-semibold text-gray-800">
          {task.taskType === 'textInput' ? 'Reflection Task' : 'Quiz Question'}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        {task.prompt}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderTaskInput()}
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? 'Submitting...' : 'Complete Task'}
        </button>
      </form>
    </div>
  );
};

export default DynamicTask;