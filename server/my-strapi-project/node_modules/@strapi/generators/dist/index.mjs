import { join } from "node:path";
import { Plop, run } from "plop";
import nodePlop from "node-plop";
const runCLI = () => {
  Plop.launch({ configPath: join(__dirname, "plopfile.js") }, (env) => {
    const options = { ...env, dest: join(process.cwd(), "src") };
    run(options, void 0, true);
  });
};
const generate = async (generatorName, options, { dir = process.cwd(), plopFile = "plopfile.js" } = {}) => {
  const plop = nodePlop(join(__dirname, plopFile), {
    destBasePath: join(dir, "src"),
    force: false
  });
  const generator = plop.getGenerator(generatorName);
  await generator.runActions(options, {
    onSuccess() {
    },
    onFailure() {
    },
    onComment() {
    }
  });
};
export {
  generate,
  runCLI
};
//# sourceMappingURL=index.mjs.map
