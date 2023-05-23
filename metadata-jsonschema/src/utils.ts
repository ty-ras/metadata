/**
 * @file This file contains few utility methods useful when creating {@link types.SupportedJSONSchemaFunctionality}.
 */

import type * as jsonSchema from "json-schema";
import type * as types from "./create-json-schema.types";

/**
 * Creates a {@link types.Transformer} which will call custom callback if first argument will be `instanceof` given constructor.
 * @param ctor The constructor.
 * @param tryTransform Callback to transform the constructor.
 * @returns The {@link types.Transformer} which calls `tryTransform` callback if the first argument is `instanceof` given `ctor`. Otherwise will return `undefined`.
 */
export const transformerFromConstructor =
  <TInput, TOutput>(
    ctor: Constructor<TInput>,
    tryTransform: types.Transformer<TInput, TOutput>,
  ): types.Transformer<unknown, TOutput | undefined> =>
  (input, ...args) =>
    input instanceof ctor ? tryTransform(input, ...args) : undefined;

/**
 * Creates a {@link types.Transformer} which will call custom callback if first argument will exactly match (`===`) the given value.
 * @param value The value to match exactly (`===`) against.
 * @param tryTransform Callback to transform the value.
 * @returns The {@link types.Transformer} which calls `tryTransform` callback if the first argument is exact match (`===`) the given `value`. Otherwise will return `undefined`.
 */
export const transformerFromEquality =
  <TInput, TOutput>(
    value: TInput,
    tryTransform: types.Transformer<TInput, TOutput>,
  ): types.Transformer<unknown, TOutput | undefined> =>
  (input, ...args) =>
    input === value ? tryTransform(input as TInput, ...args) : undefined;

/**
 * Creates single {@link types.Transformer} which will call the given array of {@link types.Transformer} in sequence until one of them will return non-`undefined` value.
 * @param matchers The array of {@link types.Transformer}s.
 * @returns The {@link types.Transformer} which will call the transformers in `matchers` until one of then will return non-`undefined` value, returning that value. If all of them return `undefined`, then `undefined` will be returned.
 */
export const transformerFromMany =
  <TInput, TOutput>(
    matchers: Array<types.Transformer<TInput, TOutput | undefined>>,
  ): types.Transformer<TInput, TOutput | undefined> =>
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

/**
 * This function encapsulates the common logic when operating with input for {@link types.FallbackValueGeneric}, and one needs to do deduction with which final value to end up with.
 * @param input The possible input for {@link types.FallbackValueGeneric}.
 * @param fallbackValue The {@link types.FallbackValueGeneric} callback to call.
 * @returns If the given `fallbackValue` is NOT a function, will return it as-is. If the given `fallbackValue` IS a function and given `input` is `undefined`, returns result of {@link getDefaultFallbackValue}. If the given `fallbackValue` is a function and given `input` is NOT `undefined`, will return result of `fallbackValue` invocation, except if it returns `undefined`, will return result of {@link getDefaultFallbackValue}.
 */
export const getFallbackValue = <TInput>(
  input: TInput | undefined,
  fallbackValue: types.FallbackValueGeneric<TInput>,
): types.JSONSchema =>
  typeof fallbackValue === "function"
    ? input === undefined
      ? getDefaultFallbackValue()
      : fallbackValue(input) ?? getDefaultFallbackValue()
    : fallbackValue;

/**
 * Callback to return placeholder {@link types.JSONSchema} which indicates unsupported value for current transformation.
 * @returns A placeholder indicating unsupported value, which is an object with only one property: `description`, having value of {@link DEFAULT_FALLBACK_VALUE_DESCRIPTION}.
 */
export const getDefaultFallbackValue = (): types.JSONSchema => ({
  description: DEFAULT_FALLBACK_VALUE_DESCRIPTION,
});

/**
 * This is the description of the fallback value returned by {@link getDefaultFallbackValue}.
 */
export const DEFAULT_FALLBACK_VALUE_DESCRIPTION =
  "This is fallback value for when JSON schema could not be generated from type validation object.";

/**
 * Tries to transform a {@link types.JSONSchema} with `anyOf` property value to {@link types.JSONSchema} with `const` or `enum` properties, if the elements of `anyOf` satisfy the criteria.
 * @param schema The {@link types.JSONSchema} to check.
 * @returns If given `schema` has `anyOf` property, and every element of that has either `const` or `enum` properties, returned value will be all those property values put into single object. If the final values will have only one element, it will be put as `const`. If more than one, then it will `enum`.
 */
export const tryToCompressUnionOfMaybeEnums = (schema: types.JSONSchema) => {
  if (schema && typeof schema === "object" && "anyOf" in schema) {
    const spreadEnumValues: Array<jsonSchema.JSONSchema7Type> = [];
    if (areAllConstsOrEnums(schema, spreadEnumValues)) {
      schema =
        spreadEnumValues.length === 1
          ? {
              ...(schema.type ? { type: schema.type } : {}),
              const: spreadEnumValues[0],
            }
          : {
              ...(schema.type ? { type: schema.type } : {}),
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

// eslint-disable-next-line jsdoc/require-yields
/**
 * Helper function to flatten hierarchical structures.
 * Useful when e.g. handling Union<Union<string, number>, Union<X, Y>>, which will transformed into Union<string, number, X, Y>.
 * @param items The current items.
 * @param getSubItems Callback to extract more nested items from one item.
 * @returns Yields the leaf items of the hierarchical structure tree.
 */
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

/**
 * Helper function to transform array of keys into object of key -> value associations.
 * @param keys The keys.
 * @param createValue The callback to create value from one key.
 * @returns An object with given `keys`, and values as results from given `createValue` callback.
 */
export const arrayToRecord = <TKeys extends string, TValue>(
  keys: ReadonlyArray<TKeys>,
  createValue: (key: TKeys) => TValue,
) =>
  Object.fromEntries(keys.map((key) => [key, createValue(key)])) as Record<
    TKeys,
    TValue
  >;

/**
 * An interface representing any constructor, as TS stdlib is lacking one, only having {@link ConstructorParameters}.
 */
export interface Constructor<V> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): V;
}
