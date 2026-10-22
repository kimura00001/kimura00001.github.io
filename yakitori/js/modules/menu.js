// お品書き：カテゴリの木札タブ ＋ 壁に貼った短冊（data/menu.json）
// 最初に開くタブは "default": true のカテゴリ（無ければ先頭）
import { h, render } from '../lib/dom.js';

function strip(item, i) {
  return h('li', { class: item.hot ? 'hot' : null, 'data-tilt': String(i % 6) },
    h('span', { class: 'name' }, item.name),
    h('span', { class: 'price' }, item.price ?? '〇〇円'),
  );
}

function panel(cat, active) {
  return h('div', {
    class: `menu-panel${cat.variant ? ` is-${cat.variant}` : ''}`,
    id: `panel-${cat.id}`, role: 'tabpanel', 'aria-labelledby': `tab-${cat.id}`, hidden: !active,
  },
    cat.lead && h('p', { class: 'panel-lead' }, cat.lead),
    h('ul', { class: 'tanzaku' }, cat.items.map(strip)),
    cat.items.some(i => i.note) && h('dl', { class: 'panel-notes' },
      cat.items.filter(i => i.note).map(i => [h('dt', {}, i.name), h('dd', {}, i.note)]),
    ),
  );
}

export default {
  name: 'menu',
  data: ['menu'],
  init(el, { menu }) {
    const cats = menu.categories;
    const first = Math.max(0, cats.findIndex(c => c.default));
    const panels = cats.map((c, i) => panel(c, i === first));
    const tabs = cats.map((c, i) => h('button', {
      type: 'button', role: 'tab', id: `tab-${c.id}`, 'aria-controls': `panel-${c.id}`,
      'aria-selected': String(i === first), class: c.variant ? `is-${c.variant}` : null,
      onclick: () => select(i),
    }, c.label));

    function select(index) {
      tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === index)));
      panels.forEach((p, i) => { p.hidden = i !== index; });
    }

    render(el,
      h('div', { class: 'menu-tabs', role: 'tablist', 'aria-label': 'お品書きの種類' }, tabs),
      panels,
      menu.note && h('p', { class: 'menu-note' }, menu.note),
    );
  },
};
