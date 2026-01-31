/**
 * database Implementation
 *
 * Database utilities, ORM helpers, and query building
 * Compatible with Drizzle ORM patterns
 */

export * from './types';

// ============================================================
// Types
// ============================================================

interface Column {
  name: string;
  dataType: string;
  columnType: string;
  notNull?: boolean;
  hasDefault?: boolean;
  enumValues?: string[];
  primaryKey?: boolean;
}

interface Table {
  _: { name: string; columns: Record<string, Column> };
}

interface View {
  _: { name: string; columns: Record<string, Column> };
}

type Type<T = unknown, U = T> = {
  _input: T;
  _output: U;
};

interface Conditions {
  never?: boolean;
}

interface Node {
  type: string;
  children?: Node[];
}

interface CollectionItem {
  name: string;
  data: unknown;
}

interface AnalyzeImportsConfig {
  root: string;
  files: string[];
}

interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | object;
}

interface QueryResult<T = unknown> {
  rows: T[];
  rowCount: number;
  fields?: { name: string; dataTypeId: number }[];
}

interface TransactionScope {
  query: <T = unknown>(sql: string, params?: unknown[]) => Promise<QueryResult<T>>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

// ============================================================
// Path & Import Utilities
// ============================================================

export function resolvePathAlias(importPath: string, _file: string): string {
  // Handle common path aliases
  if (importPath.startsWith('@/')) {
    return importPath.replace('@/', './src/');
  }
  if (importPath.startsWith('~/')) {
    return importPath.replace('~/', './');
  }
  return importPath;
}

export function fixImportPath(importPath: string, file: string, ext: string): string {
  const resolved = resolvePathAlias(importPath, file);
  if (!resolved.endsWith(ext) && !resolved.includes('.')) {
    return `${resolved}${ext}`;
  }
  return resolved;
}

export function analyze(path: string): { imports: string[]; exports: string[] } {
  // Simple static analysis placeholder
  return {
    imports: [],
    exports: [],
  };
}

export function analyzeImports(cfg: AnalyzeImportsConfig): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const file of cfg.files) {
    const analysis = analyze(`${cfg.root}/${file}`);
    result.set(file, analysis.imports);
  }
  return result;
}

export class ImportAnalyzer {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  analyze(files: string[]): Map<string, string[]> {
    return analyzeImports({ root: this.root, files });
  }
}

// ============================================================
// Column & Schema Utilities
// ============================================================

export function columnToSchema(column: Column): Type {
  switch (column.dataType) {
    case 'number':
    case 'integer':
    case 'int':
    case 'smallint':
    case 'bigint':
    case 'decimal':
    case 'numeric':
    case 'real':
    case 'double':
      return numberColumnToSchema(column);
    case 'string':
    case 'text':
    case 'varchar':
    case 'char':
    case 'uuid':
      return stringColumnToSchema(column);
    case 'bigint':
      return bigintColumnToSchema(column);
    default:
      return { _input: undefined, _output: undefined };
  }
}

export function numberColumnToSchema(_column: Column): Type<number> {
  return { _input: 0, _output: 0 };
}

export function bigintColumnToSchema(_column: Column): Type<bigint> {
  return { _input: 0n, _output: 0n };
}

export function stringColumnToSchema(_column: Column): Type<string> {
  return { _input: '', _output: '' };
}

export function getColumns(tableLike: Table | View): Record<string, Column> {
  return tableLike._.columns;
}

export function handleColumns(
  columns: Record<string, Column>,
  _refinements: Record<string, unknown>,
  _conditions: Conditions
): Type {
  const schema: Record<string, Type> = {};
  for (const [name, column] of Object.entries(columns)) {
    schema[name] = columnToSchema(column);
  }
  return schema as unknown as Type;
}

export function isColumnType<T extends Column>(column: Column, columnTypes: string[]): column is T {
  return columnTypes.includes(column.columnType);
}

export function isWithEnum(
  column: Column
): column is typeof column & { enumValues: string[] } {
  return Array.isArray(column.enumValues) && column.enumValues.length > 0;
}

export function Expect<_ extends true>(): void {
  // Type-level assertion, no runtime behavior
}

// ============================================================
// AST/Node Utilities
// ============================================================

export function recursiveRun(...args: Node[]): boolean {
  for (const node of args) {
    if (node.type === 'error') return false;
    if (node.children && !recursiveRun(...node.children)) return false;
  }
  return true;
}

export function init(collection: CollectionItem[]): Map<string, unknown> {
  const store = new Map<string, unknown>();
  for (const item of collection) {
    store.set(item.name, item.data);
  }
  return store;
}

// ============================================================
// Database Client
// ============================================================

