export function styleVars(vars) {
  return Object.entries(vars)
    .map(([key, value]) => "--" + key + ": " + value)
    .join("; ")
}
