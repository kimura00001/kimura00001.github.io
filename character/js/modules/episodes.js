// エピソード一覧。data/episodes.json
//  "image" に画像（img/ep24.png など）を書くとサムネイルになる。無ければ "tone" の色＋メインキャラ
import { h, render } from '../lib/dom.js';
import { art, fmtDate } from '../lib/art.js';
import { linkProps } from './news.js';

export default {
  name: 'episodes',
  data: ['episodes'],
  init(el, { episodes }) {
    render(el, h('div', { class: 'episodes' }, episodes.map(ep =>
      h('a', { class: 'ep reveal', ...linkProps(ep.url) },
        ep.new && h('span', { class: 'ep-badge' }, 'NEW'),
        ep.first && h('span', { class: 'ep-badge first' }, 'ここから'),
        h('div', { class: `ep-thumb tone-${ep.tone ?? 'dark'}` }, art(ep.image ?? 'main', '', ep.image ? ep.title : '')),
        h('div', { class: 'ep-body' },
          h('span', { class: 'ep-no' }, `第${ep.no}話 ・ ${fmtDate(ep.date)}`),
          h('p', { class: 'ep-title' }, ep.title),
        ),
      ),
    )));
  },
};
