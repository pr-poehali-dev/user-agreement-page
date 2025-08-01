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
    <div className="relative mb-6">
      <ScrollArea className="h-64 sm:h-80 lg:h-96 w-full rounded-lg border border-gray-500/50 bg-gray-900/50 backdrop-blur-sm shadow-lg" ref={scrollAreaRef}>
        <div className="p-4 sm:p-6 lg:p-8 text-sm sm:text-base lg:text-lg text-gray-100 leading-relaxed space-y-4 sm:space-y-5 lg:space-y-6">
          {agreementText.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-justify first-letter:text-xl first-letter:font-semibold first-letter:text-naga-teal">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </ScrollArea>
      
      {/* Индикатор прокрутки */}
      {showScrollHint && (
        <div className="absolute bottom-3 right-3 bg-naga-teal/95 text-white px-3 py-2 rounded-lg text-sm flex items-center animate-pulse shadow-lg backdrop-blur-sm">
          <Icon name="ArrowDown" size={14} className="mr-2 hidden sm:block" />
          <span className="hidden sm:inline">Прокрутите до конца</span>
          <span className="sm:hidden">↓</span>
        </div>
      )}
      
      {/* Индикатор завершения чтения */}
      {isScrolledToEnd && (
        <div className="absolute bottom-3 right-3 bg-green-500/95 text-white px-3 py-2 rounded-lg text-sm flex items-center shadow-lg backdrop-blur-sm">
          <Icon name="Check" size={14} className="mr-2 hidden sm:block" />
          <span className="hidden sm:inline">Прочитано</span>
          <span className="sm:hidden">✓</span>
        </div>
      )}
    </div>
  );
};

export default AgreementText;