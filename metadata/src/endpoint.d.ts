import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";

export type GetEndpointsMetadata<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TEndpointState,
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
        TEndpointState,
        TStringDecoder,
        TStringEncoder,
        TOutputContents,
        TInputContents
      >
    >
  >,
) => SingleEndpointResult<TEndpointMD>;

export type SingleEndpointResult<TEndpointMD> = (
  urlPrefix: string,
) => TEndpointMD;

export type URLParametersInfo<TStringDecoder> = ReadonlyArray<
  string | URLParameterSpec<TStringDecoder>
>;

export type URLParameterSpec<TStringDecoder> =
  data.URLParameterValidatorSpecMetadata<string, TStringDecoder>[string] & {
    name: string;
  };

export interface EndpointMetadataInformation<
  TArgument extends common.HKTArg,
  TEndpointState,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> {
  requestHeadersSpec:
    | data.RequestHeaderDataValidatorSpecMetadata<string, TStringDecoder>
    | undefined;
  responseHeadersSpec:
    | data.ResponseHeaderDataValidatorSpecMetadata<string, TStringEncoder>
    | undefined;
  querySpec:
    | data.QueryDataValidatorSpecMetadata<string, TStringDecoder>
    | undefined;
  inputSpec:
    | data.DataValidatorResponseInputValidatorSpec<TInputContents>
    | undefined;
  outputSpec: data.DataValidatorResponseOutputValidatorSpec<TOutputContents>;
  metadataArguments: common.Kind<
    TArgument,
    TEndpointState,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >;
}
