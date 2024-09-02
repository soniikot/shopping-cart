import execa from "execa";
function hasYarn() {
  try {
    const { exitCode } = execa.commandSync("yarn --version", { shell: true });
    return exitCode === 0;
  } catch (err) {
    return false;
  }
}
export {
  hasYarn as default
};
//# sourceMappingURL=has-yarn.mjs.map
