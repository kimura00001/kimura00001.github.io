// おしらせ一覧。data/news.json（新しい順に上から書く）
import { h, render } from '../lib/dom.js';
import { fmtDate } from '../lib/art.js';

export default {
  name: 'news',
  data: ['news'],
  init(el, { news }) {
    render(el, h('ul', { class: 'news reveal' }, news.map(n => {
      const inner = [
        h('time', { datetime: n.date }, fmtDate(n.date)),
        h('span', { class: 'tag' }, n.tag),
        h('span', { class: 'news-title' }, n.title),
      ];
      return h('li', {}, n.url ? h('a', linkProps(n.url), inner) : h('div', {}, inner));
    })));
  },
};

export function linkProps(url) {
  if (url.startsWith('#')) return { href: url };
  return { href: url, target: '_blank', rel: 'noopener' };
}
