import { getApiUrl } from '../config';

export function getBackendURL(): string {
  return getApiUrl();
}

export function getNotificationBackendURL(): string {
  const url = getApiUrl();
  // Strip the existing port if any (e.g. http://localhost:8080 -> http://localhost)
  const baseUrl = url.replace(/:\d+$/, '');
  return `${baseUrl}:8084`;
}
