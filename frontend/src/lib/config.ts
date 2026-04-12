export const API_URL = import.meta.env.VITE_API_URL as string;
export const BASE_URL = import.meta.env.VITE_BASE_URL as string || API_URL.replace('/v1', '');
