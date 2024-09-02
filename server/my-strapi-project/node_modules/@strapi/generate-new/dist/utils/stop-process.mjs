function stopProcess(message) {
  if (message) {
    console.error(message);
  }
  process.exit(1);
}
export {
  stopProcess as default
};
//# sourceMappingURL=stop-process.mjs.map
