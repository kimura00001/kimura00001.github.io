// 取扱業務：番号付きのカード。スマホでは開閉式（data/services.json）
import { h, render } from '../lib/dom.js';

const link = l => h('a', { class: 'svc-link', href: l.href, target: '_blank', rel: 'noopener' }, l.label, h('span', { 'aria-hidden': 'true' }, ' ↗'));

function card(s, i) {
  return h('details', { class: 'svc', id: `svc-${s.id}`, open: i === 0 ? true : null },
    h('summary', {},
      h('span', { class: 'svc-no' }, s.no),
      h('span', { class: 'svc-title' }, h('small', {}, s.en), s.title),
      h('span', { class: 'svc-icon', 'aria-hidden': 'true' }),
    ),
    h('div', { class: 'svc-body' },
      h('p', { class: 'svc-lead' }, s.lead),
      h('dl', {}, s.items.map(it => [h('dt', {}, it.name), h('dd', {}, it.text, it.link && link(it.link))])),
      s.tag && h('span', { class: 'svc-tag' }, s.tag),
      s.link && h('a', { class: 'svc-more', href: s.link.href }, s.link.label, h('span', { 'aria-hidden': 'true' }, ' →')),
    ),
  );
}

export default {
  name: 'services',
  data: ['services'],
  init(el, { services }) {
    const cards = services.services.map(card);
    render(el, h('div', { class: 'svc-grid' }, cards), h('p', { class: 'svc-note' }, services.note));

    // PC では全部開いた状態で並べる。スマホでは最初の 1 枚だけ開く
    const wide = matchMedia('(min-width: 900px)');
    const sync = () => cards.forEach((c, i) => { c.open = wide.matches || i === 0; });
    wide.addEventListener('change', sync);
    sync();
  },
};
