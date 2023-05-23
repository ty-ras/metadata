/**
 * @file This file contains tests for file `../utils.ts`.
 */

import test, { ExecutionContext } from "ava";
import * as spec from "../utils";
import type * as functionality from "../create-json-schema.types";

test("Validate transformerFromConstructor works", (t) => {
  t.plan(2);
  const transformer = spec.transformerFromConstructor(Date, (d) =>
    d.toISOString(),
  );
  const date = new Date();
  t.deepEqual(transformer(date, true), date.toISOString());
  t.deepEqual(transformer("Hello", true), undefined);
});

test("Validate transformerFromEquality works", (t) => {
  t.plan(2);
  const value = 123;
  const transformer = spec.transformerFromEquality(value, (n) => `${n}`);
  t.deepEqual(transformer(value, true), "123");
  t.deepEqual(transformer(124, true), undefined);
});

test("Validate transformerFromMany works", (t) => {
  t.plan(4);

  const transformer = spec.transformerFromMany([
    spec.transformerFromConstructor(Date, (d) => d.toISOString()),
    spec.transformerFromEquality(123, (n) => `${n}`),
  ]);
  const date = new Date();
  t.deepEqual(transformer(date, true), date.toISOString());
  t.deepEqual(transformer(123, true), "123");
  t.deepEqual(transformer(124, true), undefined);
  t.deepEqual(transformer("Hello", true), undefined);
});

test("Validate getFallbackValue works", (t) => {
  t.plan(6);
  const input = 123;
  const fallbackValue = {};
  t.deepEqual(spec.getFallbackValue(input, fallbackValue), fallbackValue);
  t.deepEqual(spec.getFallbackValue(undefined, fallbackValue), fallbackValue);
  const fallbackValueFunction = () => fallbackValue;
  t.deepEqual(
    spec.getFallbackValue(input, fallbackValueFunction),
    fallbackValue,
  );
  const defaultFallback = spec.getDefaultFallbackValue();
  t.deepEqual(
    spec.getFallbackValue(undefined, fallbackValueFunction),
    defaultFallback,
  );

  const fallbackValueFunctionUndefined = () => undefined;
  t.deepEqual(
    spec.getFallbackValue(input, fallbackValueFunctionUndefined),
    defaultFallback,
  );
  t.deepEqual(
    spec.getFallbackValue(undefined, fallbackValueFunctionUndefined),
    defaultFallback,
  );
});

test("Validate tryToCompressUnionOfMaybeEnums works", (t) => {
  t.plan(11);

  // Inputs which should not compress anything
  verifyTryToCompressUnionOfMaybeEnums(t, {});
  verifyTryToCompressUnionOfMaybeEnums(t, { anyOf: undefined });
  verifyTryToCompressUnionOfMaybeEnums(t, { anyOf: [] });
  verifyTryToCompressUnionOfMaybeEnums(t, { anyOf: [{}] });
  verifyTryToCompressUnionOfMaybeEnums(t, { anyOf: [{ type: "string" }] });
  verifyTryToCompressUnionOfMaybeEnums(t, {
    anyOf: [{ type: "string" }, { const: "constValue" }],
  });

  // Inputs which should compress the values
  verifyTryToCompressUnionOfMaybeEnums(
    t,
    { anyOf: [{ const: "constValue" }] },
    { const: "constValue" },
  );
  verifyTryToCompressUnionOfMaybeEnums(
    t,
    { anyOf: [{ enum: ["constValue"] }] },
    { const: "constValue" },
  );
  verifyTryToCompressUnionOfMaybeEnums(
    t,
    { anyOf: [{ const: "constValue1" }, { enum: ["constValue2"] }] },
    { enum: ["constValue1", "constValue2"] },
  );
  verifyTryToCompressUnionOfMaybeEnums(
    t,
    { type: "string", anyOf: [{ const: "constValue" }] },
    { type: "string", const: "constValue" },
  );
  verifyTryToCompressUnionOfMaybeEnums(
    t,
    {
      type: "string",
      anyOf: [{ const: "constValue1" }, { enum: ["constValue2"] }],
    },
    { type: "string", enum: ["constValue1", "constValue2"] },
  );
});

test("Validate flattenDeepStructures works", (t) => {
  t.plan(2);
  t.deepEqual(
    Array.from(
      spec.flattenDeepStructures([], () => {
        throw new Error("This should not be called");
      }),
    ),
    [],
  );
  t.deepEqual(
    Array.from(
      spec.flattenDeepStructures([1, 2, 3], (item) =>
        item === 1 ? [1.1, 1.2] : item === 3 ? [3.1] : undefined,
      ),
    ),
    [1.1, 1.2, 2, 3.1],
  );
});

test("Validate arrayToRecord works", (t) => {
  t.plan(1);
  t.deepEqual(
    spec.arrayToRecord(["one", "two"], (key) => (key === "one" ? 1 : 2)),
    { one: 1, two: 2 },
  );
});

const verifyTryToCompressUnionOfMaybeEnums = (
  t: ExecutionContext,
  input: functionality.JSONSchema,
  expectedOutput?: functionality.JSONSchema,
) => {
  const result = spec.tryToCompressUnionOfMaybeEnums(input);
  if (expectedOutput) {
    t.deepEqual(result, expectedOutput);
  } else {
    t.is(result, result);
  }
};
