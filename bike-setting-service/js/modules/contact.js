// お問い合わせフォーム（旧サイトのメールフォームと同じ項目）。
// サーバーを持たない静的サイトなので、入力内容を文章にまとめて LINE 公式アカウントの
// トーク画面に下書きとして渡す（送信は LINE 側で行う）。LINE を使わない人向けにコピーも用意する。
import { h, render } from '../lib/dom.js';

const FIELDS = [
  { name: 'name', label: 'お名前', required: true, autocomplete: 'name' },
  { name: 'tel', label: 'お電話番号', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel' },
  { name: 'area', label: 'ご住所（市区町村まででOK）', required: true, autocomplete: 'address-level2' },
  { name: 'email', label: 'メールアドレス', type: 'email', autocomplete: 'email', inputmode: 'email' },
  { name: 'bike', label: 'バイク（車種・年式など）', required: true, placeholder: '例）ZRX1200 DAEG 2015年式', wide: true },
  { name: 'topic', label: 'ご用件', type: 'select', wide: true, options: ['セッティング', 'パワーチェック', 'オーバーホール', '車検・メンテナンス', 'カスタム', '車両購入・買取', '事故修理・引き上げ', '保険', 'オリジナル商品', 'その他'] },
  { name: 'body', label: 'お問い合わせ内容', type: 'textarea', required: true, wide: true, placeholder: '気になっている症状や、やりたいことをご自由にどうぞ' },
  { name: 'callback', label: '折り返しのお電話', type: 'radio', wide: true, options: ['不要', '希望する'] },
];

function field(f) {
  const fid = `f-${f.name}`;
  if (f.type === 'radio') {
    return h('fieldset', { class: 'field wide' }, h('legend', {}, f.label),
      h('div', { class: 'radios' }, f.options.map((o, i) => h('label', { class: 'radio' },
        h('input', { type: 'radio', name: f.name, value: o, checked: i === 0 }), h('span', {}, o)))));
  }
  let input;
  if (f.type === 'textarea') input = h('textarea', { id: fid, name: f.name, rows: '6', required: f.required, placeholder: f.placeholder });
  else if (f.type === 'select') input = h('select', { id: fid, name: f.name }, f.options.map(o => h('option', {}, o)));
  else input = h('input', { id: fid, name: f.name, type: f.type ?? 'text', required: f.required, autocomplete: f.autocomplete, inputmode: f.inputmode, placeholder: f.placeholder });
  return h('div', { class: `field${f.wide ? ' wide' : ''}` },
    h('label', { for: fid }, f.label, f.required && h('span', { class: 'req' }, '必須')),
    input,
  );
}

function compose(form) {
  const data = new FormData(form);
  const lines = ['【ホームページからのお問い合わせ】'];
  for (const f of FIELDS) {
    const v = String(data.get(f.name) ?? '').trim();
    if (v) lines.push(f.type === 'textarea' ? `■${f.label}\n${v}` : `■${f.label}：${v}`);
  }
  return lines.join('\n');
}

export default {
  name: 'contact',
  data: ['shop'],
  init(el, { shop }) {
    const status = h('p', { class: 'form-status', role: 'status', 'aria-live': 'polite' });
    const preview = h('textarea', { class: 'form-preview', readonly: true, rows: '8', 'aria-label': '送信する内容' });
    const after = h('div', { class: 'form-after', hidden: true },
      h('p', {}, 'LINE が開かない場合は、この内容をコピーして LINE かお電話でお伝えください。'),
      preview,
      h('button', { type: 'button', class: 'btn btn-ghost', onclick: copy }, '内容をコピー'),
    );
    const form = h('form', { class: 'form', novalidate: true, onsubmit: submit },
      h('div', { class: 'form-grid' }, FIELDS.map(field)),
      h('div', { class: 'form-actions' },
        h('button', { type: 'submit', class: 'btn btn-line' }, 'LINE で送る'),
        h('p', { class: 'form-help' }, '入力内容が LINE のトーク画面に下書きされます。内容を確認して送信してください。'),
      ),
      status,
    );

    function submit(e) {
      e.preventDefault();
      const invalid = [...form.elements].find(x => x.willValidate && !x.checkValidity());
      if (invalid) {
        form.classList.add('checked');
        status.textContent = '未入力の必須項目があります。';
        invalid.focus();
        return;
      }
      const text = compose(form);
      preview.value = text;
      after.hidden = false;
      if (shop.demo) {
        status.textContent = 'デモのため送信されません。実際はこの内容が LINE に下書きされます。';
        after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
      status.textContent = 'LINE を開いています…';
      window.open(`${shop.lineMessageUrl}?${encodeURIComponent(text)}`, '_blank', 'noopener');
    }

    async function copy() {
      try {
        await navigator.clipboard.writeText(preview.value);
        status.textContent = 'コピーしました。';
      } catch {
        preview.select();
        status.textContent = '選択しました。長押し（または Ctrl+C）でコピーしてください。';
      }
    }

    render(el, form, after);
  },
};
