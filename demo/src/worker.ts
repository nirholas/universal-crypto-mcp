import {
  createPublicClient,
  erc20Abi,
  fallback,
  formatUnits,
  getAddress,
  http,
  isAddress,
  isHash,
  parseAbiItem,
  parseUnits,
  zeroAddress,
  type AbiFunction,
  type AbiParameter,
  type Address,
  type Chain,
  type Hex,
  type PublicClient,
} from 'viem';
import { arbitrum, avalanche, base, baseSepolia, bsc, mainnet, optimism, polygon, sepolia } from 'viem/chains';
import { normalize } from 'viem/ens';
import { HttpError, json, kitRoutes, metered, readJson, requireKeyOrUser, requireUser, Router, serve, str, type KitEnv, type User } from './kit';

const APP = 'UCM Cloud';
const VERSION = '1.0.0';
const UA = { 'user-agent': 'ucm-cloud-demo (+https://universal-crypto-mcp.ninabrekkerese.workers.dev)' };
const NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const MAX_WATCH = 50;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS watchlist (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, label TEXT NOT NULL, address TEXT NOT NULL, created_at INTEGER NOT NULL, UNIQUE (user_id, address));
CREATE INDEX IF NOT EXISTS watchlist_user ON watchlist (user_id, created_at);
CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT NOT NULL, fetched_at INTEGER NOT NULL)
`;

type Env = KitEnv;

/* ---------------------------------------------------------------- networks */

interface TokenRef {
  address: Address;
  decimals: number;
  gecko: string;
  symbol: string;
}

interface Net {
  chain: Chain;
  explorer: string;
  gecko: string;
  key: string;
  kyber?: string;
  name: string;
  rpc: string;
  symbol: string;
  testnet: boolean;
  tokens: TokenRef[];
}

const t = (symbol: string, address: string, decimals: number, gecko: string): TokenRef => ({ address: address as Address, decimals, gecko, symbol });
const USDC = 'coingecko:usd-coin';
const USDT = 'coingecko:tether';
const ETH = 'coingecko:ethereum';

const NETS: Net[] = [
  {
    chain: mainnet, explorer: 'https://etherscan.io', gecko: ETH, key: 'ethereum', kyber: 'ethereum', name: 'Ethereum', rpc: 'https://ethereum-rpc.publicnode.com', symbol: 'ETH', testnet: false,
    tokens: [t('USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, USDC), t('USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, USDT), t('WETH', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, ETH)],
  },
  {
    chain: base, explorer: 'https://basescan.org', gecko: ETH, key: 'base', kyber: 'base', name: 'Base', rpc: 'https://base-rpc.publicnode.com', symbol: 'ETH', testnet: false,
    tokens: [t('USDC', '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, USDC), t('WETH', '0x4200000000000000000000000000000000000006', 18, ETH)],
  },
  {
    chain: arbitrum, explorer: 'https://arbiscan.io', gecko: ETH, key: 'arbitrum', kyber: 'arbitrum', name: 'Arbitrum One', rpc: 'https://arbitrum-one-rpc.publicnode.com', symbol: 'ETH', testnet: false,
    tokens: [t('USDC', '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, USDC), t('USDT', '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6, USDT), t('WETH', '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, ETH)],
  },
  {
    chain: optimism, explorer: 'https://optimistic.etherscan.io', gecko: ETH, key: 'optimism', kyber: 'optimism', name: 'OP Mainnet', rpc: 'https://optimism-rpc.publicnode.com', symbol: 'ETH', testnet: false,
    tokens: [t('USDC', '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', 6, USDC), t('USDT', '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 6, USDT), t('WETH', '0x4200000000000000000000000000000000000006', 18, ETH)],
  },
  {
    chain: polygon, explorer: 'https://polygonscan.com', gecko: 'coingecko:polygon-ecosystem-token', key: 'polygon', kyber: 'polygon', name: 'Polygon', rpc: 'https://polygon-bor-rpc.publicnode.com', symbol: 'POL', testnet: false,
    tokens: [t('USDC', '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', 6, USDC), t('USDT', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, USDT), t('WETH', '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, ETH)],
  },
  {
    chain: bsc, explorer: 'https://bscscan.com', gecko: 'coingecko:binancecoin', key: 'bsc', kyber: 'bsc', name: 'BNB Smart Chain', rpc: 'https://bsc-rpc.publicnode.com', symbol: 'BNB', testnet: false,
    tokens: [t('USDC', '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, USDC), t('USDT', '0x55d398326f99059fF775485246999027B3197955', 18, USDT), t('ETH', '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, ETH)],
  },
  {
    chain: avalanche, explorer: 'https://snowtrace.io', gecko: 'coingecko:avalanche-2', key: 'avalanche', kyber: 'avalanche', name: 'Avalanche C-Chain', rpc: 'https://avalanche-c-chain-rpc.publicnode.com', symbol: 'AVAX', testnet: false,
    tokens: [t('USDC', '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, USDC), t('USDT', '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', 6, USDT), t('WETH.e', '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, ETH)],
  },
  { chain: sepolia, explorer: 'https://sepolia.etherscan.io', gecko: '', key: 'sepolia', name: 'Sepolia', rpc: 'https://ethereum-sepolia-rpc.publicnode.com', symbol: 'ETH', testnet: true, tokens: [t('USDC', '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', 6, '')] },
  { chain: baseSepolia, explorer: 'https://sepolia.basescan.org', gecko: '', key: 'base-sepolia', name: 'Base Sepolia', rpc: 'https://base-sepolia-rpc.publicnode.com', symbol: 'ETH', testnet: true, tokens: [t('USDC', '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 6, '')] },
];
const MAINNETS = NETS.filter((n) => !n.testnet);
const CHAIN_KEYS = NETS.map((n) => n.key);

function net(raw: unknown): Net {
  const v = String(raw ?? 'ethereum').trim().toLowerCase();
  const n = NETS.find((x) => x.key === v || String(x.chain.id) === v || x.name.toLowerCase() === v);
  if (!n) throw new HttpError(400, `Unknown chain "${v}". Use one of: ${CHAIN_KEYS.join(', ')}`);
  return n;
}

const clients = new Map<string, PublicClient>();
function client(n: Net): PublicClient {
  let c = clients.get(n.key);
  if (!c) {
    c = createPublicClient({ batch: { multicall: true }, chain: n.chain, transport: fallback([...new Set([n.rpc, ...n.chain.rpcUrls.default.http])].map((u) => http(u, { retryCount: 1, timeout: 8_000 }))) }) as PublicClient;
    clients.set(n.key, c);
  }
  return c;
}

/* ---------------------------------------------------------------- helpers */

async function cached<T extends object>(env: Env, ctx: ExecutionContext, key: string, ttlSeconds: number, load: () => Promise<T>): Promise<T & { stale?: boolean }> {
  const row = await env.DB.prepare('SELECT value, fetched_at FROM cache WHERE key = ?').bind(key).first<{ fetched_at: number; value: string }>();
  if (row && Date.now() - row.fetched_at < ttlSeconds * 1000) return JSON.parse(row.value);
  try {
    const value = await load();
    ctx.waitUntil(
      env.DB.prepare('INSERT INTO cache (key, value, fetched_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, fetched_at = excluded.fetched_at')
        .bind(key, JSON.stringify(value, bigintSafe), Date.now())
        .run(),
    );
    return JSON.parse(JSON.stringify(value, bigintSafe));
  } catch (error) {
    if (row) return { ...(JSON.parse(row.value) as T), stale: true };
    throw error instanceof HttpError ? error : new HttpError(502, `Upstream unavailable: ${(error as Error).message}`);
  }
}

const bigintSafe = (_k: string, v: unknown) => (typeof v === 'bigint' ? v.toString() : v);

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(url, { ...init, headers: { accept: 'application/json', ...UA, ...init.headers }, signal: init.signal ?? AbortSignal.timeout(12_000) });
  const text = await r.text();
  if (!r.ok) {
    let detail = '';
    try {
      const j = JSON.parse(text) as { message?: string };
      detail = j.message ? `: ${j.message}` : '';
    } catch {
      detail = '';
    }
    throw new HttpError(r.status >= 500 ? 502 : 400, `${new URL(url).host} returned ${r.status}${detail}`);
  }
  return JSON.parse(text) as T;
}

/** Accepts a checksummed/lowercase address or an ENS name and returns a checksummed address. */
async function toAddress(raw: unknown, field = 'address'): Promise<Address> {
  const v = str(raw, field, 255).trim();
  if (isAddress(v, { strict: false })) return getAddress(v);
  if (/^[^\s]+\.[a-z]{2,}$/i.test(v)) {
    const resolved = await client(NETS[0]).getEnsAddress({ name: normalize(v) }).catch(() => null);
    if (!resolved) throw new HttpError(404, `ENS name ${v} does not resolve to an address`);
    return resolved;
  }
  throw new HttpError(400, `${field} must be a 0x address or an ENS name`);
}

function tokenAddress(raw: unknown, n: Net, field = 'token'): Address | typeof NATIVE {
  const v = str(raw, field, 64).trim();
  if (v.toLowerCase() === 'native' || v.toUpperCase() === n.symbol || v.toLowerCase() === NATIVE.toLowerCase()) return NATIVE;
  const known = n.tokens.find((x) => x.symbol.toLowerCase() === v.toLowerCase());
  if (known) return known.address;
  if (!isAddress(v, { strict: false })) throw new HttpError(400, `${field} must be a token address, a known symbol (${[n.symbol, ...n.tokens.map((x) => x.symbol)].join(', ')}) or "native"`);
  return getAddress(v);
}

async function prices(ids: string[]): Promise<Record<string, number>> {
  const uniq = [...new Set(ids.filter(Boolean))];
  if (!uniq.length) return {};
  const r = await getJson<{ coins: Record<string, { price: number }> }>(`https://coins.llama.fi/prices/current/${uniq.map(encodeURIComponent).join(',')}`);
  return Object.fromEntries(Object.entries(r.coins).map(([k, v]) => [k, v.price]));
}

