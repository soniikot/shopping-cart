"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const outdent = require("outdent");
const gitIgnoreFile = {
  name: ".gitignore",
  contents: outdent.outdent`
    # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

    # dependencies
    node_modules
    .pnp
    .pnp.js
    
    # testing
    coverage
    
    # production
    dist
    
    # misc
    .DS_Store
    *.pem
    
    # debug
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    
    # local env files
    .env    
    `
};
exports.gitIgnoreFile = gitIgnoreFile;
//# sourceMappingURL=gitIgnore.js.map
