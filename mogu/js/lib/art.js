// index.html のスプライト（<symbol id="...">）を使って絵を出す。
// 画像ファイル（img/ 以下や https://）を指定した場合は <img> にする。
const NS = 'http://www.w3.org/2000/svg';

export function art(name, className = '', alt = '') {
  if (/[./]/.test(name)) {
    const img = document.createElement('img');
    img.src = name;
    img.alt = alt;
    img.loading = 'lazy';
    if (className) img.className = className;
    return img;
  }
  const svg = document.createElementNS(NS, 'svg');
  if (className) svg.setAttribute('class', className);
  if (alt) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', alt); }
  else svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(NS, 'use');
  use.setAttribute('href', `#${name}`);
  svg.append(use);
  return svg;
}

// <use> の代わりに symbol の中身を複製して埋め込む（目玉を個別に動かすため）
export function inline(svg) {
  const use = svg.querySelector('use');
  const symbol = use && document.querySelector(use.getAttribute('href'));
  if (!symbol) return;
  svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
  use.replaceWith(...[...symbol.children].map(c => c.cloneNode(true)));
}

// "2026-10-17" → "2026.10.17"
export const fmtDate = s => (s || '').replaceAll('-', '.');
