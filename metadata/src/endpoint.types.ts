/**
 * @file This file contains types related to constructing metadata information about HTTP endpoint(s) at certain URL path (and possibly with multiple HTTP methods).
 */

import type * as data from "@ty-ras/data-backend";
import type * as mdArg from "./md-arg.types";

/**
 * This signature is for callbacks which return metadata for HTTP endpoint(s) at certain URL path (and possibly with multiple HTTP methods).
 */
export type GetEndpointsMetadata<
  TArgument extends mdArg.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> = (
  arg: TEndpointArg,
  urlSpec: URLParametersInfo<TStringDecoder>,
  methods: Partial<
    Record<
      string,
      EndpointMetadataInformation<
        TArgument,
        TStringDecoder,
        TStringEncoder,
        TOutputContents,
        TInputContents
      >
    >
  >,
) => SingleEndpointResult<TEndpointMD>;

/**
 * This signature is what {@link GetEndpointsMetadata} callbacks return: another callback to actually construct the final metadata, at given URL prefix.
 */
export type SingleEndpointResult<TEndpointMD> = (
  urlPrefix: string,
) => TEndpointMD;

/**
 * This type represents information about parameters in URL path, as argument to {@link GetEndpointsMetadata}.
 * It is an array, where each element may be one of:
 * - String, representing the static part of the URL path spec, or
 * - {@link URLParameterSpec} representing the definition of one URL path parameter.
 *
 * For example, the URL path spec represented in OpenAPI format as `/api/do-something/{ param1 }/something-else/{ param2 }`, in this type format, would be `["/api/do-something/", { name: "param1", spec: ... }, "/something-else/", { name: "param2", spec: ... }]`.
 */
export type URLParametersInfo<TStringDecoder> = ReadonlyArray<
  string | URLParameterSpec<TStringDecoder>
>;

/**
 * This interface captures both the name, and the metadata about one parameter in URL path.
 */
export interface URLParameterSpec<TStringDecoder> {
  /**
   * The name of the URL path parameter.
   */
  name: string;

  /**
   * The metadata about URL path parameter.
   */
  spec: data.URLParameterValidatorSpecMetadata<string, TStringDecoder>[string];
}

/**
 * This is generic information about single HTTP endpoint, as path of per-method dictionary of argument for {@link GetEndpointsMetadata}.
 */
export interface EndpointMetadataInformation<
  TArgument extends mdArg.HKTArg,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> {
  /**
   * The metadata about HTTP request headers.
   */
  requestHeadersSpec:
    | data.RequestHeaderDataValidatorSpecMetadata<string, TStringDecoder>
    | undefined;

  /**
   * The metadata about HTTP response headers.
   */
  responseHeadersSpec:
    | data.ResponseHeaderDataValidatorSpecMetadata<string, TStringEncoder>
    | undefined;

  /**
   * The metadata about URL query parameters.
   */
  querySpec:
    | data.QueryDataValidatorSpecMetadata<string, TStringDecoder>
    | undefined;

  /**
   * The metadata about HTTP request body.
   */
  inputSpec:
    | data.DataValidatorResponseInputValidatorSpec<TInputContents>
    | undefined;

  /**
   * The metadata about HTTP response body.
   */
  outputSpec: data.DataValidatorResponseOutputValidatorSpec<TOutputContents>;

  /**
   * The generic version of the arguments for certain kind of metadata (e.g. OpenAPI).
   */
  metadataArguments: mdArg.Kind<
    TArgument,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >;
}
