/**
 * database Types
 *
 * Auto-extracted from vendor/database/
 */

// ============================================================
// Interfaces from vendor code
// ============================================================

export interface Conditions {
	never: (column?: Column) => boolean;
	optional: (column: Column) => boolean;
	nullable: (column: Column) => boolean;
}

export interface CreateSelectSchema {
	<TTable extends Table>(table: TTable): BuildSchema<'select', TTable['_']['columns'], undefined>;
	<
		TTable extends Table,
		TRefine extends BuildRefine<TTable['_']['columns']>,
	>(
		table: TTable,
		refine?: NoUnknownKeys<TRefine, TTable['$inferSelect']>,
	): BuildSchema<'select', TTable['_']['columns'], TRefine>;

	<TView extends View>(view: TView): BuildSchema<'select', TView['_']['selectedFields'], undefined>;
	<
		TView extends View,
		TRefine extends BuildRefine<TView['_']['selectedFields']>,
	>(
		view: TView,
		refine: NoUnknownKeys<TRefine, TView['$inferSelect']>,
	): BuildSchema<'select', TView['_']['selectedFields'], TRefine>;

	<TEnum extends PgEnum<any>>(enum_: TEnum): Type<TEnum['enumValues'][number]>;
}

export interface CreateInsertSchema {
	<TTable extends Table>(table: TTable): BuildSchema<'insert', TTable['_']['columns'], undefined>;
	<
		TTable extends Table,
		TRefine extends BuildRefine<Pick<TTable['_']['columns'], keyof TTable['$inferInsert']>>,
	>(
		table: TTable,
		refine?: NoUnknownKeys<TRefine, TTable['$inferInsert']>,
	): BuildSchema<'insert', TTable['_']['columns'], TRefine>;
}

export interface CreateUpdateSchema {
	<TTable extends Table>(table: TTable): BuildSchema<'update', TTable['_']['columns'], undefined>;
	<
		TTable extends Table,
		TRefine extends BuildRefine<Pick<TTable['_']['columns'], keyof TTable['$inferInsert']>>,
	>(
		table: TTable,
		refine?: TRefine,
	): BuildSchema<'update', TTable['_']['columns'], TRefine>;
}

interface String {
		trimChar(char: string): string;
		squashSpaces(): string;
		capitalise(): string;
		camelCase(): string;
		snake_case(): string;

		concatIf(it: string, condition: boolean): string;
	}

interface Array<T> {
		random(): T;
	}

export interface AuthTokenPayload {
  userId: string
  refreshTokenId: string
}

interface RefreshTokenPayload {
  userId: string
  refreshTokenId: string
  isRefreshToken: true
}

export interface AuthToken {
  authToken: string
}

export interface RefreshTokenTable {
  refresh_token_id: Generated<string>
  user_id: string
  last_refreshed_at: Date
  created_at: Generated<Date>
}

export interface RefreshToken {
  refreshToken: string
}

export interface Config {
  readonly port: number
  readonly authTokenSecret: string
  readonly authTokenExpiryDuration: string
  readonly database: ConnectionConfig
}

export interface ContextExtension {
  db: Kysely<Database>
}

export interface Database {
  user: UserTable
  refresh_token: RefreshTokenTable
  sign_in_method: SignInMethodTable
  password_sign_in_method: PasswordSignInMethodTable
}

export interface PasswordSignInMethodTable {
  user_id: string
  password_hash: string
}

export interface SignInMethodTable {
  user_id: string
  type: 'password'
}

export interface PasswordSignInMethod {
  email: string
  password: string
}

export interface SignedInUser {
  refreshToken: RefreshToken
  authToken: AuthToken
  user: User
}

export interface UserTable {
  user_id: Generated<string>
  first_name: string | null
  last_name: string | null
  email: string | null
  created_at: Generated<Date>
}

export interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
}

// ============================================================
// Types from vendor code
// ============================================================

export type ArktypeNullable<TSchema> = Type<type.infer<TSchema> | null>;

export type ArktypeOptional<TSchema> = [Type<type.infer<TSchema>>, '?'];

export type GetArktypeType<
	TColumn extends Column,
> = TColumn['_']['columnType'] extends
	'PgJson' | 'PgJsonb' | 'MySqlJson' | 'SingleStoreJson' | 'SQLiteTextJson' | 'SQLiteBlobJson'
	? unknown extends TColumn['_']['data'] ? Type<Json> : Type<TColumn['_']['data']>
	: Type<TColumn['_']['data']>;

type HandleSelectColumn<
	TSchema,
	TColumn extends Column,
> = TColumn['_']['notNull'] extends true ? TSchema
	: ArktypeNullable<TSchema>;

type HandleInsertColumn<
	TSchema,
	TColumn extends Column,
> = TColumn['_']['notNull'] extends true ? TColumn['_']['hasDefault'] extends true ? ArktypeOptional<TSchema>
	: TSchema
	: ArktypeOptional<ArktypeNullable<TSchema>>;

type HandleUpdateColumn<
	TSchema,
	TColumn extends Column,
> = TColumn['_']['notNull'] extends true ? ArktypeOptional<TSchema>
	: ArktypeOptional<ArktypeNullable<TSchema>>;

export type HandleColumn<
	TType extends 'select' | 'insert' | 'update',
	TColumn extends Column,
> = TType extends 'select' ? HandleSelectColumn<GetArktypeType<TColumn>, TColumn>
	: TType extends 'insert' ? HandleInsertColumn<GetArktypeType<TColumn>, TColumn>
	: TType extends 'update' ? HandleUpdateColumn<GetArktypeType<TColumn>, TColumn>
	: GetArktypeType<TColumn>;

type GenericSchema = type.cast<unknown> | [type.cast<unknown>, '?'];

type BuildRefineField<T> = T extends GenericSchema ? ((schema: T) => GenericSchema) | GenericSchema : never;

type HandleRefinement<
	TType extends 'select' | 'insert' | 'update',
	TRefinement,
	TColumn extends Column,
> = TRefinement extends (schema: any) => GenericSchema ? (
		TColumn['_']['notNull'] extends true ? ReturnType<TRefinement>
			: ArktypeNullable<ReturnType<TRefinement>>
	) extends infer TSchema ? TType extends 'update' ? ArktypeOptional<TSchema>
		: TSchema
	: Type<any>
	: TRefinement;

type Literal = type.infer<typeof literalSchema>;

export type Json = Literal | Record<string, any> | any[];

export type ColumnIsGeneratedAlwaysAs<TColumn> = TColumn extends Column
	? TColumn['_']['identity'] extends 'always' ? true
	: TColumn['_']['generated'] extends { type: 'byDefault' } | undefined ? false
	: true
	: false;

export type CollectionItem = {
	type: 'data' | 'types';

type External = {
	file: string;

export type Issue = {
	file: string;

export type IssueImport = {
	name: string;

export type ChainLink = {
	file: string;

type ListMode = 'whitelist' | 'blacklist';

export type CustomLocalPathResolver = (
	basePath: string,
	path: string,
	target: string,
) => string;

// ============================================================
// UCM Expected Types (stub)
// ============================================================

export interface Client {
  // TODO: Define based on vendor/database/ patterns
}

export interface QueryResult {
  // TODO: Define based on vendor/database/ patterns
}

export interface Migration {
  // TODO: Define based on vendor/database/ patterns
}

export interface Schema {
  // TODO: Define based on vendor/database/ patterns
}
