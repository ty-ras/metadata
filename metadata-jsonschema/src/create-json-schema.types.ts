/**
 * @file This types-only file contains types for creating {@link SupportedJSONSchemaFunctionality} using minimal amount of repetition.
 */

import type * as jsonSchema from "json-schema";
import type * as data from "@ty-ras/data";

/**
 * This type contains all necessary functionality in order to transform native `io-ts`/`zod`/`runtypes`/... validators into schema information understood by particular metadata format.
 * This is done by first using functionality of this type to transform native validators into {@link JSONSchema}, and then the returned JSON schema will be transformed into final format (which is typically same or subset of {@link JSONSchema}).
 */
export interface SupportedJSONSchemaFunctionality<
  TTransformedSchema,
  TValidatorHKT extends data.ValidatorHKTBase,
  TRequestBodyContentTypes extends string,
  TResponseBodyContentTypes extends string,
> extends JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<TValidatorHKT> {
  /**
   * The callback to transform the decoders (deserializers) for string values (HTTP request headers, URL path parameters, query parameters), to final schema object.
   */
  stringDecoder: Transformer<
    data.AnyDecoderGeneric<TValidatorHKT>,
    TTransformedSchema
  >;

  /**
   * The callback to transform the encoders (serializers) for string values, to final schema object.
   */
  stringEncoder: Transformer<
    data.AnyEncoderGeneric<TValidatorHKT>,
    TTransformedSchema
  >;

  /**
   * Callbacks to transform response body encoders (serializers), to final schema object.
   * Key is content MIME type (almost always "application/json").
   * Value is the callback to transform the encoders.
   */
  encoders: {
    [P in TResponseBodyContentTypes]: Transformer<
      data.AnyEncoderGeneric<TValidatorHKT>,
      TTransformedSchema
    >;
  };

  /**
   * Callbacks to transform request body decoders (deserializers), to final schema object.
   * Key is content MIME type (almost always "application/json").
   * Value is the callback to transform the decoders.
   */
  decoders: {
    [P in TRequestBodyContentTypes]: Transformer<
      data.AnyDecoderGeneric<TValidatorHKT>,
      TTransformedSchema
    >;
  };
}

/**
 * The JSON schema that is used by this library - version 7.
 * @see jsonSchema.JSONSchema7Definition
 */
export type JSONSchema = jsonSchema.JSONSchema7Definition;

/**
 * The common base interface for {@link SupportedJSONSchemaFunctionality} and {@link JSONSchemaFunctionalityCreationArgumentsGeneric}.
 */
export interface JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
  TValidatorHKT extends data.ValidatorHKTBase,
> {
  /**
   * Callback to get information on whether the given decoder or encoder accepts `undefined` as valid value.
   * @see GetUndefinedPossibility
   */
  getUndefinedPossibility: GetUndefinedPossibility<
    | data.AnyDecoderGeneric<TValidatorHKT>
    | data.AnyEncoderGeneric<TValidatorHKT>
  >;
}

/**
 * The arguments for function creating instances of {@link SupportedJSONSchemaFunctionality} by function of this library.
 * This type is meant to be used by other TyRAS libraries, and not directly by client code.
 */
export interface JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TValidatorHKT extends data.ValidatorHKTBase,
  TRequestBodyContentTypes extends string,
  TResponseBodyContentTypes extends string,
> extends JSONSchemaFunctionalityCreationArgumentsBase<TTransformedSchema>,
    JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<TValidatorHKT> {
  /**
   * The {@link SchemaTransformation} for decoders (deserializers) of string values (HTTP request headers, URL path parameters, query parameters).
   */
  stringDecoder: SchemaTransformation<data.AnyDecoderGeneric<TValidatorHKT>>;

  /**
   * The {@link SchemaTransformation} for encoders (serializers) of string values (HTTP response headers).
   */
  stringEncoder: SchemaTransformation<data.AnyEncoderGeneric<TValidatorHKT>>;

  /**
   * The {@link SchemaTransformation} objects for encoders (serializers) of HTTP response body.
   */
  encoders: {
    [P in TResponseBodyContentTypes]: SchemaTransformation<
      data.AnyEncoderGeneric<TValidatorHKT>
    >;
  };

  /**
   * The {@link SchemaTransformation} objects for decoders (deserializers) of HTTP request body.
   */
  decoders: {
    [P in TRequestBodyContentTypes]: SchemaTransformation<
      data.AnyDecoderGeneric<TValidatorHKT>
    >;
  };
}

