import fs from "fs";
import path from "path";
import stream from "stream";
import _ from "lodash";
import { defaultsDeep } from "lodash/fp";
import koaStatic from "koa-static";
import "open";
import "@strapi/utils";
import isInitialized from "../../utils/is-initialized.mjs";
import { serveStatic } from "./serve-static.mjs";
const defaults = {
  maxAge: 6e4,
  defaultIndex: true
};
const publicStatic = (config, { strapi }) => {
  const { defaultIndex, maxAge } = defaultsDeep(defaults, config);
  if (defaultIndex === true) {
    const index = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
    const serveIndexPage = async (ctx, next) => {
      await next();
      if (ctx.body != null || ctx.status !== 404)
        return;
      ctx.url = "index.html";
      const isInitialized$1 = await isInitialized(strapi);
      const data = {
        serverTime: (/* @__PURE__ */ new Date()).toUTCString(),
        isInitialized: isInitialized$1,
        ..._.pick(strapi, [
          "config.info.version",
          "config.info.name",
          "config.admin.url",
          "config.server.url",
          "config.environment",
          "config.serveAdminPanel"
        ])
      };
      const content = _.template(index)(data);
      const body = new stream.Readable({
        read() {
          this.push(Buffer.from(content));
          this.push(null);
        }
      });
      ctx.type = "html";
      ctx.body = body;
    };
    strapi.server.routes([
      {
        method: "GET",
        path: "/",
        handler: serveIndexPage,
        config: { auth: false }
      },
      {
        method: "GET",
        path: "/index.html",
        handler: serveIndexPage,
        config: { auth: false }
      },
      {
        method: "GET",
        path: "/assets/images/(.*)",
        handler: serveStatic(path.resolve(__dirname, "assets/images"), {
          maxage: maxAge,
          defer: true
        }),
        config: { auth: false }
      },
      // All other public GET-routes except /uploads/(.*) which is handled in upload middleware
      {
        method: "GET",
        path: "/((?!uploads/).+)",
        handler: koaStatic(strapi.dirs.static.public, {
          maxage: maxAge,
          defer: true
        }),
        config: { auth: false }
      }
    ]);
  }
};
export {
  publicStatic
};
//# sourceMappingURL=index.mjs.map
