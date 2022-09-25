import type * as data from "@ty-ras/data-backend";
import type * as common from "./common";

export interface MetadataBuilder<
  TArgument extends common.HKTArg,
  TEndpointArg,
  TEndpointMD,
  THeaderDecoder,
  THeaderEncoder,
  TOutputContents extends data.TOutputContentsBase,
  TInputContents extends data.TInputContentsBase,
> {
  getEndpointsMetadata: (
    arg: TEndpointArg,
    urlSpec: ReadonlyArray<string | URLParameterSpec<THeaderDecoder>>,
    methods: Partial<
      Record<
        string,
        {
          requestHeadersSpec:
            | data.RequestHeaderDataValidatorSpecMetadata<
                string,
                THeaderDecoder
              >
            | undefined;
          responseHeadersSpec:
            | data.ResponseHeaderDataValidatorSpecMetadata<
                string,
                THeaderEncoder
              >
            | undefined;
          querySpec:
            | data.QueryDataValidatorSpecMetadata<string, THeaderDecoder>
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
      >
    >,
  ) => SingleEndpointResult<TEndpointMD>;
}

export type SingleEndpointResult<TEndpointMD> = (
  urlPrefix: string,
) => TEndpointMD;

export type URLParameterSpec<TStringDecoder> =
  data.URLParameterValidatorSpecMetadata<string, TStringDecoder>[string] & {
    name: string;
  };
