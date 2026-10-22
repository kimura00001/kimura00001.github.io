// お品書き：壁に貼った短冊（data/menu.json）
// sections[] を上から順に並べる。label があれば木札の見出しを付ける
import { h, render } from '../lib/dom.js';

function strip(item, i) {
  return h('li', { class: item.hot ? 'hot' : null, 'data-tilt': String(i % 6) },
    h('span', { class: 'name' }, item.name),
    h('span', { class: 'price' }, item.price ?? '〇〇円'),
  );
}

function group(g) {
  const noted = g.items.filter(i => i.note);
  return h('div', { class: 'menu-group' },
    h('ul', { class: 'tanzaku' }, g.items.map(strip)),
    noted.length > 0 && h('dl', { class: 'panel-notes' },
      noted.map(i => [h('dt', {}, i.name), h('dd', {}, i.note)]),
    ),
  );
}

function section(s, index) {
  return h('div', { class: `menu-section${s.variant ? ` is-${s.variant}` : ''}`, id: `menu-${s.id}` },
    index > 0 && s.label && h('h3', { class: 'section-label' }, s.label),
    s.lead && h('p', { class: 'panel-lead' }, s.lead),
    s.groups.map(group),
    s.note && h('p', { class: 'menu-note' }, s.note),
  );
}

export default {
  name: 'menu',
  data: ['menu'],
  init(el, { menu }) {
    render(el, menu.sections.map(section));
  },
};
