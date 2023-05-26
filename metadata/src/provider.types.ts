/**
 * @file This file contains type definitions for the object which is able to create metadata specifications of different kind (e.g. OpenAPI, or something else).
 */

import type * as data from "@ty-ras/data";
import type * as dataBE from "@ty-ras/data-backend";
import type * as mdArg from "./md-arg.types";
import type * as endpoint from "./endpoint.types";

/**
 * This interface extends {@link MetadataProviderForEndpoints} to bring capability of creating final metadata object about several HTTP endpoints.
 */
export interface MetadataProvider<
  TArgument extends mdArg.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends dataBE.TOutputContentsBase,
  TInputContents extends dataBE.TInputContentsBase,
  TStateMD,
  TFinalMetadataArgs,
  TFinalMetadata,
> extends MetadataProviderForEndpoints<
    TArgument,
    TEndpointArg,
    TEndpointMD,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  > {
  /**
   * This function will create the final metadata object combining multiple single HTTP endpoint metadatas into one coherent REST API metadata definition.
   * @param args The arguments not related to any specific HTTP endpoint, but needed to create final metadata object.
   * @param endpointsMetadatas The array of {@link MetadataForSingleEndpoint} objects capturing metadata information about multple HTTP endpoints.
   * @returns Final metadata object.
   */
  createFinalMetadata: (
    args: TFinalMetadataArgs,
    endpointsMetadatas: ReadonlyArray<
      MetadataForSingleEndpoint<TEndpointMD, TStateMD>
    >,
  ) => TFinalMetadata;
}

/**
 * This interface provides method to create metadata for HTTP endpoint(s) behind single URL path spec.
 */
export interface MetadataProviderForEndpoints<
  TArgument extends mdArg.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends dataBE.TOutputContentsBase,
  TInputContents extends dataBE.TInputContentsBase,
> {
  /**
   * Creates metadata object for HTTP endpoint(s) behind single URL path spec, and possibly multiple HTTP methods.
   */
  getEndpointsMetadata: endpoint.GetEndpointsMetadata<
    TArgument,
    TEndpointArg,
    TEndpointMD,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  >;
}

/**
 * This interface contains metadata about single HTTP endpoints.
 */
export interface MetadataForSingleEndpoint<TEndpointMD, TStateMD> {
  /**
   * The metadata about the HTTP endpoint.
   */
  md: TEndpointMD;

  /**
   * The additional metadata per HTTP method, needed to construct the metadata object for group of HTTP endpoints behind same URL path pattern.
   */
  stateMD: Partial<Record<data.HttpMethod, TStateMD>>;
}
