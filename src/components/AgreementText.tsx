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
      const isAtEnd = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      
      if (isAtEnd && !isScrolledToEnd) {
        setIsScrolledToEnd(true);
        setShowScrollHint(false);
        onScrolledToEnd(true);
      }
    };

    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollEnd);
      // Check initial state
      setTimeout(checkScrollEnd, 100);
      
      return () => scrollElement.removeEventListener('scroll', checkScrollEnd);
    }
  }, [isScrolledToEnd, onScrolledToEnd]);

  return (
    <div className="relative mb-4 sm:mb-6">
      <ScrollArea 
        ref={scrollAreaRef}
        className="h-[40vh] sm:h-[50vh] rounded-lg border border-naga-teal/20 bg-gray-900/50 p-3 sm:p-4"
      >
        <div className="text-gray-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm pr-2">
          {getAgreementText(language)}
        </div>
      </ScrollArea>
      
      {/* Индикатор прокрутки */}
      {showScrollHint && (
        <div className="absolute bottom-2 right-2 bg-naga-teal/90 text-white px-2 py-1 rounded-md text-xs flex items-center animate-pulse">
          <Icon name="ArrowDown" size={12} className="mr-1" />
          <span className="hidden sm:inline">Прокрутите до конца</span>
          <span className="sm:hidden">↓</span>
        </div>
      )}
      
      {/* Индикатор завершения чтения */}
      {isScrolledToEnd && (
        <div className="absolute bottom-2 right-2 bg-green-500/90 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <Icon name="Check" size={12} className="mr-1" />
          <span className="hidden sm:inline">Прочитано</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}
    </div>
  );
};

export default AgreementText;