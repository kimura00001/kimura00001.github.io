// ヘッダー：スクロール時の影と、スマホのハンバーガーメニュー
export default {
  name: 'nav',
  global: true,
  init() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    if (!nav || !toggle) return;

    addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive: true });

    const setOpen = open => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('ul a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  },
};
