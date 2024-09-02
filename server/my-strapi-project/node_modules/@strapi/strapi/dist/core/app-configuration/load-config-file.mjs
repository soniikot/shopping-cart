import path from "path";
import fs from "fs";
import { importDefault, env, templateConfiguration } from "@strapi/utils";
const loadJsFile = (file) => {
  try {
    const jsModule = importDefault(file);
    if (typeof jsModule === "function") {
      return jsModule({ env });
    }
    return jsModule;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not load js config file ${file}: ${error.message}`);
    }
    throw new Error("Unknown error");
  }
};
const loadJSONFile = (file) => {
  try {
    return templateConfiguration(JSON.parse(fs.readFileSync(file).toString()));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Could not load json config file ${file}: ${error.message}`);
    }
    throw new Error("Unknown error");
  }
};
const loadFile = (file) => {
  const ext = path.extname(file);
  switch (ext) {
    case ".js":
      return loadJsFile(file);
    case ".json":
      return loadJSONFile(file);
    default:
      return {};
  }
};
export {
  loadFile
};
//# sourceMappingURL=load-config-file.mjs.map
