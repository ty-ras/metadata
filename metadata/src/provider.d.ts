import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";
import type * as endpoint from "./endpoint";

export type MetadataProvider<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TEndpointState,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
  TFinalMetadataArgs,
  TFinalMetadata,
> = MetadataProviderForEndpoints<
  TArgument,
  TEndpointArg,
  TEndpointMD,
  TEndpointState,
  TStringDecoder,
  TStringEncoder,
  TOutputContents,
  TInputContents
> & {
  createFinalMetadata: (
    args: TFinalMetadataArgs,
    endpointsMetadatas: ReadonlyArray<TEndpointMD>,
  ) => TFinalMetadata;
};

export interface MetadataProviderForEndpoints<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TEndpointState,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> {
  getEndpointsMetadata: endpoint.GetEndpointsMetadata<
    TArgument,
    TEndpointArg,
    TEndpointMD,
    TEndpointState,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  >;
}
