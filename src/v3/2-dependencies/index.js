export async function fetchDependencies(packageName) {
  if (!packageName || typeof packageName !== "string") return [];

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

export default fetchDependencies;

