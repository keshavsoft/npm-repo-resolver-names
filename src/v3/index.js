import { validatePackage } from "./1-package/index.js";
import { traverseDependencies } from "./3-traverse/index.js";

/**
 * npm-repo-resolver-names (v3)
 * -------------------------------------------------------------
 * Recursively walks npm dependencies and collects all unique package names.
 *
 * Story:
 *   Act 1 (1-package)      : Validates and parses the package input spec.
 *   Act 2 (2-dependencies) : Fetches immediate dependencies of a single package.
 *   Act 3 (3-traverse)     : Recursively loops through dependencies level-by-level.
 * -------------------------------------------------------------
 */
export async function collectNpmNames(packageSpec, options = {}) {
  const target = validatePackage(packageSpec);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};

  onProgress({ stage: "resolving", packageSpec: target.spec });

  return await traverseDependencies(target.name, options);
}

export default collectNpmNames;
