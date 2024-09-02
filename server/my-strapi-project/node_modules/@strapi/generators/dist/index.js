"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const node_path = require("node:path");
const plop = require("plop");
const nodePlop = require("node-plop");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const nodePlop__default = /* @__PURE__ */ _interopDefault(nodePlop);
const runCLI = () => {
  plop.Plop.launch({ configPath: node_path.join(__dirname, "plopfile.js") }, (env) => {
    const options = { ...env, dest: node_path.join(process.cwd(), "src") };
    plop.run(options, void 0, true);
  });
};
const generate = async (generatorName, options, { dir = process.cwd(), plopFile = "plopfile.js" } = {}) => {
  const plop2 = nodePlop__default.default(node_path.join(__dirname, plopFile), {
    destBasePath: node_path.join(dir, "src"),
    force: false
  });
  const generator = plop2.getGenerator(generatorName);
  await generator.runActions(options, {
    onSuccess() {
    },
    onFailure() {
    },
    onComment() {
    }
  });
};
exports.generate = generate;
exports.runCLI = runCLI;
//# sourceMappingURL=index.js.map
