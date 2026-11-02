import { fetchDependencies } from "../2-dependencies/index.js";

export async function traverseDependencies(rootPackageName, options = {}) {
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
  const visited = new Set();

  async function walk(pkgName) {
    if (!pkgName || visited.has(pkgName)) return;
    visited.add(pkgName);

    // 1. Fetch immediate dependencies for current node
    const dependencies = await fetchDependencies(pkgName);
    onProgress({ stage: "fetched", package: pkgName, count: dependencies.length });

    // 2. Feed dependencies as inputs into the next recursive level
    await Promise.all(dependencies.map((dep) => walk(dep)));
  }

  await walk(rootPackageName);

  const names = Array.from(visited);
  onProgress({ stage: "names-collected", count: names.length, names });
  return names;
}

export default traverseDependencies;

