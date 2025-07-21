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

  const t = translations[language];

  const handleFingerprintCollected = (fingerprintData: BrowserFingerprint) => {
    setFingerprint(fingerprintData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-naga-dark via-gray-900 to-naga-charcoal text-white relative">
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-naga-teal/20 to-naga-gold/10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
        {/* Переключатель языков */}
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />

        {/* Заголовок с иконкой дракона */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="text-4xl sm:text-6xl mb-2 sm:mb-0 sm:mr-4">🐉</div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-naga-gold mb-2">
                {t.title}
              </h1>
              <p className="text-naga-teal text-base sm:text-lg">{t.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Основная карточка */}
        <Card className="bg-gray-800/90 border-naga-teal/30 backdrop-blur-sm shadow-2xl">
          <div className="p-6">
            {/* Прокручиваемый текст соглашения */}
            <AgreementText language={language} />

            {/* Форма согласия */}
            <AgreementForm
              language={language}
              translations={t}
              onFingerprintCollected={handleFingerprintCollected}
            />
          </div>
        </Card>

        {/* Футер */}
        <div className="text-center mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm px-4">
          <p>{t.copyrightText}</p>
          <p className="mt-1 flex items-center justify-center">
            <Icon name="Globe" className="inline mr-1" size={14} />
            {t.footerText}
          </p>
        </div>

        {/* Debug информация (только для разработки) */}
        {fingerprint && process.env.NODE_ENV === 'development' && (
          <Card className="mt-6 sm:mt-8 bg-gray-800/90 border-red-500/30">
            <div className="p-3 sm:p-4">
              <h3 className="text-red-400 font-semibold mb-2 text-sm">{t.debugTitle}</h3>
              <pre className="text-xs text-gray-300 overflow-auto max-h-40">
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