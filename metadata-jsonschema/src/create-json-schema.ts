/**
 * @file This file contains the definition for `createJsonSchemaFunctionalityGeneric` which will be used by other TyRAS libraries, along with few other utility methods.
 */

import type * as types from "./create-json-schema.types";

/**
 * Creates a new {@link types.SupportedJSONSchemaFunctionality} with given {@link types.JSONSchemaFunctionalityCreationArgumentsGeneric}.
 * @param param0 The deconstructed {@link types.JSONSchemaFunctionalityCreationArgumentsGeneric}.
 * @param param0.transformSchema Privately deconstructed variables.
 * @param param0.stringDecoder Privately deconstructed variables.
 * @param param0.stringEncoder Privately deconstructed variables.
 * @param param0.encoders Privately deconstructed variables.
 * @param param0.decoders Privately deconstructed variables.
 * @param param0.getUndefinedPossibility Privately deconstructed variables.
 * @returns A new instance of {@link types.SupportedJSONSchemaFunctionality}.
 */
export const createJsonSchemaFunctionalityGeneric = <
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends types.TContentsBase,
  TInputContents extends types.TContentsBase,
>({
  transformSchema,
  stringDecoder,
  stringEncoder,
  encoders,
  decoders,
  getUndefinedPossibility,
}: types.JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents,
  TInputContents
>): types.SupportedJSONSchemaFunctionality<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents,
  TInputContents
> => ({
  stringDecoder: (...args) =>
    transformSchema(
      stringDecoder.override?.(...args) ?? stringDecoder.transform(...args),
    ),
  stringEncoder: (...args) =>
    transformSchema(
      stringEncoder.override?.(...args) ?? stringEncoder.transform(...args),
    ),
  encoders: Object.fromEntries(
    Object.entries(encoders).map<
      [
        keyof TOutputContents,
        types.SupportedJSONSchemaFunctionality<
          TTransformedSchema,
          TStringDecoder,
          TStringEncoder,
          TOutputContents,
          TInputContents
        >["encoders"][string],
      ]
    >(([contentType, { transform, override }]) => [
      contentType,
      (...args) => transformSchema(override?.(...args) ?? transform(...args)),
    ]),
  ) as unknown as types.SupportedJSONSchemaFunctionality<
    TTransformedSchema,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  >["encoders"],
  decoders: Object.fromEntries(
    Object.entries(decoders).map<
      [
        keyof TInputContents,
        types.SupportedJSONSchemaFunctionality<
          TTransformedSchema,
          TStringDecoder,
          TStringEncoder,
          TOutputContents,
          TInputContents
        >["decoders"][string],
      ]
    >(([contentType, { transform, override }]) => [
      contentType,
      (...args) => transformSchema(override?.(...args) ?? transform(...args)),
    ]),
  ) as unknown as types.SupportedJSONSchemaFunctionality<
    TTransformedSchema,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  >["decoders"],
  getUndefinedPossibility,
});
