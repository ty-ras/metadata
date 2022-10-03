import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";
import type * as stage1 from "./stage1";

export interface MetadataProvider<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TContextArguments,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
  TFinalMetadataArgs,
  TFinalMetadata,
> {
  withRefinedContext(
    contextArgs: TContextArguments,
  ): MetadataProvider<
    TArgument,
    TEndpointArg,
    TEndpointMD,
    TContextArguments,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents,
    TFinalMetadataArgs,
    TFinalMetadata
  >;

  getBuilder(): stage1.MetadataBuilder<
    TArgument,
    TEndpointArg,
    TEndpointMD,
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
