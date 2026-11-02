import { fetchDependencies } from "../2-dependencies/index.js";

/**
 * Traverses npm dependencies recursively and builds an in-memory graph.
 *
 * @param {string} rootPackageName
 * @param {object} options
 * @returns {Promise<{ names: string[], graph: Record<string, string[]> }>}
 */
export async function traverseGraph(rootPackageName, options = {}) {
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
  const graph = {};

  async function walk(pkgName) {
    if (!pkgName || Object.prototype.hasOwnProperty.call(graph, pkgName)) return;

    // 1. Fetch immediate dependencies for current node
    const dependencies = await fetchDependencies(pkgName);
    graph[pkgName] = dependencies;
    onProgress({ stage: "fetched", package: pkgName, count: dependencies.length });

    // 2. Feed dependencies as inputs into the next recursive level
    await Promise.all(dependencies.map((dep) => walk(dep)));
  }

  await walk(rootPackageName);

  const names = Object.keys(graph);
  onProgress({ stage: "names-collected", count: names.length, names });

  return {
    names,
    graph
  };
}

export default traverseGraph;
