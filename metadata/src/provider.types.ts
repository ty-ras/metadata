/**
 * @file This file contains types for any provider which collects metadata (e.g. OpenAPI) about BE endpoints specified with TyRAS framework.
 */

import type * as protocol from "@ty-ras/protocol";
import type * as data from "@ty-ras/data";
import type * as dataBE from "@ty-ras/data-backend";
import type * as ep from "@ty-ras/endpoint";
import type * as hkt from "./hkt.types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This is interface which defines functionality to be implemented by metadata providers (e.g. OpenAPI) which operate for endpoints specified with TyRAS framework.
 */
export interface MetadataProvider<
  TProtocolEncodedHKT extends protocol.EncodedHKTBase,
  TValidatorHKT extends data.ValidatorHKTBase,
  TStateHKT extends dataBE.StateHKTBase,
  TMetadataProviderHKT extends hkt.MetadataProviderHKTBase,
> {
  /**
   * This function should produce provider-specific intermediate object for one or more endpoint defined for single URL path pattern.
   * @param urlArgs The arguments common for URL path pattern.
   * @param endpoints The endpoints and their data, with HTTP method as key.
   * @returns The provider-specific intermediate result to be used in {@link createFinalMetadata }.
   */
  afterDefiningURLEndpoints: (
    this: void,
    urlArgs: {
      url: dataBE.URLParameterValidatorSpecMetadata<
        protocol.TURLDataBase,
        TValidatorHKT
      >;
      md: hkt.MaterializeParameterWhenSpecifyingURL<
        TMetadataProviderHKT,
        TProtocolEncodedHKT,
        Record<string, unknown>
      >;
      patternSpec: URLPathPatternInfo;
    },
    endpoints: Record<
      protocol.HttpMethod,
      SingleEndpointInformation<
        TProtocolEncodedHKT,
        TValidatorHKT,
        TStateHKT,
        TMetadataProviderHKT
      >
    >,
  ) => hkt.MaterializeReturnWhenSpecifyingEndpoint<TMetadataProviderHKT>;

  /**
   * This function should build the full metadata object for the whole REST API.
   * @param mdArg The provider-specific argument common for whole REST API.
   * @param endpointMetadatas The information about endpoints constituting the REST API, including results of {@link afterDefiningURLEndpoints}.
   * @returns The provider-specific metadata object.
   */
  createFinalMetadata: (
    this: void,
    mdArg: hkt.MaterializeParameterWhenCreatingEndpoints<TMetadataProviderHKT>,
    endpointMetadatas: ReadonlyArray<
      hkt.MaterializeReturnWhenSpecifyingEndpoint<TMetadataProviderHKT>
    >,
  ) => hkt.MaterializeReturnWhenCreatingEndpoints<TMetadataProviderHKT>;
}

/**
 * This type represents information about parameters in URL path, as argument to {@link GetEndpointsMetadata}.
 * It is an array, where each element may be one of:
 * - String, representing the static part of the URL path spec, or
 * - {@link URLParameterSpec} representing the definition of one URL path parameter.
 *
 * For example, the URL path spec represented in OpenAPI format as `/api/do-something/{ param1 }/something-else/{ param2 }`, in this type format, would be `["/api/do-something/", { name: "param1", spec: ... }, "/something-else/", { name: "param2", spec: ... }]`.
 */
export type URLPathPatternInfo = ReadonlyArray<string | URLParameterSpec>;

/**
 * This interface captures both the name, and the metadata about one parameter in URL path.
 */
export interface URLParameterSpec {
  /**
   * The name of the URL path parameter.
   */
  name: string;
}

/**
 * This interface contains both TyRAS generic information, as well as provider-specific information, about one REST API endpoint.
 */
export interface SingleEndpointInformation<
  TProtocolEncodedHKT extends protocol.EncodedHKTBase,
  TValidatorHKT extends data.ValidatorHKTBase,
  TStateHKT extends dataBE.StateHKTBase,
  TMetadataProviderHKT extends hkt.MetadataProviderHKTBase,
> {
  /**
   * The TyRAS generic information about one REST API endpoint.
   */
  spec: SingleEndpointSpecMetadata<TValidatorHKT, TStateHKT>;

  /**
   * The provider-specific information about one REST API endpoint.
   */
  md: hkt.MaterializeParameterWhenSpecifyingEndpoint<
    TMetadataProviderHKT,
    TProtocolEncodedHKT,
    protocol.ProtocolSpecCore<protocol.HttpMethod, unknown>,
    string,
    string
  >;
}

/**
 * This interface contains all TyRAS generic information about one REST API endpoint.
 */
export interface SingleEndpointSpecMetadata<
  TValidatorHKT extends data.ValidatorHKTBase,
  TStateHKT extends dataBE.StateHKTBase,
> {
  /**
   * The HTTP method {@link protocol.HttpMethod} for this endpoint.
   */
  method: protocol.HttpMethod;

  /**
   * The {@link dataBE.DataValidatorResponseOutputValidatorSpec} of the HTTP response body for this endpoint.
   */
  responseBody: dataBE.DataValidatorResponseOutputValidatorSpec<
    unknown,
    unknown,
    TValidatorHKT,
    string
  >;

  /**
   * The optional {@link dataBE.QueryDataValidatorSpecMetadata} of the HTTP request query parameters for this endpoint.
   */
  query:
    | dataBE.QueryDataValidatorSpecMetadata<
        protocol.TQueryDataBase,
        TValidatorHKT
      >
    | undefined;

  /**
   * The optional {@link dataBE.DataValidatorResponseInputValidatorSpec} of the HTTP request body for this endpoint.
   */
  requestBody:
    | dataBE.DataValidatorResponseInputValidatorSpec<
        unknown,
        TValidatorHKT,
        string
      >
    | undefined;

  /**
   * The optional {@link dataBE.RequestHeaderDataValidatorSpecMetadata} of the HTTP request headers for this endpoint.
   */
  requestHeaders:
    | dataBE.RequestHeaderDataValidatorSpecMetadata<
        protocol.TRequestHeadersDataBase,
        TValidatorHKT
      >
    | undefined;

  /**
   * The optional {@link dataBE.ResponseHeaderDataValidatorSpecMetadata} of the HTTP response headers for this endpoint.
   */
  responseHeaders:
    | dataBE.ResponseHeaderDataValidatorSpecMetadata<
        protocol.TResponseHeadersDataBase,
        TValidatorHKT
      >
    | undefined;

  /**
   * The {@link ep.EndpointStateInformation} for this endpoint.
   * These typically signify e.g. the need of authentication or some other internal aspect, which is relevant for metadata providers.
   */
  stateInfo: ep.EndpointStateInformation<
    dataBE.MaterializeStateInfo<
      TStateHKT,
      dataBE.MaterializeStateSpecBase<TStateHKT>
    >,
    dataBE.MaterializeRuntimeState<
      TStateHKT,
      dataBE.MaterializeStateSpecBase<TStateHKT>
    >
  >;
}
