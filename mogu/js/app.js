// エントリーポイント。registry.js に登録されたモジュールを順に起動する。
//  - global: true      … ページ全体に 1 回だけ起動
//  - それ以外          … HTML の <div data-module="名前"> ごとに起動
//  - late: true        … 他のモジュールの描画が終わってから起動
// どれか 1 つが失敗しても、他のモジュールは動き続ける。
import modules from './registry.js';
import { load } from './lib/data.js';

const byName = new Map(modules.map(m => [m.name, m]));

async function mount(mod, el) {
  const entries = await Promise.all((mod.data ?? []).map(async name => [name, await load(name)]));
  await mod.init(el, Object.fromEntries(entries));
}

async function run(jobs) {
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === 'rejected') console.error(r.reason);
}

const jobs = modules.filter(m => m.global && !m.late).map(m => mount(m, document));
for (const el of document.querySelectorAll('[data-module]')) {
  const mod = byName.get(el.dataset.module);
  if (mod) jobs.push(mount(mod, el));
  else console.warn(`unknown module: ${el.dataset.module}`);
}
await run(jobs);
await run(modules.filter(m => m.global && m.late).map(m => mount(m, document)));
document.documentElement.classList.add('ready');
