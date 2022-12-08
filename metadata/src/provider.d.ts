import type * as data from "@ty-ras/data";
import type * as dataBE from "@ty-ras/data-backend";
import type * as common from "./common";
import type * as endpoint from "./endpoint";

export type MetadataProvider<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends dataBE.TOutputContentsBase,
  TInputContents extends dataBE.TInputContentsBase,
  TStateMD,
  TFinalMetadataArgs,
  TFinalMetadata,
> = MetadataProviderForEndpoints<
  TArgument,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents,
  TInputContents
> & {
  createFinalMetadata: (
    args: TFinalMetadataArgs,
    endpointsMetadatas: ReadonlyArray<{
      md: TEndpointMD;
      stateMD: Partial<Record<data.HttpMethod, TStateMD>>;
    }>,
  ) => TFinalMetadata;
};

export interface MetadataProviderForEndpoints<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends dataBE.TOutputContentsBase,
  TInputContents extends dataBE.TInputContentsBase,
> {
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
