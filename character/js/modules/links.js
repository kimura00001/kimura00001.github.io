// SNS・ショップへのリンク。data/links.json
//  "icon": x / pixiv / instagram / youtube / shop / stamp（それ以外はリンクのアイコン）
import { h, render } from '../lib/dom.js';
import { art } from '../lib/art.js';

const ICONS = ['x', 'pixiv', 'instagram', 'youtube', 'shop', 'stamp'];

export default {
  name: 'links',
  data: ['links'],
  init(el, { links }) {
    render(el, h('div', { class: 'links' }, links.map(l =>
      h('a', { class: 'link reveal', href: l.url, target: '_blank', rel: 'noopener' },
        art(`ico-${ICONS.includes(l.icon) ? l.icon : 'link'}`, 'link-icon'),
        h('span', {},
          h('span', { class: 'link-label' }, l.label),
          l.sub && h('span', { class: 'link-sub' }, l.sub)),
      ),
    )));
  },
};
