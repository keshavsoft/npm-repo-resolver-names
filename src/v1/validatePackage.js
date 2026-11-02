export function validatePackage(packageSpec) {
  if (!packageSpec || typeof packageSpec !== "string" || !packageSpec.trim()) {
    throw new Error("Invalid target: package name must be a non-empty string.");
  }

  const spec = packageSpec.trim();
  let name = spec;
  let requestedVersion = null;

  const atIndex = spec.lastIndexOf("@");
  if (atIndex > 0) {
    name = spec.slice(0, atIndex);
    requestedVersion = spec.slice(atIndex + 1);
  }

  let scope = null;
  if (name.startsWith("@")) {
    const slashIndex = name.indexOf("/");
    if (slashIndex > 1) {
      scope = name.slice(1, slashIndex);
    }
  }

  return {
    spec,
    name,
    version: requestedVersion,
    scope,
    owner: scope || null
  };
}

export default validatePackage;
