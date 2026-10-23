// ヒーロー下の電光掲示板。site.json の "ticker" を流す
import { h, render } from '../lib/dom.js';

export default {
  name: 'ticker',
  data: ['site'],
  init(el, { site }) {
    const lines = site.ticker ?? [];
    // 2 周ぶん並べて、半分ずらすと切れ目なくループする
    const items = [...lines, ...lines].map((t, i) => h('span', { class: i % 2 ? 'odd' : '' }, `◆ ${t}`));
    render(el, items);
  },
};
