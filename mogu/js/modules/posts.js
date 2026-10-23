// 最近の投稿。data/posts.json
//  site.json の "embedPosts": false … 自前のカードで表示（X が重い・消えた時も崩れない）
//  site.json の "embedPosts": true  … 本物の X 埋め込みにする（posts.json の url は実際のポストの URL に）
import { h, render } from '../lib/dom.js';
import { art, fmtDate } from '../lib/art.js';

const X_POST = /^https:\/\/(x|twitter)\.com\/[^/]+\/status\/\d+/;

export default {
  name: 'posts',
  data: ['posts', 'site'],
  init(el, { posts, site }) {
    const profile = site.authorX ? `https://x.com/${site.authorX}` : null;
    const more = profile && h('p', { class: 'posts-more' },
      h('a', { class: 'btn btn-primary', href: profile, target: '_blank', rel: 'noopener' }, 'Xで もっと見る'));

    const embeddable = site.embedPosts && posts.filter(p => X_POST.test(p.url));
    if (embeddable?.length) {
      render(el, h('div', { class: 'posts' }, embeddable.map(p =>
        h('blockquote', { class: 'twitter-tweet', 'data-lang': 'ja', 'data-dnt': 'true' },
          h('a', { href: p.url.replace('twitter.com', 'x.com') }, p.text ?? p.url)))), more);
      const s = document.createElement('script');
      s.src = 'https://platform.twitter.com/widgets.js';
      s.async = true;
      document.head.append(s);
      return;
    }

    render(el, h('div', { class: 'posts' }, posts.map(p =>
      h('article', { class: 'post reveal' },
        h('div', { class: 'post-head' },
          art('mogu', 'post-avatar'),
          h('div', {},
            h('p', { class: 'post-name' }, site.author),
            site.authorX && h('p', { class: 'post-handle' }, `@${site.authorX} ・ ${fmtDate(p.date)}`)),
          art('ico-x', 'post-x')),
        h('p', { class: 'post-text' }, p.text),
        p.image && h('div', { class: `post-image tone-${p.image}` }, art(/[./]/.test(p.image) ? p.image : 'mogu')),
        h('div', { class: 'post-foot' },
          p.likes != null && h('span', {}, art('ico-heart'), p.likes.toLocaleString()),
          p.reposts != null && h('span', {}, art('ico-repost'), p.reposts.toLocaleString()),
          h('a', { href: p.url, target: '_blank', rel: 'noopener' }, 'Xで見る →')),
      ),
    )), more);
  },
};
