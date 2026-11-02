import test from "node:test";
import assert from "node:assert/strict";
import { validatePackage, collectNpmNames } from "../src/index.js";

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
