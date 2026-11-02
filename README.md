# npm-repo-resolver-names

> Recursively walk npm dependencies and collect authentic package names as a pure array of strings.

Part of the **`npm-repo-resolver`** suite.

## Usage

```bash
# Programmatic
import { collectNpmNames } from "npm-repo-resolver-names";

const names = await collectNpmNames("json-renderers-build-table");
console.log(names);
// -> ["json-renderers-build-table", "json-instructions", ...]
```

```bash
# CLI
npx npm-repo-resolver-names json-renderers-build-table
```

## License
MIT

