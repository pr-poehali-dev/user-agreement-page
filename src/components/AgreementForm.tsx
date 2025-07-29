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

      if (response.ok) {
        try {
          // @ts-ignore
          if (window.Telegram?.WebApp?.close) {
            // @ts-ignore
            window.Telegram.WebApp.close();
          }
        } catch {
          alert(t.agreementAccepted);
        }
      } else {
        throw new Error('Failed to send data');
      }
    } catch {
      alert(t.errorSending);
    } finally {
      setIsLoading(false);
    }
  };

  const canAgree = isScrolledToEnd;
  const canProceed = isAgreed && isScrolledToEnd;

  return (
    <>
      {!isScrolledToEnd && (
        <div className="mb-4 p-3 sm:p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center space-x-2 text-amber-400">
            <Icon name="Info" size={16} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              {language === 'ru' 
                ? 'Для продолжения необходимо ознакомиться со всем текстом соглашения'
                : 'Please read the entire agreement text to continue'
              }
            </p>
          </div>
        </div>
      )}

      <div className={`
        flex items-start space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border transition-all duration-300
        ${canAgree 
          ? 'bg-naga-teal/10 border-naga-teal/20' 
          : 'bg-gray-600/10 border-gray-600/20 opacity-50'
        }
      `}>
        <Checkbox
          id="agreement"
          checked={isAgreed}
          disabled={!canAgree}
          onCheckedChange={(checked) => canAgree && setIsAgreed(checked as boolean)}
          className={`
            mt-1 flex-shrink-0 transition-all duration-200
            ${canAgree 
              ? 'data-[state=checked]:bg-naga-teal data-[state=checked]:border-naga-teal cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
            }
          `}
        />
        <label
          htmlFor="agreement"
          className={`
            text-xs sm:text-sm leading-relaxed flex-1 transition-all duration-200
            ${canAgree 
              ? 'text-gray-200 cursor-pointer' 
              : 'text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {t.checkboxText}
        </label>
      </div>

      <div className="flex justify-center mb-4 sm:mb-6">
        <Button
          onClick={handleAccept}
          disabled={!canProceed || isLoading}
          className={`
            px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto
            ${
              !canProceed
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-naga-teal hover:bg-naga-teal/80 text-white hover:shadow-lg hover:scale-105'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Icon name="Loader2" className="animate-spin mr-2" size={18} />
              <span className="text-sm sm:text-base">{t.processing}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Icon name="Check" className="mr-2" size={18} />
              <span className="text-sm sm:text-base">{t.continueButton}</span>
            </div>
          )}
        </Button>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-naga-gold/10 border border-naga-gold/20">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <Icon name="Shield" className="text-naga-gold mt-0.5 flex-shrink-0" size={16} />
          <div className="text-xs sm:text-sm text-gray-300">
            <p className="font-semibold text-naga-gold mb-1">{t.securityTitle}</p>
            <p className="leading-relaxed">{t.securityText}</p>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default AgreementForm;