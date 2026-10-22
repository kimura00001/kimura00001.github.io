// 作業ブログ（data/blog.json）。blog.html で一覧と記事を切り替えて表示する。
//   blog.html            … 一覧
//   blog.html#cat=carb   … カテゴリで絞り込み
//   blog.html#post=xxx   … 記事
// PC：右にカテゴリ一覧を固定。スマホ：上部の横スクロールのカテゴリチップ。
import { h, render } from '../lib/dom.js';

export const formatDate = iso => iso.replaceAll('-', '.');

export function postCard(p, cats) {
  return h('a', { class: 'post-card', href: `blog.html#post=${p.id}` },
    h('span', { class: 'post-meta' }, h('time', { datetime: p.date }, formatDate(p.date)), h('span', { class: 'post-cat' }, cats.get(p.cat))),
    h('span', { class: 'post-title' }, p.title),
    h('span', { class: 'post-summary' }, p.summary),
  );
}

function parseHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  return { post: params.get('post'), cat: params.get('cat') };
}

export default {
  name: 'blog',
  data: ['blog'],
  init(el, { blog }) {
    const cats = new Map(blog.categories.map(c => [c.id, c.label]));
    const posts = blog.posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    const count = id => posts.filter(p => !id || p.cat === id).length;

    const catLinks = [{ id: null, label: 'すべて' }, ...blog.categories].map(c => h('a', {
      href: c.id ? `#cat=${c.id}` : '#', class: 'cat-link', dataset: { cat: c.id ?? '' },
    }, c.label, h('span', {}, String(count(c.id)))));
    const side = h('nav', { class: 'blog-cats', 'aria-label': 'カテゴリ' }, h('p', { class: 'blog-cats-head' }, 'カテゴリ'), h('div', {}, catLinks));
    const main = h('div', { class: 'blog-main' });

    function list(cat) {
      const shown = posts.filter(p => !cat || p.cat === cat);
      render(main,
        h('h2', { class: 'blog-h' }, cat ? cats.get(cat) : '新着記事', h('small', {}, `${shown.length}件`)),
        h('ul', { class: 'post-list' }, shown.map(p => h('li', {}, postCard(p, cats)))),
        h('p', { class: 'demo-note' }, blog.demoNote),
      );
    }

    function article(p) {
      const i = posts.indexOf(p);
      const newer = posts[i - 1], older = posts[i + 1];
      render(main,
        h('article', { class: 'post' },
          h('a', { class: 'post-back', href: `#cat=${p.cat}` }, `← ${cats.get(p.cat)}の記事一覧`),
          h('p', { class: 'post-meta' }, h('time', { datetime: p.date }, formatDate(p.date)), h('span', { class: 'post-cat' }, cats.get(p.cat))),
          h('h2', {}, p.title),
          p.result && h('dl', { class: 'post-result' }, p.result.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))),
          p.body.map(t => h('p', {}, t)),
          h('div', { class: 'post-photo', role: 'img', 'aria-label': '作業写真（差し替え予定）' }, '作業写真が入ります'),
          h('aside', { class: 'post-cta' },
            h('p', {}, '同じような症状・ご相談はお気軽にどうぞ。'),
            h('a', { class: 'btn btn-primary', href: 'index.html#contact' }, '相談してみる'),
          ),
          h('nav', { class: 'ch-pager', 'aria-label': '前後の記事' },
            older ? h('a', { href: `#post=${older.id}`, class: 'prev' }, h('small', {}, '← 前の記事'), older.title) : h('span'),
            newer ? h('a', { href: `#post=${newer.id}`, class: 'next' }, h('small', {}, '次の記事 →'), newer.title) : h('span'),
          ),
        ),
      );
      document.title = `${p.title}｜作業ブログ`;
    }

    function route() {
      const { post, cat } = parseHash();
      const p = post && posts.find(x => x.id === post);
      if (p) article(p); else list(cats.has(cat) ? cat : null);
      const active = p ? p.cat : (cats.has(cat) ? cat : '');
      catLinks.forEach(a => (a.dataset.cat === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      catLinks.find(a => a.hasAttribute('aria-current'))?.scrollIntoView({ block: 'nearest', inline: 'center' });
    }

    render(el, h('div', { class: 'blog-grid' }, side, main));
    addEventListener('hashchange', () => {
      route();
      el.scrollIntoView({ block: 'start' });
    });
    route();
  },
};
