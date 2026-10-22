// トップページの「作業ブログ」新着（data/blog.json の新しい順に 3 件）
import { h, render } from '../lib/dom.js';
import { postCard } from './blog.js';

export default {
  name: 'latest',
  data: ['blog'],
  init(el, { blog }) {
    const cats = new Map(blog.categories.map(c => [c.id, c.label]));
    const posts = blog.posts.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
    render(el,
      h('ul', { class: 'post-list is-latest' }, posts.map(p => h('li', {}, postCard(p, cats)))),
      h('a', { class: 'svc-more', href: 'blog.html' }, '作業ブログをもっと見る', h('span', { 'aria-hidden': 'true' }, ' →')),
    );
  },
};
