// ちょっと不穏な演出まとめ。いらなければ registry.js から外すだけで全部止まる。
//  - モグの目がマウス（スマホはスクロール位置）を追いかける
//  - ときどき見出しがノイズっぽく揺れて、キャッチコピーが一瞬だけ変わる
//  - しばらく操作しないと、画面の右下からモグがのぞく
import { art, inline } from '../lib/art.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function followEyes() {
  const svgs = [...document.querySelectorAll('svg[data-watch]')];
  svgs.forEach(inline);
  const pupils = svgs.flatMap(svg => [...svg.querySelectorAll('.pupil')]);
  if (!pupils.length) return;

  let x = innerWidth / 2, y = innerHeight / 2, queued = false;
  const update = () => {
    queued = false;
    for (const p of pupils) {
      const eye = p.parentNode.querySelector('ellipse').getBoundingClientRect();
      const dx = x - (eye.left + eye.width / 2), dy = y - (eye.top + eye.height / 2);
      const len = Math.hypot(dx, dy) || 1, k = Math.min(1, len / 300);
      p.setAttribute('transform', `translate(${(dx / len) * 7 * k} ${(dy / len) * 8 * k})`);
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; queue(); }, { passive: true });
  // タッチ端末では、スクロールした方向をじっと見る
  addEventListener('scroll', () => { if (matchMedia('(hover: none)').matches) { y = innerHeight * 1.2; queue(); } }, { passive: true });
  update();
}

function glitches(catchText) {
  const catchEl = document.querySelector('.hero-catch');
  const tick = () => {
    const targets = [...document.querySelectorAll('.hero-title, [data-uneasy]')];
    const el = targets[Math.floor(Math.random() * targets.length)];
    if (el) {
      el.classList.remove('glitch');
      void el.offsetWidth;
      el.classList.add('glitch');
    }
    if (catchEl && Math.random() < 0.35) {
      const original = catchEl.textContent;
      catchEl.textContent = catchText;
      setTimeout(() => { catchEl.textContent = original; }, 450);
    }
    setTimeout(tick, 6000 + Math.random() * 9000);
  };
  setTimeout(tick, 5000);
}

function peek() {
  const el = document.querySelector('.peek');
  if (!el) return;
  el.append(art('mogu'));
  let timer;
  const reset = () => {
    el.classList.remove('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.add('show'), 20000);
  };
  ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(t => addEventListener(t, reset, { passive: true }));
  reset();
}

export default {
  name: 'uneasy',
  global: true,
  late: true,
  init() {
    followEyes();
    if (reduced) return;
    glitches('ずっと いっしょに いるよ。');
    peek();
  },
};
