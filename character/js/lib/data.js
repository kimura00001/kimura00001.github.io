// data/<name>.json を読み込む。同じファイルは一度だけ取得してキャッシュする。
const cache = new Map();

export function load(name) {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`invalid data name: ${name}`);
  if (!cache.has(name)) {
    cache.set(name, fetch(`data/${name}.json`, { cache: 'no-cache' }).then(res => {
      if (!res.ok) throw new Error(`failed to load data/${name}.json (${res.status})`);
      return res.json();
    }));
  }
  return cache.get(name);
}
