// 単行本。data/books.json
//  "cover" に表紙画像（img/vol2.jpg など）を書くとそれを表示。無ければ "color" の仮表紙
import { h, render } from '../lib/dom.js';
import { art } from '../lib/art.js';

export default {
  name: 'books',
  data: ['books'],
  init(el, { books }) {
    render(el, h('div', { class: 'books' }, books.map(b =>
      h('article', { class: 'book reveal' },
        h('div', { class: `book-cover tone-${b.color ?? 'pink'}` },
          b.cover ? art(b.cover, '', b.title) : [h('span', { class: 'book-cover-title' }, b.title), art('mogu')]),
        h('div', {},
          b.badge && h('span', { class: 'badge' }, b.badge),
          h('h3', { class: 'book-title' }, b.title),
          h('p', { class: 'book-meta' }, [b.date, b.price].filter(Boolean).join(' ／ ')),
          b.note && h('p', { class: 'book-note' }, b.note),
          h('div', { class: 'book-shops' }, (b.shops ?? []).map(s =>
            h('a', { class: 'btn btn-ghost', href: s.url, target: '_blank', rel: 'noopener' }, s.label))),
        ),
      ),
    )));
  },
};
