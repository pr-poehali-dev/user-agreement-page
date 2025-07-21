import React from 'react';
import { Language } from './types';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex bg-gray-800/70 rounded-lg p-1 backdrop-blur-sm border border-naga-teal/20">
        <button
          onClick={() => onLanguageChange('ru')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            language === 'ru'
              ? 'bg-naga-teal text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          🇷🇺 RU
        </button>
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
            language === 'en'
              ? 'bg-naga-teal text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          🇬🇧 EN
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;