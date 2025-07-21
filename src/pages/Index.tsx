import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface BrowserFingerprint {
  user_agent: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  platform: string;
  ip_address: string;
  fingerprint: string;
  telegram_user_id?: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  maxTouchPoints: number;
  vendor: string;
  webgl_vendor: string;
  webgl_renderer: string;
  webgl_version: string;
  opengl_version: string;
  canvas_fingerprint: string;
}

type Language = 'ru' | 'en';

interface Translations {
  title: string;
  subtitle: string;
  checkboxText: string;
  continueButton: string;
  processing: string;
  securityTitle: string;
  securityText: string;
  copyrightText: string;
  footerText: string;
  agreementAccepted: string;
  errorSending: string;
  debugTitle: string;
}

const translations: Record<Language, Translations> = {
  ru: {
    title: 'Пользовательское соглашение',
    subtitle: 'NAGA EXCHANGE',
    checkboxText: 'Я подтверждаю, что внимательно прочитал(а) и полностью принимаю условия настоящего Пользовательского соглашения. Я согласен(а) на сбор и обработку технических данных моего устройства для обеспечения безопасности операций.',
    continueButton: 'Продолжить',
    processing: 'Обработка...',
    securityTitle: 'Безопасность данных',
    securityText: 'Все собираемые данные защищены современными методами шифрования и используются исключительно для обеспечения безопасности операций. Мы не передаем персональную информацию третьим лицам.',
    copyrightText: '© 2024 Naga Exchange. Все права защищены.',
    footerText: 'Надежный обмен цифровых валют под защитой дракона',
    agreementAccepted: 'Согласие принято! Данные отправлены.',
    errorSending: 'Ошибка отправки данных. Попробуйте еще раз.',
    debugTitle: 'Debug: Собранные данные'
  },
  en: {
    title: 'User Agreement',
    subtitle: 'NAGA EXCHANGE',
    checkboxText: 'I confirm that I have carefully read and fully accept the terms of this User Agreement. I agree to the collection and processing of technical data from my device to ensure the security of operations.',
    continueButton: 'Continue',
    processing: 'Processing...',
    securityTitle: 'Data Security',
    securityText: 'All collected data is protected by modern encryption methods and is used exclusively to ensure the security of operations. We do not share personal information with third parties.',
    copyrightText: '© 2024 Naga Exchange. All rights reserved.',
    footerText: 'Reliable digital currency exchange under dragon protection',
    agreementAccepted: 'Agreement accepted! Data sent.',
    errorSending: 'Error sending data. Please try again.',
    debugTitle: 'Debug: Collected Data'
  }
};

