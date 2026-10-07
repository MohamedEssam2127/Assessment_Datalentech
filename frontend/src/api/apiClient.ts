import axios from 'axios';
import i18n from '../localization/i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Request interceptor ──────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach the idempotency key if provided via meta
    const idempotencyKey = (config as any).idempotencyKey;
    if (idempotencyKey) {
      config.headers['X-Idempotency-Key'] = idempotencyKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = i18n.t('errors.timeout');
    } else if (!error.response) {
      error.message = i18n.t('errors.network');
    } else {
      error.message = i18n.t('errors.server');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
