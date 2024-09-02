"use strict";
const fs = require("fs/promises");
const isEmptyDirectory = async (dir) => {
  const files = await fs.readdir(dir);
  return files.length === 0;
};
const isDirectory = async (dir) => {
  const stats = await fs.lstat(dir);
  return stats.isDirectory();
};
const pathExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
const ensurePackagePathIsViable = async (path) => {
  const exists = await pathExists(path);
  if (!exists) {
    await fs.mkdir(path, { recursive: true });
  }
  const isEmpty = await isEmptyDirectory(path);
  if (!isEmpty) {
    throw new Error(`${path} is not empty`);
  }
  const isDir = await isDirectory(path);
  if (!isDir) {
    throw new Error(`${path} is not a directory`);
  }
};
exports.ensurePackagePathIsViable = ensurePackagePathIsViable;
exports.pathExists = pathExists;
//# sourceMappingURL=files-pIit-45R.js.map
