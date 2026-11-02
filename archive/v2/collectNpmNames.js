import { validatePackage } from "./validatePackage.js";

async function fetchDependencies(packageName) {
  const encoded = packageName.startsWith("@")
    ? `@${encodeURIComponent(packageName.slice(1))}`
    : encodeURIComponent(packageName);

  try {
    const res = await fetch(`https://registry.npmjs.org/${encoded}/latest`, {
      headers: {
        Accept: "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8"
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Object.keys(data.dependencies || {});
  } catch {
    return [];
  }
}

export async function collectNpmNames(packageSpec, options = {}) {
  const target = validatePackage(packageSpec);
  const onProgress = typeof options.onProgress === "function" ? options.onProgress : () => {};
  const visited = new Set();

  onProgress({ stage: "resolving", packageSpec: target.spec });

  async function traverse(pkgName) {
    if (!pkgName || visited.has(pkgName)) return;
    visited.add(pkgName);

    const dependencies = await fetchDependencies(pkgName);
    onProgress({ stage: "fetched", package: pkgName, dependenciesCount: dependencies.length });

    await Promise.all(dependencies.map((dep) => traverse(dep)));
  }

  await traverse(target.name);

  const names = Array.from(visited);
  onProgress({ stage: "names-collected", count: names.length, names });
  return names;
}

export default collectNpmNames;
