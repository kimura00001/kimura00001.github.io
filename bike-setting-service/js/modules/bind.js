// data/shop.json の値をページに差し込む。
//   <span data-bind="tel">        … 文字として入れる
//   <a data-bind-href="lineUrl">  … href に入れる（tel は tel: リンクにする）
// 店名や電話番号を変えるときは shop.json を直すだけでページ全体に反映される。
// "demo": true のときは連絡先系のリンクを無効にする（押されたときは demo.js が知らせる）。
const LABELS = { tel: '電話', lineUrl: 'LINE', mapUrl: '地図', facebookUrl: 'Facebook' };
const toHref = (key, value) => key === 'tel' ? `tel:${value.replace(/[^\d+]/g, '')}` : value;

export default {
  name: 'bind',
  global: true,
  data: ['shop'],
  init(root, { shop }) {
    for (const el of root.querySelectorAll('[data-bind]')) {
      const value = shop[el.dataset.bind];
      if (typeof value === 'string') el.textContent = value;
    }
    for (const el of root.querySelectorAll('[data-bind-href]')) {
      const key = el.dataset.bindHref;
      const value = shop[key];
      if (shop.demo && key in LABELS) {
        el.href = '#';
        el.dataset.demo = LABELS[key];
        el.removeAttribute('target');
      } else if (typeof value === 'string' && /^(https?:|tel:)/.test(toHref(key, value))) {
        el.href = toHref(key, value);
      }
    }
    // 下層ページは HTML 側の <title> をそのまま使う
    if (!document.body.classList.contains('page-sub')) document.title = `${shop.name}｜${shop.genre}`;
  },
};
