/**
 * Secure App Mode Detection & Protection
 * 
 * Security Rules:
 * - App Mode is ONLY activated when running in standalone display mode
 * - NOT activated from URL parameters alone
 * - NOT activated when running in iframe
 * - Uses sessionStorage (not localStorage) to prevent tampering
 */

const APP_SESSION_KEY = 'is_app_session';
const ALLOWED_ORIGIN = 'zoomchatlive.com';

/**
 * Check if app is running in a genuine standalone/PWA mode
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://') ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

/**
 * Check if app is running inside an iframe (potential abuse)
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

/**
 * Check if referrer is from a different origin (potential clone)
 */
export function isFromDifferentOrigin(): boolean {
  if (typeof document === 'undefined') return false;
  
  const referrer = document.referrer;
  if (!referrer) return false;
  
  try {
    const referrerUrl = new URL(referrer);
    const currentHost = window.location.hostname;
    
    if (currentHost === 'localhost' || currentHost.includes('replit')) {
      return false;
    }
    
    return !referrerUrl.hostname.includes(ALLOWED_ORIGIN) && 
           referrerUrl.hostname !== currentHost;
  } catch {
    return false;
  }
}

/**
 * Initialize App Session securely
 * Only sets the flag if running in genuine standalone mode
 */
export function initAppSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (isInIframe()) {
    console.log('[AppMode] Blocked: Running in iframe');
    return false;
  }
  
  if (isFromDifferentOrigin()) {
    console.log('[AppMode] Warning: Referrer from different origin');
  }
  
  if (isStandaloneMode()) {
    sessionStorage.setItem(APP_SESSION_KEY, '1');
    console.log('[AppMode] App session initialized (standalone mode)');
    return true;
  }
  
  console.log('[AppMode] Web mode - no app session');
  return false;
}

/**
 * Check if current session is an App Session
 */
export function isAppSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (isInIframe()) {
    return false;
  }
  
  return sessionStorage.getItem(APP_SESSION_KEY) === '1';
}

/**
 * Handle App Mode redirect logic
 * Only redirects from "/" to "/auth/login" in app mode if NOT logged in
 */
export function handleAppModeRedirect(): void {
  if (typeof window === 'undefined') return;
  
  if (isInIframe()) return;
  
  if (!isAppSession() && !isStandaloneMode()) return;
  
  const path = window.location.pathname;
  
  // Check if user is already logged in (has auth token in localStorage)
  const hasAuthToken = localStorage.getItem('toptop_demo_token');
  const hasAuthUser = localStorage.getItem('toptop_demo_user');
  
  if (path === '/' || path === '') {
    // Only redirect to login if NOT already authenticated
    if (!hasAuthToken && !hasAuthUser) {
      console.log('[AppMode] Redirecting to login (not authenticated)');
      window.location.replace('/auth/login');
    } else {
      console.log('[AppMode] User is authenticated, staying on home');
    }
  }
}

/**
 * Clear app session (on logout)
 */
export function clearAppSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(APP_SESSION_KEY);
}
