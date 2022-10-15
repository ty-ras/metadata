import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";
import type * as endpoint from "./endpoint";

export interface MetadataProvider<
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
  createFinalMetadata(
    args: TFinalMetadataArgs,
    endpointsMetadatas: ReadonlyArray<TEndpointMD>,
  ): TFinalMetadata;
}
