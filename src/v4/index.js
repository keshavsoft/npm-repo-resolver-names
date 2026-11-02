import { validatePackage } from "./1-package/index.js";
import { traverseGraph } from "./3-traverse/index.js";

/**
 * npm-repo-resolver-names (v4)
 * -------------------------------------------------------------
 * Dual Interface:
 *   1. collectNpmNames(packageSpec, options) -> Promise<string[]>
 *      Returns the pure Array<string> of unique package names.
 *      (Default for NPX CLI and simple string consumers).
 *
 *   2. collectNpmGraph(packageSpec, options) -> Promise<Record<string, string[]>>
 *      Returns the in-memory dependency graph object.
 *      (For downstream analytical repos like trees, metrics, and visualization).
 * -------------------------------------------------------------
 */

export async function collectNpmGraph(packageSpec, options = {}) {
  const target = validatePackage(packageSpec);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};

  onProgress({ stage: "resolving", packageSpec: target.spec });

  const { graph } = await traverseGraph(target.name, options);
  return graph;
}

export async function collectNpmNames(packageSpec, options = {}) {
  const target = validatePackage(packageSpec);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};

  onProgress({ stage: "resolving", packageSpec: target.spec });

  const { names } = await traverseGraph(target.name, options);
  return names;
}

export default collectNpmNames;