const Index = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);
  const [language, setLanguage] = useState<Language>('ru');

  const t = translations[language];

  const generateCanvasFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Naga fingerprint 🐉', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Naga fingerprint 🐉', 4, 17);
    
    return canvas.toDataURL();
  };

  const getWebGLInfo = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        vendor: 'no-webgl',
        renderer: 'no-webgl',
        version: 'no-webgl',
        glsl_version: 'no-webgl'
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    return {
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      glsl_version: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };
  };

  const collectFingerprint = async (): Promise<BrowserFingerprint> => {
    const webglInfo = getWebGLInfo();
    const canvasFingerprint = generateCanvasFingerprint();
    
    // Получение IP адреса
    let ipAddress = 'unknown';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
    }

    // Telegram WebApp ID
    let telegramUserId: string | undefined;
    try {
      // @ts-ignore
      if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        // @ts-ignore
        telegramUserId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
      }
    } catch (error) {
      console.error('No Telegram WebApp context:', error);
    }

    const fingerprintData: BrowserFingerprint = {
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      ip_address: ipAddress,
      fingerprint: btoa(canvasFingerprint + navigator.userAgent + webglInfo.renderer),
      telegram_user_id: telegramUserId,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      deviceMemory: (navigator as any).deviceMemory,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      vendor: navigator.vendor,
      webgl_vendor: webglInfo.vendor,
      webgl_renderer: webglInfo.renderer,
      webgl_version: webglInfo.version,
      opengl_version: webglInfo.glsl_version,
      canvas_fingerprint: canvasFingerprint,
    };

    return fingerprintData;
  };

  const handleAccept = async () => {
    if (!isAgreed || isLoading) return;

    setIsLoading(true);
    
    try {
      const fingerprintData = await collectFingerprint();
      setFingerprint(fingerprintData);
      
      // Отправка на backend
      const response = await fetch('/api/terms/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accepted: true,
          ...fingerprintData,
        }),
      });

      if (response.ok) {
        // Закрытие WebApp если доступно
        try {
          // @ts-ignore
          if (window.Telegram?.WebApp?.close) {
            // @ts-ignore
            window.Telegram.WebApp.close();
          }
        } catch (error) {
          alert(t.agreementAccepted);
        }
      } else {
        throw new Error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.errorSending);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgreementText = (lang: Language) => {
    if (lang === 'en') {
      return `
USER AGREEMENT
NAGA EXCHANGE CRYPTO SERVICE 🐉

1. GENERAL PROVISIONS

1.1. This User Agreement (hereinafter - "Agreement") regulates the relationship between the Administration of the "Naga Exchange" exchange service (hereinafter - "Service") and Service users.

1.2. Naga Exchange is an automated electronic currency exchange service operating under the symbol of the mythical naga dragon, guardian of digital treasures.

1.3. Use of the Service means full and unconditional acceptance of this Agreement.

2. DATA COLLECTION AND PROCESSING

2.1. To ensure transaction security, the Service collects the following technical information:
- Browser and device characteristics
- IP address and geolocation data
- Device digital fingerprint
- Time zone and language settings

2.2. Collected data is used exclusively for:
- Fraud prevention
- AML/KYC compliance
- Technical security assurance
- Service quality improvement

3. EXCHANGE CONDITIONS

3.1. All exchange operations are carried out at rates current at the time of order creation.

3.2. Minimum and maximum exchange amounts are indicated on the Service main page.

3.3. Operation execution time is 5 to 60 minutes depending on selected exchange directions.

4. RESPONSIBILITY

4.1. The user bears full responsibility for the correctness of provided details.

4.2. The Service is not responsible for delays caused by technical problems of third-party payment systems.

4.3. In case of technical failures, the Service undertakes to return funds or complete the operation as soon as possible.

5. SECURITY

5.1. All operations are protected by modern cryptographic protocols.

5.2. User personal data is stored encrypted and is not transferred to third parties.

5.3. The monitoring system operates 24/7 to prevent unauthorized access.

6. TECHNICAL SUPPORT

6.1. Support service is available 24/7 through:
- Telegram: @naga_support
- Email: support@nagaexchange.com
- Online chat on the website

6.2. Support service response time - no more than 30 minutes.

7. FINAL PROVISIONS

7.1. The Service reserves the right to make changes to this Agreement.

7.2. The current version of the Agreement is always available on the official website.

7.3. In case of disputes, the parties strive for their peaceful settlement.

Last updated: ${new Date().toLocaleDateString('en-US')}

🐉 NAGA EXCHANGE - Your reliable guide in the world of digital currencies
      `.trim();
    }
    
    return `
ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ
ОБМЕННЫЙ СЕРВИС "NAGA EXCHANGE" 🐉

1. ОБЩИЕ ПОЛОЖЕНИЯ

1.1. Настоящее Пользовательское соглашение (далее - "Соглашение") регулирует отношения между Администрацией обменного сервиса "Naga Exchange" (далее - "Сервис") и пользователями Сервиса.

1.2. Naga Exchange - это автоматизированный сервис обмена электронных валют, работающий под символом мифического дракона-нага, хранителя цифровых сокровищ.

1.3. Использование Сервиса означает полное и безоговорочное принятие данного Соглашения.

2. СБОР И ОБРАБОТКА ДАННЫХ

2.1. Для обеспечения безопасности операций Сервис собирает следующую техническую информацию:
- Характеристики браузера и устройства
- IP-адрес и геолокационные данные
- Цифровой отпечаток устройства (fingerprint)
- Временную зону и языковые настройки

2.2. Собранные данные используются исключительно для:
- Предотвращения мошенничества
- Соблюдения требований AML/KYC
- Обеспечения технической безопасности
- Улучшения качества сервиса

3. УСЛОВИЯ ОБМЕНА

3.1. Все операции обмена осуществляются по курсам, актуальным на момент создания заявки.

3.2. Минимальные и максимальные суммы обмена указаны на главной странице Сервиса.

3.3. Время выполнения операций составляет от 5 до 60 минут в зависимости от выбранных направлений обмена.

4. ОТВЕТСТВЕННОСТЬ

4.1. Пользователь несет полную ответственность за корректность предоставленных реквизитов.

4.2. Сервис не несет ответственности за задержки, вызванные техническими проблемами платежных систем третьих лиц.

4.3. В случае технических сбоев Сервис обязуется вернуть средства или завершить операцию в кратчайшие сроки.

5. БЕЗОПАСНОСТЬ

5.1. Все операции защищены современными криптографическими протоколами.

5.2. Персональные данные пользователей хранятся в зашифрованном виде и не передаются третьим лицам.

5.3. Система мониторинга работает круглосуточно для предотвращения несанкционированного доступа.

6. ТЕХНИЧЕСКАЯ ПОДДЕРЖКА

6.1. Служба поддержки доступна 24/7 через:
- Telegram: @naga_support
- Email: support@nagaexchange.com
- Онлайн-чат на сайте

6.2. Время ответа службы поддержки - не более 30 минут.

7. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

7.1. Сервис оставляет за собой право вносить изменения в данное Соглашение.

7.2. Актуальная версия Соглашения всегда доступна на официальном сайте.

7.3. При возникновении споров стороны стремятся к их мирному урегулированию.

Дата последнего обновления: ${new Date().toLocaleDateString('ru-RU')}

🐉 NAGA EXCHANGE - Ваш надежный проводник в мире цифровых валют
    `.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-naga-dark via-gray-900 to-naga-charcoal text-white relative">
      {/* Декоративный фон */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-naga-teal/20 to-naga-gold/10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
        {/* Переключатель языков */}
        <div className="flex justify-end mb-4">
          <div className="flex bg-gray-800/70 rounded-lg p-1 backdrop-blur-sm border border-naga-teal/20">
            <button
              onClick={() => setLanguage('ru')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                language === 'ru'
                  ? 'bg-naga-teal text-white shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🇷🇺 RU
            </button>
            <button
              onClick={() => setLanguage('en')}
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
            <ScrollArea className="h-[50vh] sm:h-[60vh] mb-4 sm:mb-6 rounded-lg border border-naga-teal/20 bg-gray-900/50 p-3 sm:p-6">
              <div className="text-gray-200 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {getAgreementText(language)}
              </div>
            </ScrollArea>

            {/* Чекбокс согласия */}
            <div className="flex items-start space-x-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-naga-teal/10 border border-naga-teal/20">
              <Checkbox
                id="agreement"
                checked={isAgreed}
                onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                className="data-[state=checked]:bg-naga-teal data-[state=checked]:border-naga-teal mt-1 flex-shrink-0"
              />
              <label
                htmlFor="agreement"
                className="text-gray-200 text-xs sm:text-sm leading-relaxed cursor-pointer flex-1"
              >
                {t.checkboxText}
              </label>
            </div>

            {/* Кнопка продолжить */}
            <div className="flex justify-center">
              <Button
                onClick={handleAccept}
                disabled={!isAgreed || isLoading}
                className={`
                  px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto
                  ${
                    !isAgreed
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-naga-teal hover:bg-naga-teal/80 text-white hover:shadow-lg hover:scale-105'
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                    {t.processing}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Icon name="Check" className="mr-2" size={20} />
                    {t.continueButton}
                  </div>
                )}
              </Button>
            </div>

            {/* Информация о безопасности */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-naga-gold/10 border border-naga-gold/20">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" className="text-naga-gold mt-1 flex-shrink-0" size={20} />
                <div className="text-xs sm:text-sm text-gray-300">
                  <p className="font-semibold text-naga-gold mb-1">{t.securityTitle}</p>
                  <p>{t.securityText}</p>
                </div>
              </div>
            </div>
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