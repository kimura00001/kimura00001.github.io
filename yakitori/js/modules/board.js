// 黒板：本日のおすすめ と お知らせ（data/board.json）
import { h, render } from '../lib/dom.js';

const formatDate = iso => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y}.${m}.${d}`;
};

export default {
  name: 'board',
  data: ['board'],
  init(el, { board }) {
    render(el,
      h('div', { class: 'board' },
        h('h3', {}, board.title),
        h('ul', { class: 'board-items' },
          board.items.map(item => h('li', {},
            h('span', { class: 'board-name' }, item.name),
            item.desc && h('span', { class: 'board-desc' }, item.desc),
          )),
        ),
        board.news?.length > 0 && h('div', { class: 'board-news' },
          h('span', { class: 'board-news-label' }, 'お知らせ'),
          board.news.map(n => h('p', {}, h('time', { datetime: n.date }, formatDate(n.date)), n.text)),
        ),
        h('span', { class: 'chalk', 'aria-hidden': 'true' }),
      ),
    );
  },
};
