export type Language = 'ru' | 'en';

export interface BrowserFingerprint {
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

export interface Translations {
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
}