async function erc20Meta(n: Net, token: Address) {
  const c = client(n);
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    c.readContract({ abi: erc20Abi, address: token, functionName: 'name' }).catch(() => null),
    c.readContract({ abi: erc20Abi, address: token, functionName: 'symbol' }).catch(() => null),
    c.readContract({ abi: erc20Abi, address: token, functionName: 'decimals' }).catch(() => null),
    c.readContract({ abi: erc20Abi, address: token, functionName: 'totalSupply' }).catch(() => null),
  ]);
  if (decimals === null) throw new HttpError(404, `${token} is not an ERC-20 token on ${n.name}`);
  return { decimals, name, symbol, totalSupply };
}

const decimalsOf = async (n: Net, token: Address | typeof NATIVE) => (token === NATIVE ? 18 : n.tokens.find((x) => x.address === token)?.decimals ?? (await erc20Meta(n, token)).decimals);

function amountAtomic(raw: unknown, decimals: number, field = 'amount'): bigint {
  const v = str(raw, field, 40).trim();
  if (!/^\d+(\.\d+)?$/.test(v)) throw new HttpError(400, `${field} must be a positive decimal number`);
  const a = parseUnits(v, decimals);
  if (a <= 0n) throw new HttpError(400, `${field} must be greater than zero`);
  return a;
}

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/* ---------------------------------------------------------------- chain data */

async function gasFor(n: Net) {
  const c = client(n);
  const t0 = Date.now();
  const [gasPrice, block] = await Promise.all([c.getGasPrice(), c.getBlock({ blockTag: 'latest' })]);
  return {
    baseFeeGwei: block.baseFeePerGas != null ? Number(formatUnits(block.baseFeePerGas, 9)) : null,
    blockNumber: Number(block.number),
    blockTime: Number(block.timestamp),
    chain: n.key,
    chainId: n.chain.id,
    gasPriceGwei: Number(formatUnits(gasPrice, 9)),
    latencyMs: Date.now() - t0,
    name: n.name,
    symbol: n.symbol,
    testnet: n.testnet,
    utilization: block.gasLimit ? round(Number((block.gasUsed * 10_000n) / block.gasLimit) / 100, 1) : null,
  };
}

