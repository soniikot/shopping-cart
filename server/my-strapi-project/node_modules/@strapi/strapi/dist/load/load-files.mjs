import path from "path";
import _ from "lodash";
import fse from "fs-extra";
import { importDefault } from "@strapi/utils";
import { glob } from "glob";
import filePathToPath from "./filepath-to-prop-path.mjs";
async function loadFiles(dir, pattern, { requireFn = importDefault, shouldUseFileNameAsKey = (_2) => true, globArgs = {} } = {}) {
  const root = {};
  const files = await glob(pattern, { cwd: dir, ...globArgs });
  for (const file of files) {
    const absolutePath = path.resolve(dir, file);
    delete require.cache[absolutePath];
    let mod;
    if (path.extname(absolutePath) === ".json") {
      mod = await fse.readJson(absolutePath);
    } else {
      mod = requireFn(absolutePath);
    }
    Object.defineProperty(mod, "__filename__", {
      enumerable: true,
      configurable: false,
      writable: false,
      value: path.basename(file)
    });
    const propPath = filePathToPath(file, shouldUseFileNameAsKey(file));
    if (propPath.length === 0)
      _.merge(root, mod);
    _.merge(root, _.setWith({}, propPath, mod, Object));
  }
  return root;
}
export {
  loadFiles as default
};
//# sourceMappingURL=load-files.mjs.map
