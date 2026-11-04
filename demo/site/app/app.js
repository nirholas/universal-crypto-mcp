import { $, $$, ago, api, busy, confirmDialog, copy, evm, fmt, gate, h, mountAuth, mountKeys, mountUsage, short, switchEvmChain, tabs, toast, usd, user } from '/kit/kit.js';

mountAuth({ appHref: '/app/' });

const skel = (rows = 3) => h('div', { class: 'stack' }, Array.from({ length: rows }, () => h('div', { class: 'skeleton sk-row' })));
const empty = (text) => h('p', { class: 'empty-inline muted' }, text);
const tile = (label, value, extra) => h('div', { class: 'card kpi' }, h('div', { class: 'l' }, label), h('div', { class: 'v' }, value), extra ? h('div', { class: 'muted' }, extra) : null);
const table = (head, rows) => h('div', { class: 'table-wrap' }, h('table', { class: 'table' }, h('thead', {}, h('tr', {}, head.map((c) => h('th', {}, c)))), h('tbody', {}, rows)));
const formData = (form) => Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));
const link = (href, text) => h('a', { href, rel: 'noopener', target: '_blank' }, text);
const amt = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n === 0 ? '0' : n < 0.0001 ? n.toExponential(2) : fmt(n, n < 1 ? 6 : 4);
};

async function section(el, load, render, { quiet = false } = {}) {
  if (!quiet || !el.children.length) el.replaceChildren(skel());
  try {
    el.replaceChildren(...[render(await load())].flat());
  } catch (e) {
    el.replaceChildren(h('div', { class: 'empty-inline' }, h('p', { class: 'kit-err' }, e.message), h('button', { class: 'btn btn-sm', onclick: () => section(el, load, render), type: 'button' }, 'Retry')));
  }
}

const removeButton = (label, text, path, after) =>
  h('button', {
    'aria-label': label,
    class: 'btn btn-sm btn-ghost',
    onclick: async (ev) => {
      if (!(await confirmDialog(text, 'Delete'))) return;
      await busy(ev.currentTarget, async () => {
        await api(path, { method: 'DELETE' });
        toast('Deleted', 'success');
        after();
      });
    },
    type: 'button',
  }, 'Delete');

const run = (name, args) => api(`/api/run/${encodeURIComponent(name)}`, { body: args }).then((r) => r.result);

/* ---------------------------------------------------------------- chains */

let chains = [];
const chainByKey = (k) => chains.find((c) => c.key === k) ?? null;

async function loadChains() {
  ({ chains } = await api('/api/chains'));
  for (const sel of $$('select[data-chains]')) {
    const kind = sel.dataset.chains;
    const list = chains.filter((c) => !c.testnet && (kind !== 'swaps' || c.swaps));
    sel.replaceChildren(...list.map((c) => h('option', { value: c.key }, c.name)));
  }
  const to = $('#bridge-form').toChain;
  if ([...to.options].some((o) => o.value === 'arbitrum')) to.value = 'arbitrum';
  const from = $('#bridge-form').fromChain;
  if ([...from.options].some((o) => o.value === 'base')) from.value = 'base';
}

/* ---------------------------------------------------------------- portfolio */

function holdingsTable(p) {
  if (!p.holdings.length) return empty(`No balances found on the ${p.chainsScanned} networks scanned.`);
  const rows = [...p.holdings].sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0)).map((x) => {
    const c = chainByKey(x.chain);
    const tokenCell = x.native ? h('span', { class: 'muted' }, 'native') : c ? link(`${c.explorer}/token/${x.token}`, short(x.token, 4)) : short(x.token, 4);
    return h('tr', {}, h('td', {}, x.chainName), h('td', {}, h('strong', {}, x.symbol), ' ', tokenCell), h('td', { class: 'tabular' }, amt(x.amount)), h('td', { class: 'tabular' }, x.priceUsd == null ? '—' : usd(x.priceUsd)), h('td', { class: 'tabular' }, x.valueUsd == null ? '—' : usd(x.valueUsd)));
  });
  return table(['Network', 'Asset', 'Balance', 'Price', 'Value'], rows);
}

function portfolioView(p) {
  const failed = p.chainsFailed?.length ? h('p', { class: 'muted' }, `Unreachable right now: ${p.chainsFailed.join(', ')}`) : null;
  return [
    h('div', { class: 'quote-grid' }, tile('Total value', usd(p.totalUsd)), tile('Assets held', String(p.holdings.length)), tile('Networks scanned', String(p.chainsScanned))),
    holdingsTable(p),
    failed,
    p.stale ? h('p', { class: 'muted' }, 'Some values are from cache because an RPC was slow.') : null,
  ];
}