async function gasBoard(list: Net[]) {
  const [rows, px] = await Promise.all([
    Promise.allSettled(list.map(gasFor)),
    prices(list.map((n) => n.gecko)).catch(() => ({}) as Record<string, number>),
  ]);
  return {
    chains: rows.map((r, i) => {
      const n = list[i];
      if (r.status === 'rejected') return { chain: n.key, chainId: n.chain.id, error: (r.reason as Error).message.split('\n')[0], name: n.name, symbol: n.symbol, testnet: n.testnet };
      const price = px[n.gecko];
      return { ...r.value, nativeUsd: price ?? null, transferUsd: price ? round(r.value.gasPriceGwei * 1e-9 * 21_000 * price, 4) : null };
    }),
    fetchedAt: Date.now(),
  };
}

async function portfolio(address: Address, testnets = false) {
  const list = testnets ? NETS : MAINNETS;
  const results = await Promise.allSettled(
    list.map(async (n) => {
      const c = client(n);
      const [nativeBal, ...tokenBals] = await Promise.all([
        c.getBalance({ address }),
        ...n.tokens.map((tk) => c.readContract({ abi: erc20Abi, address: tk.address, args: [address], functionName: 'balanceOf' }).catch(() => 0n)),
      ]);
      return [
        { amount: formatUnits(nativeBal, 18), chain: n.key, gecko: n.gecko, native: true, raw: nativeBal, symbol: n.symbol, token: NATIVE },
        ...n.tokens.map((tk, i) => ({ amount: formatUnits(tokenBals[i], tk.decimals), chain: n.key, gecko: tk.gecko, native: false, raw: tokenBals[i], symbol: tk.symbol, token: tk.address })),
      ];
    }),
  );
  const holdings = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : [])).filter((h) => h.raw > 0n);
  const px = await prices(holdings.map((h) => h.gecko)).catch(() => ({}) as Record<string, number>);
  const rows = holdings
    .map(({ gecko, raw: _raw, ...h }) => {
      const price = px[gecko] ?? null;
      return { ...h, chainName: NETS.find((n) => n.key === h.chain)!.name, priceUsd: price, valueUsd: price === null ? null : round(Number(h.amount) * price, 2) };
    })
    .sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0));
  return {
    address,
    chainsFailed: results.flatMap((r, i) => (r.status === 'rejected' ? [list[i].key] : [])),
    chainsScanned: list.map((n) => n.key),
    holdings: rows,
    totalUsd: round(rows.reduce((s, r) => s + (r.valueUsd ?? 0), 0), 2),
  };
}

/** Converts string arguments into the shapes viem expects for an ABI parameter. */
function coerce(p: AbiParameter, v: unknown): unknown {
  if (p.type.endsWith(']')) {
    const arr = typeof v === 'string' ? JSON.parse(v) : v;
    if (!Array.isArray(arr)) throw new HttpError(400, `${p.name || p.type} must be a JSON array`);
    const inner = { ...p, type: p.type.replace(/\[\d*\]$/, '') } as AbiParameter;
    return arr.map((x) => coerce(inner, x));
  }
  if (/^u?int\d*$/.test(p.type)) return BigInt(String(v));
  if (p.type === 'bool') return v === true || v === 'true' || v === '1';
  if (p.type === 'address') {
    if (!isAddress(String(v), { strict: false })) throw new HttpError(400, `${p.name || 'address'} must be an address`);
    return getAddress(String(v));
  }
  if (p.type === 'tuple') return typeof v === 'string' ? JSON.parse(v) : v;
  return v;
}

/* ---------------------------------------------------------------- security */

const FLAG_LABELS: Record<string, string> = {
  anti_whale_modifiable: 'Anti-whale limits modifiable',
  can_take_back_ownership: 'Ownership can be reclaimed',
  cannot_buy: 'Cannot be bought',
  cannot_sell_all: 'Cannot sell all tokens',
  hidden_owner: 'Hidden owner',
  honeypot_with_same_creator: 'Creator deployed honeypots before',
  is_blacklisted: 'Blacklist function',
  is_honeypot: 'Honeypot',
  is_mintable: 'Mintable',
  is_proxy: 'Upgradeable proxy',
  owner_change_balance: 'Owner can change balances',
  personal_slippage_modifiable: 'Per-address tax modifiable',
  selfdestruct: 'Self-destruct',
  slippage_modifiable: 'Tax modifiable',
  trading_cooldown: 'Trading cooldown',
  transfer_pausable: 'Transfers pausable',
};
const CRITICAL = new Set(['is_honeypot', 'cannot_sell_all', 'cannot_buy', 'owner_change_balance', 'hidden_owner', 'selfdestruct', 'honeypot_with_same_creator']);

async function tokenSecurity(n: Net, token: Address) {
  const r = await getJson<{ code: number; message: string; result: Record<string, Record<string, unknown>> }>(`https://api.gopluslabs.io/api/v1/token_security/${n.chain.id}?contract_addresses=${token}`);
  const d = r.result?.[token.toLowerCase()];
  if (!d) throw new HttpError(404, `GoPlus has no security data for ${token} on ${n.name}`);
  const flags = Object.entries(FLAG_LABELS)
    .filter(([k]) => d[k] === '1')
    .map(([k, label]) => ({ critical: CRITICAL.has(k), key: k, label }));
  const pct = (v: unknown) => (v === undefined || v === '' ? null : round(Number(v) * 100, 2));
  const risk = flags.some((f) => f.critical) ? 'high' : flags.length > 2 ? 'medium' : 'low';
  return {
    buyTaxPct: pct(d.buy_tax),
    chain: n.key,
    creator: d.creator_address ?? null,
    flags,
    holderCount: d.holder_count ? Number(d.holder_count) : null,
    lpHolderCount: d.lp_holder_count ? Number(d.lp_holder_count) : null,
    name: d.token_name ?? null,
    openSource: d.is_open_source === '1',
    owner: d.owner_address || null,
    risk,
    sellTaxPct: pct(d.sell_tax),
    source: 'GoPlus Security',
    symbol: d.token_symbol ?? null,
    token,
    topHolders: Array.isArray(d.holders) ? (d.holders as { address: string; is_contract: number; percent: string; tag?: string }[]).slice(0, 5).map((x) => ({ address: x.address, contract: x.is_contract === 1, pct: round(Number(x.percent) * 100, 2), tag: x.tag || null })) : [],
    trustList: d.trust_list === '1',
  };
}

