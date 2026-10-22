// 在庫車両と販売実績（data/bikes.json）
//  - 在庫：メーカー絞り込み＋並び替え。カードを押すと詳細ダイアログ
//    （PC は中央のモーダル、スマホは下から出るシート）。「問い合わせる」でフォームに車両名を入れる
//  - 販売実績：スマホでは装着パーツを折りたたむ
import { h, render } from '../lib/dom.js';

const yen = n => `${(n / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万円`;
const km = n => `${n.toLocaleString('ja-JP')}km`;
const SORTS = {
  new: { label: '新着順', fn: () => 0 },
  low: { label: '価格が安い順', fn: (a, b) => a.price - b.price },
  high: { label: '価格が高い順', fn: (a, b) => b.price - a.price },
  km: { label: '走行距離が少ない順', fn: (a, b) => a.km - b.km },
};

// 車種タイプ別のシルエット（写真の代わり）
function silhouette(type, color) {
  const NS = 'http://www.w3.org/2000/svg';
  const s = (tag, attrs) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  };
  const body = {
    naked: 'M62 70 L88 46 L120 44 L132 36 L150 38 L160 52 L176 56 L150 70 Z',
    ss: 'M58 72 L80 44 L118 40 L150 30 L172 44 L176 62 L150 72 Z',
    mini: 'M74 70 L92 48 L118 48 L130 40 L146 42 L150 58 L132 70 Z',
  }[type] ?? '';
  const svg = s('svg', { viewBox: '0 0 240 110', class: 'bike-img', 'aria-hidden': 'true' });
  const r = type === 'mini' ? 20 : 24;
  svg.append(
    s('rect', { width: 240, height: 110, fill: '#1d1f23' }),
    s('path', { d: 'M0 96 H240', stroke: '#34383e', 'stroke-width': 2 }),
    s('circle', { cx: 64, cy: 96 - r, r, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 5 }),
    s('circle', { cx: 176, cy: 96 - r, r, fill: 'none', stroke: '#9aa0a8', 'stroke-width': 5 }),
    s('path', { d: body, fill: color, stroke: '#141518', 'stroke-width': 2, transform: type === 'mini' ? 'translate(0 8)' : '' }),
    s('path', { d: 'M64 72 L100 72 M176 72 L150 50', stroke: '#9aa0a8', 'stroke-width': 4, 'stroke-linecap': 'round' }),
  );
  return svg;
}

function stockCard(b, open) {
  return h('li', {},
    h('button', { type: 'button', class: 'stock-card', onclick: () => open(b), 'aria-haspopup': 'dialog' },
      silhouette(b.type, b.color),
      h('span', { class: 'sc-body' },
        h('span', { class: 'sc-maker' }, b.maker),
        h('span', { class: 'sc-model' }, b.model),
        h('span', { class: 'sc-spec' }, `${b.year}年 ／ ${km(b.km)} ／ ${b.cc}cc`),
        h('span', { class: 'sc-price num' }, yen(b.price), h('small', {}, '支払総額')),
        h('span', { class: 'sc-tags' }, b.tags.map(t => h('span', {}, t))),
      ),
    ),
  );
}

function soldCard(b) {
  return h('article', { class: 'bike' },
    h('header', {},
      h('span', { class: 'bike-maker' }, b.maker),
      h('h4', {}, b.model),
      h('span', { class: 'bike-status' }, b.status),
    ),
    h('dl', { class: 'bike-spec' }, b.spec.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))),
    h('p', {}, b.text),
    h('details', { class: 'bike-parts' },
      h('summary', {}, `装着パーツ（${b.parts.length}点）`),
      h('ul', {}, b.parts.map(p => h('li', {}, p))),
    ),
  );
}

function inquire(b) {
  const form = document.querySelector('.form');
  if (!form) return;
  form.elements.bike.value = `${b.maker} ${b.model}（在庫車両）`;
  form.elements.topic.value = '車両購入・買取';
  if (!form.elements.body.value) form.elements.body.value = 'この車両について詳しく知りたいです。';
  (form.closest('.form-wrap') ?? form).scrollIntoView({ behavior: 'smooth' });
  form.elements.name.focus({ preventScroll: true });
}

export default {
  name: 'bikes',
  data: ['bikes'],
  init(el, { bikes }) {
    const state = { maker: 'ALL', sort: 'new' };
    const makers = ['ALL', ...new Set(bikes.stock.map(b => b.maker))];
    const list = h('ul', { class: 'stock-list', 'aria-live': 'polite' });
    const count = h('span', { class: 'stock-count' });

    const dialogBody = h('div', { class: 'dlg-body' });
    const dialog = h('dialog', { class: 'dlg', 'aria-labelledby': 'dlg-title', onclick: e => { if (e.target === dialog) dialog.close(); } },
      h('button', { type: 'button', class: 'dlg-close', 'aria-label': '閉じる', onclick: () => dialog.close() }, '×'),
      dialogBody,
    );

    function open(b) {
      render(dialogBody,
        silhouette(b.type, b.color),
        h('p', { class: 'sc-maker' }, b.maker),
        h('h3', { id: 'dlg-title' }, b.model),
        h('p', { class: 'dlg-price num' }, yen(b.price), h('small', {}, '支払総額（税込・諸費用込）')),
        h('dl', { class: 'dlg-spec' }, [['年式', `${b.year}年`], ['走行距離', km(b.km)], ['排気量', `${b.cc}cc`], ['車検', b.shaken]]
          .map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))),
        h('p', {}, b.text),
        h('p', { class: 'dlg-sub' }, '装着パーツ'),
        h('ul', { class: 'dlg-parts' }, b.parts.map(p => h('li', {}, p))),
        h('div', { class: 'dlg-actions' },
          h('button', { type: 'button', class: 'btn btn-primary', onclick: () => { dialog.close(); inquire(b); } }, 'この車両について問い合わせる'),
        ),
        h('p', { class: 'dlg-note' }, bikes.demoNote),
      );
      dialog.showModal();
    }

    function update() {
      const shown = bikes.stock
        .filter(b => state.maker === 'ALL' || b.maker === state.maker)
        .slice().sort(SORTS[state.sort].fn);
      render(list, shown.map(b => stockCard(b, open)));
      count.textContent = `${shown.length}台`;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.maker === state.maker)));
    }

    const chips = makers.map(m => h('button', {
      type: 'button', class: 'chip', dataset: { maker: m },
      onclick: () => { state.maker = m; update(); },
    }, m === 'ALL' ? 'すべて' : m));
    const sort = h('select', { 'aria-label': '並び替え', onchange: e => { state.sort = e.target.value; update(); } },
      Object.entries(SORTS).map(([k, v]) => h('option', { value: k }, v.label)));

    render(el,
      h('p', { class: 'bikes-lead' }, bikes.lead),
      h('div', { class: 'stock-tools' },
        h('div', { class: 'chips', role: 'group', 'aria-label': 'メーカーで絞り込み' }, chips),
        h('div', { class: 'stock-sort' }, count, sort),
      ),
      list,
      h('p', { class: 'demo-note' }, bikes.demoNote),
      h('h3', { class: 'sold-head' }, '販売実績'),
      h('div', { class: 'bike-grid' }, bikes.sold.map(soldCard)),
      dialog,
    );
    update();

    // 販売実績のパーツ一覧は PC では最初から開いておく
    const wide = matchMedia('(min-width: 900px)');
    const sync = () => el.querySelectorAll('.bike-parts').forEach(d => { d.open = wide.matches; });
    wide.addEventListener('change', sync);
    sync();
  },
};
