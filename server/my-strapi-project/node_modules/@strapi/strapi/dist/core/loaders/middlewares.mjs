import { join, extname, basename } from "path";
import fse from "fs-extra";
import { importDefault } from "@strapi/utils";
import { middlewares } from "../../middlewares/index.mjs";
async function loadMiddlewares(strapi) {
  const localMiddlewares = await loadLocalMiddlewares(strapi);
  strapi.container.get("middlewares").add(`global::`, localMiddlewares);
  strapi.container.get("middlewares").add(`strapi::`, middlewares);
}
const loadLocalMiddlewares = async (strapi) => {
  const dir = strapi.dirs.dist.middlewares;
  if (!await fse.pathExists(dir)) {
    return {};
  }
  const middlewares2 = {};
  const paths = await fse.readdir(dir, { withFileTypes: true });
  for (const fd of paths) {
    const { name } = fd;
    const fullPath = join(dir, name);
    if (fd.isFile() && extname(name) === ".js") {
      const key = basename(name, ".js");
      middlewares2[key] = importDefault(fullPath);
    }
  }
  return middlewares2;
};
export {
  loadMiddlewares as default
};
//# sourceMappingURL=middlewares.mjs.map
