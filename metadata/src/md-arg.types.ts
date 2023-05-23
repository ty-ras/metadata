/**
 * @file This file contains type definitions related to customizing the arguments needed for creating metadata for one HTTP endpoint.
 */

/**
 * This is [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again) for type which will be used when constructing final metadata.
 * It will capture the necessary shape of the type needed to construct certain kind of metadata (e.g. OpenAPI, or something else).
 * @example
 * ```ts
 * import type * as md from "@ty-ras/metadata";
 *
 * export interface CustomMetadataArguments extends md.HKTArg {
 *   readonly type: CustomMetadataTypeStatic &
 *     CustomMetadataTypeURLData<this["_TURLData"]> &
 *     CustomMetadataTypeRequestHeaders<this["_TRequestHeaders"]> &
 *     ...
 *   ;
 * }
 * ```
 */
export interface HKTArg {
  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the shape of the data passed via URL path string.
   */
  readonly _TURLData?: unknown;
  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the HTTP method of the endpoint.
   */
  readonly _TMethod?: unknown;
  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the data passed via HTTP request headers.
   */
  readonly _TRequestHeaders?: unknown;

  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the data returned via HTTP response headers.
   */
  readonly _TResponseHeaders?: unknown;

  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the data passed via URL query.
   */
  readonly _TQuery?: unknown;

  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the data passed via HTTP request body.
   */
  readonly _TBody?: unknown;

  /**
   * This is the "generic argument" of [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again), representing the data passed via HTTP response body.
   */
  readonly _TOutput?: unknown;

  /**
   * This property should be overridden by type extending this type, and it should hold the concrete type, parametrized using the other properties of this type:
   *
   * ```ts
   * import type * as md from "@ty-ras/metadata";
   *
   * export interface CustomMetadataArguments extends md.HKTArg {
   *   readonly type: CustomMetadataTypeStatic &
   *     CustomMetadataTypeURLData<this["_TURLData"]> &
   *     CustomMetadataTypeRequestHeaders<this["_TRequestHeaders"]> &
   *     ...
   *   ;
   * }
   * ```
   */
  readonly type?: unknown;
}

/**
 * The helper type for [higher-kinded-type](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again) {@link HKTArg} which will materialize the actual type.
 */
export type Kind<
  F extends HKTArg,
  TURLData,
  TQuery,
  TRequestHeaders,
  TResponseHeaders,
  TBody,
  TOutput,
> = F extends {
  readonly type: unknown;
}
  ? (F & {
      readonly _TURLData: TURLData;
      readonly _TRequestHeaders: TRequestHeaders;
      readonly _TResponseHeaders: TResponseHeaders;
      readonly _TQuery: TQuery;
      readonly _TBody: TBody;
      readonly _TOutput: TOutput;
    })["type"]
  : never; // This is simplified version from original HKT pattern in the link, because we don't use the functional properties of this specific HKT.
