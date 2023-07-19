/**
 * @file This file contains tests for file `../create-json-schema.ts`.
 */

import test, { ExecutionContext } from "ava";
import * as spec from "../create-json-schema";
import type * as functionality from "../create-json-schema.types";
import type * as data from "@ty-ras/data";

test("Validate createJsonSchemaFunctionality works", (t) => {
  t.plan(75);
  verifyCreateJsonSchemaFunctionality(t, none);
  verifyCreateJsonSchemaFunctionality(t, returnUndefined);
  verifyCreateJsonSchemaFunctionality(t, returnSchema);
});

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
  const transformFunctionality = spec.createJsonSchemaFunctionalityGeneric<
    functionality.JSONSchema,
    ValidatorHKT,
    "application/json",
    "application/json"
  >({
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
    for (const [idx, schemaTransformer] of [
      transformFunctionality.stringDecoder,
      transformFunctionality.stringEncoder,
      transformFunctionality.decoders["application/json"],
      transformFunctionality.encoders["application/json"],
    ].entries()) {
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

/**
 * This is validator to be used only for tests.
 */
interface ValidatorHKT extends data.ValidatorHKTBase {
  /**
   * This provides implementation for {@link data.ValidatorHKTBase._getEncoder}.
   * For the test setup, it is simply a string.
   */
  readonly _getEncoder: string;

  /**
   * This provides implementation for {@link data.ValidatorHKTBase._getDecoder}.
   * For the test setup, it is simply a string.
   */
  readonly _getDecoder: string;

  /**
   * This provides implementation for {@link data.ValidatorHKTBase._getDecodedType}.
   * For the test setup, it is simply a string.
   */
  readonly _getDecodedType: string;
}
