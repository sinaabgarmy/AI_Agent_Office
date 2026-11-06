// Central place where every frontend API call builds its URL.
//
// - Default (empty string): same-origin requests. This is the normal mode on a
//   Windows 11 laptop, where `npm run dev` serves BOTH the frontend and the
//   /api backend on http://localhost:3000.
// - Split deploy (optional): if the frontend is ever hosted separately from the
//   backend (e.g. static hosting + a remote API), set VITE_API_URL in .env to
//   the backend origin, e.g. VITE_API_URL="http://localhost:3000" or your
//   tunnel URL. Every fetch below is then prefixed automatically, so no API
//   call can silently 404 again.
export const API_BASE: string = ((import.meta as any)?.env?.VITE_API_URL ?? '')
  .toString()
  .trim()
  .replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
