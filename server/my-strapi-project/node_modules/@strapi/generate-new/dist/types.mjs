function isStderrError(error) {
  return typeof error === "object" && error !== null && "stderr" in error && typeof error.stderr === "string";
}
export {
  isStderrError
};
//# sourceMappingURL=types.mjs.map
