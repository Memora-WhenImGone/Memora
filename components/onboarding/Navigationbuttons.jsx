import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationButtons = ({ currentStage, onBack, onContinue, buttonText = 'Continue' }) => {
  const isActivateStage = currentStage === 4;
  
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-12">
      <button
        onClick={onBack}
        disabled={currentStage === 1}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          currentStage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <button
        onClick={onContinue}
        className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
          isActivateStage
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {buttonText}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NavigationButtons;