const ADDRESS_LABELS: Record<string, string> = {
  blacklist_doubt: 'Suspected blacklist',
  blackmail_activities: 'Blackmail',
  cybercrime: 'Cybercrime',
  darkweb_transactions: 'Darkweb transactions',
  fake_kyc: 'Fake KYC',
  fake_token: 'Fake token deployer',
  financial_crime: 'Financial crime',
  honeypot_related_address: 'Honeypot related',
  malicious_mining_activities: 'Malicious mining',
  mixer: 'Mixer usage',
  money_laundering: 'Money laundering',
  phishing_activities: 'Phishing',
  sanctioned: 'Sanctioned',
  stealing_attack: 'Stealing attack',
};

async function addressSecurity(address: Address, n: Net) {
  const r = await getJson<{ result: Record<string, string> | null }>(`https://api.gopluslabs.io/api/v1/address_security/${address}?chain_id=${n.chain.id}`);
  const d = r.result ?? {};
  const flags = Object.entries(ADDRESS_LABELS).filter(([k]) => d[k] === '1').map(([key, label]) => ({ key, label }));
  return { address, chain: n.key, flags, isContract: d.contract_address === '1', malicious: flags.length > 0, maliciousContractsCreated: Number(d.number_of_malicious_contracts_created ?? 0), source: d.data_source || 'GoPlus Security' };
}

/* ---------------------------------------------------------------- swaps & bridges */

interface Execution {
  approval: { amount: string; needed: boolean; spender: Address; token: Address } | null;
  chainId: number;
  tx: { data: Hex; to: Address; value: string };
}

async function approvalFor(n: Net, token: Address | typeof NATIVE, owner: Address, spender: Address, amount: bigint): Promise<Execution['approval']> {
  if (token === NATIVE) return null;
  const allowance = await client(n).readContract({ abi: erc20Abi, address: token, args: [owner, spender], functionName: 'allowance' });
  return { amount: amount.toString(), needed: allowance < amount, spender, token };
}

interface KyberRoute {
  data: { routeSummary: Record<string, unknown> & { amountIn: string; amountInUsd: string; amountOut: string; amountOutUsd: string; gas: string; gasUsd: string; route: { exchange: string }[][] }; routerAddress: Address };
}

async function swapQuote(args: Record<string, unknown>) {
  const n = net(args.chain);
  if (!n.kyber) throw new HttpError(400, `Swaps are not available on ${n.name}`);
  const tokenIn = tokenAddress(args.tokenIn, n, 'tokenIn');
  const tokenOut = tokenAddress(args.tokenOut, n, 'tokenOut');
  if (tokenIn === tokenOut) throw new HttpError(400, 'tokenIn and tokenOut must differ');
  const [decIn, decOut] = await Promise.all([decimalsOf(n, tokenIn), decimalsOf(n, tokenOut)]);
  const amountIn = amountAtomic(args.amount, decIn);
  const slippageBps = Math.min(Math.max(Math.round(Number(args.slippageBps ?? 50)), 1), 2000);
  const head = { 'x-client-id': 'ucm-cloud' };
  const q = await getJson<KyberRoute & { code: number; message: string }>(`https://aggregator-api.kyberswap.com/${n.kyber}/api/v1/routes?tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}`, { headers: head });
  if (q.code !== 0 || !q.data?.routeSummary) throw new HttpError(404, `No swap route: ${q.message}`);
  const s = q.data.routeSummary;
  const quote = {
    amountIn: formatUnits(BigInt(s.amountIn), decIn),
    amountInUsd: Number(s.amountInUsd),
    amountOut: formatUnits(BigInt(s.amountOut), decOut),
    amountOutUsd: Number(s.amountOutUsd),
    chain: n.key,
    dexes: [...new Set(s.route.flat().map((r) => r.exchange))],
    gasUsd: Number(s.gasUsd),
    minAmountOut: formatUnits((BigInt(s.amountOut) * BigInt(10_000 - slippageBps)) / 10_000n, decOut),
    priceImpactPct: Number(s.amountInUsd) > 0 ? round((1 - Number(s.amountOutUsd) / Number(s.amountInUsd)) * 100, 3) : null,
    router: q.data.routerAddress,
    slippageBps,
    source: 'KyberSwap Aggregator',
    tokenIn,
    tokenOut,
  };
  if (!args.sender) return { execution: null, quote };
  const sender = await toAddress(args.sender, 'sender');
  const built = await getJson<{ code: number; data: { data: Hex; routerAddress: Address; transactionValue: string }; message: string }>(`https://aggregator-api.kyberswap.com/${n.kyber}/api/v1/route/build`, {
    body: JSON.stringify({ recipient: sender, routeSummary: s, sender, slippageTolerance: slippageBps, source: 'ucm-cloud' }),
    headers: { ...head, 'content-type': 'application/json' },
    method: 'POST',
  });
  if (built.code !== 0) throw new HttpError(400, `Could not build swap: ${built.message}`);
  const execution: Execution = {
    approval: await approvalFor(n, tokenIn, sender, built.data.routerAddress, amountIn),
    chainId: n.chain.id,
    tx: { data: built.data.data, to: built.data.routerAddress, value: BigInt(built.data.transactionValue || '0').toString() },
  };
  return { execution, quote };
}

interface LifiToken {
  address: Address;
  decimals: number;
  priceUSD?: string;
  symbol: string;
}

