// 店舗情報（data/shop.json）
import { h, render } from '../lib/dom.js';

export default {
  name: 'info',
  data: ['shop'],
  init(el, { shop }) {
    const rows = [
      ['店名', shop.name],
      ['住所', shop.address],
      ['アクセス', shop.access],
      ['営業時間', shop.hours],
      ['定休日', [shop.holiday, shop.holidayNote && h('small', {}, `※ ${shop.holidayNote}`)]],
      ['電話', shop.demo ? shop.tel : h('a', { href: `tel:${shop.tel.replace(/[^\d+]/g, '')}` }, shop.tel)],
      ['予算', shop.budget],
    ];
    render(el,
      h('dl', {}, rows.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
      shop.demo && h('p', { class: 'dummy' }, '※ 店名・住所・電話番号はデモ用のダミーです。'),
      h('div', { class: 'tags' }, shop.tags.map(t => h('span', {}, t))),
    );
  },
};
