
import React from 'react';

interface Option {
  value: string;
  label: string;
}
interface LanguageSelectorProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="w-full">
      <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={label}
          value={value}
          onChange={onChange}
          className="w-full pl-3 pr-10 py-3 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