async function bridgeQuote(args: Record<string, unknown>) {
  const from = net(args.fromChain);
  const to = net(args.toChain);
  if (from.testnet || to.testnet) throw new HttpError(400, 'Bridging is only available between mainnets');
  const sender = await toAddress(args.fromAddress, 'fromAddress');
  const lifiToken = (n: Net, v: unknown, field: string) => {
    const a = tokenAddress(v, n, field);
    return a === NATIVE ? zeroAddress : a;
  };
  const fromToken = lifiToken(from, args.fromToken, 'fromToken');
  const toToken = lifiToken(to, args.toToken ?? args.fromToken, 'toToken');
  const tok = await getJson<LifiToken>(`https://li.quest/v1/token?chain=${from.chain.id}&token=${fromToken}`);
  const amount = amountAtomic(args.amount, tok.decimals);
  const slippage = Math.min(Math.max(Number(args.slippageBps ?? 50), 1), 2000) / 10_000;
  const q = await getJson<{
    action: { fromToken: LifiToken; toToken: LifiToken };
    estimate: { approvalAddress: Address; executionDuration: number; feeCosts?: { amountUSD: string; name: string }[]; fromAmountUSD: string; gasCosts?: { amountUSD: string }[]; toAmount: string; toAmountMin: string; toAmountUSD: string };
    toolDetails: { name: string };
    transactionRequest?: { data: Hex; to: Address; value: string };
  }>(`https://li.quest/v1/quote?fromChain=${from.chain.id}&toChain=${to.chain.id}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${amount}&fromAddress=${sender}&slippage=${slippage}&integrator=ucm-cloud`);
  const e = q.estimate;
  const sum = (xs?: { amountUSD: string }[]) => round((xs ?? []).reduce((s, x) => s + Number(x.amountUSD || 0), 0), 4);
  const quote = {
    bridge: q.toolDetails?.name,
    durationSec: e.executionDuration,
    feesUsd: sum(e.feeCosts),
    fromAmount: formatUnits(amount, tok.decimals),
    fromAmountUsd: Number(e.fromAmountUSD),
    fromChain: from.key,
    fromToken: q.action.fromToken.symbol,
    gasUsd: sum(e.gasCosts),
    source: 'LI.FI',
    toAmount: formatUnits(BigInt(e.toAmount), q.action.toToken.decimals),
    toAmountMin: formatUnits(BigInt(e.toAmountMin), q.action.toToken.decimals),
    toAmountUsd: Number(e.toAmountUSD),
    toChain: to.key,
    toToken: q.action.toToken.symbol,
  };
  const tr = q.transactionRequest;
  const execution: Execution | null = tr
    ? { approval: await approvalFor(from, fromToken === zeroAddress ? NATIVE : fromToken, sender, e.approvalAddress, amount), chainId: from.chain.id, tx: { data: tr.data, to: tr.to, value: BigInt(tr.value || '0').toString() } }
    : null;
  return { execution, quote };
}

/* ---------------------------------------------------------------- tool registry */

interface Prop {
  default?: unknown;
  description: string;
  enum?: string[];
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string';
  items?: { type: string };
}

interface Tool {
  description: string;
  group: string;
  name: string;
  params: Record<string, Prop>;
  required: string[];
  run: (args: Record<string, unknown>, c: { ctx: ExecutionContext; env: Env; user: User }) => Promise<unknown>;
  title: string;
}

const chainProp = (description = 'Network key or chain id'): Prop => ({ default: 'ethereum', description, enum: CHAIN_KEYS, type: 'string' });
const addrProp = (description = 'Address (0x…) or ENS name'): Prop => ({ description, type: 'string' });

