"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const outdent = require("outdent");
const tsconfigFile = {
  name: "tsconfig.json",
  contents: outdent.outdent`
      {
        "include": ["src"],
        "exclude": ["**/*.test.ts"],
        "compilerOptions": {
          "composite": false,
          "declaration": true,
          "declarationMap": true,
          "esModuleInterop": true,
          "forceConsistentCasingInFileNames": true,
          "inlineSources": false,
          "isolatedModules": true,
          "moduleResolution": "Bundler",
          "module": "ESNext",
          "noEmit": true,
          "noUnusedLocals": false,
          "noUnusedParameters": false,
          "preserveWatchOutput": true,
          "skipLibCheck": true,
          "strict": true
        }
      }
    `
};
const tsconfigBuildFile = {
  name: "tsconfig.build.json",
  contents: outdent.outdent`
      {
        "extends": "./tsconfig",
        "include": ["./src"],
        "compilerOptions": {
          "rootDir": ".",
          "outDir": "./dist",
          "emitDeclarationOnly": true,
          "noEmit": false,
          "resolveJsonModule": true
        }
      }
    `
};
const tsconfigEslintFile = {
  name: "tsconfig.eslint.json",
  contents: outdent.outdent`
      {
        "extends": "./tsconfig",
        "include": ["src", "*.ts", "*.js"],
      }
    `
};
exports.tsconfigBuildFile = tsconfigBuildFile;
exports.tsconfigEslintFile = tsconfigEslintFile;
exports.tsconfigFile = tsconfigFile;
//# sourceMappingURL=typescript-UNrF5BlF.js.map
