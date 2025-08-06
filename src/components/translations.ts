import { Language, Translations } from './types';

export const translations: Record<Language, Translations> = {
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
    errorSending: 'Ошибка отправки данных. Попробуйте еще раз.'

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
    errorSending: 'Error sending data. Please try again.'
  }
};

export const getAgreementText = (lang: Language) => {
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