const TOOLS: Tool[] = [
  {
    description: 'Lists every supported network with chain id, native currency, explorer and RPC.',
    group: 'Network', name: 'get_chains', params: {}, required: [], title: 'Supported chains',
    run: async () => ({ chains: NETS.map((n) => ({ chainId: n.chain.id, explorer: n.explorer, key: n.key, name: n.name, rpc: n.rpc, symbol: n.symbol, testnet: n.testnet, tokens: n.tokens.map((x) => x.symbol) })) }),
  },
  {
    description: 'Live gas price, base fee, block utilization and the USD cost of a plain transfer. Omit chain to compare all networks.',
    group: 'Network', name: 'get_gas', params: { chain: { description: 'Network key; omit for all networks', enum: CHAIN_KEYS, type: 'string' } }, required: [], title: 'Gas tracker',
    run: async (a, { ctx, env }) => (a.chain ? gasBoard([net(a.chain)]) : cached(env, ctx, 'gas:all', 20, () => gasBoard(NETS))),
  },
  {
    description: 'Fetches a block (latest by default) with its transaction count and gas usage.',
    group: 'Network', name: 'get_block', params: { block: { description: 'Block number; omit for latest', type: 'integer' }, chain: chainProp() }, required: [], title: 'Block',
    run: async (a) => {
      const n = net(a.chain);
      const b = await client(n).getBlock(a.block != null && a.block !== '' ? { blockNumber: BigInt(String(a.block)) } : { blockTag: 'latest' });
      return { baseFeeGwei: b.baseFeePerGas != null ? Number(formatUnits(b.baseFeePerGas, 9)) : null, chain: n.key, explorer: `${n.explorer}/block/${b.number}`, gasLimit: b.gasLimit.toString(), gasUsed: b.gasUsed.toString(), hash: b.hash, miner: b.miner, number: Number(b.number), timestamp: Number(b.timestamp), transactions: b.transactions.length };
    },
  },
  {
    description: 'Native balance of an address or ENS name on one network.',
    group: 'Wallet', name: 'get_balance', params: { address: addrProp(), chain: chainProp() }, required: ['address'], title: 'Native balance',
    run: async (a) => {
      const n = net(a.chain);
      const address = await toAddress(a.address);
      const [bal, nonce] = await Promise.all([client(n).getBalance({ address }), client(n).getTransactionCount({ address })]);
      return { address, balance: formatUnits(bal, 18), chain: n.key, nonce, symbol: n.symbol };
    },
  },
  {
    description: 'Multi-chain portfolio: native coins plus USDC, USDT and WETH across seven mainnets, priced in USD by DefiLlama.',
    group: 'Wallet', name: 'get_portfolio', params: { address: addrProp(), testnets: { default: false, description: 'Include Sepolia and Base Sepolia', type: 'boolean' } }, required: ['address'], title: 'Portfolio',
    run: async (a, { ctx, env }) => {
      const address = await toAddress(a.address);
      const testnets = a.testnets === true;
      return cached(env, ctx, `pf:${address}:${testnets}`, 30, () => portfolio(address, testnets));
    },
  },
  {
    description: 'ERC-20 balance of an address for any token on any supported network.',
    group: 'Wallet', name: 'get_token_balance', params: { address: addrProp(), chain: chainProp(), token: { description: 'Token address or known symbol (USDC, USDT, WETH)', type: 'string' } }, required: ['address', 'token'], title: 'Token balance',
    run: async (a) => {
      const n = net(a.chain);
      const address = await toAddress(a.address);
      const token = tokenAddress(a.token, n);
      if (token === NATIVE) return { address, balance: formatUnits(await client(n).getBalance({ address }), 18), chain: n.key, symbol: n.symbol, token: 'native' };
      const [meta, bal] = await Promise.all([erc20Meta(n, token), client(n).readContract({ abi: erc20Abi, address: token, args: [address], functionName: 'balanceOf' })]);
      return { address, balance: formatUnits(bal, meta.decimals), chain: n.key, symbol: meta.symbol, token };
    },
  },
  {
    description: 'Name, symbol, decimals and total supply of an ERC-20 token.',
    group: 'Tokens', name: 'get_token_info', params: { chain: chainProp(), token: { description: 'Token address or known symbol', type: 'string' } }, required: ['token'], title: 'Token info',
    run: async (a) => {
      const n = net(a.chain);
      const token = tokenAddress(a.token, n);
      if (token === NATIVE) throw new HttpError(400, `${n.symbol} is the native coin, not an ERC-20`);
      const m = await erc20Meta(n, token);
      return { chain: n.key, decimals: m.decimals, explorer: `${n.explorer}/token/${token}`, name: m.name, symbol: m.symbol, token, totalSupply: m.totalSupply === null ? null : formatUnits(m.totalSupply, m.decimals) };
    },
  },
  {
    description: 'Current USD prices from DefiLlama. Use coingecko:<id> or <chain>:<token address> keys, comma separated.',
    group: 'Tokens', name: 'token_prices', params: { coins: { default: 'coingecko:ethereum,coingecko:bitcoin', description: 'Comma-separated DefiLlama coin keys', type: 'string' } }, required: ['coins'], title: 'Token prices',
    run: async (a) => {
      const keys = str(a.coins, 'coins', 1500).split(',').map((s) => s.trim()).filter(Boolean).slice(0, 40);
      if (!keys.length) throw new HttpError(400, 'coins is required');
      const r = await getJson<{ coins: Record<string, { confidence: number; price: number; symbol: string; timestamp: number }> }>(`https://coins.llama.fi/prices/current/${keys.map(encodeURIComponent).join(',')}`);
      return { missing: keys.filter((k) => !r.coins[k]), prices: r.coins, source: 'DefiLlama' };
    },
  },
  {
    description: 'Transaction details with receipt status, gas used and fee.',
    group: 'Explorer', name: 'get_transaction', params: { chain: chainProp(), hash: { description: 'Transaction hash', type: 'string' } }, required: ['hash'], title: 'Transaction',
    run: async (a) => {
      const n = net(a.chain);
      const hash = str(a.hash, 'hash', 66).trim() as Hex;
      if (!isHash(hash)) throw new HttpError(400, 'hash must be a 32-byte 0x hash');
      const c = client(n);
      const tx = await c.getTransaction({ hash }).catch(() => null);
      if (!tx) throw new HttpError(404, `Transaction not found on ${n.name}`);
      const receipt = await c.getTransactionReceipt({ hash }).catch(() => null);
      return {
        block: tx.blockNumber != null ? Number(tx.blockNumber) : null,
        chain: n.key,
        explorer: `${n.explorer}/tx/${hash}`,
        feeNative: receipt ? formatUnits(receipt.gasUsed * receipt.effectiveGasPrice, 18) : null,
        from: tx.from,
        gasUsed: receipt?.gasUsed.toString() ?? null,
        hash,
        input: tx.input.length > 10 ? `${tx.input.slice(0, 10)}… (${(tx.input.length - 2) / 2} bytes)` : tx.input,
        logs: receipt?.logs.length ?? null,
        nonce: tx.nonce,
        status: receipt ? receipt.status : 'pending',
        to: tx.to,
        value: formatUnits(tx.value, 18),
      };
    },
  },
  {
    description: 'Calls any view or pure function. Give the human-readable signature, e.g. "function balanceOf(address) view returns (uint256)".',
    group: 'Explorer', name: 'read_contract',
    params: { address: { description: 'Contract address', type: 'string' }, args: { description: 'Arguments, in order (comma separated)', items: { type: 'string' }, type: 'array' }, chain: chainProp(), signature: { description: 'Human-readable function signature', type: 'string' } },
    required: ['address', 'signature'], title: 'Read contract',
    run: async (a) => {
      const n = net(a.chain);
      const address = await toAddress(a.address);
      const sig = str(a.signature, 'signature', 500).trim();
      let item: AbiFunction;
      try {
        const parsed = parseAbiItem(sig.startsWith('function ') ? sig : `function ${sig}`);
        if (parsed.type !== 'function') throw new Error('not a function');
        item = parsed as AbiFunction;
      } catch (e) {
        throw new HttpError(400, `Invalid signature: ${(e as Error).message.split('\n')[0]}`);
      }
      const raw = Array.isArray(a.args) ? a.args : typeof a.args === 'string' && a.args ? a.args.split(',').map((s) => s.trim()) : [];
      if (raw.length !== item.inputs.length) throw new HttpError(400, `${item.name} takes ${item.inputs.length} argument(s), got ${raw.length}`);
      const args = item.inputs.map((p, i) => coerce(p, raw[i]));
      const result = await client(n).readContract({ abi: [item], address, args, functionName: item.name }).catch((e: Error) => {
        throw new HttpError(400, `Call reverted: ${e.message.split('\n')[0]}`);
      });
      return { address, chain: n.key, function: item.name, result: JSON.parse(JSON.stringify(result, bigintSafe)) };
    },
  },
  {
    description: 'Resolves an ENS name to its address, avatar and common text records.',
    group: 'ENS', name: 'resolve_ens', params: { name: { default: 'vitalik.eth', description: 'ENS name', type: 'string' } }, required: ['name'], title: 'Resolve ENS',
    run: async (a) => {
      const name = normalize(str(a.name, 'name', 255).trim());
      const c = client(NETS[0]);
      const address = await c.getEnsAddress({ name });
      if (!address) throw new HttpError(404, `${name} has no address record`);
      const [avatar, url, twitter, github] = await Promise.all(['avatar', 'url', 'com.twitter', 'com.github'].map((key) => c.getEnsText({ key, name }).catch(() => null)));
      return { address, avatar, github, name, twitter, url };
    },
  },
  {
    description: 'Reverse-resolves an address to its primary ENS name.',
    group: 'ENS', name: 'lookup_ens', params: { address: { description: 'Address', type: 'string' } }, required: ['address'], title: 'Reverse ENS',
    run: async (a) => {
      const address = await toAddress(a.address);
      return { address, name: await client(NETS[0]).getEnsName({ address }) };
    },
  },
  {
    description: 'Verifies a signed message (EOA or EIP-1271 smart account).',
    group: 'ENS', name: 'verify_signature', params: { address: addrProp('Expected signer'), chain: chainProp('Network for smart-account checks'), message: { description: 'Exact message that was signed', type: 'string' }, signature: { description: '0x signature', type: 'string' } }, required: ['address', 'message', 'signature'], title: 'Verify signature',
    run: async (a) => {
      const n = net(a.chain);
      const address = await toAddress(a.address);
      const signature = str(a.signature, 'signature', 4000).trim() as Hex;
      if (!/^0x[0-9a-fA-F]+$/.test(signature)) throw new HttpError(400, 'signature must be hex');
      const valid = await client(n).verifyMessage({ address, message: str(a.message, 'message', 10_000), signature }).catch(() => false);
      return { address, chain: n.key, valid };
    },
  },
  {
    description: 'GoPlus token security scan: honeypot, taxes, mint/blacklist/proxy flags, owner and top holders.',
    group: 'Security', name: 'token_security', params: { chain: chainProp(), token: { description: 'Token contract address', type: 'string' } }, required: ['token'], title: 'Token security',
    run: async (a, { ctx, env }) => {
      const n = net(a.chain);
      const token = tokenAddress(a.token, n);
      if (token === NATIVE) throw new HttpError(400, 'Native coins have no contract to scan');
      return cached(env, ctx, `sec:${n.key}:${token}`, 600, () => tokenSecurity(n, token));
    },
  },
  {
    description: 'GoPlus address screening: phishing, sanctions, mixer use and other malicious activity.',
    group: 'Security', name: 'address_security', params: { address: addrProp(), chain: chainProp() }, required: ['address'], title: 'Address screening',
    run: async (a) => addressSecurity(await toAddress(a.address), net(a.chain)),
  },
  {
    description: 'Total value locked per chain from DefiLlama.',
    group: 'DeFi', name: 'chain_tvl', params: { limit: { default: 20, description: 'How many chains (1-100)', type: 'integer' } }, required: [], title: 'Chain TVL',
    run: async (a, { ctx, env }) => {
      const all = await cached(env, ctx, 'tvl:chains', 600, async () => ({
        chains: (await getJson<{ chainId: number | null; name: string; tokenSymbol: string | null; tvl: number }[]>('https://api.llama.fi/v2/chains'))
          .filter((c) => c.tvl > 0)
          .sort((x, y) => y.tvl - x.tvl)
          .slice(0, 100)
          .map((c) => ({ chainId: c.chainId, name: c.name, token: c.tokenSymbol, tvlUsd: Math.round(c.tvl) })),
      }));
      const limit = Math.min(Math.max(Number(a.limit ?? 20) || 20, 1), 100);
      return { chains: all.chains.slice(0, limit), source: 'DefiLlama', stale: all.stale };
    },
  },
  {
    description: 'Best swap route from the KyberSwap aggregator. Pass sender to also get a ready-to-sign transaction and approval check.',
    group: 'Trading', name: 'swap_quote',
    params: {
      amount: { default: '0.01', description: 'Amount of tokenIn, in whole units', type: 'string' },
      chain: chainProp(),
      sender: addrProp('Wallet that will sign (optional)'),
      slippageBps: { default: 50, description: 'Slippage tolerance in basis points', type: 'integer' },
      tokenIn: { default: 'native', description: 'Token address, symbol or "native"', type: 'string' },
      tokenOut: { default: 'USDC', description: 'Token address, symbol or "native"', type: 'string' },
    },
    required: ['tokenIn', 'tokenOut', 'amount'], title: 'Swap quote',
    run: async (a) => swapQuote(a),
  },
  {
    description: 'Cross-chain bridge quote from LI.FI with a ready-to-sign transaction for the source chain.',
    group: 'Trading', name: 'bridge_quote',
    params: {
      amount: { default: '10', description: 'Amount in whole units', type: 'string' },
      fromAddress: addrProp('Wallet that will sign'),
      fromChain: { ...chainProp('Source network'), default: 'base' },
      fromToken: { default: 'USDC', description: 'Token address, symbol or "native"', type: 'string' },
      slippageBps: { default: 50, description: 'Slippage tolerance in basis points', type: 'integer' },
      toChain: { ...chainProp('Destination network'), default: 'arbitrum' },
      toToken: { description: 'Destination token (defaults to fromToken)', type: 'string' },
    },
    required: ['fromChain', 'toChain', 'fromToken', 'amount', 'fromAddress'], title: 'Bridge quote',
    run: async (a) => bridgeQuote(a),
  },
  {
    description: 'Lists the addresses on your UCM Cloud watchlist.',
    group: 'Account', name: 'list_watchlist', params: {}, required: [], title: 'My watchlist',
    run: async (_a, { env, user }) => ({ watchlist: (await env.DB.prepare('SELECT id, label, address, created_at FROM watchlist WHERE user_id = ? ORDER BY created_at DESC').bind(user.id).all()).results }),
  },
];

