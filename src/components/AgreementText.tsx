import React, { useRef, useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { Language } from './types';
import { getAgreementText } from './translations';

interface AgreementTextProps {
  language: Language;
  onScrolledToEnd: (scrolled: boolean) => void;
}

const AgreementText: React.FC<AgreementTextProps> = ({ language, onScrolledToEnd }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const checkScrollEnd = () => {
      const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (!scrollElement) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const tolerance = 10;
      const scrolledToEnd = scrollTop + clientHeight >= scrollHeight - tolerance;
      
      if (scrolledToEnd && !isScrolledToEnd) {
        setIsScrolledToEnd(true);
        setShowScrollHint(false);
        onScrolledToEnd(true);
      }
    };

    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollEnd);
      checkScrollEnd(); // Проверяем сразу
      
      return () => scrollElement.removeEventListener('scroll', checkScrollEnd);
    }
  }, [isScrolledToEnd, onScrolledToEnd]);

  const agreementText = getAgreementText(language);

  return (
    <div className="relative mb-4">
      <ScrollArea className="h-40 sm:h-48 w-full rounded-md border border-gray-600" ref={scrollAreaRef}>
        <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3 sm:space-y-4">
          {agreementText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-justify">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </ScrollArea>
      
      {/* Индикатор прокрутки */}
      {showScrollHint && (
        <div className="absolute bottom-2 right-2 bg-naga-teal/90 text-white px-2 py-1 rounded-md text-xs flex items-center animate-pulse">
          <Icon name="ArrowDown" size={12} className="mr-1 hidden sm:block" />
          <span className="hidden sm:inline">Прокрутите до конца</span>
          <span className="sm:hidden">↓</span>
        </div>
      )}
      
      {/* Индикатор завершения чтения */}
      {isScrolledToEnd && (
        <div className="absolute bottom-2 right-2 bg-green-500/90 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <Icon name="Check" size={12} className="mr-1 hidden sm:block" />
          <span className="hidden sm:inline">Прочитано</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}
    </div>
  );
};

export default AgreementText;