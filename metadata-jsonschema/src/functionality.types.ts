/**
 * @file This types-only file contains types for creating {@link SupportedJSONSchemaFunctionality} using minimal amount of repetition.
 */

import type * as jsonSchema from "json-schema";

/**
 * This type contains all necessary functionality in order to transform native `io-ts`/`zod`/`runtypes`/... validators into schema information understood by particular metadata format.
 * This is done by first using functionality of this type to transform native validators into {@link JSONSchema}, and then the returned JSON schema will be transformed into final format (which is typically same or subset of {@link JSONSchema}).
 */
export interface SupportedJSONSchemaFunctionality<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> extends JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
    TOutputContents,
    TInputContents
  > {
  stringDecoder: Transformer<TStringDecoder, TTransformedSchema>;
  stringEncoder: Transformer<TStringEncoder, TTransformedSchema>;
  encoders: {
    [P in keyof TOutputContents]: Transformer<
      GetInput<TOutputContents[P]>,
      TTransformedSchema
    >;
  };
  decoders: {
    [P in keyof TInputContents]: Transformer<
      GetInput<TInputContents[P]>,
      TTransformedSchema
    >;
  };
}

export type JSONSchema = jsonSchema.JSONSchema7Definition;

export interface JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> {
  getUndefinedPossibility: GetUndefinedPossibility<
    | GetInput<TOutputContents[keyof TOutputContents]>
    | GetInput<TInputContents[keyof TInputContents]>
  >;
}

export interface JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> extends JSONSchemaFunctionalityCreationArgumentsBase<TTransformedSchema>,
    JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
      TOutputContents,
      TInputContents
    > {
  stringDecoder: SchemaTransformation<TStringDecoder>;
  stringEncoder: SchemaTransformation<TStringEncoder>;
  encoders: TOutputContents;
  decoders: TInputContents;
}

export interface JSONSchemaFunctionalityCreationArgumentsBase<
  TTransformedSchema,
> {
  transformSchema: (schema: JSONSchema) => TTransformedSchema;
}

/**
 * Return value:
 * - `true` -> will always return undefined
 * - `false` -> will never return undefined
 * - `undefined` -> may return undefined
 */
export type GetUndefinedPossibility<TDecoderOrEncoder> = (
  encoderOrDecoder: TDecoderOrEncoder,
) => UndefinedPossibility;

export type UndefinedPossibility = boolean | undefined;

export type JSONSchemaFunctionalityCreationArgumentsContentTypes<
  TTransformedSchema,
  TKeys extends string,
  TInput,
> = JSONSchemaFunctionalityCreationArgumentsBase<TTransformedSchema> &
  JSONSchemaFunctionalityCreationArgumentsContentTypesOnly<TKeys, TInput>;

export type JSONSchemaFunctionalityCreationArgumentsContentTypesOnly<
  TKeys extends string,
  TInput,
> = {
  contentTypes: ReadonlyArray<TKeys>;
  fallbackValue?: FallbackValueGeneric<TInput>;
};

export type FallbackValueGeneric<TInput> =
  | JSONSchema
  | ((input: TInput) => JSONSchema | undefined);

export interface SchemaTransformation<TInput> {
  override: OverrideGeneric<TInput> | undefined;
  transform: Transformer<TInput, JSONSchema>;
}

export type OverrideGeneric<TInput> = Transformer<
  TInput,
  JSONSchema | undefined
>;

export type Transformer<TInput, TReturnType> = (
  input: TInput,
  cutOffTopLevelUndefined: boolean,
) => TReturnType;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TContentsBase = Record<string, SchemaTransformation<any>>;

export type GetInput<TSchemaTransformation> =
  TSchemaTransformation extends SchemaTransformation<infer T> ? T : never;