const toolInfo = (x: Tool) => ({
  description: x.description,
  group: x.group,
  inputSchema: { additionalProperties: false, properties: x.params, required: x.required, type: 'object' },
  name: x.name,
  title: x.title,
});

async function runTool(name: string, args: Record<string, unknown>, c: { ctx: ExecutionContext; env: Env; user: User }) {
  const tool = TOOLS.find((x) => x.name === name);
  if (!tool) throw new HttpError(404, `Unknown tool ${name}`);
  for (const r of tool.required) if (args[r] === undefined || args[r] === '') throw new HttpError(400, `${r} is required`);
  return tool.run(args, c);
}

/* ---------------------------------------------------------------- MCP */

interface RpcMessage {
  id?: number | string | null;
  jsonrpc?: string;
  method?: string;
  params?: { arguments?: Record<string, unknown>; name?: string; protocolVersion?: string };
}

const rpcError = (id: RpcMessage['id'], code: number, message: string) => ({ error: { code, message }, id: id ?? null, jsonrpc: '2.0' });

async function mcpMessage(m: RpcMessage, user: User, env: Env, ctx: ExecutionContext) {
  if (m.jsonrpc !== '2.0' || typeof m.method !== 'string') return rpcError(m.id, -32600, 'Invalid JSON-RPC request');
  if (m.id === undefined) return null;
  switch (m.method) {
    case 'initialize':
      return {
        id: m.id,
        jsonrpc: '2.0',
        result: {
          capabilities: { tools: { listChanged: false } },
          instructions: `${APP}: live EVM data across ${NETS.length} networks — gas, balances, portfolios, ENS, contract reads, GoPlus security, DefiLlama prices/TVL, KyberSwap swaps and LI.FI bridges. Trading tools return unsigned transactions; nothing is signed server-side.`,
          protocolVersion: m.params?.protocolVersion ?? '2025-06-18',
          serverInfo: { name: 'universal-crypto-mcp', title: APP, version: VERSION },
        },
      };
    case 'ping':
      return { id: m.id, jsonrpc: '2.0', result: {} };
    case 'tools/list':
      return { id: m.id, jsonrpc: '2.0', result: { tools: TOOLS.map(toolInfo).map(({ group: _g, ...x }) => x) } };
    case 'tools/call': {
      const name = m.params?.name;
      if (typeof name !== 'string' || !TOOLS.some((x) => x.name === name)) return rpcError(m.id, -32602, `Unknown tool ${String(name)}`);
      const args = m.params?.arguments ?? {};
      try {
        const out = await metered(env, ctx, user, `mcp:${name}`, args, () => runTool(name, args, { ctx, env, user }));
        return { id: m.id, jsonrpc: '2.0', result: { content: [{ text: JSON.stringify(out, bigintSafe, 2).slice(0, 60_000), type: 'text' }], isError: false } };
      } catch (error) {
        return { id: m.id, jsonrpc: '2.0', result: { content: [{ text: (error as Error).message, type: 'text' }], isError: true } };
      }
    }
    default:
      return rpcError(m.id, -32601, `Method not found: ${m.method}`);
  }
}

