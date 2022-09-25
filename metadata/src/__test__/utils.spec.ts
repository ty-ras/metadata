/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import test, { ExecutionContext } from "ava";
import * as spec from "../utils";
import type * as s0 from "../stage0";
import type * as s1 from "../stage1";

test("Test that InitialMetadataProviderClass works", (t) => {
  t.plan(12);

  verifyBuilderAndArg(t, "arg");
  const expectedArg2 = "arg2";
  verifyBuilderAndArg(t, expectedArg2, (provider) =>
    provider.withRefinedContext(expectedArg2),
  );
});

const verifyBuilderAndArg = (
  t: ExecutionContext,
  expectedArg: string,
  getActualProvider?: (
    provider: s0.MetadataProvider<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >,
  ) => s0.MetadataProvider<any, any, any, any, any, any, any, any, any, any>,
) => {
  const builder: s1.MetadataBuilder<any, any, any, any, any, any, any> = {
    getEndpointsMetadata: () => {
      throw new Error("This should be never called by provider.");
    },
  };
  const seenArgs: Array<string> = [];
  const seenFinalMDArgs: Array<{ args: any; endpoints: ReadonlyArray<any> }> =
    [];
  const finalMD = {};
  let provider: s0.MetadataProvider<
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  > = new spec.InitialMetadataProviderClass(
    expectedArg,
    (arg) => {
      seenArgs.push(arg);
      return builder;
    },
    (arg, args, endpoints) => {
      seenArgs.push(arg);
      seenFinalMDArgs.push({ args, endpoints });
      return finalMD;
    },
  );
  if (getActualProvider) {
    provider = getActualProvider(provider);
  }
  t.is(
    provider.getBuilder(),
    builder,
    "Provider must return the builder which is provided by the callback",
  );
  t.deepEqual(
    seenArgs,
    [expectedArg],
    "Provider must call callback with given arg",
  );
  t.deepEqual(seenFinalMDArgs, [], "Provider must not call final MD callback.");
  const finalArg = {};
  const finalEndpoints: Array<any> = [];
  seenArgs.length = 0;
  t.is(
    finalMD,
    provider.createFinalMetadata(finalArg, finalEndpoints),
    "Provider must return the final metadata object which is provided by the callback.",
  );
  t.deepEqual(
    seenArgs,
    [expectedArg],
    "Provider must call callback with given arg",
  );
  t.deepEqual(
    seenFinalMDArgs,
    [
      {
        args: finalArg,
        endpoints: finalEndpoints,
      },
    ],
    "Provider must call final MD callback with given args",
  );
};
