import { BrowserFingerprint } from './types';

export const generateCanvasFingerprint = (): string => {
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

export const getWebGLInfo = () => {
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

export const collectFingerprint = async (): Promise<BrowserFingerprint> => {
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