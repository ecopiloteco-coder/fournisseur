// API Configuration
const DEV_BACKEND_URL = 'http://localhost:8080';
const PROD_BACKEND_URL = 'https://api.eco-pilot.com';

const isBrowser = typeof window !== 'undefined';
const isLocalhost =
  isBrowser &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

const EFFECTIVE_BACKEND_URL = isLocalhost ? DEV_BACKEND_URL : PROD_BACKEND_URL;

export const CONFIG = {
  API_URL: EFFECTIVE_BACKEND_URL,
  IS_PROD: !isLocalhost,
  BACKEND_URL: EFFECTIVE_BACKEND_URL,
  FOURNISSEUR_SERVICE_URL: isLocalhost ? 'http://localhost:8087' : PROD_BACKEND_URL,
};

export const getApiUrl = (): string => {
  const url = CONFIG.BACKEND_URL;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};
