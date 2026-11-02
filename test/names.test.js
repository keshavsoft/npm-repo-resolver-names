import test from "node:test";
import assert from "node:assert/strict";
import { collectNpmNames, collectNpmGraph } from "../src/index.js";
import { validatePackage } from "../src/v4/1-package/index.js";

test("validatePackage parses scopes, versions, and names", () => {
  const target = validatePackage("@keshavsoft/json-renderers@1.2.0");
  assert.equal(target.name, "@keshavsoft/json-renderers");
  assert.equal(target.version, "1.2.0");
  assert.equal(target.scope, "keshavsoft");

  assert.throws(() => validatePackage(""), /Invalid target/);
});

test("collectNpmNames returns pure array of strings", async () => {
  const names = await collectNpmNames("is-number");
  assert.ok(Array.isArray(names));
  assert.ok(names.includes("is-number"));
  for (const name of names) {
    assert.equal(typeof name, "string");
  }
});

test("collectNpmGraph returns in-memory dependency graph object", async () => {
  const graph = await collectNpmGraph("is-number");
  assert.ok(graph && typeof graph === "object");
  assert.ok("is-number" in graph);
  assert.ok(Array.isArray(graph["is-number"]));
});
