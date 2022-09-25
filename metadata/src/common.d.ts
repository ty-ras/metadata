// Higher-kinded-type trick from: https://www.matechs.com/blog/encoding-hkts-in-typescript-once-again
export interface HKTArg {
  readonly _TURLData?: unknown;
  readonly _TMethod?: unknown;
  readonly _TRequestHeaders?: unknown;
  readonly _TResponseHeaders?: unknown;
  readonly _TQuery?: unknown;
  readonly _TBody?: unknown;
  readonly _TOutput?: unknown;

  readonly type?: unknown;
}

export type Kind<
  F extends HKTArg,
  TURLData,
  TQuery,
  TRequestHeaders,
  TResponseHeaders,
  TBody,
  TOutput,
> = F extends {
  readonly type: unknown;
}
  ? (F & {
      readonly _TURLData: TURLData;
      readonly _TRequestHeaders: TRequestHeaders;
      readonly _TResponseHeaders: TResponseHeaders;
      readonly _TQuery: TQuery;
      readonly _TBody: TBody;
      readonly _TOutput: TOutput;
    })["type"]
  : never; // This is simplified version from original HKT pattern in the link, because we don't use the functional properties of this specific HKT.
