// This file provides type declarations for the uuid package
// to ensure TypeScript can find the types

declare module 'uuid' {
  export function v1(options?: { node?: number[]; clockseq?: number; msecs?: number; nsecs?: number }): string;
  export function v4(options?: { random?: number[]; rng?: () => number[] }): string;
  export function v3(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function v5(name: string | Uint8Array, namespace: string | Uint8Array): string;
  export function parse(uuid: string): Uint8Array;
  export function stringify(arr: Uint8Array, offset?: number): string;
  export function validate(uuid: string): boolean;
  export function version(uuid: string): number;
  export const NIL: string;
  export const MAX: string;
  export namespace v1 {
    function validate(uuid: string): boolean;
  }
  export namespace v4 {
    function validate(uuid: string): boolean;
  }
}
