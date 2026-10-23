// 登場人物。data/characters.json
//  "art" はスプライトの id（mogu / chisato / mayor）か画像のパス
import { h, render } from '../lib/dom.js';
import { art } from '../lib/art.js';

export default {
  name: 'characters',
  data: ['characters'],
  init(el, { characters }) {
    render(el, h('div', { class: 'chars' }, characters.map((c, i) =>
      h('article', { class: 'char reveal' },
        art(c.art, 'char-art', c.name),
        h('div', {},
          h('p', { class: 'char-role' }, c.role),
          h('h3', { class: 'char-name', dataset: i === 0 ? { uneasy: '' } : {} },
            c.ruby && c.ruby !== c.name ? h('ruby', {}, c.name, h('rt', {}, c.ruby)) : c.name),
          h('p', { class: 'char-text' }, c.text),
          c.profile?.length && h('dl', { class: 'char-profile' },
            c.profile.map(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])),
        ),
      ),
    )));
  },
};
