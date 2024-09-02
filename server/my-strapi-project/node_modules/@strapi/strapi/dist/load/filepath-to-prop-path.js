"use strict";
const path = require("node:path");
const fp = require("lodash/fp");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const path__default = /* @__PURE__ */ _interopDefault(path);
const fp__default = /* @__PURE__ */ _interopDefault(fp);
const filePathToPath = (entryPath, useFileNameAsKey = true) => {
  const transform = fp__default.default.pipe(
    // Remove the relative path prefixes: './' for posix (and some win32) and ".\" for win32
    removeRelativePrefix,
    // Remove the path metadata and extensions
    fp__default.default.replace(/(\.settings|\.json|\.js)/g, ""),
    // Transform to lowercase
    // Note: We're using fp.toLower instead of fp.lowercase as the latest removes special characters such as "/"
    fp__default.default.toLower,
    // Split the cleaned path by matching every possible separator (either "/" or "\" depending on the OS)
    fp__default.default.split(new RegExp(`[\\${path__default.default.win32.sep}|${path__default.default.posix.sep}]`, "g")),
    // Make sure to remove leading '.' from the different path parts
    fp__default.default.map(fp__default.default.trimCharsStart(".")),
    // join + split in case some '.' characters are still present in different parts of the path
    fp__default.default.join("."),
    fp__default.default.split("."),
    // Remove the last portion of the path array if the file name shouldn't be used as a key
    useFileNameAsKey ? fp__default.default.identity : fp__default.default.slice(0, -1)
  );
  return transform(entryPath);
};
const removeRelativePrefix = (filePath) => {
  return filePath.startsWith(`.${path__default.default.win32.sep}`) || filePath.startsWith(`.${path__default.default.posix.sep}`) ? filePath.slice(2) : filePath;
};
module.exports = filePathToPath;
//# sourceMappingURL=filepath-to-prop-path.js.map
