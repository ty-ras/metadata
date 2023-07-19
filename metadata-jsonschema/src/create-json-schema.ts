/**
 * @file This file contains the definition for `createJsonSchemaFunctionalityGeneric` which will be used by other TyRAS libraries, along with few other utility methods.
 */

import * as data from "@ty-ras/data";
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
  TValidatorHKT extends data.ValidatorHKTBase,
  TRequestBodyContentTypes extends string,
  TResponseBodyContentTypes extends string,
>({
  transformSchema,
  stringDecoder,
  stringEncoder,
  encoders,
  decoders,
  getUndefinedPossibility,
}: types.JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TValidatorHKT,
  TRequestBodyContentTypes,
  TResponseBodyContentTypes
>): types.SupportedJSONSchemaFunctionality<
  TTransformedSchema,
  TValidatorHKT,
  TRequestBodyContentTypes,
  TResponseBodyContentTypes
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
    Object.entries<
      types.SchemaTransformation<data.AnyEncoderGeneric<TValidatorHKT>>
    >(encoders).map<
      [
        TResponseBodyContentTypes,
        types.SupportedJSONSchemaFunctionality<
          TTransformedSchema,
          TValidatorHKT,
          TRequestBodyContentTypes,
          TResponseBodyContentTypes
        >["encoders"][TResponseBodyContentTypes],
      ]
    >(([contentType, { transform, override }]) => [
      contentType as TResponseBodyContentTypes,
      (...args) => transformSchema(override?.(...args) ?? transform(...args)),
    ]),
  ) as unknown as types.SupportedJSONSchemaFunctionality<
    TTransformedSchema,
    TValidatorHKT,
    TRequestBodyContentTypes,
    TResponseBodyContentTypes
  >["encoders"],
  decoders: Object.fromEntries(
    Object.entries<
      types.SchemaTransformation<data.AnyDecoderGeneric<TValidatorHKT>>
    >(decoders).map<
      [
        TRequestBodyContentTypes,
        types.SupportedJSONSchemaFunctionality<
          TTransformedSchema,
          TValidatorHKT,
          TRequestBodyContentTypes,
          TResponseBodyContentTypes
        >["decoders"][TRequestBodyContentTypes],
      ]
    >(([contentType, { transform, override }]) => [
      contentType as TRequestBodyContentTypes,
      (...args) => transformSchema(override?.(...args) ?? transform(...args)),
    ]),
  ) as unknown as types.SupportedJSONSchemaFunctionality<
    TTransformedSchema,
    TValidatorHKT,
    TRequestBodyContentTypes,
    TResponseBodyContentTypes
  >["decoders"],
  getUndefinedPossibility,
});
