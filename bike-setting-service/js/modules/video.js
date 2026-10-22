// YouTube 動画（data/shop.json の youtubeId）。
// 最初は再生ボタンだけを表示し、押されたときに youtube-nocookie の iframe を読み込む（初期表示を軽くする）。
import { h, render } from '../lib/dom.js';

export default {
  name: 'video',
  data: ['shop'],
  init(el, { shop }) {
    // 動画 ID が無いとき（デモ中）は差し替え予定の枠だけ出す
    if (!/^[\w-]{11}$/.test(shop.youtubeId ?? '')) {
      render(el, h('div', { class: 'video-facade is-empty' },
        h('span', { class: 'video-play', 'aria-hidden': 'true' }),
        h('span', { class: 'video-label' }, h('small', {}, 'MOVIE'), '店舗・作業の様子の動画が入ります'),
      ));
      return;
    }
    const play = () => render(el, h('iframe', {
      src: `https://www.youtube-nocookie.com/embed/${shop.youtubeId}?autoplay=1&rel=0`,
      title: '店舗紹介動画', allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: true,
    }));
    render(el, h('button', { type: 'button', class: 'video-facade', onclick: play, 'aria-label': '動画を再生（YouTube）' },
      h('span', { class: 'video-play', 'aria-hidden': 'true' }),
      h('span', { class: 'video-label' }, h('small', {}, 'MOVIE'), '店舗・作業の様子を動画で'),
    ));
  },
};
