/**
 * defi Types
 *
 * Auto-extracted from vendor/defi/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

interface User {
  id: string;
  reserves: {
    usageAsCollateralEnabledOnUser: boolean;
    reserve: {
      symbol: string;
      usageAsCollateralEnabled: boolean;
      underlyingAsset: string;
      price: {
        priceInEth: string;
      }

interface PositionHistory {
  transactionHash: string;
}

interface PositionMainOwner {
  address: string;
}

interface PositionMain {
  lastOwner: PositionMainOwner;
}

interface Position {
  tick: number;
  tickVersion: string;
  index: string;
  validator: string;
  recipient: string;
  amount: string;
  startPrice: string;
  liquidationPenalty: number;
  totalExpo: string;
  amountReceived: string;
  amountRemaining: string;
  profit: string;
  liquidationPrice: string | null;
  effectiveTickPrice: string | null;
  type: string;
  status: string;
  history: PositionHistory[];
  mainPosition: PositionMain;
}

interface ApiResponse {
  serverTimestamp: number;
  positions: Position[];
}

export interface Bins {
  [token: string]: {
    bins: {
      [bin: number]: number;
    }

export interface Liq {
  owner: string;
  liqPrice: number;
  collateral: string;
  collateralAmount: string;
  extra?: {
    displayName?: string;
    url: string;
  }

// ============================================================
// Types from vendor code
// ============================================================

type AaveAdapterResource = {
  name: "aave";

type VaultData = {
  id: string;

type Account = {
  id: string;

type Balance = {
  amount: string;

type Asset = {
  id: string;

type Tier = "collateral" | "isolated" | "cross";

type AssetConfig = {
  borrowFactor: string;

type MappedAsset = {
  id: string;

type MulticallResponse<T> = {
  output: {
    input: any;

type SystemState = {
  price: string;

type Trove = {
  id: string;

type Urn = {
  ink: string;

type Ilk = {
  Art: string;

type Spot = {
  pip: string;

type CollateralConfig = {
  id: string;

type MarketConfig = {
  name: string;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface Protocol {
  // TODO: Define based on vendor/defi/ patterns
}

export interface Pool {
  // TODO: Define based on vendor/defi/ patterns
}

export interface SwapParams {
  // TODO: Define based on vendor/defi/ patterns
}

export interface PoolStats {
  // TODO: Define based on vendor/defi/ patterns
}
