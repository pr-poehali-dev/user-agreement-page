import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AgreementText from '@/components/AgreementText';
import AgreementForm from '@/components/AgreementForm';
import { Language, BrowserFingerprint } from '@/components/types';
import { translations } from '@/components/translations';

const Index = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);

  const t = translations[language];

  const handleFingerprintCollected = (fingerprintData: BrowserFingerprint) => {
    setFingerprint(fingerprintData);
  };

  const handleScrolledToEnd = (scrolled: boolean) => {
    setIsScrolledToEnd(scrolled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-naga-dark via-gray-900 to-naga-charcoal text-white">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 max-w-4xl">
        {/* Переключатель языков */}
        <div className="mb-3 sm:mb-4">
          <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
        </div>

        {/* Заголовок с иконкой дракона */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
            <div className="text-3xl sm:text-6xl mb-2 sm:mb-0 sm:mr-4">🐉</div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-naga-gold mb-1 sm:mb-2">
                {t.title}
              </h1>
              <p className="text-naga-teal text-sm sm:text-lg">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Основная карточка */}
        <Card className="bg-gray-800/90 border-naga-teal/30 backdrop-blur-sm shadow-xl">
          <div className="p-3 sm:p-6">
            {/* Прокручиваемый текст соглашения */}
            <AgreementText 
              language={language} 
              onScrolledToEnd={handleScrolledToEnd}
            />

            {/* Форма согласия */}
            <AgreementForm
              language={language}
              translations={t}
              isScrolledToEnd={isScrolledToEnd}
              onFingerprintCollected={handleFingerprintCollected}
            />
          </div>
        </Card>

        {/* Футер */}
        <div className="text-center mt-4 sm:mt-8 text-gray-400 text-xs sm:text-sm px-2 sm:px-4">
          <p>{t.copyrightText}</p>
          <p className="mt-1 flex items-center justify-center flex-wrap">
            <Icon name="Globe" className="inline mr-1 flex-shrink-0" size={14} />
            <span className="text-center">{t.footerText}</span>
          </p>
        </div>

        {/* Debug информация (только для разработки) */}
        {fingerprint && process.env.NODE_ENV === 'development' && (
          <Card className="mt-4 sm:mt-6 bg-gray-800/90 border-red-500/30">
            <div className="p-3 sm:p-4">
              <h3 className="text-red-400 font-semibold mb-2 text-xs sm:text-sm">{t.debugTitle}</h3>
              <pre className="text-xs text-gray-300 overflow-auto max-h-32 sm:max-h-40">
                {JSON.stringify(fingerprint, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;