/* ---------------------------------------------------------------- routes */

const router: Router<Env> = kitRoutes(new Router<Env>(), { appName: APP, keySlug: 'ucm' })
  .get('/api/live', async (_req, env, ctx) => json(await cached(env, ctx, 'gas:mainnets', 20, () => gasBoard(MAINNETS))))
  .get('/api/chains', () => json({ chains: NETS.map((n) => ({ chainId: n.chain.id, explorer: n.explorer, key: n.key, name: n.name, rpc: n.rpc, swaps: Boolean(n.kyber), symbol: n.symbol, testnet: n.testnet, tokens: n.tokens.map((x) => ({ address: x.address, decimals: x.decimals, symbol: x.symbol })) })) }))
  .get('/api/tools', () => json({ tools: TOOLS.map(toolInfo) }))
  .post('/api/run/:name', async (req, env, ctx, p) => {
    const user = await requireKeyOrUser(req, env, ctx);
    const args = await readJson<Record<string, unknown>>(req);
    if (!TOOLS.some((x) => x.name === p.name)) throw new HttpError(404, `Unknown tool ${p.name}`);
    const started = Date.now();
    const result = await metered(env, ctx, user, `tool:${p.name}`, args, () => runTool(p.name, args, { ctx, env, user }));
    return new Response(JSON.stringify({ ms: Date.now() - started, result, tool: p.name }, bigintSafe), { headers: { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' } });
  })

  .get('/api/watchlist', async (req, env) => {
    const u = await requireUser(req, env);
    const { results } = await env.DB.prepare('SELECT id, label, address, created_at FROM watchlist WHERE user_id = ? ORDER BY created_at DESC').bind(u.id).all();
    return json({ watchlist: results });
  })
  .post('/api/watchlist', async (req, env) => {
    const u = await requireUser(req, env);
    const b = await readJson<{ address?: unknown; label?: unknown }>(req);
    const label = str(b.label, 'label', 60).trim();
    if (!label) throw new HttpError(400, 'label is required');
    const address = await toAddress(b.address);
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM watchlist WHERE user_id = ?').bind(u.id).first<{ n: number }>();
    if ((count?.n ?? 0) >= MAX_WATCH) throw new HttpError(400, `Watchlists are limited to ${MAX_WATCH} addresses`);
    const r = await env.DB.prepare('INSERT INTO watchlist (user_id, label, address, created_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id, address) DO NOTHING RETURNING id')
      .bind(u.id, label, address, Date.now())
      .first<{ id: number }>();
    if (!r) throw new HttpError(409, `${address} is already on your watchlist`);
    return json({ entry: { address, id: r.id, label } }, { status: 201 });
  })
  .delete('/api/watchlist/:id', async (req, env, _ctx, p) => {
    const u = await requireUser(req, env);
    const r = await env.DB.prepare('DELETE FROM watchlist WHERE id = ? AND user_id = ?').bind(Number(p.id), u.id).run();
    if (!r.meta.changes) throw new HttpError(404, 'Watchlist entry not found');
    return json({ ok: true });
  })

  .get('/mcp', () => json({ error: 'This MCP endpoint is stateless: POST JSON-RPC messages (no SSE stream).' }, { headers: { allow: 'POST' }, status: 405 }))
  .post('/mcp', async (req, env, ctx) => {
    const user = await requireKeyOrUser(req, env, ctx);
    let msg: RpcMessage | RpcMessage[];
    try {
      msg = await req.json();
    } catch {
      return json(rpcError(null, -32700, 'Parse error'), { status: 400 });
    }
    if (Array.isArray(msg)) {
      const out = (await Promise.all(msg.slice(0, 20).map((m) => mcpMessage(m, user, env, ctx)))).filter(Boolean);
      return out.length ? json(out) : new Response(null, { status: 202 });
    }
    const out = await mcpMessage(msg, user, env, ctx);
    return out ? json(out) : new Response(null, { status: 202 });
  });

export default { fetch: serve(router, SCHEMA) } satisfies ExportedHandler<Env>;
