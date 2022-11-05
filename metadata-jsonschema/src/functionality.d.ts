import type * as jsonSchema from "json-schema";

export interface JSONSchemaFunctionalityCreationArgumentsBase<
  TTransformedSchema,
> {
  transformSchema: (schema: JSONSchema) => TTransformedSchema;
}

export interface JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> {
  getUndefinedPossibility: (
    decoderOrEncoder:
      | GetInput<TOutputContents[keyof TOutputContents]>
      | GetInput<TInputContents[keyof TInputContents]>,
  ) => UndefinedPossibility;
}
export type JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> = JSONSchemaFunctionalityCreationArgumentsBase<TTransformedSchema> &
  JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
    TOutputContents,
    TInputContents
  > & {
    stringDecoder: SchemaTransformation<TStringDecoder>;
    stringEncoder: SchemaTransformation<TStringEncoder>;
    encoders: TOutputContents;
    decoders: TInputContents;
  };

export type UndefinedPossibility = boolean; // "always" | "maybe" | "never";

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

export type SupportedJSONSchemaFunctionality<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends TContentsBase,
  TInputContents extends TContentsBase,
> = JSONSchemaFunctionalityCreationArgumentsWithUndefinedFunctionality<
  TOutputContents,
  TInputContents
> & {
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
};

export type Transformer<TInput, TReturnType> = (
  input: TInput,
  cutOffTopLevelUndefined: boolean,
) => TReturnType;

export type JSONSchema = jsonSchema.JSONSchema7Definition;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TContentsBase = Record<string, SchemaTransformation<any>>;

export type GetInput<TSchemaTransformation> =
  TSchemaTransformation extends SchemaTransformation<infer T> ? T : never;
