import { collectNpmNames } from "../../src/index.js";

const names = await collectNpmNames("json-renderers-build-table");
console.log(names);