/**
 * The base interface for {@link JSONSchemaFunctionalityCreationArgumentsGeneric} and {@link JSONSchemaFunctionalityCreationArgumentsContentTypes}.
 */
export interface JSONSchemaFunctionalityCreationArgumentsBase<
  TTransformedSchema,
> {
  /**
   * The callback to transform {@link JSONSchema} constructed from encoders/decoders, into custom schema object.
   * @param schema The {@link JSONSchema} to transform.
   * @returns The transformed schema object.
   */
  transformSchema: (schema: JSONSchema) => TTransformedSchema;
}

/**
 * The callback to deduce whether given (de)serializer object accepts `undefined` as valid value.
 * @see UndefinedPossibility
 */
export type GetUndefinedPossibility<TDecoderOrEncoder> = (
  encoderOrDecoder: TDecoderOrEncoder,
) => UndefinedPossibility;

/**
 * The return value of {@link GetUndefinedPossibility}.
 *
 * - `true` -> will always return undefined
 * - `false` -> will never return undefined
 * - `undefined` -> may return undefined
 */
export type UndefinedPossibility = boolean | undefined;

/**
 * The interface used by other TyRAS libraries to define the actual input of the per-validation framework function to create {@link SupportedJSONSchemaFunctionality}.
 */
export interface JSONSchemaFunctionalityCreationArgumentsContentTypes<
  TTransformedSchema,
  TRequestBodyContentTypes extends string,
  TResponseBodyContentTypes extends string,
  TInput,
> extends JSONSchemaFunctionalityCreationArgumentsBase<TTransformedSchema> {
  /**
   * Which content types are supported by this validation framework for request bodies.
   */
  requestBodyContentTypes: ReadonlyArray<TRequestBodyContentTypes>;

  /**
   * Which content types are supported by this validation framework for response bodies.
   */
  responseBodyContentTypes: ReadonlyArray<TResponseBodyContentTypes>;

  /**
   * The static value, or a callback, to get the fallback schema object, if generic functionality does not work.
   */
  fallbackValue?: FallbackValueGeneric<TInput>;
}

/**
 * The static value, or a callback, to get the fallback schema object, if generic functionality does not work.
 * This type is meant to be used by other TyRAS libraries, and not direct client code.
 */
export type FallbackValueGeneric<TInput> =
  | JSONSchema
  | ((input: TInput) => JSONSchema | undefined);

/**
 * This interface defines properties necessary when transforming string value (HTTP headers, URL path parameters, query parameters) encoders or decoders (serializers or deserializers).
 */
export interface SchemaTransformation<TInput> {
  /**
   * The callback to avoid calling generic functionality, and use value provided by this callback instead.
   */
  override: OverrideGeneric<TInput> | undefined;

  /**
   * The generic functionality to transform the encoder or decoder.
   */
  transform: Transformer<TInput, JSONSchema>;
}

/**
 * The callback to override encoder/decoder generic transformation.
 * This type is meant to be used by other TyRAS libraries, and not direct client code.
 */
export type OverrideGeneric<TInput> = Transformer<
  TInput,
  JSONSchema | undefined
>;

/**
 * The generic type to transform encoders/decoders to custom schemas.
 * If the 2nd parameter `cutOffTopLevelUndefined` will be `true`, then if the `input` accepts `undefined`, it should be transformed as if it wouldn't.
 */
export type Transformer<TInput, TReturnType> = (
  input: TInput,
  cutOffTopLevelUndefined: boolean,
) => TReturnType;

/**
 * The base type for constraints for dictionary, key of which is content MIME type string, and value is {@link SchemaTransformation}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TContentsBase<TInput> = Record<
  string,
  SchemaTransformation<TInput>
>;

/**
 * Helper type to extract generic parameter of given {@link SchemaTransformation}.
 */
export type GetInput<TSchemaTransformation> =
  TSchemaTransformation extends SchemaTransformation<infer T> ? T : never;