function loadPortfolio() {
  const u = user();
  const el = $('#portfolio');
  if (u.chain !== 'evm') {
    el.replaceChildren(h('div', { class: 'callout' }, 'You signed in with a Solana wallet. UCM Cloud scans EVM networks, so add an EVM address under ', h('a', { href: '#watchlist' }, 'Watchlist'), ' to see its holdings.'));
    return;
  }
  section(el, () => run('get_portfolio', { address: u.address, testnets: $('#pf-testnets').checked }), portfolioView);
}

function loadGas() {
  section($('#gas'), () => api('/api/live'), (live) => {
    const rows = live.chains.map((c) => {
      if (c.error) return h('tr', {}, h('td', {}, c.name ?? c.chain), h('td', { class: 'kit-err', colspan: '5' }, c.error));
      return h('tr', {},
        h('td', {}, c.name, c.testnet ? h('span', { class: 'badge' }, 'testnet') : null),
        h('td', { class: 'tabular' }, `${fmt(c.gasPriceGwei, c.gasPriceGwei < 1 ? 4 : 2)} gwei`),
        h('td', { class: 'tabular' }, c.blockNumber),
        h('td', {}, h('div', { class: 'gasbar', title: `${fmt(c.utilization ?? 0, 0)}% full` }, h('span', { style: `width:${Math.min(100, Math.round(c.utilization ?? 0))}%` }))),
        h('td', { class: 'tabular' }, c.transferUsd == null ? '—' : usd(c.transferUsd)),
        h('td', { class: 'tabular muted' }, `${c.latencyMs} ms`),
      );
    });
    if (!rows.length) return empty('No networks configured.');
    return [table(['Network', 'Gas price', 'Block', 'Fullness', 'Transfer', 'RPC latency'], rows), h('p', { class: 'muted' }, `Updated ${ago(live.fetchedAt)}${live.stale ? ' · some RPCs unavailable' : ''}`)];
  });
}

/* ---------------------------------------------------------------- watchlist */

