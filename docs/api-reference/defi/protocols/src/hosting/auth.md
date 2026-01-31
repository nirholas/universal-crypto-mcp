[**Universal Crypto MCP API Reference v1.0.0**](../../../../index.md)

***

[Universal Crypto MCP API Reference](/docs/api/index.md) / defi/protocols/src/hosting/auth

# defi/protocols/src/hosting/auth

## Interfaces

### AuthTokenPayload

Defined in: [defi/protocols/src/hosting/auth.ts:41](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L41)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="email"></a> `email` | `string` | [defi/protocols/src/hosting/auth.ts:43](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L43) |
| <a id="exp"></a> `exp` | `number` | [defi/protocols/src/hosting/auth.ts:46](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L46) |
| <a id="iat"></a> `iat` | `number` | [defi/protocols/src/hosting/auth.ts:45](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L45) |
| <a id="tier"></a> `tier` | `string` | [defi/protocols/src/hosting/auth.ts:44](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L44) |
| <a id="userid"></a> `userId` | `string` | [defi/protocols/src/hosting/auth.ts:42](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L42) |

***

### AuthUser

Defined in: [defi/protocols/src/hosting/auth.ts:34](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L34)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="email-1"></a> `email` | `string` | [defi/protocols/src/hosting/auth.ts:36](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L36) |
| <a id="id"></a> `id` | `string` | [defi/protocols/src/hosting/auth.ts:35](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L35) |
| <a id="tier-1"></a> `tier` | `"free"` \| `"pro"` \| `"business"` \| `"enterprise"` | [defi/protocols/src/hosting/auth.ts:38](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L38) |
| <a id="username"></a> `username` | `string` | [defi/protocols/src/hosting/auth.ts:37](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L37) |

***

### SignInResult

Defined in: [defi/protocols/src/hosting/auth.ts:54](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L54)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="token"></a> `token` | `string` | [defi/protocols/src/hosting/auth.ts:56](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L56) |
| <a id="user"></a> `user` | [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser) | [defi/protocols/src/hosting/auth.ts:55](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L55) |

***

### SignUpResult

Defined in: [defi/protocols/src/hosting/auth.ts:49](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L49)

#### Properties

| Property | Type | Defined in |
| :------ | :------ | :------ |
| <a id="token-1"></a> `token` | `string` | [defi/protocols/src/hosting/auth.ts:51](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L51) |
| <a id="user-1"></a> `user` | [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser) | [defi/protocols/src/hosting/auth.ts:50](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L50) |

## Variables

### default

```ts
default: {
  extractBearerToken: (authHeader: string | null) => string | null;
  getStripeCustomerId: (userId: string) => string | null;
  getUserById: (id: string) => 
     | AuthUser
    | null;
  getUserFromToken: (token: string) => 
     | AuthUser
    | null;
  hashPassword: (password: string) => Promise<string>;
  refreshToken: (userId: string) => string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, username?: string) => Promise<SignUpResult>;
  updateUserStripeInfo: (userId: string, stripeCustomerId: string, stripeSubscriptionId?: string) => Promise<void>;
  updateUserTier: (userId: string, tier: "free" | "pro" | "business" | "enterprise", stripeCustomerId?: string, stripeSubscriptionId?: string) => Promise<AuthUser>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
  verifyToken: (token: string) => AuthTokenPayload;
};
```

Defined in: [defi/protocols/src/hosting/auth.ts:328](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L328)

#### Type Declaration

