/**
 * @file This file contains code related to expressing TyRAS endpoints' metadata as [HKT](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again).
 */

import type * as protocol from "@ty-ras/protocol";

/* eslint-disable @typescript-eslint/ban-types */

/**
 * This is base type for all TyRAS endpoints' metadata [higher-kinded types (HKT)](https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again).
 * The point of HKT is that it can be used as generic argument without having generic arguments itself, e.g. something like using `function myFunc(list: List)` instead of `function <T>myFunc(list: List<T>)`.
 */
export interface MetadataProviderHKTBase {
  /**
   * This property will be used as argument by both {@link MaterializeParameterWhenSpecifyingURL} and {@link MaterializeParameterWhenSpecifyingEndpoint} types.
   * It should never be overwritten by sub-types.
   */
  readonly _argProtocolHKT?: unknown;

  /**
   * This property will be used as argument by {@link MaterializeParameterWhenSpecifyingURL} type.
   * It should never be overwritten by sub-types.
   */
  readonly _argURLParameters?: unknown;

  /**
   * This property will be used as argument by {@link MaterializeParameterWhenSpecifyingEndpoint} type.
   * It should never be overwritten by sub-types.
   */
  readonly _argProtocolSpec?: unknown;

  /**
   * This property will be used as argument by {@link MaterializeParameterWhenSpecifyingEndpoint} type.
   * It should never be overwritten by sub-types.
   */
  readonly _argRequestBodyContentTypes?: unknown;

  /**
   * This property will be used as argument by {@link MaterializeParameterWhenSpecifyingEndpoint} type.
   * It should never be overwritten by sub-types.
   */
  readonly _argResponseBodyContentTypes?: unknown;

  /**
   * This property should contain the type expression for {@link MaterializeParameterWhenSpecifyingURL} type.
   * It must always be overwritten by sub-types.
   */
  readonly _getParameterWhenSpecifyingURL?: unknown;

  /**
   * This property should contain the type expression for {@link MaterializeParameterWhenSpecifyingURL} type.
   * It must always be overwritten by sub-types.
   */
  readonly _getParameterWhenSpecifyingEndpoint?: unknown;

  /**
   * This property should contain the type expression for {@link MaterializeParameterWhenSpecifyingEndpoint} type.
   * It must always be overwritten by sub-types.
   */
  readonly _getReturnWhenSpecifyingEndpoint?: unknown;

  /**
   * This property should contain the type expression for {@link MaterializeParameterWhenCreatingEndpoints} type.
   * It must always be overwritten by sub-types.
   */
  readonly _getParameterWhenCreatingEndpoints?: unknown;

  /**
   * This property should contain the type expression for {@link MaterializeReturnWhenCreatingEndpoints} type.
   * It must always be overwritten by sub-types.
   */
  readonly _getReturnWhenCreatingEndpoints?: unknown;
}

/**
 * This is type which operates on subtypes of {@link MetadataProviderHKTBase}, and is responsible for providing the actual generic type ("materializing") for parameter to be given be BE endpoint specifying code, when creating builder for specific URL path pattern.
 */
export type MaterializeParameterWhenSpecifyingURL<
  TMetadataProviderHKT extends MetadataProviderHKTBase,
  TProtoEncodedHKT extends protocol.EncodedHKTBase,
  TURLData,
> = TMetadataProviderHKT extends {
  readonly _getParameterWhenSpecifyingURL: unknown;
}
  ? (TMetadataProviderHKT & {
      readonly _argProtocolHKT: TProtoEncodedHKT;
      readonly _argURLParameters: TURLData;
    })["_getParameterWhenSpecifyingURL"]
  : never;

/**
 * This is type which operates on subtypes of {@link MetadataProviderHKTBase}, and is responsible for providing the actual generic type ("materializing") for parameter to be given be BE endpoint specifying code, when defining endpoint for specific URL path pattern and specific HTTP method.
 */
export type MaterializeParameterWhenSpecifyingEndpoint<
  TMetadataProviderHKT extends MetadataProviderHKTBase,
  TProtoEncodedHKT extends protocol.EncodedHKTBase,
  TProtocolSpec extends protocol.ProtocolSpecCore<protocol.HttpMethod, unknown>,
  TRequestBodyContentTypes extends string,
  TResponseBodyContentTypes extends string,
> = TMetadataProviderHKT extends {
  readonly _getParameterWhenSpecifyingEndpoint: unknown;
}
  ? (TMetadataProviderHKT & {
      readonly _argProtocolHKT: TProtoEncodedHKT;
      readonly _argProtocolSpec: TProtocolSpec;
      readonly _argRequestBodyContentTypes: TRequestBodyContentTypes;
      readonly _argResponseBodyContentTypes: TResponseBodyContentTypes;
    })["_getParameterWhenSpecifyingEndpoint"]
  : never;

/**
 * This is type which operates on subtypes of {@link MetadataProviderHKTBase}, and is responsible for providing the actual generic type ("materializing") for return type of metadata provider function which builds the intermediate information about one or more endpoint behind one URL path pattern.
 */
export type MaterializeReturnWhenSpecifyingEndpoint<
  TMetadataProviderHKT extends MetadataProviderHKTBase,
> = TMetadataProviderHKT extends {
  readonly _getReturnWhenSpecifyingEndpoint: unknown;
}
  ? (TMetadataProviderHKT & {})["_getReturnWhenSpecifyingEndpoint"]
  : never;

/**
 * This is type which operates on subtypes of {@link MetadataProviderHKTBase}, and is responsible for providing the actual generic type ("materializing") for parameter required when constructing metadata for a full REST API constituted by multiple endpoints.
 */
export type MaterializeParameterWhenCreatingEndpoints<
  TMetadataProviderHKT extends MetadataProviderHKTBase,
> = TMetadataProviderHKT extends {
  readonly _getParameterWhenCreatingEndpoints: unknown;
}
  ? (TMetadataProviderHKT & {})["_getParameterWhenCreatingEndpoints"]
  : never;

/**
 * This is type which operates on subtypes of {@link MetadataProviderHKTBase}, and is responsible for providing the actual generic type ("materializing") for return type of metadata provider function which builds the final metadata object for a full REST API constituted by multiple endpoints.
 */
export type MaterializeReturnWhenCreatingEndpoints<
  TMetadataProviderHKT extends MetadataProviderHKTBase,
> = TMetadataProviderHKT extends {
  readonly _getReturnWhenCreatingEndpoints: unknown;
}
  ? (TMetadataProviderHKT & {})["_getReturnWhenCreatingEndpoints"]
  : never;
