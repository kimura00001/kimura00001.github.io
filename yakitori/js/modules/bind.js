// <span data-bind="name"> のような要素に data/shop.json の値を差し込む。
// 店名などを変えるときは shop.json を直すだけでページ全体に反映される。
export default {
  name: 'bind',
  global: true,
  data: ['shop'],
  init(root, { shop }) {
    for (const el of root.querySelectorAll('[data-bind]')) {
      const value = shop[el.dataset.bind];
      if (typeof value === 'string') el.textContent = value;
    }
    document.title = `${shop.name}｜${shop.genre}`;
  },
};