function scan(entry) {
  const box = h('div', { class: 'card stack' });
  $('#watch-detail').replaceChildren(box);
  const head = h('div', { class: 'row' }, h('h3', { class: 'grow' }, entry.label), h('code', { class: 'muted' }, short(entry.address, 6)));
  const body = h('div');
  box.replaceChildren(head, body);
  section(body, () => run('get_portfolio', { address: entry.address }), portfolioView);
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function loadWatchlist() {
  section($('#watchlist'), () => api('/api/watchlist'), ({ watchlist }) => {
    if (!watchlist.length) return empty('No addresses yet. Add a treasury, a whale or your own cold wallet above.');
    return table(['Label', 'Address', 'Added', ''], watchlist.map((w) => h('tr', {},
      h('td', {}, w.label),
      h('td', {}, h('code', { title: w.address }, short(w.address, 6)), ' ', h('button', { 'aria-label': 'Copy address', class: 'btn btn-sm btn-ghost', onclick: () => copy(w.address, 'Address copied'), type: 'button' }, 'Copy')),
      h('td', { class: 'muted' }, ago(w.created_at)),
      h('td', { class: 'row end' }, h('button', { class: 'btn btn-sm', onclick: () => scan(w), type: 'button' }, 'Scan'), removeButton(`Delete ${w.label}`, `Remove "${w.label}" from your watchlist?`, `/api/watchlist/${w.id}`, () => { $('#watch-detail').replaceChildren(); loadWatchlist(); })),
    )));
  });
}

/* ---------------------------------------------------------------- trade */

const pad64 = (hex) => hex.padStart(64, '0');
const toHex = (v) => `0x${BigInt(v).toString(16)}`;

async function waitReceipt(p, hash, status) {
  for (let i = 0; i < 120; i++) {
    const r = await p.request({ method: 'eth_getTransactionReceipt', params: [hash] });
    if (r) {
      if (r.status !== '0x1') throw new Error(`Transaction ${short(hash, 6)} reverted.`);
      return r;
    }
    status.textContent = `Waiting for ${short(hash, 6)} to confirm…`;
    await new Promise((res) => setTimeout(res, 2000));
  }
  throw new Error('The approval did not confirm within 4 minutes. Check your wallet, then quote again.');
}

async function execute(kind, req, first, status, btn) {
  const p = evm();
  if (!p) throw new Error('No Ethereum wallet detected.');
  const me = user().address.toLowerCase();
  const [acct] = await p.request({ method: 'eth_requestAccounts' });
  if (acct?.toLowerCase() !== me) throw new Error(`Switch your wallet to ${short(user().address, 6)}, the account you signed in with.`);
  const c = chains.find((x) => x.chainId === first.execution.chainId);
  if (!c) throw new Error('Unsupported network.');
  status.textContent = `Switching wallet to ${c.name}…`;
  await switchEvmChain({ currency: { decimals: 18, name: c.symbol, symbol: c.symbol }, explorer: c.explorer, id: c.chainId, name: c.name, rpc: c.rpc });

  let exec = first.execution;
  if (exec.approval?.needed) {
    const a = exec.approval;
    status.textContent = `Approve ${first.quote.tokenIn?.symbol ?? first.quote.fromToken?.symbol ?? 'the token'} in your wallet…`;
    const data = `0x095ea7b3${pad64(a.spender.toLowerCase().replace(/^0x/, ''))}${pad64(BigInt(a.amount).toString(16))}`;
    const hash = await p.request({ method: 'eth_sendTransaction', params: [{ data, from: acct, to: a.token }] });
    await waitReceipt(p, hash, status);
    status.textContent = 'Approved. Refreshing the route…';
    const fresh = await run(kind === 'swap' ? 'swap_quote' : 'bridge_quote', req);
    if (!fresh.execution) throw new Error('The route is no longer available. Quote again.');
    exec = fresh.execution;
  }
  status.textContent = 'Confirm the transaction in your wallet…';
  const hash = await p.request({ method: 'eth_sendTransaction', params: [{ data: exec.tx.data, from: acct, to: exec.tx.to, value: toHex(exec.tx.value ?? '0') }] });
  status.replaceChildren('Submitted: ', link(`${c.explorer}/tx/${hash}`, short(hash, 8)));
  toast('Transaction submitted', 'success');
  btn.hidden = true;
}

function quoteCard(kind, req, r) {
  const q = r.quote;
  const status = h('p', { class: 'muted' });
  const kpis = kind === 'swap'
    ? [
        tile('You pay', `${amt(q.amountIn)} ${q.tokenIn.symbol}`, q.amountInUsd == null ? null : usd(q.amountInUsd)),
        tile('You get', `${amt(q.amountOut)} ${q.tokenOut.symbol}`, q.amountOutUsd == null ? null : usd(q.amountOutUsd)),
        tile('Minimum out', `${amt(q.minAmountOut)} ${q.tokenOut.symbol}`, `${q.slippageBps / 100}% slippage`),
        tile('Price impact', q.priceImpactPct == null ? '—' : `${fmt(q.priceImpactPct, 2)}%`),
        tile('Gas', q.gasUsd == null ? '—' : usd(q.gasUsd)),
      ]
    : [
        tile('You send', `${amt(q.fromAmount)} ${q.fromToken.symbol}`, `${q.fromChain}${q.fromAmountUsd == null ? '' : ` · ${usd(q.fromAmountUsd)}`}`),
        tile('You receive', `${amt(q.toAmount)} ${q.toToken.symbol}`, `${q.toChain}${q.toAmountUsd == null ? '' : ` · ${usd(q.toAmountUsd)}`}`),
        tile('Minimum', `${amt(q.toAmountMin)} ${q.toToken.symbol}`),
        tile('Fees + gas', usd((q.feesUsd ?? 0) + (q.gasUsd ?? 0))),
        tile('ETA', q.durationSec == null ? '—' : `${Math.max(1, Math.round(q.durationSec / 60))} min`),
      ];
  const route = kind === 'swap' ? `Route via ${q.dexes?.length ? q.dexes.join(', ') : q.source}` : `Bridge: ${q.bridge} · via ${q.source}`;
  const card = h('div', { class: 'card stack' }, h('div', { class: 'row' }, h('h3', { class: 'grow' }, kind === 'swap' ? `Swap on ${q.chain}` : 'Bridge route'), h('span', { class: 'badge' }, q.source)), h('div', { class: 'quote-grid' }, kpis), h('p', { class: 'muted' }, route));
  if (!r.execution) {
    card.append(h('div', { class: 'callout' }, user().chain === 'evm' ? 'This route cannot be executed from your address.' : 'Sign in with an EVM wallet to execute this route. Solana wallets can still view quotes.'));
    return card;
  }
  const steps = h('ol', { class: 'tx-steps' }, r.execution.approval?.needed ? h('li', {}, `Approve ${short(r.execution.approval.spender, 4)} to spend your ${kind === 'swap' ? q.tokenIn.symbol : q.fromToken.symbol}`) : null, h('li', {}, kind === 'swap' ? 'Sign the swap' : 'Sign the bridge transaction on the source chain'));
  const btn = h('button', { class: 'btn btn-primary', type: 'button' }, r.execution.approval?.needed ? 'Approve & execute' : 'Execute');
  btn.addEventListener('click', async () => {
    const ok = await confirmDialog(`This sends a real transaction on mainnet from ${short(user().address, 6)}. Continue?`, 'Continue');
    if (!ok) return;
    await busy(btn, async () => {
      try {
        await execute(kind, req, r, status, btn);
      } catch (e) {
        status.textContent = '';
        throw e;
      }
    });
  });
  card.append(steps, h('div', { class: 'row end' }, status, btn));
  return card;
}

function bindQuote(formSel, kind) {
  $(formSel).addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const d = formData(form);
    const req = { ...d, slippageBps: d.slippageBps ? Number(d.slippageBps) : undefined };
    if (!req.toToken) delete req.toToken;
    const u = user();
    if (u.chain === 'evm') req[kind === 'swap' ? 'sender' : 'fromAddress'] = u.address;
    else if (kind === 'bridge') {
      toast('Bridging needs an EVM sender. Sign in with an EVM wallet.', 'error');
      return;
    }
    if (kind === 'bridge' && req.fromChain === req.toChain) {
      toast('Pick two different networks.', 'error');
      return;
    }
    const out = $('#trade-out');
    out.replaceChildren(h('div', { class: 'card' }, skel(3)));
    busy(form.querySelector('[type=submit]'), async () => {
      try {
        const r = await run(kind === 'swap' ? 'swap_quote' : 'bridge_quote', req);
        out.replaceChildren(quoteCard(kind, req, r));
      } catch (e) {
        out.replaceChildren(h('div', { class: 'card' }, h('p', { class: 'kit-err' }, e.message)));
        throw e;
      }
    });
  });
}

