// 連載「セッティングとは？」（data/articles.json）
// PC：左に固定の目次、読んでいる話をハイライト。スマホ：上部に固定した横スクロール目次＋各話末の前後リンク。
import { h, render } from '../lib/dom.js';
import { chart } from './charts.js';

const id = i => `ch${i + 1}`;

function chapter(c, i, list) {
  const prev = list[i - 1], next = list[i + 1];
  return h('article', { class: 'chapter', id: id(i), 'aria-labelledby': `${id(i)}-t` },
    h('header', {},
      h('span', { class: 'ch-no' }, c.no),
      h('h2', { id: `${id(i)}-t` }, c.title),
      h('p', { class: 'ch-sub' }, c.sub),
    ),
    c.chart && h('figure', { class: 'ch-figure' }, chart(c.chart), h('figcaption', {}, '※ イメージ図')),
    c.body.map(p => h('p', {}, p)),
    c.points && h('dl', { class: 'ch-points' }, c.points.map(p => h('div', {}, h('dt', {}, p.name), h('dd', {}, p.text)))),
    c.effect && h('aside', { class: 'ch-effect' }, h('b', {}, 'エンジンに与える影響'), h('p', {}, c.effect)),
    h('nav', { class: 'ch-pager', 'aria-label': '前後の話' },
      prev ? h('a', { href: `#${id(i - 1)}`, class: 'prev' }, h('small', {}, '← 前の話'), `${prev.no} ${prev.title}`) : h('span'),
      next ? h('a', { href: `#${id(i + 1)}`, class: 'next' }, h('small', {}, '次の話 →'), `${next.no} ${next.title}`)
        : h('a', { href: 'index.html#contact', class: 'next is-cta' }, h('small', {}, '読み終えたら'), 'セッティングを相談する'),
    ),
  );
}

export default {
  name: 'articles',
  data: ['articles'],
  init(el, { articles }) {
    const list = articles.chapters;
    const tocLinks = list.map((c, i) => h('a', { href: `#${id(i)}` }, h('span', {}, c.no), c.title));
    const toc = h('nav', { class: 'toc', 'aria-label': '目次' },
      h('p', { class: 'toc-head' }, '目次'),
      h('ol', {}, tocLinks.map(a => h('li', {}, a))),
    );
    render(el,
      h('div', { class: 'read-grid' },
        toc,
        h('div', { class: 'chapters' }, list.map(chapter), h('p', { class: 'author' }, articles.author)),
      ),
    );

    // 今読んでいる話を目次でハイライトし、スマホの横スクロール目次はその位置まで送る
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const i = list.findIndex((_, j) => id(j) === en.target.id);
        tocLinks.forEach((a, j) => (j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
        const a = tocLinks[i];
        const ol = a.closest('ol');
        if (ol.scrollWidth > ol.clientWidth) ol.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
      }
    }, { rootMargin: '-35% 0px -60% 0px' });
    el.querySelectorAll('.chapter').forEach(c => io.observe(c));
  },
};
