// .reveal の要素を、画面に入ったらふわっと表示する
export default {
  name: 'reveal',
  global: true,
  late: true,
  init() {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  },
};