/* ---------------------------------------------------------------- security */

const riskBadge = (r) => h('span', { class: `badge ${r === 'low' ? 'ok' : r === 'high' ? 'bad' : 'warn'}` }, `${r} risk`);

function tokenReport(r, chain) {
  const c = chainByKey(chain);
  const pct = (v) => (v == null ? '—' : `${fmt(v, 2)}%`);
  return h('div', { class: 'card stack' },
    h('div', { class: 'row' }, h('h3', { class: 'grow' }, `${r.name ?? 'Unknown token'} ${r.symbol ? `(${r.symbol})` : ''}`), riskBadge(r.risk)),
    h('div', { class: 'quote-grid' }, tile('Buy tax', pct(r.buyTaxPct)), tile('Sell tax', pct(r.sellTaxPct)), tile('Holders', r.holderCount == null ? '—' : fmt(r.holderCount, 0)), tile('Verified source', r.openSource == null ? '—' : r.openSource ? 'Yes' : 'No')),
    r.flags.length ? h('div', { class: 'flags' }, r.flags.map((f) => h('span', { class: `badge ${f.critical ? 'bad' : 'warn'}` }, f.label))) : h('div', { class: 'callout ok' }, 'GoPlus raised no flags for this token.'),
    h('p', { class: 'muted' }, 'Owner: ', r.owner ? (c ? link(`${c.explorer}/address/${r.owner}`, short(r.owner, 6)) : short(r.owner, 6)) : 'none / renounced', ' · Creator: ', r.creator ? short(r.creator, 6) : '—'),
    r.topHolders?.length ? table(['Top holder', 'Share', 'Tag'], r.topHolders.map((x) => h('tr', {}, h('td', {}, h('code', {}, short(x.address, 6))), h('td', { class: 'tabular' }, pct(x.pct)), h('td', { class: 'muted' }, x.tag || (x.contract ? 'contract' : ''))))) : null,
  );
}

