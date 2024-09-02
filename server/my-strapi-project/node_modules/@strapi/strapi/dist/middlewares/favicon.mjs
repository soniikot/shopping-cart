import { existsSync } from "fs";
import { resolve } from "path";
import koaFavicon from "koa-favicon";
const defaults = {
  path: "favicon.png",
  maxAge: 864e5
};
const favicon = (config, { strapi }) => {
  const { maxAge, path: faviconDefaultPath } = { ...defaults, ...config };
  const { root: appRoot } = strapi.dirs.app;
  let faviconPath = faviconDefaultPath;
  if (!existsSync(resolve(appRoot, faviconPath))) {
    faviconPath = "favicon.ico";
  }
  return koaFavicon(resolve(appRoot, faviconPath), { maxAge });
};
export {
  favicon
};
//# sourceMappingURL=favicon.mjs.map