export class DatabaseClient {
  private config: DatabaseConfig;
  private pool: unknown = null;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // In production, create actual connection pool
    // Using pg or mysql2 or similar
    console.log('Database connected to:', this.config.host || this.config.connectionString);
  }

  async disconnect(): Promise<void> {
    this.pool = null;
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    // Placeholder - in production use actual DB driver
    console.log('Executing query:', sql, params);
    return { rows: [], rowCount: 0 };
  }

  async transaction<T>(fn: (scope: TransactionScope) => Promise<T>): Promise<T> {
    await this.query('BEGIN');

    const scope: TransactionScope = {
      query: (sql, params) => this.query(sql, params),
      commit: async () => {
        await this.query('COMMIT');
      },
      rollback: async () => {
        await this.query('ROLLBACK');
      },
    };

    try {
      const result = await fn(scope);
      await scope.commit();
      return result;
    } catch (error) {
      await scope.rollback();
      throw error;
    }
  }
}

let defaultClient: DatabaseClient | null = null;

export function createClient(config: DatabaseConfig): DatabaseClient {
  const client = new DatabaseClient(config);
  if (!defaultClient) {
    defaultClient = client;
  }
  return client;
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
  if (!defaultClient) {
    throw new Error('Database client not initialized. Call createClient first.');
  }
  return defaultClient.query<T>(sql, params);
}

export async function transaction<T>(fn: (scope: TransactionScope) => Promise<T>): Promise<T> {
  if (!defaultClient) {
    throw new Error('Database client not initialized. Call createClient first.');
  }
  return defaultClient.transaction(fn);
}

// ============================================================
// Migration Utilities
// ============================================================

interface Migration {
  id: string;
  name: string;
  up: (client: DatabaseClient) => Promise<void>;
  down: (client: DatabaseClient) => Promise<void>;
}

const migrations: Migration[] = [];

export function registerMigration(migration: Migration): void {
  migrations.push(migration);
}

export async function migrate(direction: 'up' | 'down' = 'up'): Promise<void> {
  if (!defaultClient) {
    throw new Error('Database client not initialized');
  }

  // Create migrations table if not exists
  await defaultClient.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Get applied migrations
  const { rows } = await defaultClient.query<{ id: string }>('SELECT id FROM _migrations');
  const appliedIds = new Set(rows.map(r => r.id));

  if (direction === 'up') {
    for (const migration of migrations) {
      if (!appliedIds.has(migration.id)) {
        console.log(`Applying migration: ${migration.name}`);
        await migration.up(defaultClient);
        await defaultClient.query('INSERT INTO _migrations (id, name) VALUES ($1, $2)', [
          migration.id,
          migration.name,
        ]);
      }
    }
  } else {
    for (const migration of [...migrations].reverse()) {
      if (appliedIds.has(migration.id)) {
        console.log(`Rolling back migration: ${migration.name}`);
        await migration.down(defaultClient);
        await defaultClient.query('DELETE FROM _migrations WHERE id = $1', [migration.id]);
      }
    }
  }
}

// ============================================================
// Error Classes
// ============================================================

export class AuthTokenError extends Error {
  constructor(message = 'Authentication token error') {
    super(message);
    this.name = 'AuthTokenError';
  }
}

export class InvalidAuthTokenError extends AuthTokenError {
  constructor(message = 'Invalid authentication token') {
    super(message);
    this.name = 'InvalidAuthTokenError';
  }
}

export class AuthTokenExpiredError extends AuthTokenError {
  constructor(message = 'Authentication token expired') {
    super(message);
    this.name = 'AuthTokenExpiredError';
  }
}

export class RefreshTokenUserIdMismatchError extends Error {
  constructor(message = 'Refresh token user ID does not match') {
    super(message);
    this.name = 'RefreshTokenUserIdMismatchError';
  }
}

export class UserAlreadyHasSignInMethodError extends Error {
  constructor(message = 'User already has this sign-in method') {
    super(message);
    this.name = 'UserAlreadyHasSignInMethodError';
  }
}

export class SignInMethodNotFoundError extends Error {
  constructor(message = 'Sign-in method not found') {
    super(message);
    this.name = 'SignInMethodNotFoundError';
  }
}

export class WrongPasswordError extends Error {
  constructor(message = 'Wrong password') {
    super(message);
    this.name = 'WrongPasswordError';
  }
}

export class PasswordTooWeakError extends Error {
  constructor(message = 'Password is too weak') {
    super(message);
    this.name = 'PasswordTooWeakError';
  }
}

// ============================================================
// App Class (ORM-like interface)
// ============================================================

export class App {
  private tables = new Map<string, Table>();
  private client: DatabaseClient | null = null;

  constructor(config?: DatabaseConfig) {
    if (config) {
      this.client = createClient(config);
    }
  }

  registerTable(table: Table): void {
    this.tables.set(table._.name, table);
  }

  getTable(name: string): Table | undefined {
    return this.tables.get(name);
  }

  async connect(): Promise<void> {
    await this.client?.connect();
  }

  async disconnect(): Promise<void> {
    await this.client?.disconnect();
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    if (!this.client) {
      throw new Error('No database client configured');
    }
    return this.client.query<T>(sql, params);
  }
}