function addressReport(r, input) {
  return h('div', { class: 'card stack' },
    h('div', { class: 'row' }, h('h3', { class: 'grow' }, short(input, 8)), h('span', { class: `badge ${r.malicious ? 'bad' : 'ok'}` }, r.malicious ? 'flagged' : 'clean')),
    h('p', { class: 'muted' }, r.isContract ? 'This address is a contract.' : 'This address is an externally owned account.', r.source ? ` Source: ${r.source}.` : ''),
    r.flags.length ? h('div', { class: 'flags' }, r.flags.map((f) => h('span', { class: 'badge bad' }, f.label))) : h('div', { class: 'callout ok' }, 'No malicious-activity flags were found for this address.'),
  );
}

function bindSecurity() {
  const out = $('#sec-out');
  const go = (form, fn) => {
    const d = formData(form);
    out.replaceChildren(h('div', { class: 'card' }, skel(3)));
    busy(form.querySelector('[type=submit]'), async () => {
      try {
        out.replaceChildren(await fn(d));
      } catch (e) {
        out.replaceChildren(h('div', { class: 'card' }, h('p', { class: 'kit-err' }, e.message)));
        throw e;
      }
    });
  };
  $('#tok-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    go(ev.currentTarget, async (d) => tokenReport(await run('token_security', d), d.chain));
  });
  $('#addr-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    go(ev.currentTarget, async (d) => addressReport(await run('address_security', d), d.address));
  });
}

/* ---------------------------------------------------------------- tools */

let tools = [];

function field(name, schema, required) {
  const label = `${name}${required ? ' *' : ''}`;
  const hint = schema.description ? h('small', { class: 'muted' }, schema.description) : null;
  const type = Array.isArray(schema.type) ? schema.type.find((t) => t !== 'null') : schema.type;
  let input;
  if (schema.enum) {
    input = h('select', { class: 'input', name }, required ? null : h('option', { value: '' }, '(default)'), schema.enum.map((v) => h('option', { selected: schema.default === v, value: String(v) }, String(v))));
  } else if (type === 'boolean') {
    input = h('select', { class: 'input', name }, h('option', { value: '' }, '(default)'), h('option', { value: 'true' }, 'true'), h('option', { value: 'false' }, 'false'));
  } else {
    input = h('input', {
      class: 'input',
      name,
      placeholder: schema.default != null ? String(schema.default) : type === 'array' ? 'comma,separated' : '',
      required: required && schema.default == null ? true : null,
      step: type === 'number' ? 'any' : null,
      type: type === 'number' || type === 'integer' ? 'number' : 'text',
    });
  }
  input.dataset.type = type ?? 'string';
  return h('label', { class: 'field' }, label, input, hint);
}

function collect(form) {
  const args = {};
  for (const el of form.querySelectorAll('[name]')) {
    const v = el.value.trim();
    if (!v) continue;
    const t = el.dataset.type;
    args[el.name] = t === 'number' || t === 'integer' ? Number(v) : t === 'boolean' ? v === 'true' : t === 'array' ? v.split(',').map((s) => s.trim()).filter(Boolean) : v;
  }
  return args;
}

function openTool(t, btn) {
  for (const b of document.querySelectorAll('.tool-item')) b.setAttribute('aria-current', String(b === btn));
  const props = t.inputSchema.properties ?? {};
  const req = new Set(t.inputSchema.required ?? []);
  const out = h('div');
  const form = h('form', { class: 'stack' }, Object.entries(props).map(([k, s]) => field(k, s, req.has(k))), h('div', { class: 'row end' }, h('button', { class: 'btn btn-primary', type: 'submit' }, 'Run')));
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    out.replaceChildren(skel(3));
    busy(form.querySelector('[type=submit]'), async () => {
      try {
        const r = await api(`/api/run/${encodeURIComponent(t.name)}`, { body: collect(form) });
        out.replaceChildren(h('div', { class: 'muted' }, `${r.ms} ms`), h('pre', { class: 'code result-body' }, JSON.stringify(r.result, null, 2)));
      } catch (e) {
        out.replaceChildren(h('p', { class: 'kit-err' }, e.message));
        throw e;
      }
    });
  });
  $('#tool-pane').replaceChildren(
    h('div', { class: 'row' }, h('h3', { class: 'grow' }, t.title), h('span', { class: 'badge' }, t.group)),
    h('p', { class: 'muted' }, t.description),
    h('code', { class: 'muted' }, `POST /api/run/${t.name}`),
    Object.keys(props).length ? null : h('p', { class: 'muted' }, 'This tool takes no arguments.'),
    form,
    out,
  );
}

