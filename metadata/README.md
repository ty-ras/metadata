# Typesafe REST API Specification - Metadata

[![Coverage](https://codecov.io/gh/ty-ras/metadata/branch/main/graph/badge.svg?flag=metadata)](https://codecov.io/gh/ty-ras/metadata)

This package contains some of the most commonly used metadata-related constructs to be used on backend side in Typesafe REST API Specification (TyRAS) package family.
Typically, this module is consumed only by other TyRAS packages.

Notice that this module does not have runtime specification - it only is useable during TypeScript compilation.
This is why `import type` syntax must be used when importing this module:
```ts
import type * as metadata from "@ty-ras/metadata";
```

This way, there will be no `import`/`require` statement emitted for the result `.js` file, thus avoiding runtime errors.
