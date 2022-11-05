import test, { ExecutionContext } from "ava";
import * as spec from "../utils";
import * as functionality from "../functionality";

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
  t.plan(9);

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

test("Validate createJsonSchemaFunctionality works", (t) => {
  t.plan(75);
  verifyCreateJsonSchemaFunctionality(t, none);
  verifyCreateJsonSchemaFunctionality(t, returnUndefined);
  verifyCreateJsonSchemaFunctionality(t, returnSchema);
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

const verifyCreateJsonSchemaFunctionality = (
  t: ExecutionContext,
  overrideMode: typeof none | typeof returnSchema | typeof returnUndefined,
) => {
  const transforms: Record<string, functionality.JSONSchema> = {
    one: {
      const: "one",
    },
  };
  const seenTransformInputs: Array<string> = [];
  const transform = (input: string) => {
    seenTransformInputs.push(input);
    return transforms[input];
  };
  const overrides: Record<string, functionality.JSONSchema | undefined> = {
    two:
      overrideMode === returnSchema
        ? {
            const: "two",
          }
        : undefined,
  };
  const override =
    overrideMode !== none ? (input: string) => overrides[input] : undefined;
  const transformAndOverride = {
    transform,
    override,
  };
  const getUndefinedPossibility = () => true;
  const seenSchemas: Array<functionality.JSONSchema> = [];
  const transformFunctionality = spec.createJsonSchemaFunctionalityGeneric({
    transformSchema: (schema) => {
      seenSchemas.push(schema);
      return schema;
    },
    stringDecoder: transformAndOverride,
    stringEncoder: transformAndOverride,
    decoders: {
      "application/json": transformAndOverride,
    },
    encoders: {
      "application/json": transformAndOverride,
    },
    getUndefinedPossibility,
  });

  t.is(
    transformFunctionality.getUndefinedPossibility,
    getUndefinedPossibility,
    "The returned 'getUndefinedPossibility' must be same as given",
  );
  // Test (string) decoder, (string) encoder one at a time
  const testEncoderOrDecoder = (
    input: string,
    shouldHaveResult: boolean,
    transformShouldHaveBeenCalled: boolean,
  ) => {
    for (const [idx, schemaTransformer] of Object.entries([
      transformFunctionality.stringDecoder,
      transformFunctionality.stringEncoder,
      transformFunctionality.decoders["application/json"],
      transformFunctionality.encoders["application/json"],
    ])) {
      seenTransformInputs.length = 0;
      seenSchemas.length = 0;
      const expectedResult = shouldHaveResult ? { const: input } : undefined;
      t.deepEqual(
        schemaTransformer(input, true),
        expectedResult,
        `Schema transform ${idx} must've succeeded with expected result`,
      );
      t.deepEqual(
        seenTransformInputs,
        transformShouldHaveBeenCalled ? [input] : [],
        `Schema transform ${idx} callback must ${
          transformShouldHaveBeenCalled ? "" : "not "
        }have been called`,
      );
      t.deepEqual(
        seenSchemas,
        [expectedResult],
        `JSON Schema transform ${idx} callback must've been called`,
      );
    }
  };

  testEncoderOrDecoder("one", true, true);
  testEncoderOrDecoder(
    "two",
    overrideMode === returnSchema,
    overrideMode !== returnSchema,
  );
};

const returnSchema = "return-schema";
const none = "none";
const returnUndefined = "return-undefined";
