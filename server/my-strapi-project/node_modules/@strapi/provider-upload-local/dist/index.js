"use strict";
const stream = require("stream");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const utils = require("@strapi/utils");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__default = /* @__PURE__ */ _interopDefault(fs);
const path__default = /* @__PURE__ */ _interopDefault(path);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const utils__namespace = /* @__PURE__ */ _interopNamespace(utils);
const { PayloadTooLargeError } = utils__namespace.errors;
const { kbytesToBytes, bytesToHumanReadable } = utils__namespace.file;
const UPLOADS_FOLDER_NAME = "uploads";
const index = {
  init({ sizeLimit: providerOptionsSizeLimit } = {}) {
    if (providerOptionsSizeLimit) {
      process.emitWarning(
        '[deprecated] In future versions, "sizeLimit" argument will be ignored from upload.config.providerOptions. Move it to upload.config'
      );
    }
    const uploadPath = path__default.default.resolve(strapi.dirs.static.public, UPLOADS_FOLDER_NAME);
    if (!fse__default.default.pathExistsSync(uploadPath)) {
      throw new Error(
        `The upload folder (${uploadPath}) doesn't exist or is not accessible. Please make sure it exists.`
      );
    }
    return {
      checkFileSize(file, options) {
        const { sizeLimit } = options ?? {};
        if (providerOptionsSizeLimit) {
          if (kbytesToBytes(file.size) > providerOptionsSizeLimit)
            throw new PayloadTooLargeError(
              `${file.name} exceeds size limit of ${bytesToHumanReadable(
                providerOptionsSizeLimit
              )}.`
            );
        } else if (sizeLimit) {
          if (kbytesToBytes(file.size) > sizeLimit)
            throw new PayloadTooLargeError(
              `${file.name} exceeds size limit of ${bytesToHumanReadable(sizeLimit)}.`
            );
        }
      },
      uploadStream(file) {
        if (!file.stream) {
          return Promise.reject(new Error("Missing file stream"));
        }
        const { stream: stream$1 } = file;
        return new Promise((resolve, reject) => {
          stream.pipeline(
            stream$1,
            fs__default.default.createWriteStream(path__default.default.join(uploadPath, `${file.hash}${file.ext}`)),
            (err) => {
              if (err) {
                return reject(err);
              }
              file.url = `/${UPLOADS_FOLDER_NAME}/${file.hash}${file.ext}`;
              resolve();
            }
          );
        });
      },
      upload(file) {
        if (!file.buffer) {
          return Promise.reject(new Error("Missing file buffer"));
        }
        const { buffer } = file;
        return new Promise((resolve, reject) => {
          fs__default.default.writeFile(path__default.default.join(uploadPath, `${file.hash}${file.ext}`), buffer, (err) => {
            if (err) {
              return reject(err);
            }
            file.url = `/${UPLOADS_FOLDER_NAME}/${file.hash}${file.ext}`;
            resolve();
          });
        });
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const filePath = path__default.default.join(uploadPath, `${file.hash}${file.ext}`);
          if (!fs__default.default.existsSync(filePath)) {
            resolve("File doesn't exist");
            return;
          }
          fs__default.default.unlink(filePath, (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      }
    };
  }
};
module.exports = index;
//# sourceMappingURL=index.js.map
