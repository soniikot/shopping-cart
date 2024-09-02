import browserslistToEsbuild from "browserslist-to-esbuild";
import react from "@vitejs/plugin-react-swc";
import { l as loadStrapiMonorepo, g as getMonorepoAliases, a as getUserConfig } from "./config-vWNWOcHV.mjs";
import { g as getDocumentHTML } from "./index-0WWbaSNa.mjs";
const buildFilesPlugin = (ctx) => {
  const CHUNK_ID = ".strapi/client/app.js";
  return {
    name: "strapi/server/build-files",
    apply: "build",
    buildStart() {
      this.emitFile({
        type: "chunk",
        id: CHUNK_ID,
        name: "strapi"
      });
    },
    async generateBundle(_options, outputBundle) {
      const bundle = outputBundle;
      const entryFile = Object.values(bundle).find(
        (file) => file.type === "chunk" && file.name === "strapi" && file.facadeModuleId?.endsWith(CHUNK_ID)
      );
      if (!entryFile) {
        throw new Error(`Failed to find entry file in bundle (${CHUNK_ID})`);
      }
      if (entryFile.type !== "chunk") {
        throw new Error("Entry file is not a chunk");
      }
      const entryFileName = entryFile.fileName;
      const entryPath = ["/admin".replace(/\/+$/, ""), entryFileName].join("/");
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: getDocumentHTML({
          logger: ctx.logger,
          props: {
            entryPath
          }
        })
      });
    }
  };
};
const resolveBaseConfig = async (ctx) => {
  const target = browserslistToEsbuild(ctx.target);
  return {
    root: ctx.cwd,
    build: {
      emptyOutDir: false,
      // Rely on CLI to do this
      outDir: ctx.distDir,
      target
    },
    cacheDir: "node_modules/.strapi/vite",
    configFile: false,
    define: {
      "process.env": ctx.env
    },
    envPrefix: "STRAPI_ADMIN_",
    optimizeDeps: {
      include: [
        // pre-bundle React dependencies to avoid React duplicates,
        // even if React dependencies are not direct dependencies
        // https://react.dev/warnings/invalid-hook-call-warning#duplicate-react
        "react",
        `react/jsx-runtime`,
        "react-dom/client",
        "styled-components",
        "react-router-dom"
      ]
    },
    resolve: {
      // https://react.dev/warnings/invalid-hook-call-warning#duplicate-react
      dedupe: ["react", "react-dom", "react-router-dom", "styled-components"]
    },
    plugins: [react(), buildFilesPlugin(ctx)]
  };
};
const resolveProductionConfig = async (ctx) => {
  const {
    options: { minify, sourcemaps }
  } = ctx;
  const baseConfig = await resolveBaseConfig(ctx);
  return {
    ...baseConfig,
    base: ctx.basePath,
    logLevel: "silent",
    mode: "production",
    build: {
      ...baseConfig.build,
      assetsDir: "",
      minify,
      sourcemap: sourcemaps,
      rollupOptions: {
        input: {
          strapi: ctx.entry
        }
      }
    }
  };
};
const resolveDevelopmentConfig = async (ctx) => {
  const monorepo = await loadStrapiMonorepo(ctx.cwd);
  const baseConfig = await resolveBaseConfig(ctx);
  return {
    ...baseConfig,
    mode: "development",
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve?.alias,
        ...getMonorepoAliases({ monorepo })
      }
    },
    server: {
      middlewareMode: true,
      open: ctx.options.open,
      hmr: true
    },
    appType: "custom"
  };
};
const USER_CONFIGS = ["vite.config.js", "vite.config.mjs", "vite.config.ts"];
const mergeConfigWithUserConfig = async (config, ctx) => {
  const userConfig = await getUserConfig(USER_CONFIGS, ctx);
  if (userConfig) {
    return userConfig(config);
  }
  return config;
};
export {
  resolveDevelopmentConfig as a,
  mergeConfigWithUserConfig as m,
  resolveProductionConfig as r
};
//# sourceMappingURL=config-bN5VpLkz.mjs.map
