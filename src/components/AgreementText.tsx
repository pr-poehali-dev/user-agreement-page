import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Language } from './types';
import { getAgreementText } from './translations';

interface AgreementTextProps {
  language: Language;
}

const AgreementText: React.FC<AgreementTextProps> = ({ language }) => {
  return (
    <ScrollArea className="h-[50vh] sm:h-[60vh] mb-4 sm:mb-6 rounded-lg border border-naga-teal/20 bg-gray-900/50 p-3 sm:p-6">
      <div className="text-gray-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
        {getAgreementText(language)}
      </div>
    </ScrollArea>
  );
};

export default AgreementText;