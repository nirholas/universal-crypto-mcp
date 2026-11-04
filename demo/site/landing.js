import { $, ago, api, fmt, h, mountAuth, usd } from '/kit/kit.js';

mountAuth({ appHref: '/app/' });

const skeletonTiles = (el, n) => el.replaceChildren(...Array.from({ length: n }, () => h('div', { class: 'card' }, h('div', { class: 'skeleton sk-sm' }), h('div', { class: 'skeleton sk-lg' }))));
const failed = (el, msg, retry) => el.replaceChildren(h('div', { class: 'card empty-inline' }, h('p', { class: 'kit-err' }, msg), h('button', { class: 'btn btn-sm', onclick: retry, type: 'button' }, 'Retry')));

async function loadLive() {
  const el = $('#ticker');
  if (!el.children.length) skeletonTiles(el, 7);
  try {
    const live = await api('/api/live');
    const ok = live.chains.filter((c) => !c.error && !c.testnet);
    if (!ok.length) {
      el.replaceChildren(h('div', { class: 'card empty-inline' }, h('p', { class: 'muted' }, 'No network responded just now. The board retries every minute.')));
      return;
    }
    el.replaceChildren(
      ...ok.map((c) =>
        h('div', { class: 'card kpi' },
          h('div', { class: 'l' }, c.name),
          h('div', { class: 'v tabular' }, `${fmt(c.gasPriceGwei, c.gasPriceGwei < 1 ? 4 : 2)} gwei`),
          h('div', { class: 'muted tabular' }, `${c.symbol} ${usd(c.nativeUsd)} · transfer ${c.transferUsd == null ? '—' : usd(c.transferUsd)}`),
          h('div', { class: 'gasbar', title: `Block ${c.blockNumber} · ${fmt(c.utilization ?? 0, 0)}% full` }, h('span', { style: `width:${Math.min(100, Math.round(c.utilization ?? 0))}%` })),
        ),
      ),
      h('p', { class: 'muted ticker-note' }, live.stale ? `Some RPCs are unavailable; showing data from ${ago(live.fetchedAt)}.` : `Updated ${ago(live.fetchedAt)} · bar shows how full the latest block is`),
    );
  } catch (e) {
    failed(el, `Gas board unavailable: ${e.message}`, loadLive);
  }
}

loadLive();
setInterval(loadLive, 60_000);
