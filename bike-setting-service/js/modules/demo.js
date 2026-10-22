// デモ表示中（shop.json の "demo": true）は、電話・LINE・地図などのリンクを押しても
// 実際には発信・遷移させず、その旨を小さく知らせる。対象は data-demo を付けたリンク。
import { h } from '../lib/dom.js';

export default {
  name: 'demo',
  global: true,
  data: ['shop'],
  init(root, { shop }) {
    if (!shop.demo) return;
    const toast = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
    document.body.append(toast);
    let timer;
    root.addEventListener('click', e => {
      const a = e.target.closest('[data-demo]');
      if (!a) return;
      e.preventDefault();
      toast.textContent = `デモのため無効です（${a.dataset.demo}）`;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 2400);
    });
  },
};
