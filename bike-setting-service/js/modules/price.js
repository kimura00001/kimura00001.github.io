// 料金表：カテゴリのタブ ＋ 一覧（data/price.json）
// 最初に開くタブは "default": true のカテゴリ（無ければ先頭）
import { h, render } from '../lib/dom.js';

function row(r) {
  if (r.group) return h('li', { class: 'price-group' }, r.group);
  return h('li', { class: 'price-row' },
    h('span', { class: 'price-name' }, r.name, r.sub && h('small', {}, r.sub)),
    h('span', { class: 'price-dots', 'aria-hidden': 'true' }),
    h('span', { class: 'price-val' }, r.price, r.tax && h('small', {}, '税抜')),
  );
}

function panel(cat, active) {
  return h('div', {
    class: 'price-panel', id: `price-${cat.id}`, role: 'tabpanel',
    'aria-labelledby': `price-tab-${cat.id}`, hidden: !active,
  },
    cat.lead && h('p', { class: 'price-lead' }, cat.lead),
    h('ul', { class: 'price-list' }, cat.rows.map(row)),
    cat.notes?.length > 0 && h('ul', { class: 'price-notes' }, cat.notes.map(n => h('li', {}, n))),
  );
}

export default {
  name: 'price',
  data: ['price'],
  init(el, { price }) {
    const cats = price.categories;
    const first = Math.max(0, cats.findIndex(c => c.default));
    const panels = cats.map((c, i) => panel(c, i === first));
    const tabs = cats.map((c, i) => h('button', {
      type: 'button', role: 'tab', id: `price-tab-${c.id}`, 'aria-controls': `price-${c.id}`,
      'aria-selected': String(i === first), tabindex: i === first ? null : '-1',
      onclick: () => select(i),
      onkeydown: e => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        const next = (i + step + cats.length) % cats.length;
        select(next);
        tabs[next].focus();
      },
    }, c.label));

    function select(index) {
      tabs.forEach((t, i) => {
        t.setAttribute('aria-selected', String(i === index));
        t.tabIndex = i === index ? 0 : -1;
      });
      panels.forEach((p, i) => { p.hidden = i !== index; });
      tabs[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }

    render(el,
      h('div', { class: 'price-tabs', role: 'tablist', 'aria-label': '料金の種類' }, tabs),
      h('div', { class: 'price-box' }, panels),
      price.note && h('p', { class: 'price-note' }, price.note),
    );
  },
};
