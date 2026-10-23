// <span data-bind="title"> のような要素に data/site.json の値を差し込む。
// <a data-href="latestUrl"> はリンク先を差し替える。
export default {
  name: 'bind',
  global: true,
  data: ['site'],
  init(root, { site }) {
    for (const el of root.querySelectorAll('[data-bind]')) {
      const value = site[el.dataset.bind];
      if (typeof value === 'string') el.textContent = value;
    }
    for (const el of root.querySelectorAll('[data-href]')) {
      const value = site[el.dataset.href];
      if (typeof value === 'string' && /^https?:\/\/|^#/.test(value)) el.href = value;
    }
    document.title = `${site.title}｜公式サイト`;
  },
};
