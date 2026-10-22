// 連載ページの図（空燃比のイメージグラフ）。数値は説明用のイラスト。
// 縦軸：空燃比 11〜16（上が濃い）、横軸：回転数。13:1 の基準線を赤で引く。
const NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  el.append(...children);
  return el;
}

const W = 360, H = 230, L = 44, R = 344, T = 16, B = 188;
const y = afr => T + (afr - 11) / 5 * (B - T);

function frame(legend) {
  const g = svg('g', { class: 'ch-frame' });
  for (let a = 11; a <= 16; a++) {
    g.append(svg('line', { x1: L, x2: R, y1: y(a), y2: y(a) }));
    g.append(svg('text', { x: L - 8, y: y(a) + 4, 'text-anchor': 'end' }, `${a}`));
  }
  g.append(svg('text', { x: L, y: B + 18 }, '低回転'), svg('text', { x: R, y: B + 18, 'text-anchor': 'end' }, '高回転'));
  g.append(svg('text', { x: 6, y: T + 4, class: 'ch-side' }, '濃'), svg('text', { x: 6, y: B, class: 'ch-side' }, '薄'));
  g.append(svg('line', { x1: L, x2: R, y1: y(13), y2: y(13), class: 'ch-base' }));
  const lg = svg('g', { class: 'ch-legend', transform: `translate(8 ${H - 4})` });
  legend.forEach(([cls, label], i) => {
    lg.append(svg('line', { x1: i * 118, x2: i * 118 + 16, y1: -4, y2: -4, class: cls }), svg('text', { x: i * 118 + 22, y: 0 }, label));
  });
  return [g, lg];
}

const line = (d, cls) => svg('path', { d, class: cls });

const charts = {
  scale() {
    const bands = [
      [11, 12, 'rich', '濃い', '12:1以下'],
      [12.5, 13.5, 'good', '適正', '12.5〜13.5:1'],
      [14, 16, 'lean', '薄い', '14:1以上'],
    ];
    const x = afr => 20 + (afr - 11) / 5 * 320;
    const root = svg('svg', { viewBox: '0 0 360 150', class: 'chart chart-scale', role: 'img', 'aria-label': '空燃比の目安。12:1以下は濃い、12.5〜13.5:1が適正、14:1以上は薄い。理論空燃比は14.7:1' });
    root.append(svg('rect', { x: 20, y: 40, width: 320, height: 22, class: 'scale-bar' }));
    for (const [a, b, cls, label, note] of bands) {
      root.append(svg('rect', { x: x(a), y: 40, width: x(b) - x(a), height: 22, class: `scale-${cls}` }));
      root.append(svg('text', { x: (x(a) + x(b)) / 2, y: 82, 'text-anchor': 'middle', class: 'scale-label' }, label));
      root.append(svg('text', { x: (x(a) + x(b)) / 2, y: 98, 'text-anchor': 'middle', class: 'scale-note' }, note));
    }
    for (let a = 11; a <= 16; a++) root.append(svg('text', { x: x(a), y: 32, 'text-anchor': 'middle', class: 'scale-tick' }, `${a}`));
    root.append(svg('line', { x1: x(14.7), x2: x(14.7), y1: 36, y2: 126, class: 'scale-marker' }), svg('text', { x: x(14.7), y: 142, 'text-anchor': 'middle', class: 'scale-note' }, '理論空燃比 14.7'));
    root.append(svg('text', { x: 20, y: 14, class: 'scale-note' }, '← 濃い（ガソリン多め）'), svg('text', { x: 340, y: 14, 'text-anchor': 'end', class: 'scale-note' }, '薄い（空気多め）→'));
    return root;
  },
  adjust() {
    const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': 'セッティング前は開け始めが濃く途中から薄くなる。セッティング後は全回転域で13:1付近に揃う' });
    root.append(...frame([['ch-before', 'セッティング前'], ['ch-after', 'セッティング後'], ['ch-base', '基準 13:1']]));
    root.append(line(`M${L} ${y(11.4)} C90 ${y(11.6)} 110 ${y(15.2)} 150 ${y(15)} C190 ${y(14.8)} 200 ${y(13.3)} 240 ${y(13.4)} C280 ${y(13.6)} 300 ${y(14.6)} ${R} ${y(14.8)}`, 'ch-before'));
    root.append(line(`M${L} ${y(12.8)} C100 ${y(13.1)} 150 ${y(12.9)} 200 ${y(13.05)} C250 ${y(13.15)} 300 ${y(12.95)} ${R} ${y(13.05)}`, 'ch-after'));
    return root;
  },
  season() {
    const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart', role: 'img', 'aria-label': 'セッティング前のバイクは、夏は濃すぎる領域、冬は薄すぎる領域に触れる。セッティング後は季節で平行に動くだけ' });
    root.append(...frame([['ch-summer', '夏'], ['ch-winter', '冬'], ['ch-after', 'セッティング後']]));
    const base = [12.2, 14.4, 13.2, 14.2];
    const curve = off => `M${L} ${y(base[0] + off)} C110 ${y(base[0] + off)} 130 ${y(base[1] + off)} 180 ${y(base[1] + off)} C230 ${y(base[1] + off)} 250 ${y(base[2] + off)} 290 ${y(base[2] + off)} C320 ${y(base[2] + off)} 330 ${y(base[3] + off)} ${R} ${y(base[3] + off)}`;
    root.append(line(curve(-1), 'ch-summer'), line(curve(1.1), 'ch-winter'));
    root.append(line(`M${L} ${y(12.7)} H${R}`, 'ch-after'), line(`M${L} ${y(13.3)} H${R}`, 'ch-after'));
    root.append(svg('circle', { cx: L + 14, cy: y(11.2), r: 12, class: 'ch-warn' }), svg('text', { x: L + 30, y: y(11.2) + 4, class: 'ch-warn-t' }, '※1 濃すぎ'));
    root.append(svg('circle', { cx: 180, cy: y(15.5), r: 12, class: 'ch-warn' }), svg('text', { x: 198, y: y(15.5) + 4, class: 'ch-warn-t' }, '※2 薄すぎ'));
    return root;
  },
};

export function chart(name) {
  return charts[name]?.() ?? null;
}
