// Nombre del sitio: cámbialo aquí (y SITE_NAME en server/.env) para renombrar la plataforma.
export const SITE = { first: 'Aula', accent: 'Pro', last: 'Online', full: 'Aula Pro Online' };

// Dirección de la API. En desarrollo queda vacía (Vite redirige /api al backend).
// En producción define VITE_API_URL=https://api.tudominio.com en el archivo .env
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
// Convierte rutas del backend (/uploads, /img, /api) en direcciones completas.
export const asset = (u) => (u && u.startsWith('/') ? API + u : u);

const TOKEN = 'aulapro_token';
export const getToken = () => localStorage.getItem(TOKEN);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN, t) : localStorage.removeItem(TOKEN));

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`;
  if (body) headers['Content-Type'] = 'application/json';
  let res;
  try { res = await fetch(`${API}/api${path}`, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) }); }
  catch { throw new Error('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error(data.error || 'Ocurrió un error. Inténtalo de nuevo.'); e.status = res.status; throw e; }
  return data;
}

// Dirección del panel de administración (proyecto aparte).
export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export const money = (n) => (Number(n) === 0 ? 'Gratis' : `S/ ${Number(n).toLocaleString('es-PE', { minimumFractionDigits: Number.isInteger(Number(n)) ? 0 : 2, maximumFractionDigits: 2 })}`);
export const fecha = (s) => (s ? new Date(s.replace(' ', 'T') + 'Z').toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// Convierte un enlace de YouTube o Vimeo en su dirección para incrustar.
export function embedUrl(url) {
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url || '');
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  const vm = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url || '');
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

// ---------- Actualización en vivo ----------
// El backend avisa cuando algo cambia y las pantallas vuelven a pedir sus datos, sin recargar la página.
const liveListeners = new Set();
let liveSource = null;
export function onLive(fn) {
  liveListeners.add(fn);
  if (!liveSource && typeof EventSource !== 'undefined') {
    let lost = false;
    liveSource = new EventSource(`${API}/api/events`);
    liveSource.onmessage = (e) => { try { const ev = JSON.parse(e.data); liveListeners.forEach((f) => f(ev)); } catch { /* mensaje no válido */ } };
    liveSource.onerror = () => { lost = true; };
    // Si la conexión se cortó y volvió, se actualiza por si hubo cambios mientras tanto.
    liveSource.onopen = () => { if (lost) { lost = false; liveListeners.forEach((f) => f({ scope: 'contenido' })); } };
  }
  return () => liveListeners.delete(fn);
}
// Qué avisos hacen que esta aplicación se actualice.
export const LIVE_SCOPES = ['contenido'];
