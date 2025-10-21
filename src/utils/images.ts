// src/utils/images.ts
import { CDN_URL } from './constants';

export const FALLBACK_IMG = new URL('../images/Subtract.svg', import.meta.url).href;

const ORIGIN = (import.meta.env.VITE_API_ORIGIN as string).replace(/\/$/, '');

export function toCdnUrl(raw?: string | null): string {
  const s = (raw ?? '').trim();
  if (!s) return '';

  // абсолютные ссылки 
  if (/^https?:\/\//i.test(s)) return s;

  // путь от корня сервера
  if (s.startsWith('/')) return `${ORIGIN}${s}`;

  // «content/...»
  if (s.startsWith('content/')) return `${ORIGIN}/${s}`;

  // убираем случайный префикс "weblarek/"
  const name = s.startsWith('weblarek/') ? s.slice(9) : s;

  return `${CDN_URL}/${name.split('/').map(encodeURIComponent).join('/')}`;
}

export function preferPng(raw?: string | null) {
  const base = toCdnUrl(raw);
  if (!base) return { png: FALLBACK_IMG, svg: FALLBACK_IMG };

  // гарантируем .svg, учитываем query
  const svg = base.replace(/(\.svg)?(\?.*)?$/i, '.svg$2');
  const png = svg.replace(/\.svg(\?.*)?$/i, '.png$1');
  return { png, svg };
}

