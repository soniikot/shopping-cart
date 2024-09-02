"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const outdent = require("outdent");
const ADMIN = {
  tsconfigFile: {
    name: "admin/tsconfig.json",
    contents: outdent.outdent`
        {
          "extends": "@strapi/typescript-utils/tsconfigs/admin",
          "include": ["./src", "./custom.d.ts"],
          "compilerOptions": {
            "rootDir": "../",
            "baseUrl": ".",
          },
        }
      `
  },
  tsconfigBuildFile: {
    name: "admin/tsconfig.build.json",
    contents: outdent.outdent`
        {
          "extends": "./tsconfig",
          "include": ["./src", "./custom.d.ts"],
          "exclude": ["**/*.test.ts", "**/*.test.tsx"],
          "compilerOptions": {
            "rootDir": "../",
            "baseUrl": ".",
            "outDir": "./dist",
          }
        }
      `
  }
};
const SERVER = {
  tsconfigFile: {
    name: "server/tsconfig.json",
    contents: outdent.outdent`
        {
          "extends": "@strapi/typescript-utils/tsconfigs/server",
          "include": ["./src"],
          "compilerOptions": {
            "rootDir": "../",
            "baseUrl": ".",
          },
        }
      `
  },
  tsconfigBuildFile: {
    name: "server/tsconfig.build.json",
    contents: outdent.outdent`
        {
          "extends": "./tsconfig",
          "include": ["./src"],
          "exclude": ["**/*.test.ts"],
          "compilerOptions": {
            "rootDir": "../",
            "baseUrl": ".",
            "outDir": "./dist",
          }
        }
      `
  }
};
exports.adminTsconfigFiles = ADMIN;
exports.serverTsconfigFiles = SERVER;
//# sourceMappingURL=typescript.js.map
