
import React from 'react';

interface AdvancedOptionsProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ instructions, onInstructionsChange }) => {
  return (
    <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700 transition-all duration-300 ease-in-out">
      <label htmlFor="custom-instructions" className="block text-sm font-medium text-gray-300">
        Custom Instructions (Optional)
      </label>
      <textarea
        id="custom-instructions"
        value={instructions}
        onChange={(e) => onInstructionsChange(e.target.value)}
        rows={3}
        className="w-full p-3 font-sans text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 resize-y"
        placeholder="e.g., 'Make the tone more poetic and romantic', 'Use modern, casual slang', 'Focus on the dominant character's perspective'"
      />
      <p className="text-xs text-gray-500">
        Provide specific instructions to guide the AI's tone, style, or focus for the translation.
      </p>
    </div>
  );
};

export default AdvancedOptions;
