import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Language, BrowserFingerprint, Translations } from './types';
import { collectFingerprint } from './FingerprintUtils';

interface AgreementFormProps {
  language: Language;
  translations: Translations;
  isScrolledToEnd: boolean;
  onFingerprintCollected?: (fingerprint: BrowserFingerprint) => void;
}

const AgreementForm: React.FC<AgreementFormProps> = ({ 
  language, 
  translations: t, 
  isScrolledToEnd,
  onFingerprintCollected 
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);

  const handleAccept = async () => {
    if (!isAgreed || isLoading || !isScrolledToEnd) return;

    setIsLoading(true);
    
    try {
      const fingerprintData = await collectFingerprint();
      setFingerprint(fingerprintData);
      onFingerprintCollected?.(fingerprintData);
      
      const response = await fetch('/api/terms/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accepted: true, ...fingerprintData }),
      });

      // Всегда показываем страницу благодарности независимо от ответа
      setIsCompleted(true);
      setTimeout(() => {
        try {
          // @ts-ignore
          if (window.Telegram?.WebApp?.close) {
            // @ts-ignore
            window.Telegram.WebApp.close();
          }
        } catch {
          // Тихо игнорируем если не Telegram
        }
      }, 2000);
    } catch {
      // Всегда показываем страницу благодарности даже при ошибке
      setIsCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const canAgree = isScrolledToEnd;
  const canProceed = isAgreed && isScrolledToEnd;

  if (isCompleted) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-naga-dark via-gray-900 to-naga-charcoal text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-naga-teal/20 rounded-full flex items-center justify-center border-2 border-naga-teal/40">
          <Icon name="Check" className="text-naga-teal" size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">
            {language === 'ru' ? 'Соглашение подтверждено' : 'Agreement confirmed'}
          </h1>
          <p className="text-gray-400 text-xl sm:text-2xl">
            {language === 'ru' 
              ? 'Вы можете закрыть это окно'
              : 'You can close this window'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isScrolledToEnd && (
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-amber-500/15 border border-amber-500/40 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3 text-amber-300">
            <Icon name="Info" size={18} className="flex-shrink-0" />
            <p className="text-sm sm:text-base font-medium">
              {language === 'ru' 
                ? 'Для продолжения необходимо ознакомиться со всем текстом соглашения'
                : 'Please read the entire agreement text to continue'
              }
            </p>
          </div>
        </div>
      )}

      <div className={`
        flex items-start space-x-4 mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl border transition-all duration-300 shadow-lg backdrop-blur-sm
        ${canAgree 
          ? 'bg-naga-teal/15 border-naga-teal/30' 
          : 'bg-gray-600/10 border-gray-600/20 opacity-50'
        }
      `}>
        <Checkbox
          id="agreement"
          checked={isAgreed}
          disabled={!canAgree}
          onCheckedChange={(checked) => canAgree && setIsAgreed(checked as boolean)}
          className={`
            mt-0.5 flex-shrink-0 transition-all duration-200 scale-110
            ${canAgree 
              ? 'data-[state=checked]:bg-naga-teal data-[state=checked]:border-naga-teal cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
        />
        <label
          htmlFor="agreement"
          className={`
            text-sm sm:text-base leading-relaxed flex-1 transition-all duration-200 font-medium
            ${canAgree 
              ? 'text-gray-200 cursor-pointer' 
              : 'text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {t.checkboxText}
        </label>
      </div>

      <div className="flex justify-center mb-6 sm:mb-8">
        <Button
          onClick={handleAccept}
          disabled={!canProceed || isLoading}
          className={`
            px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-xl font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto shadow-lg
            ${
              !canProceed
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-naga-teal hover:bg-naga-teal/80 text-white hover:shadow-lg hover:scale-105'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Icon name="Loader2" className="animate-spin mr-3" size={20} />
              <span className="text-sm sm:text-base">{t.processing}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Icon name="Check" className="mr-3" size={20} />
              <span className="text-sm sm:text-base">{t.continueButton}</span>
            </div>
          )}
        </Button>
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-naga-gold/15 border border-naga-gold/30 shadow-lg backdrop-blur-sm">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Icon name="Shield" className="text-naga-gold mt-1 flex-shrink-0" size={18} />
          <div className="text-sm sm:text-base text-gray-200">
            <p className="font-semibold text-naga-gold mb-2 text-base sm:text-lg">{t.securityTitle}</p>
            <p className="leading-relaxed">{t.securityText}</p>
          </div>
        </div>
      </div>


    </>
  );
};

export default AgreementForm;