import { collectNpmGraph } from "../../src/index.js";

const names = await collectNpmGraph("json-renderers-build-table");
console.log(names);