function renderTools() {
  const q = $('#tool-filter').value.trim().toLowerCase();
  const list = $('#tool-list');
  const shown = tools.filter((t) => !q || `${t.name} ${t.title} ${t.description} ${t.group}`.toLowerCase().includes(q));
  if (!shown.length) return list.replaceChildren(empty(q ? `No tool matches "${q}".` : 'No tools available.'));
  const groups = [...new Set(shown.map((t) => t.group))];
  list.replaceChildren(...groups.flatMap((g) => [
    h('div', { class: 'muted' }, h('strong', {}, g)),
    ...shown.filter((t) => t.group === g).map((t) => {
      const b = h('button', { class: 'tool-item', type: 'button' }, t.title, h('small', {}, t.name));
      b.addEventListener('click', () => openTool(t, b));
      return b;
    }),
  ]));
}

function loadTools() {
  section($('#tool-list'), () => api('/api/tools'), (r) => {
    tools = r.tools;
    queueMicrotask(renderTools);
    return skel(1);
  });
}

/* ---------------------------------------------------------------- mcp */

function initMcp() {
  const url = `${location.origin}/mcp`;
  $('#mcp-url').textContent = url;
  $('#mcp-copy').addEventListener('click', () => copy(url, 'MCP URL copied'));
  $('#mcp-config').textContent = JSON.stringify({ mcpServers: { ucm: { headers: { Authorization: 'Bearer <your API key>' }, type: 'http', url } } }, null, 2);
  $('#mcp-curl').textContent = `curl -s ${url} \\\n  -H "Authorization: Bearer $UCM_KEY" \\\n  -H "content-type: application/json" \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`;
  section($('#mcp-tools'), () => api('/mcp', { body: { id: 1, jsonrpc: '2.0', method: 'tools/list' } }), (r) => {
    const list = r.result?.tools ?? [];
    if (!list.length) return empty('The MCP server listed no tools.');
    return [h('p', { class: 'muted' }, `${list.length} tools`), table(['Name', 'Description'], list.map((t) => h('tr', {}, h('td', { class: 'nowrap' }, h('code', {}, t.name)), h('td', {}, t.description))))];
  });
}

/* ---------------------------------------------------------------- boot */

const root = $('#app');
await gate(root, { text: 'Connect an Ethereum or Solana wallet to scan portfolios, run security checks and sign swaps and bridges.', title: 'Sign in to UCM Cloud' });
const u = user();
$('#who').textContent = `${u.chain === 'evm' ? 'EVM' : 'Solana'} · ${short(u.address, 6)}`;
tabs(root);

if (u.chain !== 'evm') {
  const note = $('#trade-note');
  note.textContent = 'You signed in with a Solana wallet. You can view swap quotes, but executing swaps and bridges needs an EVM wallet.';
  note.hidden = false;
}

$('#pf-reload').addEventListener('click', loadPortfolio);
$('#pf-testnets').addEventListener('change', loadPortfolio);
$('#gas-reload').addEventListener('click', loadGas);
$('#watch-reload').addEventListener('click', loadWatchlist);
$('#watch-form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const form = ev.currentTarget;
  busy(form.querySelector('[type=submit]'), async () => {
    await api('/api/watchlist', { body: formData(form) });
    form.reset();
    toast('Address added', 'success');
    loadWatchlist();
  });
});
$('#tool-filter').addEventListener('input', renderTools);
bindQuote('#swap-form', 'swap');
bindQuote('#bridge-form', 'bridge');
bindSecurity();

initMcp();
loadGas();
loadWatchlist();
loadTools();
loadChains()
  .then(loadPortfolio)
  .catch((e) => {
    toast(`Could not load networks: ${e.message}`, 'error');
    loadPortfolio();
  });
mountKeys($('#keys'), { endpointHint: `curl -s ${location.origin}/api/run/get_portfolio -H "Authorization: Bearer $UCM_KEY" -H "content-type: application/json" -d '{"address":"vitalik.eth"}'` });
const usage = mountUsage($('#usage'));
window.addEventListener('hashchange', () => {
  const tab = location.hash.slice(1);
  if (tab === 'usage') usage.reload();
  if (tab === 'overview') {
    loadGas();
    loadPortfolio();
  }
});
