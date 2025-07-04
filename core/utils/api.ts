import axios from 'axios';

const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

export const apiWithoutLocale = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  if (isServer) return config;

  const locale = window.location.pathname.split('/')[1];

  if (locale) {
    config.params = {
      ...config.params,
      locale,
    };
  }

  return config;
});

export default api;
