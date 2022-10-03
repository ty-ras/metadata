import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";

export interface MetadataBuilder<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> {
  getEndpointsMetadata: (
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
}

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
    | Omit<
        data.DataValidatorRequestInputSpec<unknown, TInputContents>,
        "validator"
      >
    | undefined;
  outputSpec: Omit<
    data.DataValidatorResponseOutputSpec<unknown, TOutputContents>,
    "validator"
  >;
  metadataArguments: common.Kind<
    TArgument,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >;
}