| Name | Type | Defined in |
| :------ | :------ | :------ |
| <a id="extractbearertoken-3"></a> `extractBearerToken()` | (`authHeader`: `string` \| `null`) => `string` \| `null` | [defi/protocols/src/hosting/auth.ts:338](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L338) |
| <a id="getstripecustomerid-3"></a> `getStripeCustomerId()` | (`userId`: `string`) => `string` \| `null` | [defi/protocols/src/hosting/auth.ts:336](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L336) |
| <a id="getuserbyid-3"></a> `getUserById()` | (`id`: `string`) => \| [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser) \| `null` | [defi/protocols/src/hosting/auth.ts:333](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L333) |
| <a id="getuserfromtoken-3"></a> `getUserFromToken()` | (`token`: `string`) => \| [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser) \| `null` | [defi/protocols/src/hosting/auth.ts:332](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L332) |
| <a id="hashpassword-3"></a> `hashPassword()` | (`password`: `string`) => `Promise`\<`string`\> | [defi/protocols/src/hosting/auth.ts:339](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L339) |
| <a id="refreshtoken-3"></a> `refreshToken()` | (`userId`: `string`) => `string` \| `null` | [defi/protocols/src/hosting/auth.ts:337](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L337) |
| <a id="signin-3"></a> `signIn()` | (`email`: `string`, `password`: `string`) => `Promise`\<[`SignInResult`](/docs/api/defi/protocols/src/hosting/auth.md#signinresult)\> | [defi/protocols/src/hosting/auth.ts:330](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L330) |
| <a id="signup-3"></a> `signUp()` | (`email`: `string`, `password`: `string`, `username?`: `string`) => `Promise`\<[`SignUpResult`](/docs/api/defi/protocols/src/hosting/auth.md#signupresult)\> | [defi/protocols/src/hosting/auth.ts:329](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L329) |
| <a id="updateuserstripeinfo-3"></a> `updateUserStripeInfo()` | (`userId`: `string`, `stripeCustomerId`: `string`, `stripeSubscriptionId?`: `string`) => `Promise`\<`void`\> | [defi/protocols/src/hosting/auth.ts:335](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L335) |
| <a id="updateusertier-3"></a> `updateUserTier()` | (`userId`: `string`, `tier`: `"free"` \| `"pro"` \| `"business"` \| `"enterprise"`, `stripeCustomerId?`: `string`, `stripeSubscriptionId?`: `string`) => `Promise`\<[`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser)\> | [defi/protocols/src/hosting/auth.ts:334](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L334) |
| <a id="verifypassword-3"></a> `verifyPassword()` | (`password`: `string`, `hash`: `string`) => `Promise`\<`boolean`\> | [defi/protocols/src/hosting/auth.ts:340](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L340) |
| <a id="verifytoken-3"></a> `verifyToken()` | (`token`: `string`) => [`AuthTokenPayload`](/docs/api/defi/protocols/src/hosting/auth.md#authtokenpayload) | [defi/protocols/src/hosting/auth.ts:331](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L331) |

## Functions

### extractBearerToken()

```ts
function extractBearerToken(authHeader: string | null): string | null;
```

Defined in: [defi/protocols/src/hosting/auth.ts:308](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L308)

Middleware helper to extract token from Authorization header

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `authHeader` | `string` \| `null` |

#### Returns

`string` \| `null`

***

### getStripeCustomerId()

```ts
function getStripeCustomerId(userId: string): string | null;
```

Defined in: [defi/protocols/src/hosting/auth.ts:264](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L264)

Get user's Stripe customer ID

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`string` \| `null`

***

### getUserById()

```ts
function getUserById(id: string): 
  | AuthUser
  | null;
```

Defined in: [defi/protocols/src/hosting/auth.ts:202](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L202)

Get user by ID

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

  \| [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser)
  \| `null`

***

### getUserFromToken()

```ts
function getUserFromToken(token: string): 
  | AuthUser
  | null;
```

Defined in: [defi/protocols/src/hosting/auth.ts:188](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L188)

Get user from token

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

  \| [`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser)
  \| `null`

***

### hashPassword()

```ts
function hashPassword(password: string): Promise<string>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:317](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L317)

Hash a password (utility for migrations)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `password` | `string` |

#### Returns

`Promise`\<`string`\>

***

### refreshToken()

```ts
function refreshToken(userId: string): string | null;
```

Defined in: [defi/protocols/src/hosting/auth.ts:287](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L287)

Refresh token (generate new token for existing user)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`string` \| `null`

***

### signIn()

```ts
function signIn(email: string, password: string): Promise<SignInResult>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:135](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L135)

Sign in an existing user

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `email` | `string` |
| `password` | `string` |

#### Returns

`Promise`\<[`SignInResult`](/docs/api/defi/protocols/src/hosting/auth.md#signinresult)\>

***

### signUp()

```ts
function signUp(
   email: string, 
   password: string, 
username?: string): Promise<SignUpResult>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:78](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L78)

Sign up a new user

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `email` | `string` |
| `password` | `string` |
| `username?` | `string` |

#### Returns

`Promise`\<[`SignUpResult`](/docs/api/defi/protocols/src/hosting/auth.md#signupresult)\>

***

### updateUserStripeInfo()

```ts
function updateUserStripeInfo(
   userId: string, 
   stripeCustomerId: string, 
stripeSubscriptionId?: string): Promise<void>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:242](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L242)

Update user Stripe info

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `stripeCustomerId` | `string` |
| `stripeSubscriptionId?` | `string` |

#### Returns

`Promise`\<`void`\>

***

### updateUserTier()

```ts
function updateUserTier(
   userId: string, 
   tier: "free" | "pro" | "business" | "enterprise", 
   stripeCustomerId?: string, 
stripeSubscriptionId?: string): Promise<AuthUser>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:211](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L211)

Update user tier (called after Stripe webhook)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `userId` | `string` |
| `tier` | `"free"` \| `"pro"` \| `"business"` \| `"enterprise"` |
| `stripeCustomerId?` | `string` |
| `stripeSubscriptionId?` | `string` |

#### Returns

`Promise`\<[`AuthUser`](/docs/api/defi/protocols/src/hosting/auth.md#authuser)\>

***

### verifyPassword()

```ts
function verifyPassword(password: string, hash: string): Promise<boolean>;
```

Defined in: [defi/protocols/src/hosting/auth.ts:324](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L324)

Verify a password against hash (utility)

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `password` | `string` |
| `hash` | `string` |

#### Returns

`Promise`\<`boolean`\>

***

### verifyToken()

```ts
function verifyToken(token: string): AuthTokenPayload;
```

Defined in: [defi/protocols/src/hosting/auth.ts:170](https://github.com/nirholas/universal-crypto-mcp/blob/2b24f56f5c1847dd14a50a618b98164e511a842f/packages/defi/protocols/src/hosting/auth.ts#L170)

Verify and decode a JWT token

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

[`AuthTokenPayload`](/docs/api/defi/protocols/src/hosting/auth.md#authtokenpayload)
