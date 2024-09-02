"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const browserslistToEsbuild = require("browserslist-to-esbuild");
const esbuildLoader = require("esbuild-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");
const crypto = require("node:crypto");
const path = require("node:path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const findRoot = require("find-root");
const config = require("./config-cQDYAnre.js");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const browserslistToEsbuild__default = /* @__PURE__ */ _interopDefault(browserslistToEsbuild);
const HtmlWebpackPlugin__default = /* @__PURE__ */ _interopDefault(HtmlWebpackPlugin);
const MiniCssExtractPlugin__default = /* @__PURE__ */ _interopDefault(MiniCssExtractPlugin);
const ForkTsCheckerPlugin__default = /* @__PURE__ */ _interopDefault(ForkTsCheckerPlugin);
const crypto__default = /* @__PURE__ */ _interopDefault(crypto);
const path__default = /* @__PURE__ */ _interopDefault(path);
const ReactRefreshWebpackPlugin__default = /* @__PURE__ */ _interopDefault(ReactRefreshWebpackPlugin);
const findRoot__default = /* @__PURE__ */ _interopDefault(findRoot);
const adminPackageAliases = [
  "@strapi/design-system",
  "@strapi/helper-plugin",
  "@strapi/icons",
  "date-fns",
  "formik",
  "history",
  "immer",
  "qs",
  "lodash",
  "react",
  "react-dnd",
  "react-dnd-html5-backend",
  "react-dom",
  "react-error-boundary",
  "react-helmet",
  "react-is",
  "react-intl",
  "react-query",
  "react-redux",
  "react-router-dom",
  "react-window",
  "react-select",
  "redux",
  "reselect",
  "styled-components",
  "yup"
];
const getAdminDependencyAliases = (monorepo) => adminPackageAliases.filter(
  (moduleName) => !monorepo?.path || monorepo.path && moduleName !== "@strapi/helper-plugin"
).reduce((acc, moduleName) => {
  acc[`${moduleName}$`] = findRoot__default.default(require.resolve(moduleName));
  return acc;
}, {});
const getAliases = (cwd, monorepo) => {
  const adminAliases = getAdminDependencyAliases(monorepo);
  const monorepoAliases = config.getMonorepoAliases({ monorepo });
  return {
    ...adminAliases,
    ...monorepoAliases
  };
};
const resolveBaseConfig = async (ctx) => {
  const monorepo = await config.loadStrapiMonorepo(ctx.cwd);
  const target = browserslistToEsbuild__default.default(ctx.target);
  return {
    experiments: {
      topLevelAwait: true
    },
    entry: {
      main: [`./${ctx.entry}`]
    },
    resolve: {
      alias: getAliases(ctx.cwd, monorepo),
      extensions: [".js", ".jsx", ".react.js", ".ts", ".tsx"]
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: require.resolve("esbuild-loader"),
          options: {
            loader: "tsx",
            target,
            jsx: "automatic"
          }
        },
        {
          test: /\.(js|jsx|mjs)$/,
          use: {
            loader: require.resolve("esbuild-loader"),
            options: {
              loader: "jsx",
              target,
              jsx: "automatic"
            }
          }
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.css$/i,
          use: [require.resolve("style-loader"), require.resolve("css-loader")]
        },
        {
          test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
          type: "asset/resource"
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/],
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 1e3
            }
          }
        },
        {
          test: /\.(mp4|webm)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 1e4
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin__default.default({
        inject: true,
        template: path__default.default.resolve(ctx.runtimeDir, "index.html")
      }),
      new webpack.DefinePlugin(
        Object.entries(ctx.env).reduce((acc, [key, value]) => {
          acc[`process.env.${key}`] = JSON.stringify(value);
          return acc;
        }, {})
      ),
      ctx.tsconfig && new ForkTsCheckerPlugin__default.default({
        typescript: {
          configFile: ctx.tsconfig.path,
          configOverwrite: {
            compilerOptions: {
              sourceMap: ctx.options.sourcemaps
            }
          }
        }
      })
    ].filter(Boolean)
  };
};
const resolveDevelopmentConfig = async (ctx) => {
  const baseConfig = await resolveBaseConfig(ctx);
  return {
    ...baseConfig,
    cache: {
      type: "filesystem",
      // version cache when there are changes to aliases
      buildDependencies: {
        config: [__filename]
      },
      version: crypto__default.default.createHash("md5").update(Object.entries(baseConfig.resolve.alias).join()).digest("hex")
    },
    entry: {
      ...baseConfig.entry,
      main: [
        `${require.resolve("webpack-hot-middleware/client")}?path=/__webpack_hmr`,
        ...baseConfig.entry.main
      ]
    },
    stats: "errors-warnings",
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: "[name].js",
      path: ctx.distPath,
      publicPath: ctx.basePath
    },
    infrastructureLogging: {
      level: "error"
    },
    plugins: [
      ...baseConfig.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin__default.default()
    ]
  };
};
const resolveProductionConfig = async (ctx) => {
  const target = browserslistToEsbuild__default.default(ctx.target);
  const baseConfig = await resolveBaseConfig(ctx);
  return {
    ...baseConfig,
    stats: "errors-only",
    mode: "production",
    bail: true,
    devtool: ctx.options.sourcemaps ? "source-map" : false,
    output: {
      path: ctx.distPath,
      publicPath: ctx.basePath,
      // Utilize long-term caching by adding content hashes (not compilation hashes)
      // to compiled assets for production
      filename: "[name].[contenthash:8].js",
      chunkFilename: "[name].[contenthash:8].chunk.js"
    },
    optimization: {
      minimize: ctx.options.minify,
      minimizer: [
        new esbuildLoader.ESBuildMinifyPlugin({
          target,
          css: true
          // Apply minification to CSS assets
        })
      ],
      moduleIds: "deterministic",
      runtimeChunk: true
    },
    plugins: [
      ...baseConfig.plugins,
      new MiniCssExtractPlugin__default.default({
        filename: "[name].[chunkhash].css",
        chunkFilename: "[name].[chunkhash].chunkhash.css",
        ignoreOrder: true
      }),
      ctx.options.stats && new webpackBundleAnalyzer.BundleAnalyzerPlugin()
    ].filter(Boolean)
  };
};
const USER_CONFIGS = ["webpack.config.js", "webpack.config.mjs", "webpack.config.ts"];
const mergeConfigWithUserConfig = async (config$1, ctx) => {
  const userConfig = await config.getUserConfig(USER_CONFIGS, ctx);
  if (userConfig) {
    if (typeof userConfig === "function") {
      const webpack2 = await import("webpack");
      return userConfig(config$1, webpack2);
    } else {
      ctx.logger.warn(
        `You've exported something other than a function from ${path__default.default.join(
          ctx.appDir,
          "src",
          "admin",
          "webpack.config"
        )}, this will ignored.`
      );
    }
  }
  return config$1;
};
exports.mergeConfigWithUserConfig = mergeConfigWithUserConfig;
exports.resolveDevelopmentConfig = resolveDevelopmentConfig;
exports.resolveProductionConfig = resolveProductionConfig;
//# sourceMappingURL=config-e-cmAy8N.js.map
