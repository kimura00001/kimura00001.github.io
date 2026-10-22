// 店舗情報（data/shop.json）
import { h, render } from '../lib/dom.js';

const telHref = tel => `tel:${tel.replace(/[^\d+]/g, '')}`;

export default {
  name: 'access',
  data: ['shop'],
  init(el, { shop }) {
    const rows = [
      ['店名', [shop.name, h('small', {}, shop.company)]],
      ['住所', [shop.zip, h('br'), shop.address]],
      ['営業時間', shop.hours],
      ['定休日', [shop.holiday, h('small', {}, `※ ${shop.holidayNote}`)]],
      ['電話', h('a', { href: telHref(shop.tel) }, shop.tel)],
      ['FAX', shop.fax],
      ['LINE', h('a', { href: shop.lineUrl, target: '_blank', rel: 'noopener' }, shop.lineId)],
      ['駐車場', shop.parking],
    ];
    render(el, h('dl', { class: 'spec' }, rows.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))));
  },
};
