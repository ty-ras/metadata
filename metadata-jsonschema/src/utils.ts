import type * as jsonSchema from "json-schema";
import type * as functionality from "./functionality";

export const createJsonSchemaFunctionalityGeneric = <
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents extends functionality.TContentsBase,
  TInputContents extends functionality.TContentsBase,
>({
  transformSchema,
  stringDecoder,
  stringEncoder,
  encoders,
  decoders,
  getUndefinedPossibility,
}: functionality.JSONSchemaFunctionalityCreationArgumentsGeneric<
  TTransformedSchema,
  TStringDecoder,
  TStringEncoder,
  TOutputContents,
  TInputContents
>): functionality.SupportedJSONSchemaFunctionality<
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
        functionality.SupportedJSONSchemaFunctionality<
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
  ) as unknown as functionality.SupportedJSONSchemaFunctionality<
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
        functionality.SupportedJSONSchemaFunctionality<
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
  ) as unknown as functionality.SupportedJSONSchemaFunctionality<
    TTransformedSchema,
    TStringDecoder,
    TStringEncoder,
    TOutputContents,
    TInputContents
  >["decoders"],
  getUndefinedPossibility,
});

export const transformerFromConstructor =
  <TInput, TOutput>(
    ctor: Constructor<TInput>,
    tryTransform: functionality.Transformer<TInput, TOutput>,
  ): functionality.Transformer<unknown, TOutput | undefined> =>
  (input, ...args) =>
    input instanceof ctor ? tryTransform(input, ...args) : undefined;

export const transformerFromEquality =
  <TInput, TOutput>(
    value: TInput,
    tryTransform: functionality.Transformer<TInput, TOutput>,
  ): functionality.Transformer<unknown, TOutput | undefined> =>
  (input, ...args) =>
    input === value ? tryTransform(input as TInput, ...args) : undefined;

export const transformerFromMany =
  <TInput, TOutput>(
    matchers: Array<functionality.Transformer<TInput, TOutput | undefined>>,
  ): functionality.Transformer<TInput, TOutput | undefined> =>
  // TODO create a copy out of matchers to prevent modifications outside of this scope
  (input, ...args) => {
    // Reduce doesn't provide a way to break early out from the loop
    // We could use .every and return false, and inside lambda scope, modifying the result variable declared in this scope
    let result: TOutput | undefined;
    matchers.every(
      (matcher) => (result = matcher(input, ...args)) === undefined,
    );
    return result;
  };

export const getFallbackValue = <TInput>(
  input: TInput | undefined,
  fallbackValue: functionality.FallbackValueGeneric<TInput>,
): functionality.JSONSchema =>
  typeof fallbackValue === "function"
    ? input === undefined
      ? getDefaultFallbackValue()
      : fallbackValue(input) ?? getDefaultFallbackValue()
    : fallbackValue;

export const getDefaultFallbackValue = (): functionality.JSONSchema => ({
  description:
    "This is fallback value for when JSON schema could not be generated from type validation object.",
});

export const tryToCompressUnionOfMaybeEnums = (
  schema: functionality.JSONSchema,
) => {
  if (schema && typeof schema === "object" && "anyOf" in schema) {
    const spreadEnumValues: Array<jsonSchema.JSONSchema7Type> = [];
    if (areAllConstsOrEnums(schema, spreadEnumValues)) {
      schema =
        spreadEnumValues.length === 1
          ? {
              const: spreadEnumValues[0],
            }
          : {
              enum: spreadEnumValues,
            };
    }
  }
  return schema;
};

const areAllConstsOrEnums = (
  schema: jsonSchema.JSONSchema7,
  spreadEnumValues: Array<jsonSchema.JSONSchema7Type> = [],
) =>
  schema.anyOf?.every((element) => {
    let isConstOrEnum = false;
    if (element && typeof element === "object") {
      const { const: constValue } = element;
      if (constValue !== undefined) {
        isConstOrEnum = true;
        spreadEnumValues.push(constValue);
      } else {
        const { enum: enumValue } = element;
        if (enumValue !== undefined && enumValue.length > 0) {
          isConstOrEnum = true;
          spreadEnumValues.push(...enumValue);
        }
      }
    }
    return isConstOrEnum;
  }) === true;

// Flatten e.g. Union<Union<string, number>, Union<X, Y>> into Union<string, number, X, Y>
export function* flattenDeepStructures<T>(
  items: Array<T>,
  getSubItems: (item: T) => Array<T> | undefined,
): Generator<T, void, unknown> {
  for (const item of items) {
    const subs = getSubItems(item);
    if (subs === undefined) {
      yield item;
    } else {
      for (const sub of flattenDeepStructures(subs, getSubItems)) {
        yield sub;
      }
    }
  }
}

export const arrayToRecord = <TKeys extends string, TValue>(
  keys: ReadonlyArray<TKeys>,
  createValue: (key: TKeys) => TValue,
) =>
  Object.fromEntries(keys.map((key) => [key, createValue(key)])) as Record<
    TKeys,
    TValue
  >;

export interface Constructor<V> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): V;
}
