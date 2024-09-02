import { Transform, PassThrough, Writable, Readable, Duplex, pipeline } from "stream";
import path, { extname, join, posix } from "path";
import { EOL } from "os";
import { chain } from "stream-chain";
import { isArray, zip, isObject, uniq, isEqual, mapValues, pick, reject as reject$1, capitalize, isNumber, isEmpty, last, difference, set, omit, get, has, pipe, assign, map as map$1, size, isNil, clone, once, castArray, keyBy, isString, isNaN, merge, isFinite, toNumber } from "lodash/fp";
import { diff as diff$1 } from "semver";
import { scryptSync, createCipheriv, createDecipheriv, randomUUID } from "crypto";
import { EventEmitter } from "events";
import * as fse from "fs-extra";
import fse__default, { createReadStream, stat, createWriteStream, rm } from "fs-extra";
import _ from "lodash";
import { contentTypes, mapAsync } from "@strapi/utils";
import chalk from "chalk";
import https from "https";
import http from "http";
import { WebSocket } from "ws";
import zip$1 from "zlib";
import tar from "tar";
import { parser } from "stream-json/jsonl/Parser";
import tar$1 from "tar-stream";
import { stringer } from "stream-json/jsonl/Stringer";
import { Option, InvalidOptionArgumentError } from "commander";
import Table from "cli-table3";
import { createLogger, configs } from "@strapi/logger";
import strapiFactory from "@strapi/strapi";
import ora from "ora";
import inquirer from "inquirer";
const getEncryptionStrategy = (algorithm) => {
  const strategies2 = {
    "aes-128-ecb"(key) {
      const hashedKey = scryptSync(key, "", 16);
      const initVector = null;
      const securityKey = hashedKey;
      return createCipheriv(algorithm, securityKey, initVector);
    },
    aes128(key) {
      const hashedKey = scryptSync(key, "", 32);
      const initVector = hashedKey.slice(16);
      const securityKey = hashedKey.slice(0, 16);
      return createCipheriv(algorithm, securityKey, initVector);
    },
    aes192(key) {
      const hashedKey = scryptSync(key, "", 40);
      const initVector = hashedKey.slice(24);
      const securityKey = hashedKey.slice(0, 24);
      return createCipheriv(algorithm, securityKey, initVector);
    },
    aes256(key) {
      const hashedKey = scryptSync(key, "", 48);
      const initVector = hashedKey.slice(32);
      const securityKey = hashedKey.slice(0, 32);
      return createCipheriv(algorithm, securityKey, initVector);
    }
  };
  return strategies2[algorithm];
};
const createEncryptionCipher = (key, algorithm = "aes-128-ecb") => {
  return getEncryptionStrategy(algorithm)(key);
};
const getDecryptionStrategy = (algorithm) => {
  const strategies2 = {
    "aes-128-ecb"(key) {
      const hashedKey = scryptSync(key, "", 16);
      const initVector = null;
      const securityKey = hashedKey;
      return createDecipheriv(algorithm, securityKey, initVector);
    },
    aes128(key) {
      const hashedKey = scryptSync(key, "", 32);
      const initVector = hashedKey.slice(16);
      const securityKey = hashedKey.slice(0, 16);
      return createDecipheriv(algorithm, securityKey, initVector);
    },
    aes192(key) {
      const hashedKey = scryptSync(key, "", 40);
      const initVector = hashedKey.slice(24);
      const securityKey = hashedKey.slice(0, 24);
      return createDecipheriv(algorithm, securityKey, initVector);
    },
    aes256(key) {
      const hashedKey = scryptSync(key, "", 48);
      const initVector = hashedKey.slice(32);
      const securityKey = hashedKey.slice(0, 32);
      return createDecipheriv(algorithm, securityKey, initVector);
    }
  };
  return strategies2[algorithm];
};
const createDecryptionCipher = (key, algorithm = "aes-128-ecb") => {
  return getDecryptionStrategy(algorithm)(key);
};
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDecryptionCipher,
  createEncryptionCipher
}, Symbol.toStringTag, { value: "Module" }));
const filter = (predicate, options = { objectMode: true }) => {
  return new Transform({
    ...options,
    async transform(chunk, _encoding, callback) {
      const keep = await predicate(chunk);
      callback(null, keep ? chunk : void 0);
    }
  });
};
const map = (predicate, options = { objectMode: true }) => {
  return new Transform({
    ...options,
    async transform(chunk, _encoding, callback) {
      const mappedValue = await predicate(chunk);
      callback(null, mappedValue);
    }
  });
};
const collect = (stream2, options = { destroy: true }) => {
  const chunks = [];
  return new Promise((resolve, reject2) => {
    stream2.on("close", () => resolve(chunks)).on("error", reject2).on("data", (chunk) => chunks.push(chunk)).on("end", () => {
      if (options.destroy) {
        stream2.destroy();
      }
      resolve(chunks);
    });
  });
};
const stream = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  collect,
  filter,
  map
}, Symbol.toStringTag, { value: "Module" }));
const createContext = () => ({ path: [] });
const diff = (a, b, ctx = createContext()) => {
  const diffs = [];
  const { path: path2 } = ctx;
  const aType = typeof a;
  const bType = typeof b;
  const added = () => {
    diffs.push({ kind: "added", path: path2, type: bType, value: b });
    return diffs;
  };
  const deleted = () => {
    diffs.push({ kind: "deleted", path: path2, type: aType, value: a });
    return diffs;
  };
  const modified = () => {
    diffs.push({
      kind: "modified",
      path: path2,
      types: [aType, bType],
      values: [a, b]
    });
    return diffs;
  };
  if (isArray(a) && isArray(b)) {
    let k = 0;
    for (const [aItem, bItem] of zip(a, b)) {
      const kCtx = { path: [...path2, k.toString()] };
      const kDiffs = diff(aItem, bItem, kCtx);
      diffs.push(...kDiffs);
      k += 1;
    }
    return diffs;
  }
  if (isObject(a) && isObject(b)) {
    const keys = uniq(Object.keys(a).concat(Object.keys(b)));
    for (const key of keys) {
      const aValue = a[key];
      const bValue = b[key];
      const nestedDiffs = diff(aValue, bValue, { path: [...path2, key] });
      diffs.push(...nestedDiffs);
    }
    return diffs;
  }
  if (!isEqual(a, b)) {
    if (aType === "undefined") {
      return added();
    }
    if (bType === "undefined") {
      return deleted();
    }
    return modified();
  }
  return diffs;
};
const json = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  diff
}, Symbol.toStringTag, { value: "Module" }));
const VALID_SCHEMA_PROPERTIES = [
  "collectionName",
  "info",
  "options",
  "pluginOptions",
  "attributes",
  "kind",
  "modelType",
  "modelName",
  "uid",
  "plugin",
  "globalId"
];
const mapSchemasValues = (schemas) => {
  return mapValues(pick(VALID_SCHEMA_PROPERTIES), schemas);
};
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mapSchemasValues
}, Symbol.toStringTag, { value: "Module" }));
const createTransaction = (strapi2) => {
  const fns = [];
  let done = false;
  let resume = null;
  const e = new EventEmitter();
  e.on("spawn", (uuid, cb) => {
    fns.push({ fn: cb, uuid });
    resume?.();
  });
  e.on("close", () => {
    e.removeAllListeners("rollback");
    e.removeAllListeners("spawn");
    done = true;
    resume?.();
  });
  strapi2.db.transaction(async ({ trx, rollback }) => {
    e.once("rollback", async () => {
      e.removeAllListeners("close");
      e.removeAllListeners("spawn");
      try {
        await rollback();
        e.emit("rollback_completed");
      } catch {
        e.emit("rollback_failed");
      } finally {
        done = true;
        resume?.();
      }
    });
    while (!done) {
      while (fns.length) {
        const item = fns.shift();
        if (item) {
          const { fn, uuid } = item;
          try {
            const res = await fn(trx);
            e.emit(uuid, { data: res });
          } catch (error) {
            e.emit(uuid, { error });
          }
        }
      }
      if (!done && !fns.length) {
        await new Promise((resolve) => {
          resume = resolve;
        });
      }
    }
  });
  return {
    async attach(callback) {
      const uuid = randomUUID();
      e.emit("spawn", uuid, callback);
      return new Promise((resolve, reject2) => {
        e.on(uuid, ({ data, error }) => {
          if (data) {
            resolve(data);
          }
          if (error) {
            reject2(error);
          }
          resolve(void 0);
        });
      });
    },
    end() {
      return e.emit("close");
    },
    rollback() {
      return new Promise((resolve) => {
        e.emit("rollback");
        e.once("rollback_failed", () => resolve(false));
        e.once("rollback_completed", () => resolve(true));
      });
    }
  };
};
const transaction = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createTransaction
}, Symbol.toStringTag, { value: "Module" }));
const runMiddleware = async (context, middlewares) => {
  if (!middlewares.length) {
    return;
  }
  const cb = middlewares[0];
  await cb(context, async (newContext) => {
    await runMiddleware(newContext, middlewares.slice(1));
  });
};
const middleware = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  runMiddleware
}, Symbol.toStringTag, { value: "Module" }));
const index$6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  encryption: index$7,
  json,
  middleware,
  schema,
  stream,
  transaction
}, Symbol.toStringTag, { value: "Module" }));
const OPTIONAL_CONTENT_TYPES = ["audit-log"];
const isAttributeIgnorable = (diff2) => {
  return diff2.path.length === 3 && // Root property must be attributes
  diff2.path[0] === "attributes" && // Need a valid string attribute name
  typeof diff2.path[1] === "string" && // The diff must be on ignorable attribute properties
  ["private", "required", "configurable"].includes(diff2.path[2]);
};
const isOptionalAdminType = (diff2) => {
  if ("value" in diff2 && isObject(diff2.value)) {
    const name = diff2?.value?.info?.singularName;
    return OPTIONAL_CONTENT_TYPES.includes(name);
  }
  if ("values" in diff2 && isArray(diff2.values) && isObject(diff2.values[0])) {
    const name = diff2?.values[0]?.info?.singularName;
    return OPTIONAL_CONTENT_TYPES.includes(name);
  }
  return false;
};
const isIgnorableStrict = (diff2) => isAttributeIgnorable(diff2) || isOptionalAdminType(diff2);
const strategies = {
  // No diffs
  exact(diffs) {
    return diffs;
  },
  // Strict: all content types must match except:
  // - the property within a content type is an ignorable one
  // - those that are (not transferrable and optionally available), for example EE features such as audit logs
  strict(diffs) {
    return reject$1(isIgnorableStrict, diffs);
  }
};
const compareSchemas = (a, b, strategy) => {
  const diffs = diff(a, b);
  return strategies[strategy](diffs);
};
const SeverityKind = {
  FATAL: "fatal",
  ERROR: "error",
  SILLY: "silly"
};
class DataTransferError extends Error {
  origin;
  severity;
  details;
  constructor(origin2, severity, message, details) {
    super(message);
    this.origin = origin2;
    this.severity = severity;
    this.details = details ?? null;
  }
}
class TransferEngineError extends DataTransferError {
  constructor(severity, message, details) {
    super("engine", severity, message, details);
  }
}
let TransferEngineInitializationError$1 = class TransferEngineInitializationError extends TransferEngineError {
  constructor(message) {
    super(SeverityKind.FATAL, message, { step: "initialization" });
  }
};
class TransferEngineValidationError extends TransferEngineError {
  constructor(message, details) {
    super(SeverityKind.FATAL, message, { step: "validation", details });
  }
}
class TransferEngineTransferError extends TransferEngineError {
  constructor(message, details) {
    super(SeverityKind.FATAL, message, { step: "transfer", details });
  }
}
const errors = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TransferEngineError,
  TransferEngineInitializationError: TransferEngineInitializationError$1,
  TransferEngineTransferError,
  TransferEngineValidationError
}, Symbol.toStringTag, { value: "Module" }));
const reject = (reason) => {
  throw new TransferEngineValidationError(`Invalid provider supplied. ${reason}`);
};
const validateProvider = (type, provider) => {
  if (!provider) {
    return reject(
      `Expected an instance of "${capitalize(type)}Provider", but got "${typeof provider}" instead.`
    );
  }
  if (provider.type !== type) {
    return reject(
      `Expected the provider to be of type "${type}" but got "${provider.type}" instead.`
    );
  }
};
const createDiagnosticReporter = (options = {}) => {
  const { stackSize = -1 } = options;
  const emitter = new EventEmitter();
  const stack = [];
  const addListener = (event, listener) => {
    emitter.on(event, listener);
  };
  const isDiagnosticValid = (diagnostic) => {
    if (!diagnostic.kind || !diagnostic.details || !diagnostic.details.message) {
      return false;
    }
    return true;
  };
  return {
    stack: {
      get size() {
        return stack.length;
      },
      get items() {
        return stack;
      }
    },
    report(diagnostic) {
      if (!isDiagnosticValid(diagnostic)) {
        return this;
      }
      emitter.emit("diagnostic", diagnostic);
      emitter.emit(`diagnostic.${diagnostic.kind}`, diagnostic);
      if (stackSize !== -1 && stack.length >= stackSize) {
        stack.shift();
      }
      stack.push(diagnostic);
      return this;
    },
    onDiagnostic(listener) {
      addListener("diagnostic", listener);
      return this;
    },
    on(kind, listener) {
      addListener(`diagnostic.${kind}`, listener);
      return this;
    }
  };
};
class ProviderError extends DataTransferError {
  constructor(severity, message, details) {
    super("provider", severity, message, details);
  }
}
class ProviderInitializationError extends ProviderError {
  constructor(message) {
    super(SeverityKind.FATAL, message, { step: "initialization" });
  }
}
class ProviderValidationError extends ProviderError {
  constructor(message, details) {
    super(SeverityKind.SILLY, message, { step: "validation", details });
  }
}
class ProviderTransferError extends ProviderError {
  constructor(message, details) {
    super(SeverityKind.FATAL, message, { step: "transfer", details });
  }
}
const TRANSFER_STAGES = Object.freeze([
  "entities",
  "links",
  "assets",
  "schemas",
  "configuration"
]);
const TransferGroupPresets = {
  content: {
    links: true,
    // Example: content includes the entire links stage
    entities: true
    // TODO: If we need to implement filtering on a running stage, it would be done like this, but we still need to implement it
    // [
    //   // Example: content processes the entities stage, but filters individual entities
    //   {
    //     filter(data) {
    //       return shouldIncludeThisData(data);
    //     },
    //   },
    // ],
  },
  files: {
    assets: true
  },
  config: {
    configuration: true
  }
};
const DEFAULT_VERSION_STRATEGY$1 = "ignore";
const DEFAULT_SCHEMA_STRATEGY$1 = "strict";
class TransferEngine {
  sourceProvider;
  destinationProvider;
  options;
  #metadata = {};
  #schema = {};
  // Progress of the current stage
  progress;
  diagnostics;
  #handlers = {
    schemaDiff: [],
    errors: {}
  };
  onSchemaDiff(handler) {
    this.#handlers?.schemaDiff?.push(handler);
  }
  addErrorHandler(handlerName, handler) {
    if (!this.#handlers.errors[handlerName]) {
      this.#handlers.errors[handlerName] = [];
    }
    this.#handlers.errors[handlerName]?.push(handler);
  }
  async attemptResolveError(error) {
    const context = {};
    if (error instanceof ProviderTransferError && error.details?.details.code) {
      const errorCode = error.details?.details.code;
      if (!this.#handlers.errors[errorCode]) {
        this.#handlers.errors[errorCode] = [];
      }
      await runMiddleware(context ?? {}, this.#handlers.errors[errorCode] ?? []);
    }
    return !!context.ignore;
  }
  // Save the currently open stream so that we can access it at any time
  #currentStream;
  constructor(sourceProvider, destinationProvider, options) {
    this.diagnostics = createDiagnosticReporter();
    validateProvider("source", sourceProvider);
    validateProvider("destination", destinationProvider);
    this.sourceProvider = sourceProvider;
    this.destinationProvider = destinationProvider;
    this.options = options;
    this.progress = { data: {}, stream: new PassThrough({ objectMode: true }) };
  }
  /**
   * Report a fatal error and throw it
   */
  panic(error) {
    this.reportError(error, "fatal");
    throw error;
  }
  /**
   * Report an error diagnostic
   */
  reportError(error, severity) {
    this.diagnostics.report({
      kind: "error",
      details: {
        severity,
        createdAt: /* @__PURE__ */ new Date(),
        name: error.name,
        message: error.message,
        error
      }
    });
  }
  /**
   * Report a warning diagnostic
   */
  reportWarning(message, origin2) {
    this.diagnostics.report({
      kind: "warning",
      details: { createdAt: /* @__PURE__ */ new Date(), message, origin: origin2 }
    });
  }
  /**
   * Report an info diagnostic
   */
  reportInfo(message, params) {
    this.diagnostics.report({
      kind: "info",
      details: { createdAt: /* @__PURE__ */ new Date(), message, params }
    });
  }
  /**
   * Create and return a transform stream based on the given stage and options.
   *
   * Allowed transformations includes 'filter' and 'map'.
   */
  #createStageTransformStream(key, options = {}) {
    const { includeGlobal = true } = options;
    const { throttle } = this.options;
    const { global: globalTransforms, [key]: stageTransforms } = this.options?.transforms ?? {};
    let stream2 = new PassThrough({ objectMode: true });
    const applyTransforms = (transforms = []) => {
      const chainTransforms = [];
      for (const transform of transforms) {
        if ("filter" in transform) {
          chainTransforms.push(filter(transform.filter));
        }
        if ("map" in transform) {
          chainTransforms.push(map(transform.map));
        }
      }
      if (chainTransforms.length) {
        stream2 = stream2.pipe(chain(chainTransforms));
      }
    };
    if (includeGlobal) {
      applyTransforms(globalTransforms);
    }
    if (isNumber(throttle) && throttle > 0) {
      stream2 = stream2.pipe(
        new PassThrough({
          objectMode: true,
          async transform(data, _encoding, callback) {
            await new Promise((resolve) => {
              setTimeout(resolve, throttle);
            });
            callback(null, data);
          }
        })
      );
    }
    applyTransforms(stageTransforms);
    return stream2;
  }
  /**
   * Update the Engine's transfer progress data for a given stage.
   *
   * Providing aggregate options enable custom computation to get the size (bytes) or the aggregate key associated with the data
   */
  #updateTransferProgress(stage, data, aggregate) {
    if (!this.progress.data[stage]) {
      this.progress.data[stage] = { count: 0, bytes: 0, startTime: Date.now() };
    }
    const stageProgress = this.progress.data[stage];
    if (!stageProgress) {
      return;
    }
    const size2 = aggregate?.size?.(data) ?? JSON.stringify(data).length;
    const key = aggregate?.key?.(data);
    stageProgress.count += 1;
    stageProgress.bytes += size2;
    if (key) {
      if (!stageProgress.aggregates) {
        stageProgress.aggregates = {};
      }
      const { aggregates } = stageProgress;
      if (!aggregates[key]) {
        aggregates[key] = { count: 0, bytes: 0 };
      }
      aggregates[key].count += 1;
      aggregates[key].bytes += size2;
    }
  }
  /**
   * Create and return a PassThrough stream.
   *
   * Upon writing data into it, it'll update the Engine's transfer progress data and trigger stage update events.
   */
  #progressTracker(stage, aggregate) {
    return new PassThrough({
      objectMode: true,
      transform: (data, _encoding, callback) => {
        this.#updateTransferProgress(stage, data, aggregate);
        this.#emitStageUpdate("progress", stage);
        callback(null, data);
      }
    });
  }
  /**
   * Shorthand method used to trigger transfer update events to every listeners
   */
  #emitTransferUpdate(type, payload) {
    this.progress.stream.emit(`transfer::${type}`, payload);
  }
  /**
   * Shorthand method used to trigger stage update events to every listeners
   */
  #emitStageUpdate(type, transferStage) {
    this.progress.stream.emit(`stage::${type}`, {
      data: this.progress.data,
      stage: transferStage
    });
  }
  /**
   * Run a version check between two strapi version (source and destination) using the strategy given to the engine during initialization.
   *
   * If there is a mismatch, throws a validation error.
   */
  #assertStrapiVersionIntegrity(sourceVersion, destinationVersion) {
    const strategy = this.options.versionStrategy || DEFAULT_VERSION_STRATEGY$1;
    const reject2 = () => {
      throw new TransferEngineValidationError(
        `The source and destination provide are targeting incompatible Strapi versions (using the "${strategy}" strategy). The source (${this.sourceProvider.name}) version is ${sourceVersion} and the destination (${this.destinationProvider.name}) version is ${destinationVersion}`,
        {
          check: "strapi.version",
          strategy,
          versions: { source: sourceVersion, destination: destinationVersion }
        }
      );
    };
    if (!sourceVersion || !destinationVersion || strategy === "ignore" || destinationVersion === sourceVersion) {
      return;
    }
    let diff2;
    try {
      diff2 = diff$1(sourceVersion, destinationVersion);
    } catch {
      reject2();
    }
    if (!diff2) {
      return;
    }
    const validPatch = ["prelease", "build"];
    const validMinor = [...validPatch, "patch", "prepatch"];
    const validMajor = [...validMinor, "minor", "preminor"];
    if (strategy === "patch" && validPatch.includes(diff2)) {
      return;
    }
    if (strategy === "minor" && validMinor.includes(diff2)) {
      return;
    }
    if (strategy === "major" && validMajor.includes(diff2)) {
      return;
    }
    reject2();
  }
  /**
   * Run a check between two set of schemas (source and destination) using the strategy given to the engine during initialization.
   *
   * If there are differences and/or incompatibilities between source and destination schemas, then throw a validation error.
   */
  #assertSchemasMatching(sourceSchemas, destinationSchemas) {
    const strategy = this.options.schemaStrategy || DEFAULT_SCHEMA_STRATEGY$1;
    if (strategy === "ignore") {
      return;
    }
    const keys = uniq(Object.keys(sourceSchemas).concat(Object.keys(destinationSchemas)));
    const diffs = {};
    keys.forEach((key) => {
      const sourceSchema = sourceSchemas[key];
      const destinationSchema = destinationSchemas[key];
      const schemaDiffs = compareSchemas(sourceSchema, destinationSchema, strategy);
      if (schemaDiffs.length) {
        diffs[key] = schemaDiffs;
      }
    });
    if (!isEmpty(diffs)) {
      const formattedDiffs = Object.entries(diffs).map(([uid, ctDiffs]) => {
        let msg = `- ${uid}:${EOL}`;
        msg += ctDiffs.sort((a, b) => a.kind > b.kind ? -1 : 1).map((diff2) => {
          const path2 = diff2.path.join(".");
          if (diff2.kind === "added") {
            return `${path2} exists in destination schema but not in source schema and the data will not be transferred.`;
          }
          if (diff2.kind === "deleted") {
            return `${path2} exists in source schema but not in destination schema and the data will not be transferred.`;
          }
          if (diff2.kind === "modified") {
            if (diff2.types[0] === diff2.types[1]) {
              return `Schema value changed at "${path2}": "${diff2.values[0]}" (${diff2.types[0]}) => "${diff2.values[1]}" (${diff2.types[1]})`;
            }
            return `Schema has differing data types at "${path2}": "${diff2.values[0]}" (${diff2.types[0]}) => "${diff2.values[1]}" (${diff2.types[1]})`;
          }
          throw new TransferEngineValidationError(`Invalid diff found for "${uid}"`, {
            check: `schema on ${uid}`
          });
        }).map((line) => `  - ${line}`).join(EOL);
        return msg;
      }).join(EOL);
      throw new TransferEngineValidationError(
        `Invalid schema changes detected during integrity checks (using the ${strategy} strategy). Please find a summary of the changes below:
${formattedDiffs}`,
        {
          check: "schema.changes",
          strategy,
          diffs
        }
      );
    }
  }
  shouldSkipStage(stage) {
    const { exclude, only } = this.options;
    if (stage === "schemas") {
      return false;
    }
    let included = isEmpty(only);
    if (only && only.length > 0) {
      included = only.some((transferGroup) => {
        return TransferGroupPresets[transferGroup][stage];
      });
    }
    if (exclude && exclude.length > 0) {
      if (included) {
        included = !exclude.some((transferGroup) => {
          return TransferGroupPresets[transferGroup][stage];
        });
      }
    }
    return !included;
  }
  async #transferStage(options) {
    const { stage, source, destination, transform, tracker } = options;
    const updateEndTime = () => {
      const stageData = this.progress.data[stage];
      if (stageData) {
        stageData.endTime = Date.now();
      }
    };
    if (!source || !destination || this.shouldSkipStage(stage)) {
      const results = await Promise.allSettled(
        [source, destination].map((stream2) => {
          if (!stream2 || stream2.destroyed) {
            return Promise.resolve();
          }
          return new Promise((resolve, reject2) => {
            stream2.on("close", resolve).on("error", reject2).destroy();
          });
        })
      );
      results.forEach((state) => {
        if (state.status === "rejected") {
          this.reportWarning(state.reason, `transfer(${stage})`);
        }
      });
      this.#emitStageUpdate("skip", stage);
      return;
    }
    this.#emitStageUpdate("start", stage);
    await new Promise((resolve, reject2) => {
      let stream2 = source;
      if (transform) {
        stream2 = stream2.pipe(transform);
      }
      if (tracker) {
        stream2 = stream2.pipe(tracker);
      }
      this.#currentStream = stream2.pipe(destination).on("error", (e) => {
        updateEndTime();
        this.#emitStageUpdate("error", stage);
        this.reportError(e, "error");
        destination.destroy(e);
        reject2(e);
      }).on("close", () => {
        this.#currentStream = void 0;
        updateEndTime();
        resolve();
      });
    });
    this.#emitStageUpdate("finish", stage);
  }
  // Cause an ongoing transfer to abort gracefully
  async abortTransfer() {
    const err = new TransferEngineError("fatal", "Transfer aborted.");
    if (!this.#currentStream) {
      throw err;
    }
    this.#currentStream.destroy(err);
  }
  async init() {
    await this.#resolveProviderResource();
    const { source: sourceMetadata } = this.#metadata;
    if (sourceMetadata) {
      this.destinationProvider.setMetadata?.("source", sourceMetadata);
    }
  }
  /**
   * Run the bootstrap method in both source and destination providers
   */
  async bootstrap() {
    const results = await Promise.allSettled([
      this.sourceProvider.bootstrap?.(),
      this.destinationProvider.bootstrap?.()
    ]);
    results.forEach((result) => {
      if (result.status === "rejected") {
        this.panic(result.reason);
      }
    });
  }
  /**
   * Run the close method in both source and destination providers
   */
  async close() {
    const results = await Promise.allSettled([
      this.sourceProvider.close?.(),
      this.destinationProvider.close?.()
    ]);
    results.forEach((result) => {
      if (result.status === "rejected") {
        this.panic(result.reason);
      }
    });
  }
  async #resolveProviderResource() {
    const sourceMetadata = await this.sourceProvider.getMetadata();
    const destinationMetadata = await this.destinationProvider.getMetadata();
    if (sourceMetadata) {
      this.#metadata.source = sourceMetadata;
    }
    if (destinationMetadata) {
      this.#metadata.destination = destinationMetadata;
    }
  }
  async #getSchemas() {
    if (!this.#schema.source) {
      this.#schema.source = await this.sourceProvider.getSchemas?.();
    }
    if (!this.#schema.destination) {
      this.#schema.destination = await this.destinationProvider.getSchemas?.();
    }
    return {
      sourceSchemas: this.#schema.source,
      destinationSchemas: this.#schema.destination
    };
  }
  async integrityCheck() {
    const sourceMetadata = await this.sourceProvider.getMetadata();
    const destinationMetadata = await this.destinationProvider.getMetadata();
    if (sourceMetadata && destinationMetadata) {
      this.#assertStrapiVersionIntegrity(
        sourceMetadata?.strapi?.version,
        destinationMetadata?.strapi?.version
      );
    }
    const { sourceSchemas, destinationSchemas } = await this.#getSchemas();
    try {
      if (sourceSchemas && destinationSchemas) {
        this.#assertSchemasMatching(sourceSchemas, destinationSchemas);
      }
    } catch (error) {
      if (error instanceof TransferEngineValidationError && error.details?.details?.diffs) {
        const schemaDiffs = error.details?.details?.diffs;
        const context = {
          ignoredDiffs: {},
          diffs: schemaDiffs,
          source: this.sourceProvider,
          destination: this.destinationProvider
        };
        if (isEmpty(this.#handlers.schemaDiff)) {
          throw error;
        }
        await runMiddleware(
          context,
          this.#handlers.schemaDiff
        );
        const unresolvedDiffs = diff(context.diffs, context.ignoredDiffs);
        if (unresolvedDiffs.length) {
          this.panic(
            new TransferEngineValidationError("Unresolved differences in schema", {
              check: "schema.changes",
              unresolvedDiffs
            })
          );
        }
        return;
      }
      throw error;
    }
  }
  async transfer() {
    this.progress.data = {};
    try {
      this.#emitTransferUpdate("init");
      await this.bootstrap();
      await this.init();
      await this.integrityCheck();
      this.#emitTransferUpdate("start");
      await this.beforeTransfer();
      await this.transferSchemas();
      await this.transferEntities();
      await this.transferAssets();
      await this.transferLinks();
      await this.transferConfiguration();
      await this.close();
      this.#emitTransferUpdate("finish");
    } catch (e) {
      this.#emitTransferUpdate("error", { error: e });
      const lastDiagnostic = last(this.diagnostics.stack.items);
      if (e instanceof Error && (!lastDiagnostic || lastDiagnostic.kind !== "error" || lastDiagnostic.details.error !== e)) {
        this.reportError(e, e.severity || "fatal");
      }
      await this.destinationProvider.rollback?.(e);
      throw e;
    }
    return {
      source: this.sourceProvider.results,
      destination: this.destinationProvider.results,
      engine: this.progress.data
    };
  }
  async beforeTransfer() {
    const runWithDiagnostic = async (provider) => {
      try {
        await provider.beforeTransfer?.();
      } catch (error) {
        if (error instanceof Error) {
          const resolved = await this.attemptResolveError(error);
          if (resolved) {
            return;
          }
          this.panic(error);
        } else {
          this.panic(
            new Error(`Unknwon error when executing "beforeTransfer" on the ${origin} provider`)
          );
        }
      }
    };
    await runWithDiagnostic(this.sourceProvider);
    await runWithDiagnostic(this.destinationProvider);
  }
  async transferSchemas() {
    const stage = "schemas";
    if (this.shouldSkipStage(stage)) {
      return;
    }
    const source = await this.sourceProvider.createSchemasReadStream?.();
    const destination = await this.destinationProvider.createSchemasWriteStream?.();
    const transform = this.#createStageTransformStream(stage);
    const tracker = this.#progressTracker(stage, {
      key: (value) => value.modelType
    });
    await this.#transferStage({ stage, source, destination, transform, tracker });
  }
  async transferEntities() {
    const stage = "entities";
    if (this.shouldSkipStage(stage)) {
      return;
    }
    const source = await this.sourceProvider.createEntitiesReadStream?.();
    const destination = await this.destinationProvider.createEntitiesWriteStream?.();
    const transform = chain([
      this.#createStageTransformStream(stage),
      new Transform({
        objectMode: true,
        transform: async (entity2, _encoding, callback) => {
          const { destinationSchemas: schemas } = await this.#getSchemas();
          if (!schemas) {
            return callback(null, entity2);
          }
          const availableContentTypes = Object.entries(schemas).filter(([, schema2]) => schema2.modelType === "contentType").map(([uid]) => uid);
          if (!availableContentTypes.includes(entity2.type)) {
            return callback(null, void 0);
          }
          const { type, data } = entity2;
          const attributes = schemas[type].attributes;
          const attributesToRemove = difference(Object.keys(data), Object.keys(attributes));
          const updatedEntity = set("data", omit(attributesToRemove, data), entity2);
          callback(null, updatedEntity);
        }
      })
    ]);
    const tracker = this.#progressTracker(stage, { key: (value) => value.type });
    await this.#transferStage({ stage, source, destination, transform, tracker });
  }
  async transferLinks() {
    const stage = "links";
    if (this.shouldSkipStage(stage)) {
      return;
    }
    const source = await this.sourceProvider.createLinksReadStream?.();
    const destination = await this.destinationProvider.createLinksWriteStream?.();
    const transform = chain([
      this.#createStageTransformStream(stage),
      new Transform({
        objectMode: true,
        transform: async (link2, _encoding, callback) => {
          const { destinationSchemas: schemas } = await this.#getSchemas();
          if (!schemas) {
            return callback(null, link2);
          }
          const availableContentTypes = Object.keys(schemas);
          const isValidType = (uid) => availableContentTypes.includes(uid);
          if (!isValidType(link2.left.type) || !isValidType(link2.right.type)) {
            return callback(null, void 0);
          }
          callback(null, link2);
        }
      })
    ]);
    const tracker = this.#progressTracker(stage);
    await this.#transferStage({ stage, source, destination, transform, tracker });
  }
  async transferAssets() {
    const stage = "assets";
    if (this.shouldSkipStage(stage)) {
      return;
    }
    const source = await this.sourceProvider.createAssetsReadStream?.();
    const destination = await this.destinationProvider.createAssetsWriteStream?.();
    const transform = this.#createStageTransformStream(stage);
    const tracker = this.#progressTracker(stage, {
      size: (value) => value.stats.size,
      key: (value) => extname(value.filename) || "No extension"
    });
    await this.#transferStage({ stage, source, destination, transform, tracker });
  }
  async transferConfiguration() {
    const stage = "configuration";
    if (this.shouldSkipStage(stage)) {
      return;
    }
    const source = await this.sourceProvider.createConfigurationReadStream?.();
    const destination = await this.destinationProvider.createConfigurationWriteStream?.();
    const transform = this.#createStageTransformStream(stage);
    const tracker = this.#progressTracker(stage);
    await this.#transferStage({ stage, source, destination, transform, tracker });
  }
}
const createTransferEngine$2 = (sourceProvider, destinationProvider, options) => {
  return new TransferEngine(sourceProvider, destinationProvider, options);
};
const engineDatatransfer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_SCHEMA_STRATEGY: DEFAULT_SCHEMA_STRATEGY$1,
  DEFAULT_VERSION_STRATEGY: DEFAULT_VERSION_STRATEGY$1,
  TRANSFER_STAGES,
  TransferGroupPresets,
  createTransferEngine: createTransferEngine$2,
  errors
}, Symbol.toStringTag, { value: "Module" }));
const isDialectMySQL = () => strapi.db?.dialect.client === "mysql";
function omitComponentData(contentType, data) {
  const { attributes } = contentType;
  const componentAttributes = Object.keys(attributes).filter(
    (attributeName) => contentTypes.isComponentAttribute(attributes[attributeName])
  );
  return omit(componentAttributes, data);
}
const createComponents = async (uid, data) => {
  const { attributes = {} } = strapi.getModel(uid);
  const componentBody = {};
  const attributeNames = Object.keys(attributes);
  for (const attributeName of attributeNames) {
    const attribute = attributes[attributeName];
    if (!has(attributeName, data) || !contentTypes.isComponentAttribute(attribute)) {
      continue;
    }
    if (attribute.type === "component") {
      const { component: componentUID, repeatable = false } = attribute;
      const componentValue = data[attributeName];
      if (componentValue === null) {
        continue;
      }
      if (repeatable === true) {
        if (!Array.isArray(componentValue)) {
          throw new Error("Expected an array to create repeatable component");
        }
        const components = await mapAsync(
          componentValue,
          (value) => createComponent(componentUID, value),
          { concurrency: isDialectMySQL() && !strapi.db?.inTransaction() ? 1 : Infinity }
        );
        componentBody[attributeName] = components.map(({ id }) => {
          return {
            id,
            __pivot: {
              field: attributeName,
              component_type: componentUID
            }
          };
        });
      } else {
        const component = await createComponent(
          componentUID,
          componentValue
        );
        componentBody[attributeName] = {
          id: component.id,
          __pivot: {
            field: attributeName,
            component_type: componentUID
          }
        };
      }
      continue;
    }
    if (attribute.type === "dynamiczone") {
      const dynamiczoneValues = data[attributeName];
      if (!Array.isArray(dynamiczoneValues)) {
        throw new Error("Expected an array to create repeatable component");
      }
      const createDynamicZoneComponents = async (value) => {
        const { id } = await createComponent(value.__component, value);
        return {
          id,
          __component: value.__component,
          __pivot: {
            field: attributeName
          }
        };
      };
      componentBody[attributeName] = await mapAsync(
        dynamiczoneValues,
        createDynamicZoneComponents,
        { concurrency: isDialectMySQL() && !strapi.db?.inTransaction() ? 1 : Infinity }
      );
      continue;
    }
  }
  return componentBody;
};
const getComponents = async (uid, entity2) => {
  const componentAttributes = contentTypes.getComponentAttributes(strapi.getModel(uid));
  if (_.isEmpty(componentAttributes)) {
    return {};
  }
  return strapi.query(uid).load(entity2, componentAttributes);
};
const deleteComponents = async (uid, entityToDelete, { loadComponents = true } = {}) => {
  const { attributes = {} } = strapi.getModel(uid);
  const attributeNames = Object.keys(attributes);
  for (const attributeName of attributeNames) {
    const attribute = attributes[attributeName];
    if (attribute.type === "component" || attribute.type === "dynamiczone") {
      let value;
      if (loadComponents) {
        value = await strapi.query(uid).load(entityToDelete, attributeName);
      } else {
        value = entityToDelete[attributeName];
      }
      if (!value) {
        continue;
      }
      if (attribute.type === "component") {
        const { component: componentUID } = attribute;
        await mapAsync(
          _.castArray(value),
          (subValue) => deleteComponent(componentUID, subValue),
          {
            concurrency: isDialectMySQL() && !strapi.db?.inTransaction() ? 1 : Infinity
          }
        );
      } else {
        await mapAsync(
          _.castArray(value),
          (subValue) => deleteComponent(subValue.__component, subValue),
          { concurrency: isDialectMySQL() && !strapi.db?.inTransaction() ? 1 : Infinity }
        );
      }
      continue;
    }
  }
};
const createComponent = async (uid, data) => {
  const model = strapi.getModel(uid);
  const componentData = await createComponents(uid, data);
  const transform = pipe(
    // Make sure we don't save the component with a pre-defined ID
    omit("id"),
    // Remove the component data from the original data object ...
    (payload) => omitComponentData(model, payload),
    // ... and assign the newly created component instead
    assign(componentData)
  );
  return strapi.query(uid).create({ data: transform(data) });
};
const deleteComponent = async (uid, componentToDelete) => {
  await deleteComponents(uid, componentToDelete);
  await strapi.query(uid).delete({ where: { id: componentToDelete.id } });
};
const resolveComponentUID = ({
  paths,
  strapi: strapi2,
  data,
  contentType
}) => {
  let value = data;
  let cType = contentType;
  for (const path2 of paths) {
    value = get(path2, value);
    if (typeof cType === "function") {
      cType = cType(value);
    }
    if (path2 in cType.attributes) {
      const attribute = cType.attributes[path2];
      if (attribute.type === "component") {
        cType = strapi2.getModel(attribute.component);
      }
      if (attribute.type === "dynamiczone") {
        cType = ({ __component }) => strapi2.getModel(__component);
      }
    }
  }
  if ("uid" in cType) {
    return cType.uid;
  }
  return void 0;
};
const sanitizeComponentLikeAttributes = (model, data) => {
  const { attributes } = model;
  const componentLikeAttributesKey = Object.entries(attributes).filter(([, attribute]) => attribute.type === "component" || attribute.type === "dynamiczone").map(([key]) => key);
  return omit(componentLikeAttributesKey, data);
};
const omitInvalidCreationAttributes$1 = omit(["id"]);
const createEntityQuery = (strapi2) => {
  const components = {
    async assignToEntity(uid, data) {
      const model = strapi2.getModel(uid);
      const entityComponents = await createComponents(uid, data);
      const dataWithoutComponents = sanitizeComponentLikeAttributes(model, data);
      return assign(entityComponents, dataWithoutComponents);
    },
    async get(uid, entity2) {
      return getComponents(uid, entity2);
    },
    delete(uid, componentsToDelete) {
      return deleteComponents(
        uid,
        componentsToDelete,
        {
          loadComponents: false
        }
      );
    }
  };
  const query = (uid) => {
    const create = async (params) => {
      const dataWithComponents = await components.assignToEntity(uid, params.data);
      const sanitizedData = omitInvalidCreationAttributes$1(dataWithComponents);
      return strapi2.db.query(uid).create({ ...params, data: sanitizedData });
    };
    const createMany = async (params) => {
      return Promise.resolve(params.data).then(map$1((data) => components.assignToEntity(uid, data))).then(map$1(omitInvalidCreationAttributes$1)).then((data) => strapi2.db.query(uid).createMany({ ...params, data }));
    };
    const deleteMany = async (params) => {
      const entitiesToDelete = await strapi2.db.query(uid).findMany(params ?? {});
      if (!entitiesToDelete.length) {
        return null;
      }
      const componentsToDelete = await Promise.all(
        entitiesToDelete.map((entityToDelete) => components.get(uid, entityToDelete))
      );
      const deletedEntities = await strapi2.db.query(uid).deleteMany(params);
      await Promise.all(componentsToDelete.map((compos) => components.delete(uid, compos)));
      return deletedEntities;
    };
    const getDeepPopulateComponentLikeQuery = (contentType, params = { select: "*" }) => {
      const { attributes } = contentType;
      const populate = {};
      const entries = Object.entries(attributes);
      for (const [key, attribute] of entries) {
        if (attribute.type === "component") {
          const component = strapi2.getModel(attribute.component);
          const subPopulate = getDeepPopulateComponentLikeQuery(component, params);
          if ((isArray(subPopulate) || isObject(subPopulate)) && size(subPopulate) > 0) {
            populate[key] = { ...params, populate: subPopulate };
          }
          if (isArray(subPopulate) && isEmpty(subPopulate)) {
            populate[key] = { ...params };
          }
        }
        if (attribute.type === "dynamiczone") {
          const { components: componentsUID } = attribute;
          const on = {};
          for (const componentUID of componentsUID) {
            const component = strapi2.getModel(componentUID);
            const subPopulate = getDeepPopulateComponentLikeQuery(component, params);
            if ((isArray(subPopulate) || isObject(subPopulate)) && size(subPopulate) > 0) {
              on[componentUID] = { ...params, populate: subPopulate };
            }
            if (isArray(subPopulate) && isEmpty(subPopulate)) {
              on[componentUID] = { ...params };
            }
          }
          populate[key] = size(on) > 0 ? { on } : true;
        }
      }
      const values = Object.values(populate);
      if (values.every((value) => value === true)) {
        return Object.keys(populate);
      }
      return populate;
    };
    return {
      create,
      createMany,
      deleteMany,
      getDeepPopulateComponentLikeQuery,
      get deepPopulateComponentLikeQuery() {
        const contentType = strapi2.getModel(uid);
        return getDeepPopulateComponentLikeQuery(contentType);
      }
    };
  };
  return query;
};
const entity = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createEntityQuery
}, Symbol.toStringTag, { value: "Module" }));
const createLinkQuery = (strapi2, trx) => {
  const query = () => {
    const { connection } = strapi2.db;
    const addSchema = (tableName) => {
      const schemaName = connection.client.connectionSettings.schema;
      return schemaName ? `${schemaName}.${tableName}` : tableName;
    };
    async function* generateAllForAttribute(uid, fieldName) {
      const metadata = strapi2.db.metadata.get(uid);
      if (!metadata) {
        throw new Error(`No metadata found for ${uid}`);
      }
      const attributes = filterValidRelationalAttributes(metadata.attributes);
      if (!(fieldName in attributes)) {
        throw new Error(`${fieldName} is not a valid relational attribute name`);
      }
      const attribute = attributes[fieldName];
      const kind = getLinkKind(attribute, uid);
      const { relation, target } = attribute;
      if (attribute.joinColumn) {
        const joinColumnName = attribute.joinColumn.name;
        const qb = connection.queryBuilder().select("id", joinColumnName).from(addSchema(metadata.tableName));
        if (trx) {
          qb.transacting(trx);
        }
        const entries = await qb;
        for (const entry of entries) {
          const ref = entry[joinColumnName];
          if (ref !== null) {
            yield {
              kind,
              relation,
              left: { type: uid, ref: entry.id, field: fieldName },
              right: { type: target, ref }
            };
          }
        }
      }
      if (attribute.joinTable) {
        const {
          name,
          joinColumn,
          inverseJoinColumn,
          orderColumnName,
          morphColumn,
          inverseOrderColumnName
        } = attribute.joinTable;
        const qb = connection.queryBuilder().from(addSchema(name));
        const columns = {
          left: { ref: null },
          right: { ref: null }
        };
        const left = { type: uid, field: fieldName };
        const right = {};
        if (kind === "relation.basic" || kind === "relation.circular") {
          right.type = attribute.target;
          right.field = attribute.inversedBy;
          columns.left.ref = joinColumn.name;
          columns.right.ref = inverseJoinColumn.name;
          if (orderColumnName) {
            columns.left.order = orderColumnName;
          }
          if (inverseOrderColumnName) {
            columns.right.order = inverseOrderColumnName;
          }
        }
        if (kind === "relation.morph") {
          columns.left.ref = joinColumn.name;
          columns.right.ref = morphColumn.idColumn.name;
          columns.right.type = morphColumn.typeColumn.name;
          columns.right.field = "field";
          columns.right.order = "order";
        }
        const validColumns = [
          // Left
          columns.left.ref,
          columns.left.order,
          // Right
          columns.right.ref,
          columns.right.type,
          columns.right.field,
          columns.right.order
        ].filter((column) => !isNil(column));
        qb.select(validColumns);
        if (trx) {
          qb.transacting(trx);
        }
        const entries = await qb;
        for (const entry of entries) {
          if (columns.left.ref) {
            left.ref = entry[columns.left.ref];
          }
          if (columns.right.ref) {
            right.ref = entry[columns.right.ref];
          }
          if (columns.left.order) {
            left.pos = entry[columns.left.order];
          }
          if (columns.right.order) {
            right.pos = entry[columns.right.order];
          }
          if (columns.right.type) {
            right.type = entry[columns.right.type];
          }
          if (columns.right.field) {
            right.field = entry[columns.right.field];
          }
          const link2 = {
            kind,
            relation,
            left: clone(left),
            right: clone(right)
          };
          yield link2;
        }
      }
      if (attribute.morphColumn) {
        const { typeColumn, idColumn } = attribute.morphColumn;
        const qb = connection.queryBuilder().select("id", typeColumn.name, idColumn.name).from(addSchema(metadata.tableName)).whereNotNull(typeColumn.name).whereNotNull(idColumn.name);
        if (trx) {
          qb.transacting(trx);
        }
        const entries = await qb;
        for (const entry of entries) {
          const ref = entry[idColumn.name];
          yield {
            kind,
            relation,
            left: { type: uid, ref: entry.id, field: fieldName },
            right: { type: entry[typeColumn.name], ref }
          };
        }
      }
    }
    async function* generateAll(uid) {
      const metadata = strapi2.db.metadata.get(uid);
      if (!metadata) {
        throw new Error(`No metadata found for ${uid}`);
      }
      const attributes = filterValidRelationalAttributes(metadata.attributes);
      for (const fieldName of Object.keys(attributes)) {
        for await (const link2 of generateAllForAttribute(uid, fieldName)) {
          yield link2;
        }
      }
    }
    const insert = async (link2) => {
      const { kind, left, right } = link2;
      const metadata = strapi2.db.metadata.get(left.type);
      const attribute = metadata.attributes[left.field];
      const payload = {};
      if (attribute.type !== "relation") {
        throw new Error(`Attribute ${left.field} is not a relation`);
      }
      if ("joinColumn" in attribute && attribute.joinColumn) {
        const joinColumnName = attribute.joinColumn.name;
        const qb = connection(addSchema(metadata.tableName)).where("id", left.ref).update({ [joinColumnName]: right.ref });
        if (trx) {
          qb.transacting(trx);
        }
        await qb;
      }
      if ("joinTable" in attribute && attribute.joinTable) {
        const { joinTable } = attribute;
        if (joinTable.joinColumn) {
          Object.assign(payload, { [joinTable.joinColumn.name]: left.ref });
        }
        const assignInverseColumn = () => {
          if ("inverseJoinColumn" in joinTable && joinTable.inverseJoinColumn) {
            Object.assign(payload, {
              [joinTable.inverseJoinColumn.name]: right.ref
            });
          }
        };
        const assignOrderColumns = () => {
          if ("orderColumnName" in joinTable && joinTable.orderColumnName) {
            Object.assign(payload, { [joinTable.orderColumnName]: left.pos ?? null });
          }
          if ("inverseOrderColumnName" in joinTable && joinTable.inverseOrderColumnName) {
            Object.assign(payload, { [joinTable.inverseOrderColumnName]: right.pos ?? null });
          }
        };
        const assignMorphColumns = () => {
          if ("morphColumn" in joinTable && joinTable.morphColumn) {
            const { idColumn, typeColumn } = joinTable.morphColumn ?? {};
            if (idColumn) {
              Object.assign(payload, { [idColumn.name]: right.ref });
            }
            if (typeColumn) {
              Object.assign(payload, { [typeColumn.name]: right.type });
            }
            Object.assign(payload, { order: right.pos ?? null, field: right.field ?? null });
          }
        };
        if (kind === "relation.basic" || kind === "relation.circular") {
          assignInverseColumn();
        }
        if (kind === "relation.morph") {
          assignMorphColumns();
        }
        assignOrderColumns();
        const qb = connection.insert(payload).into(addSchema(joinTable.name));
        if (trx) {
          await trx.transaction(async (nestedTrx) => {
            await qb.transacting(nestedTrx);
          });
        }
      }
      if ("morphColumn" in attribute && attribute.morphColumn) {
        const { morphColumn } = attribute;
        const qb = connection(addSchema(metadata.tableName)).where("id", left.ref).update({
          [morphColumn.idColumn.name]: right.ref,
          [morphColumn.typeColumn.name]: right.type
        });
        if (trx) {
          qb.transacting(trx);
        }
        await qb;
      }
    };
    return { generateAll, generateAllForAttribute, insert };
  };
  return query;
};
const filterValidRelationalAttributes = (attributes) => {
  const isOwner = (attribute) => {
    return attribute.owner || !attribute.mappedBy && !attribute.morphBy;
  };
  const isComponentLike = (attribute) => {
    return attribute.component || attribute.components;
  };
  return Object.entries(attributes).filter(([, attribute]) => {
    return attribute.type === "relation" && isOwner(attribute) && !isComponentLike(attribute);
  }).reduce((acc, [key, attribute]) => ({ ...acc, [key]: attribute }), {});
};
const getLinkKind = (attribute, uid) => {
  if (attribute.relation.startsWith("morph")) {
    return "relation.morph";
  }
  if (attribute.target === uid) {
    return "relation.circular";
  }
  return "relation.basic";
};
const link = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createLinkQuery
}, Symbol.toStringTag, { value: "Module" }));
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  entity,
  link
}, Symbol.toStringTag, { value: "Module" }));
const createEntitiesWriteStream = (options) => {
  const { strapi: strapi2, updateMappingTable, transaction: transaction2 } = options;
  const query = createEntityQuery(strapi2);
  return new Writable({
    objectMode: true,
    async write(entity2, _encoding, callback) {
      await transaction2?.attach(async () => {
        const { type, id, data } = entity2;
        const { create, getDeepPopulateComponentLikeQuery } = query(type);
        const contentType = strapi2.getModel(type);
        try {
          const created = await create({
            data,
            populate: getDeepPopulateComponentLikeQuery(contentType, { select: "id" }),
            select: "id"
          });
          const diffs = diff(data, created);
          updateMappingTable(type, id, created.id);
          diffs.forEach((diff2) => {
            if (diff2.kind === "modified" && last(diff2.path) === "id") {
              const target = resolveComponentUID({ paths: diff2.path, data, contentType, strapi: strapi2 });
              if (!target) {
                return;
              }
              const [oldID, newID] = diff2.values;
              updateMappingTable(target, oldID, newID);
            }
          });
        } catch (e) {
          if (e instanceof Error) {
            return callback(e);
          }
          return callback(new ProviderTransferError(`Failed to create "${type}" (${id})`));
        }
        return callback(null);
      });
    }
  });
};
const omitInvalidCreationAttributes = omit(["id"]);
const restoreCoreStore = async (strapi2, values) => {
  const data = omitInvalidCreationAttributes(values);
  return strapi2.db.query("strapi::core-store").create({
    data: {
      ...data,
      value: JSON.stringify(data.value)
    }
  });
};
const restoreWebhooks = async (strapi2, values) => {
  const data = omitInvalidCreationAttributes(values);
  return strapi2.db.query("webhook").create({ data });
};
const restoreConfigs = async (strapi2, config) => {
  if (config.type === "core-store") {
    return restoreCoreStore(strapi2, config.value);
  }
  if (config.type === "webhook") {
    return restoreWebhooks(strapi2, config.value);
  }
};
const createConfigurationWriteStream = async (strapi2, transaction2) => {
  return new Writable({
    objectMode: true,
    async write(config, _encoding, callback) {
      await transaction2?.attach(async () => {
        try {
          await restoreConfigs(strapi2, config);
        } catch (error) {
          return callback(
            new ProviderTransferError(
              `Failed to import ${chalk.yellowBright(config.type)} (${chalk.greenBright(
                config.value.id
              )}`
            )
          );
        }
        callback();
      });
    }
  });
};
const isErrorWithCode = (error) => {
  return error && typeof error.code === "string";
};
const isForeignKeyConstraintError = (e) => {
  const MYSQL_FK_ERROR_CODES = ["1452", "1557", "1216", "1217", "1451"];
  const POSTGRES_FK_ERROR_CODE = "23503";
  const SQLITE_FK_ERROR_CODE = "SQLITE_CONSTRAINT_FOREIGNKEY";
  if (isErrorWithCode(e) && e.code) {
    return [SQLITE_FK_ERROR_CODE, POSTGRES_FK_ERROR_CODE, ...MYSQL_FK_ERROR_CODES].includes(e.code);
  }
  return e.message.toLowerCase().includes("foreign key constraint");
};
const createLinksWriteStream = (mapID, strapi2, transaction2, onWarning) => {
  return new Writable({
    objectMode: true,
    async write(link2, _encoding, callback) {
      await transaction2?.attach(async (trx) => {
        const { left, right } = link2;
        const query = createLinkQuery(strapi2, trx);
        const originalLeftRef = left.ref;
        const originalRightRef = right.ref;
        left.ref = mapID(left.type, originalLeftRef) ?? originalLeftRef;
        right.ref = mapID(right.type, originalRightRef) ?? originalRightRef;
        try {
          await query().insert(link2);
        } catch (e) {
          if (e instanceof Error) {
            if (isForeignKeyConstraintError(e)) {
              onWarning?.(
                `Skipping link ${left.type}:${originalLeftRef} -> ${right.type}:${originalRightRef} due to a foreign key constraint.`
              );
              return callback(null);
            }
            return callback(e);
          }
          return callback(
            new ProviderTransferError(
              `An error happened while trying to import a ${left.type} link.`
            )
          );
        }
        callback(null);
      });
    }
  });
};
const deleteRecords = async (strapi2, options) => {
  const entities = await deleteEntitiesRecords(strapi2, options);
  const configuration = await deleteConfigurationRecords(strapi2, options);
  return {
    count: entities.count + configuration.count,
    entities,
    configuration
  };
};
const deleteEntitiesRecords = async (strapi2, options = {}) => {
  const { entities } = options;
  const query = createEntityQuery(strapi2);
  const contentTypes2 = Object.values(
    strapi2.contentTypes
  );
  const contentTypesToClear = contentTypes2.filter((contentType) => {
    let removeThisContentType = true;
    if (entities?.include) {
      removeThisContentType = entities.include.includes(contentType.uid);
    }
    if (entities?.exclude && entities.exclude.includes(contentType.uid)) {
      removeThisContentType = false;
    }
    if (entities?.filters) {
      removeThisContentType = entities.filters.every((filter2) => filter2(contentType));
    }
    return removeThisContentType;
  });
  const [results, updateResults] = useResults(
    contentTypesToClear.map((contentType) => contentType.uid)
  );
  const deletePromises = contentTypesToClear.map(async (contentType) => {
    const result = await query(contentType.uid).deleteMany(entities?.params);
    if (result) {
      updateResults(result.count || 0, contentType.uid);
    }
  });
  await Promise.all(deletePromises);
  return results;
};
const deleteConfigurationRecords = async (strapi2, options = {}) => {
  const { coreStore = true, webhook = true } = options?.configuration ?? {};
  const models = [];
  if (coreStore) {
    models.push("strapi::core-store");
  }
  if (webhook) {
    models.push("webhook");
  }
  const [results, updateResults] = useResults(models);
  const deletePromises = models.map(async (uid) => {
    const result = await strapi2.db.query(uid).deleteMany({});
    if (result) {
      updateResults(result.count, uid);
    }
  });
  await Promise.all(deletePromises);
  return results;
};
const useResults = (keys) => {
  const results = {
    count: 0,
    aggregate: keys.reduce((acc, key) => ({ ...acc, [key]: { count: 0 } }), {})
  };
  const update = (count, key) => {
    if (key) {
      if (!(key in results.aggregate)) {
        throw new ProviderTransferError(`Unknown key "${key}" provided in results update`);
      }
      results.aggregate[key].count += count;
    }
    results.count += count;
  };
  return [results, update];
};
const assertValidStrapi = (strapi2, msg = "") => {
  if (!strapi2) {
    throw new ProviderInitializationError(`${msg}. Strapi instance not found.`);
  }
};
const VALID_CONFLICT_STRATEGIES = ["restore"];
const DEFAULT_CONFLICT_STRATEGY$1 = "restore";
class LocalStrapiDestinationProvider {
  name = "destination::local-strapi";
  type = "destination";
  options;
  strapi;
  transaction;
  uploadsBackupDirectoryName;
  onWarning;
  /**
   * The entities mapper is used to map old entities to their new IDs
   */
  #entitiesMapper;
  constructor(options) {
    this.options = options;
    this.#entitiesMapper = {};
    this.uploadsBackupDirectoryName = `uploads_backup_${Date.now()}`;
  }
  async bootstrap() {
    this.#validateOptions();
    this.strapi = await this.options.getStrapi();
    if (!this.strapi) {
      throw new ProviderInitializationError("Could not access local strapi");
    }
    this.transaction = createTransaction(this.strapi);
  }
  // TODO: either move this to restore strategy, or restore strategy should given access to these instead of repeating the logic possibly in a different way
  #areAssetsIncluded = () => {
    return this.options.restore?.assets;
  };
  #isContentTypeIncluded = (type) => {
    const notIncluded = this.options.restore?.entities?.include && !this.options.restore?.entities?.include?.includes(type);
    const excluded = this.options.restore?.entities?.exclude && this.options.restore?.entities.exclude.includes(type);
    return !excluded && !notIncluded;
  };
  async close() {
    const { autoDestroy } = this.options;
    this.transaction?.end();
    if (autoDestroy === void 0 || autoDestroy === true) {
      await this.strapi?.destroy();
    }
  }
  #validateOptions() {
    if (!VALID_CONFLICT_STRATEGIES.includes(this.options.strategy)) {
      throw new ProviderValidationError(`Invalid strategy ${this.options.strategy}`, {
        check: "strategy",
        strategy: this.options.strategy,
        validStrategies: VALID_CONFLICT_STRATEGIES
      });
    }
    if (this.options.strategy === "restore" && !this.options.restore) {
      throw new ProviderValidationError("Missing restore options");
    }
  }
  async #deleteFromRestoreOptions() {
    assertValidStrapi(this.strapi);
    if (!this.options.restore) {
      throw new ProviderValidationError("Missing restore options");
    }
    return deleteRecords(this.strapi, this.options.restore);
  }
  async #deleteAllAssets(trx) {
    assertValidStrapi(this.strapi);
    if (!this.#areAssetsIncluded()) {
      return;
    }
    const stream2 = this.strapi.db.queryBuilder("plugin::upload.file").select("*").transacting(trx).stream();
    for await (const file2 of stream2) {
      await this.strapi.plugin("upload").provider.delete(file2);
      if (file2.formats) {
        for (const fileFormat of Object.values(file2.formats)) {
          await this.strapi.plugin("upload").provider.delete(fileFormat);
        }
      }
    }
  }
  async rollback() {
    await this.transaction?.rollback();
  }
  async beforeTransfer() {
    if (!this.strapi) {
      throw new Error("Strapi instance not found");
    }
    await this.transaction?.attach(async (trx) => {
      try {
        if (this.options.strategy === "restore") {
          await this.#handleAssetsBackup();
          await this.#deleteAllAssets(trx);
          await this.#deleteFromRestoreOptions();
        }
      } catch (error) {
        throw new Error(`restore failed ${error}`);
      }
    });
  }
  getMetadata() {
    assertValidStrapi(this.strapi, "Not able to get Schemas");
    const strapiVersion = this.strapi.config.get("info.strapi");
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    return {
      createdAt,
      strapi: {
        version: strapiVersion
      }
    };
  }
  getSchemas() {
    assertValidStrapi(this.strapi, "Not able to get Schemas");
    const schemas = {
      ...this.strapi.contentTypes,
      ...this.strapi.components
    };
    return mapSchemasValues(schemas);
  }
  createEntitiesWriteStream() {
    assertValidStrapi(this.strapi, "Not able to import entities");
    const { strategy } = this.options;
    const updateMappingTable = (type, oldID, newID) => {
      if (!this.#entitiesMapper[type]) {
        this.#entitiesMapper[type] = {};
      }
      Object.assign(this.#entitiesMapper[type], { [oldID]: newID });
    };
    if (strategy === "restore") {
      return createEntitiesWriteStream({
        strapi: this.strapi,
        updateMappingTable,
        transaction: this.transaction
      });
    }
    throw new ProviderValidationError(`Invalid strategy ${this.options.strategy}`, {
      check: "strategy",
      strategy: this.options.strategy,
      validStrategies: VALID_CONFLICT_STRATEGIES
    });
  }
  async #handleAssetsBackup() {
    assertValidStrapi(this.strapi, "Not able to create the assets backup");
    if (!this.#areAssetsIncluded()) {
      return;
    }
    if (this.strapi.config.get("plugin.upload").provider === "local") {
      const assetsDirectory = path.join(this.strapi.dirs.static.public, "uploads");
      const backupDirectory = path.join(
        this.strapi.dirs.static.public,
        this.uploadsBackupDirectoryName
      );
      try {
        await fse.access(
          assetsDirectory,
          // eslint-disable-next-line no-bitwise
          fse.constants.W_OK | fse.constants.R_OK | fse.constants.F_OK
        );
        await fse.access(path.join(assetsDirectory, ".."), fse.constants.W_OK | fse.constants.R_OK);
        await fse.move(assetsDirectory, backupDirectory);
        await fse.mkdir(assetsDirectory);
        await fse.outputFile(path.join(assetsDirectory, ".gitkeep"), "");
      } catch (err) {
        throw new ProviderTransferError(
          "The backup folder for the assets could not be created inside the public folder. Please ensure Strapi has write permissions on the public directory",
          {
            code: "ASSETS_DIRECTORY_ERR"
          }
        );
      }
      return backupDirectory;
    }
  }
  async #removeAssetsBackup() {
    assertValidStrapi(this.strapi, "Not able to remove Assets");
    if (!this.#areAssetsIncluded()) {
      return;
    }
    if (this.strapi.config.get("plugin.upload").provider === "local") {
      assertValidStrapi(this.strapi);
      const backupDirectory = path.join(
        this.strapi.dirs.static.public,
        this.uploadsBackupDirectoryName
      );
      await fse.rm(backupDirectory, { recursive: true, force: true });
    }
  }
  // TODO: Move this logic to the restore strategy
  async createAssetsWriteStream() {
    assertValidStrapi(this.strapi, "Not able to stream Assets");
    if (!this.#areAssetsIncluded()) {
      throw new ProviderTransferError(
        "Attempting to transfer assets when `assets` is not set in restore options"
      );
    }
    const removeAssetsBackup = this.#removeAssetsBackup.bind(this);
    const strapi2 = this.strapi;
    const transaction2 = this.transaction;
    const backupDirectory = this.uploadsBackupDirectoryName;
    const fileEntitiesMapper = this.#entitiesMapper["plugin::upload.file"];
    const restoreMediaEntitiesContent = this.#isContentTypeIncluded("plugin::upload.file");
    return new Writable({
      objectMode: true,
      async final(next) {
        await removeAssetsBackup();
        next();
      },
      async write(chunk, _encoding, callback) {
        await transaction2?.attach(async () => {
          if (!chunk.metadata) {
            const assetsDirectory = path.join(strapi2.dirs.static.public, "uploads");
            const entryPath = path.join(assetsDirectory, chunk.filename);
            const writableStream = fse.createWriteStream(entryPath);
            chunk.stream.pipe(writableStream).on("close", () => {
              callback(null);
            }).on("error", async (error) => {
              const errorMessage = error.code === "ENOSPC" ? " Your server doesn't have space to proceed with the import. " : " ";
              try {
                await fse.rm(assetsDirectory, { recursive: true, force: true });
                this.destroy(
                  new ProviderTransferError(
                    `There was an error during the transfer process.${errorMessage}The original files have been restored to ${assetsDirectory}`
                  )
                );
              } catch (err) {
                throw new ProviderTransferError(
                  `There was an error doing the rollback process. The original files are in ${backupDirectory}, but we failed to restore them to ${assetsDirectory}`
                );
              } finally {
                callback(error);
              }
            });
            return;
          }
          const uploadData = {
            ...chunk.metadata,
            stream: Readable.from(chunk.stream),
            buffer: chunk?.buffer
          };
          const provider = strapi2.config.get("plugin.upload").provider;
          try {
            await strapi2.plugin("upload").provider.uploadStream(uploadData);
            if (!restoreMediaEntitiesContent) {
              return callback();
            }
            if (uploadData?.type) {
              const condition = uploadData?.id ? { id: fileEntitiesMapper[uploadData.id] } : { hash: uploadData.mainHash };
              const entry2 = await strapi2.db.query("plugin::upload.file").findOne({
                where: condition
              });
              const specificFormat = entry2?.formats?.[uploadData.type];
              if (specificFormat) {
                specificFormat.url = uploadData.url;
              }
              await strapi2.db.query("plugin::upload.file").update({
                where: { id: entry2.id },
                data: {
                  formats: entry2.formats,
                  provider
                }
              });
              return callback();
            }
            const entry = await strapi2.db.query("plugin::upload.file").findOne({
              where: { id: fileEntitiesMapper[uploadData.id] }
            });
            entry.url = uploadData.url;
            await strapi2.db.query("plugin::upload.file").update({
              where: { id: entry.id },
              data: {
                url: entry.url,
                provider
              }
            });
            callback();
          } catch (error) {
            callback(new Error(`Error while uploading asset ${chunk.filename} ${error}`));
          }
        });
      }
    });
  }
  async createConfigurationWriteStream() {
    assertValidStrapi(this.strapi, "Not able to stream Configurations");
    const { strategy } = this.options;
    if (strategy === "restore") {
      return createConfigurationWriteStream(this.strapi, this.transaction);
    }
    throw new ProviderValidationError(`Invalid strategy ${strategy}`, {
      check: "strategy",
      strategy,
      validStrategies: VALID_CONFLICT_STRATEGIES
    });
  }
  async createLinksWriteStream() {
    if (!this.strapi) {
      throw new Error("Not able to stream links. Strapi instance not found");
    }
    const { strategy } = this.options;
    const mapID = (uid, id) => this.#entitiesMapper[uid]?.[id];
    if (strategy === "restore") {
      return createLinksWriteStream(mapID, this.strapi, this.transaction, this.onWarning);
    }
    throw new ProviderValidationError(`Invalid strategy ${strategy}`, {
      check: "strategy",
      strategy,
      validStrategies: VALID_CONFLICT_STRATEGIES
    });
  }
}
const createLocalStrapiDestinationProvider$2 = (options) => {
  return new LocalStrapiDestinationProvider(options);
};
const createEntitiesStream = (strapi2) => {
  const contentTypes2 = Object.values(strapi2.contentTypes);
  async function* contentTypeStreamGenerator() {
    for (const contentType of contentTypes2) {
      const query = createEntityQuery(strapi2).call(null, contentType.uid);
      const stream2 = strapi2.db.queryBuilder(contentType.uid).select("*").populate(query.deepPopulateComponentLikeQuery).stream();
      yield { contentType, stream: stream2 };
    }
  }
  return Readable.from(
    async function* entitiesGenerator() {
      for await (const { stream: stream2, contentType } of contentTypeStreamGenerator()) {
        try {
          for await (const entity2 of stream2) {
            yield { entity: entity2, contentType };
          }
        } catch {
        } finally {
          stream2.destroy();
        }
      }
    }()
  );
};
const createEntitiesTransformStream = () => {
  return new Transform({
    objectMode: true,
    transform(data, _encoding, callback) {
      const { entity: entity2, contentType } = data;
      const { id, ...attributes } = entity2;
      callback(null, {
        type: contentType.uid,
        id,
        data: attributes
      });
    }
  });
};
const createLinksStream = (strapi2) => {
  const uids = [...Object.keys(strapi2.contentTypes), ...Object.keys(strapi2.components)];
  return Readable.from(
    async function* linkGenerator() {
      const query = createLinkQuery(strapi2);
      for (const uid of uids) {
        const generator = query().generateAll(uid);
        for await (const link2 of generator) {
          yield link2;
        }
      }
    }()
  );
};
const createConfigurationStream = (strapi2) => {
  return Readable.from(
    async function* configurationGenerator() {
      const coreStoreStream = chain([
        strapi2.db.queryBuilder("strapi::core-store").stream(),
        (data) => set("value", JSON.parse(data.value), data),
        wrapConfigurationItem("core-store")
      ]);
      const webhooksStream = chain([
        strapi2.db.queryBuilder("webhook").stream(),
        wrapConfigurationItem("webhook")
      ]);
      const streams = [coreStoreStream, webhooksStream];
      for (const stream2 of streams) {
        for await (const item of stream2) {
          yield item;
        }
      }
    }()
  );
};
const wrapConfigurationItem = (type) => (value) => ({
  type,
  value
});
const protocolForPath = (filepath) => {
  return filepath?.startsWith("https") ? https : http;
};
function getFileStream(filepath, isLocal = false) {
  if (isLocal) {
    return createReadStream(filepath);
  }
  const readableStream = new PassThrough();
  protocolForPath(filepath).get(filepath, (res) => {
    if (res.statusCode !== 200) {
      readableStream.emit(
        "error",
        new Error(`Request failed with status code ${res.statusCode}`)
      );
      return;
    }
    res.pipe(readableStream);
  }).on("error", (error) => {
    readableStream.emit("error", error);
  });
  return readableStream;
}
function getFileStats(filepath, isLocal = false) {
  if (isLocal) {
    return stat(filepath);
  }
  return new Promise((resolve, reject2) => {
    protocolForPath(filepath).get(filepath, (res) => {
      if (res.statusCode !== 200) {
        reject2(new Error(`Request failed with status code ${res.statusCode}`));
        return;
      }
      const contentLength = res.headers["content-length"];
      const stats = {
        size: contentLength ? parseInt(contentLength, 10) : 0
      };
      resolve(stats);
    }).on("error", (error) => {
      reject2(error);
    });
  });
}
async function signFile(file2) {
  const { provider } = strapi.plugins.upload;
  const { provider: providerName } = strapi.config.get("plugin.upload");
  const isPrivate = await provider.isPrivate();
  if (file2?.provider === providerName && isPrivate) {
    const signUrl = async (file22) => {
      const signedUrl = await provider.getSignedUrl(file22);
      file22.url = signedUrl.url;
    };
    await signUrl(file2);
    if (file2.formats) {
      for (const format of Object.keys(file2.formats)) {
        await signUrl(file2.formats[format]);
      }
    }
  }
}
const createAssetsStream = (strapi2) => {
  const generator = async function* () {
    const stream2 = strapi2.db.queryBuilder("plugin::upload.file").select("*").stream();
    for await (const file2 of stream2) {
      const isLocalProvider = file2.provider === "local";
      if (!isLocalProvider) {
        await signFile(file2);
      }
      const filepath = isLocalProvider ? join(strapi2.dirs.static.public, file2.url) : file2.url;
      const stats = await getFileStats(filepath, isLocalProvider);
      const stream22 = getFileStream(filepath, isLocalProvider);
      yield {
        metadata: file2,
        filepath,
        filename: file2.hash + file2.ext,
        stream: stream22,
        stats: { size: stats.size }
      };
      if (file2.formats) {
        for (const format of Object.keys(file2.formats)) {
          const fileFormat = file2.formats[format];
          const fileFormatFilepath = isLocalProvider ? join(strapi2.dirs.static.public, fileFormat.url) : fileFormat.url;
          const fileFormatStats = await getFileStats(fileFormatFilepath, isLocalProvider);
          const fileFormatStream = getFileStream(fileFormatFilepath, isLocalProvider);
          const metadata = { ...fileFormat, type: format, id: file2.id, mainHash: file2.hash };
          yield {
            metadata,
            filepath: fileFormatFilepath,
            filename: fileFormat.hash + fileFormat.ext,
            stream: fileFormatStream,
            stats: { size: fileFormatStats.size }
          };
        }
      }
    }
  };
  return Duplex.from(generator());
};
const createLocalStrapiSourceProvider$2 = (options) => {
  return new LocalStrapiSourceProvider(options);
};
class LocalStrapiSourceProvider {
  name = "source::local-strapi";
  type = "source";
  options;
  strapi;
  constructor(options) {
    this.options = options;
  }
  async bootstrap() {
    this.strapi = await this.options.getStrapi();
  }
  async close() {
    const { autoDestroy } = this.options;
    if (autoDestroy === void 0 || autoDestroy === true) {
      await this.strapi?.destroy();
    }
  }
  getMetadata() {
    const strapiVersion = strapi.config.get("info.strapi");
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    return {
      createdAt,
      strapi: {
        version: strapiVersion
      }
    };
  }
  async createEntitiesReadStream() {
    assertValidStrapi(this.strapi, "Not able to stream entities");
    return chain([
      // Entities stream
      createEntitiesStream(this.strapi),
      // Transform stream
      createEntitiesTransformStream()
    ]);
  }
  createLinksReadStream() {
    assertValidStrapi(this.strapi, "Not able to stream links");
    return createLinksStream(this.strapi);
  }
  createConfigurationReadStream() {
    assertValidStrapi(this.strapi, "Not able to stream configuration");
    return createConfigurationStream(this.strapi);
  }
  getSchemas() {
    assertValidStrapi(this.strapi, "Not able to get Schemas");
    const schemas = {
      ...this.strapi.contentTypes,
      ...this.strapi.components
    };
    return mapSchemasValues(schemas);
  }
  createSchemasReadStream() {
    return Readable.from(Object.values(this.getSchemas()));
  }
  createAssetsReadStream() {
    assertValidStrapi(this.strapi, "Not able to stream assets");
    return createAssetsStream(this.strapi);
  }
}
const createDispatcher = (ws, retryMessageOptions = {
  retryMessageMaxRetries: 5,
  retryMessageTimeout: 3e4
}) => {
  const state = {};
  const dispatch = async (message, options = {}) => {
    if (!ws) {
      throw new Error("No websocket connection found");
    }
    return new Promise((resolve, reject2) => {
      const uuid = randomUUID();
      const payload = { ...message, uuid };
      let numberOfTimesMessageWasSent = 0;
      if (options.attachTransfer) {
        Object.assign(payload, { transferID: state.transfer?.id });
      }
      const stringifiedPayload = JSON.stringify(payload);
      ws.send(stringifiedPayload, (error) => {
        if (error) {
          reject2(error);
        }
      });
      const { retryMessageMaxRetries, retryMessageTimeout } = retryMessageOptions;
      const sendPeriodically = () => {
        if (numberOfTimesMessageWasSent <= retryMessageMaxRetries) {
          numberOfTimesMessageWasSent += 1;
          ws.send(stringifiedPayload, (error) => {
            if (error) {
              reject2(error);
            }
          });
        } else {
          reject2(new ProviderError("error", "Request timed out"));
        }
      };
      const interval = setInterval(sendPeriodically, retryMessageTimeout);
      const onResponse = (raw) => {
        const response = JSON.parse(raw.toString());
        if (response.uuid === uuid) {
          clearInterval(interval);
          if (response.error) {
            const message2 = response.error.message;
            const details = response.error.details?.details;
            const step = response.error.details?.step;
            let error = new ProviderError("error", message2, details);
            if (step === "transfer") {
              error = new ProviderTransferError(message2, details);
            } else if (step === "validation") {
              error = new ProviderValidationError(message2, details);
            } else if (step === "initialization") {
              error = new ProviderInitializationError(message2);
            }
            return reject2(error);
          }
          resolve(response.data ?? null);
        } else {
          ws.once("message", onResponse);
        }
      };
      ws.once("message", onResponse);
    });
  };
  const dispatchCommand = (payload) => {
    return dispatch({ type: "command", ...payload });
  };
  const dispatchTransferAction = async (action2) => {
    const payload = { type: "transfer", kind: "action", action: action2 };
    return dispatch(payload, { attachTransfer: true }) ?? Promise.resolve(null);
  };
  const dispatchTransferStep = async (payload) => {
    const message = {
      type: "transfer",
      kind: "step",
      ...payload
    };
    return dispatch(message, { attachTransfer: true }) ?? Promise.resolve(null);
  };
  const setTransferProperties = (properties) => {
    state.transfer = { ...properties };
  };
  return {
    get transferID() {
      return state.transfer?.id;
    },
    get transferKind() {
      return state.transfer?.kind;
    },
    setTransferProperties,
    dispatch,
    dispatchCommand,
    dispatchTransferAction,
    dispatchTransferStep
  };
};
const connectToWebsocket = (address, options) => {
  return new Promise((resolve, reject2) => {
    const server = new WebSocket(address, options);
    server.once("open", () => {
      resolve(server);
    });
    server.on("unexpected-response", (_req, res) => {
      if (res.statusCode === 401) {
        return reject2(
          new ProviderInitializationError(
            "Failed to initialize the connection: Authentication Error"
          )
        );
      }
      if (res.statusCode === 403) {
        return reject2(
          new ProviderInitializationError(
            "Failed to initialize the connection: Authorization Error"
          )
        );
      }
      if (res.statusCode === 404) {
        return reject2(
          new ProviderInitializationError(
            "Failed to initialize the connection: Data transfer is not enabled on the remote host"
          )
        );
      }
      return reject2(
        new ProviderInitializationError(
          `Failed to initialize the connection: Unexpected server response ${res.statusCode}`
        )
      );
    });
    server.once("error", (err) => {
      reject2(
        new ProviderTransferError(err.message, {
          details: {
            error: err.message
          }
        })
      );
    });
  });
};
const trimTrailingSlash = (input) => {
  return input.replace(/\/$/, "");
};
const TRANSFER_PATH = "/transfer/runner";
const TRANSFER_METHODS = ["push", "pull"];
const constants = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  TRANSFER_METHODS,
  TRANSFER_PATH
}, Symbol.toStringTag, { value: "Module" }));
const jsonLength = (obj) => Buffer.byteLength(JSON.stringify(obj));
class RemoteStrapiDestinationProvider {
  name = "destination::remote-strapi";
  type = "destination";
  options;
  ws;
  dispatcher;
  transferID;
  constructor(options) {
    this.options = options;
    this.ws = null;
    this.dispatcher = null;
    this.transferID = null;
  }
  async initTransfer() {
    const { strategy, restore } = this.options;
    const query = this.dispatcher?.dispatchCommand({
      command: "init",
      params: { options: { strategy, restore }, transfer: "push" }
    });
    const res = await query;
    if (!res?.transferID) {
      throw new ProviderTransferError("Init failed, invalid response from the server");
    }
    return res.transferID;
  }
  #startStepOnce(stage) {
    return once(() => this.#startStep(stage));
  }
  async #startStep(step) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: "start", step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      if (typeof e === "string") {
        return new ProviderTransferError(e);
      }
      return new ProviderTransferError("Unexpected error");
    }
    return null;
  }
  async #endStep(step) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: "end", step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      if (typeof e === "string") {
        return new ProviderTransferError(e);
      }
      return new ProviderTransferError("Unexpected error");
    }
    return null;
  }
  async #streamStep(step, data) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: "stream", step, data });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      if (typeof e === "string") {
        return new ProviderTransferError(e);
      }
      return new ProviderTransferError("Unexpected error");
    }
    return null;
  }
  #writeStream(step) {
    const batchSize = 1024 * 1024;
    const startTransferOnce = this.#startStepOnce(step);
    let batch = [];
    const batchLength = () => jsonLength(batch);
    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (batch.length > 0) {
          const streamError = await this.#streamStep(step, batch);
          batch = [];
          if (streamError) {
            return callback(streamError);
          }
        }
        const e = await this.#endStep(step);
        callback(e);
      },
      write: async (chunk, _encoding, callback) => {
        const startError = await startTransferOnce();
        if (startError) {
          return callback(startError);
        }
        batch.push(chunk);
        if (batchLength() >= batchSize) {
          const streamError = await this.#streamStep(step, batch);
          batch = [];
          if (streamError) {
            return callback(streamError);
          }
        }
        callback();
      }
    });
  }
  async bootstrap() {
    const { url, auth } = this.options;
    const validProtocols = ["https:", "http:"];
    let ws;
    if (!validProtocols.includes(url.protocol)) {
      throw new ProviderValidationError(`Invalid protocol "${url.protocol}"`, {
        check: "url",
        details: {
          protocol: url.protocol,
          validProtocols
        }
      });
    }
    const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${url.host}${trimTrailingSlash(
      url.pathname
    )}${TRANSFER_PATH}/push`;
    if (!auth) {
      ws = await connectToWebsocket(wsUrl);
    } else if (auth.type === "token") {
      const headers = { Authorization: `Bearer ${auth.token}` };
      ws = await connectToWebsocket(wsUrl, { headers });
    } else {
      throw new ProviderValidationError("Auth method not available", {
        check: "auth.type",
        details: {
          auth: auth.type
        }
      });
    }
    this.ws = ws;
    const { retryMessageOptions } = this.options;
    this.dispatcher = createDispatcher(this.ws, retryMessageOptions);
    this.transferID = await this.initTransfer();
    this.dispatcher.setTransferProperties({ id: this.transferID, kind: "push" });
    await this.dispatcher.dispatchTransferAction("bootstrap");
  }
  async close() {
    if (this.transferID && this.dispatcher) {
      await this.dispatcher.dispatchTransferAction("close");
      await this.dispatcher.dispatchCommand({
        command: "end",
        params: { transferID: this.transferID }
      });
    }
    await new Promise((resolve) => {
      const { ws } = this;
      if (!ws || ws.CLOSED) {
        resolve();
        return;
      }
      ws.on("close", () => resolve()).close();
    });
  }
  getMetadata() {
    return this.dispatcher?.dispatchTransferAction("getMetadata") ?? null;
  }
  async beforeTransfer() {
    await this.dispatcher?.dispatchTransferAction("beforeTransfer");
  }
  async rollback() {
    await this.dispatcher?.dispatchTransferAction("rollback");
  }
  getSchemas() {
    if (!this.dispatcher) {
      return Promise.resolve(null);
    }
    return this.dispatcher.dispatchTransferAction("getSchemas");
  }
  createEntitiesWriteStream() {
    return this.#writeStream("entities");
  }
  createLinksWriteStream() {
    return this.#writeStream("links");
  }
  createConfigurationWriteStream() {
    return this.#writeStream("configuration");
  }
  createAssetsWriteStream() {
    let batch = [];
    let hasStarted = false;
    const batchSize = 1024 * 1024;
    const batchLength = () => {
      return batch.reduce(
        (acc, chunk) => chunk.action === "stream" ? acc + chunk.data.byteLength : acc,
        0
      );
    };
    const startAssetsTransferOnce = this.#startStepOnce("assets");
    const flush = async () => {
      const streamError = await this.#streamStep("assets", batch);
      batch = [];
      return streamError;
    };
    const safePush = async (chunk) => {
      batch.push(chunk);
      if (batchLength() >= batchSize) {
        const streamError = await flush();
        if (streamError) {
          throw streamError;
        }
      }
    };
    return new Writable({
      objectMode: true,
      final: async (callback) => {
        if (batch.length > 0) {
          await flush();
        }
        if (hasStarted) {
          const endStepError = await this.#endStep("assets");
          if (endStepError) {
            return callback(endStepError);
          }
        }
        return callback(null);
      },
      async write(asset, _encoding, callback) {
        const startError = await startAssetsTransferOnce();
        if (startError) {
          return callback(startError);
        }
        hasStarted = true;
        const assetID = randomUUID();
        const { filename, filepath, stats, stream: stream2, metadata } = asset;
        try {
          await safePush({
            action: "start",
            assetID,
            data: { filename, filepath, stats, metadata }
          });
          for await (const chunk of stream2) {
            await safePush({ action: "stream", assetID, data: chunk });
          }
          await safePush({ action: "end", assetID });
          callback();
        } catch (error) {
          if (error instanceof Error) {
            callback(error);
          }
        }
      }
    });
  }
}
const createRemoteStrapiDestinationProvider$1 = (options) => {
  return new RemoteStrapiDestinationProvider(options);
};
class RemoteStrapiSourceProvider {
  name = "source::remote-strapi";
  type = "source";
  options;
  ws;
  dispatcher;
  constructor(options) {
    this.options = options;
    this.ws = null;
    this.dispatcher = null;
  }
  results;
  async #createStageReadStream(stage) {
    const startResult = await this.#startStep(stage);
    if (startResult instanceof Error) {
      throw startResult;
    }
    const { id: processID } = startResult;
    const stream2 = new PassThrough({ objectMode: true });
    const listener = async (raw) => {
      const parsed = JSON.parse(raw.toString());
      if (!parsed.uuid || parsed?.data?.type !== "transfer" || parsed?.data?.id !== processID) {
        this.ws?.once("message", listener);
        return;
      }
      const { uuid, data: message } = parsed;
      const { ended, error, data } = message;
      if (error) {
        await this.#respond(uuid);
        stream2.destroy(error);
        return;
      }
      if (ended) {
        await this.#respond(uuid);
        await this.#endStep(stage);
        stream2.end();
        return;
      }
      for (const item of castArray(data)) {
        stream2.push(item);
      }
      this.ws?.once("message", listener);
      await this.#respond(uuid);
    };
    this.ws?.once("message", listener);
    return stream2;
  }
  createEntitiesReadStream() {
    return this.#createStageReadStream("entities");
  }
  createLinksReadStream() {
    return this.#createStageReadStream("links");
  }
  writeAsync = (stream2, data) => {
    return new Promise((resolve, reject2) => {
      stream2.write(data, (error) => {
        if (error) {
          reject2(error);
        }
        resolve();
      });
    });
  };
  async createAssetsReadStream() {
    const assets = {};
    const stream2 = await this.#createStageReadStream("assets");
    const pass = new PassThrough({ objectMode: true });
    stream2.on("data", async (payload) => {
      for (const item of payload) {
        const { action: action2 } = item;
        if (action2 === "start") {
          assets[item.assetID] = { ...item.data, stream: new PassThrough() };
          await this.writeAsync(pass, assets[item.assetID]);
        } else if (action2 === "stream") {
          const rawBuffer = item.data;
          const chunk = Buffer.from(rawBuffer.data);
          await this.writeAsync(assets[item.assetID].stream, chunk);
        } else if (action2 === "end") {
          await new Promise((resolve, reject2) => {
            const { stream: assetStream } = assets[item.assetID];
            assetStream.on("close", () => {
              delete assets[item.assetID];
              resolve();
            }).on("error", reject2).end();
          });
        }
      }
    }).on("close", () => {
      pass.end();
    });
    return pass;
  }
  createConfigurationReadStream() {
    return this.#createStageReadStream("configuration");
  }
  async getMetadata() {
    const metadata = await this.dispatcher?.dispatchTransferAction("getMetadata");
    return metadata ?? null;
  }
  assertValidProtocol(url) {
    const validProtocols = ["https:", "http:"];
    if (!validProtocols.includes(url.protocol)) {
      throw new ProviderValidationError(`Invalid protocol "${url.protocol}"`, {
        check: "url",
        details: {
          protocol: url.protocol,
          validProtocols
        }
      });
    }
  }
  async initTransfer() {
    const query = this.dispatcher?.dispatchCommand({
      command: "init"
    });
    const res = await query;
    if (!res?.transferID) {
      throw new ProviderTransferError("Init failed, invalid response from the server");
    }
    return res.transferID;
  }
  async bootstrap() {
    const { url, auth } = this.options;
    let ws;
    this.assertValidProtocol(url);
    const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${url.host}${trimTrailingSlash(
      url.pathname
    )}${TRANSFER_PATH}/pull`;
    if (!auth) {
      ws = await connectToWebsocket(wsUrl);
    } else if (auth.type === "token") {
      const headers = { Authorization: `Bearer ${auth.token}` };
      ws = await connectToWebsocket(wsUrl, { headers });
    } else {
      throw new ProviderValidationError("Auth method not available", {
        check: "auth.type",
        details: {
          auth: auth.type
        }
      });
    }
    this.ws = ws;
    const { retryMessageOptions } = this.options;
    this.dispatcher = createDispatcher(this.ws, retryMessageOptions);
    const transferID = await this.initTransfer();
    this.dispatcher.setTransferProperties({ id: transferID, kind: "pull" });
    await this.dispatcher.dispatchTransferAction("bootstrap");
  }
  async close() {
    await this.dispatcher?.dispatchTransferAction("close");
    await new Promise((resolve) => {
      const { ws } = this;
      if (!ws || ws.CLOSED) {
        resolve();
        return;
      }
      ws.on("close", () => resolve()).close();
    });
  }
  async getSchemas() {
    const schemas = await this.dispatcher?.dispatchTransferAction(
      "getSchemas"
    ) ?? null;
    return schemas;
  }
  async #startStep(step) {
    try {
      return await this.dispatcher?.dispatchTransferStep({ action: "start", step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      if (typeof e === "string") {
        return new ProviderTransferError(e);
      }
      return new ProviderTransferError("Unexpected error");
    }
  }
  async #respond(uuid) {
    return new Promise((resolve, reject2) => {
      this.ws?.send(JSON.stringify({ uuid }), (e) => {
        if (e) {
          reject2(e);
        } else {
          resolve(e);
        }
      });
    });
  }
  async #endStep(step) {
    try {
      await this.dispatcher?.dispatchTransferStep({ action: "end", step });
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      if (typeof e === "string") {
        return new ProviderTransferError(e);
      }
      return new ProviderTransferError("Unexpected error");
    }
    return null;
  }
}
const createRemoteStrapiSourceProvider$1 = (options) => {
  return new RemoteStrapiSourceProvider(options);
};
const index$4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_CONFLICT_STRATEGY: DEFAULT_CONFLICT_STRATEGY$1,
  VALID_CONFLICT_STRATEGIES,
  createLocalStrapiDestinationProvider: createLocalStrapiDestinationProvider$2,
  createLocalStrapiSourceProvider: createLocalStrapiSourceProvider$2,
  createRemoteStrapiDestinationProvider: createRemoteStrapiDestinationProvider$1,
  createRemoteStrapiSourceProvider: createRemoteStrapiSourceProvider$1
}, Symbol.toStringTag, { value: "Module" }));
const DEFAULT_TRANSFER_FLOW = [
  {
    kind: "action",
    action: "bootstrap"
  },
  {
    kind: "action",
    action: "init"
  },
  {
    kind: "action",
    action: "beforeTransfer"
  },
  {
    kind: "transfer",
    stage: "schemas"
  },
  {
    kind: "transfer",
    stage: "entities"
  },
  {
    kind: "transfer",
    stage: "assets"
  },
  {
    kind: "transfer",
    stage: "links"
  },
  {
    kind: "transfer",
    stage: "configuration"
  },
  {
    kind: "action",
    action: "close"
  }
];
const createFlow = (flow) => {
  const state = { step: null };
  const stepEqual = (stepA, stepB) => {
    if (stepA.kind === "action" && stepB.kind === "action") {
      return stepA.action === stepB.action;
    }
    if (stepA.kind === "transfer" && stepB.kind === "transfer") {
      return stepA.stage === stepB.stage;
    }
    return false;
  };
  const findStepIndex = (step) => flow.findIndex((flowStep) => stepEqual(step, flowStep));
  return {
    has(step) {
      return findStepIndex(step) !== -1;
    },
    can(step) {
      if (state.step === null) {
        return true;
      }
      const indexesDifference = findStepIndex(step) - findStepIndex(state.step);
      if (indexesDifference === 0 && step.kind === "transfer") {
        return true;
      }
      return indexesDifference > 0;
    },
    cannot(step) {
      return !this.can(step);
    },
    set(step) {
      const canSwitch = this.can(step);
      if (!canSwitch) {
        throw new Error("Impossible to proceed to the given step");
      }
      state.step = step;
      return this;
    },
    get() {
      return state.step;
    }
  };
};
const VALID_TRANSFER_COMMANDS = ["init", "end", "status"];
const transformUpgradeHeader = (header = "") => {
  return header.split(",").map((s) => s.trim().toLowerCase());
};
let timeouts;
const hasHttpServer = () => {
  return typeof strapi !== "undefined" && !!strapi?.server?.httpServer;
};
const disableTimeouts = () => {
  if (!hasHttpServer()) {
    return;
  }
  const { httpServer } = strapi.server;
  if (!timeouts) {
    timeouts = {
      headersTimeout: httpServer.headersTimeout,
      requestTimeout: httpServer.requestTimeout
    };
  }
  httpServer.headersTimeout = 0;
  httpServer.requestTimeout = 0;
  strapi.log.info("[Data transfer] Disabling http timeouts");
};
const resetTimeouts = () => {
  if (!hasHttpServer() || !timeouts) {
    return;
  }
  const { httpServer } = strapi.server;
  strapi.log.info("[Data transfer] Restoring http timeouts");
  httpServer.headersTimeout = timeouts.headersTimeout;
  httpServer.requestTimeout = timeouts.requestTimeout;
};
const assertValidHeader = (ctx) => {
  if (ctx.headers.upgrade === "websocket") {
    return;
  }
  const upgradeHeader = transformUpgradeHeader(ctx.headers.upgrade);
  const logSafeUpgradeHeader = JSON.stringify(ctx.headers.upgrade)?.replace(/[^a-z0-9\s.,|]/gi, "").substring(0, 50);
  if (!upgradeHeader.includes("websocket")) {
    throw new Error(
      `Transfer Upgrade header expected 'websocket', found '${logSafeUpgradeHeader}'. Please ensure that your server or proxy is not modifying the Upgrade header.`
    );
  }
  strapi.log.info(
    `Transfer Upgrade header expected only 'websocket', found unexpected values: ${logSafeUpgradeHeader}`
  );
};
const isDataTransferMessage = (message) => {
  if (!message || typeof message !== "object") {
    return false;
  }
  const { uuid, type } = message;
  if (typeof uuid !== "string" || typeof type !== "string") {
    return false;
  }
  if (!["command", "transfer"].includes(type)) {
    return false;
  }
  return true;
};
const handleWSUpgrade = (wss, ctx, callback) => {
  assertValidHeader(ctx);
  wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), (client, request) => {
    if (!client) {
      ctx.request.socket.destroy();
      return;
    }
    disableTimeouts();
    wss.emit("connection", client, ctx.req);
    callback(client, request);
  });
  ctx.respond = false;
};
const handlerControllerFactory = (implementation) => (options) => {
  const { verify, server: serverOptions } = options ?? {};
  const wss = new WebSocket.Server({ ...serverOptions, noServer: true });
  return async (ctx) => {
    const cb = (ws) => {
      const state = { id: void 0 };
      const messageUUIDs = /* @__PURE__ */ new Set();
      const cannotRespondHandler = (err) => {
        strapi?.log?.error(
          "[Data transfer] Cannot send error response to client, closing connection"
        );
        strapi?.log?.error(err);
        try {
          ws.terminate();
          ctx.req.socket.destroy();
        } catch (err2) {
          strapi?.log?.error("[Data transfer] Failed to close socket on error");
        }
      };
      const prototype = {
        // Transfer ID
        get transferID() {
          return state.id;
        },
        set transferID(id) {
          state.id = id;
        },
        // Started at
        get startedAt() {
          return state.startedAt;
        },
        set startedAt(timestamp) {
          state.startedAt = timestamp;
        },
        get response() {
          return state.response;
        },
        set response(response) {
          state.response = response;
        },
        addUUID(uuid) {
          messageUUIDs.add(uuid);
        },
        hasUUID(uuid) {
          return messageUUIDs.has(uuid);
        },
        isTransferStarted() {
          return this.transferID !== void 0 && this.startedAt !== void 0;
        },
        assertValidTransfer() {
          const isStarted = this.isTransferStarted();
          if (!isStarted) {
            throw new Error("Invalid Transfer Process");
          }
        },
        assertValidTransferCommand(command2) {
          const isDefined = typeof this[command2] === "function";
          const isValidTransferCommand = VALID_TRANSFER_COMMANDS.includes(command2);
          if (!isDefined || !isValidTransferCommand) {
            throw new Error("Invalid transfer command");
          }
        },
        async respond(uuid, e, data) {
          let details = {};
          return new Promise((resolve, reject2) => {
            if (!uuid && !e) {
              reject2(new Error("Missing uuid for this message"));
              return;
            }
            this.response = {
              uuid,
              data,
              e
            };
            if (e instanceof ProviderError) {
              details = e.details;
            }
            const payload = JSON.stringify({
              uuid,
              data: data ?? null,
              error: e ? {
                code: e?.name ?? "ERR",
                message: e?.message,
                details
              } : null
            });
            this.send(payload, (error) => error ? reject2(error) : resolve());
          });
        },
        send(message, cb2) {
          ws.send(message, cb2);
        },
        confirm(message) {
          return new Promise((resolve, reject2) => {
            const uuid = randomUUID();
            const payload = JSON.stringify({ uuid, data: message });
            this.send(payload, (error) => {
              if (error) {
                reject2(error);
              }
            });
            const onResponse = (raw) => {
              const response = JSON.parse(raw.toString());
              if (response.uuid === uuid) {
                resolve(response.data ?? null);
              } else {
                ws.once("message", onResponse);
              }
            };
            ws.once("message", onResponse);
          });
        },
        async executeAndRespond(uuid, fn) {
          try {
            const response = await fn();
            await this.respond(uuid, null, response);
          } catch (e) {
            if (e instanceof Error) {
              await this.respond(uuid, e).catch(cannotRespondHandler);
            } else if (typeof e === "string") {
              await this.respond(uuid, new ProviderTransferError(e)).catch(cannotRespondHandler);
            } else {
              await this.respond(
                uuid,
                new ProviderTransferError("Unexpected error", {
                  error: e
                })
              ).catch(cannotRespondHandler);
            }
          }
        },
        cleanup() {
          this.transferID = void 0;
          this.startedAt = void 0;
          this.response = void 0;
        },
        teardown() {
          this.cleanup();
        },
        verifyAuth(scope) {
          return verify(ctx, scope);
        },
        // Transfer commands
        init() {
        },
        end() {
        },
        status() {
        },
        // Default prototype implementation for events
        onMessage() {
        },
        onError() {
        },
        onClose() {
        }
      };
      const handler = Object.assign(Object.create(prototype), implementation(prototype));
      ws.on("close", async (...args) => {
        try {
          await handler.onClose(...args);
        } catch (err) {
          strapi?.log?.error("[Data transfer] Uncaught error closing connection");
          strapi?.log?.error(err);
          cannotRespondHandler(err);
        } finally {
          resetTimeouts();
        }
      });
      ws.on("error", async (...args) => {
        try {
          await handler.onError(...args);
        } catch (err) {
          strapi?.log?.error("[Data transfer] Uncaught error in error handling");
          strapi?.log?.error(err);
          cannotRespondHandler(err);
        }
      });
      ws.on("message", async (...args) => {
        try {
          await handler.onMessage(...args);
        } catch (err) {
          strapi?.log?.error("[Data transfer] Uncaught error in message handling");
          strapi?.log?.error(err);
          cannotRespondHandler(err);
        }
      });
    };
    try {
      handleWSUpgrade(wss, ctx, cb);
    } catch (err) {
      strapi?.log?.error("[Data transfer] Error in websocket upgrade request");
      strapi?.log?.error(err);
    }
  };
};
const VALID_TRANSFER_ACTIONS$1 = [
  "bootstrap",
  "close",
  "rollback",
  "beforeTransfer",
  "getMetadata",
  "getSchemas"
];
const TRANSFER_KIND$1 = "push";
const writeAsync = (stream2, data) => {
  return new Promise((resolve, reject2) => {
    stream2.write(data, (error) => {
      if (error) {
        reject2(error);
      }
      resolve();
    });
  });
};
const createPushController = handlerControllerFactory((proto) => ({
  isTransferStarted() {
    return proto.isTransferStarted.call(this) && this.provider !== void 0;
  },
  verifyAuth() {
    return proto.verifyAuth.call(this, TRANSFER_KIND$1);
  },
  cleanup() {
    proto.cleanup.call(this);
    this.streams = {};
    this.assets = {};
    delete this.flow;
    delete this.provider;
  },
  teardown() {
    if (this.provider) {
      this.provider.rollback();
    }
    proto.teardown.call(this);
  },
  assertValidTransfer() {
    proto.assertValidTransfer.call(this);
    if (this.provider === void 0) {
      throw new Error("Invalid Transfer Process");
    }
  },
  assertValidTransferAction(action2) {
    if (VALID_TRANSFER_ACTIONS$1.includes(action2)) {
      return;
    }
    throw new ProviderTransferError(`Invalid action provided: "${action2}"`, {
      action: action2,
      validActions: Object.keys(VALID_TRANSFER_ACTIONS$1)
    });
  },
  assertValidStreamTransferStep(stage) {
    const currentStep = this.flow?.get();
    const nextStep = { kind: "transfer", stage };
    if (currentStep?.kind === "transfer" && !currentStep.locked) {
      throw new ProviderTransferError(
        `You need to initialize the transfer stage (${nextStep}) before starting to stream data`
      );
    }
    if (this.flow?.cannot(nextStep)) {
      throw new ProviderTransferError(`Invalid stage (${nextStep}) provided for the current flow`, {
        step: nextStep
      });
    }
  },
  async createWritableStreamForStep(step) {
    const mapper = {
      entities: () => this.provider?.createEntitiesWriteStream(),
      links: () => this.provider?.createLinksWriteStream(),
      configuration: () => this.provider?.createConfigurationWriteStream(),
      assets: () => this.provider?.createAssetsWriteStream()
    };
    if (!(step in mapper)) {
      throw new Error("Invalid transfer step, impossible to create a stream");
    }
    if (!this.streams) {
      throw new Error("Invalid transfer state");
    }
    this.streams[step] = await mapper[step]();
  },
  async onMessage(raw) {
    const msg = JSON.parse(raw.toString());
    if (!isDataTransferMessage(msg)) {
      return;
    }
    if (!msg.uuid) {
      await this.respond(void 0, new Error("Missing uuid in message"));
    }
    if (proto.hasUUID(msg.uuid)) {
      const previousResponse = proto.response;
      if (previousResponse?.uuid === msg.uuid) {
        await this.respond(previousResponse?.uuid, previousResponse.e, previousResponse.data);
      }
      return;
    }
    const { uuid, type } = msg;
    proto.addUUID(uuid);
    if (type === "command") {
      const { command: command2 } = msg;
      await this.executeAndRespond(uuid, () => {
        this.assertValidTransferCommand(command2);
        if (command2 === "status") {
          return this.status();
        }
        return this[command2](msg.params);
      });
    } else if (type === "transfer") {
      await this.executeAndRespond(uuid, async () => {
        await this.verifyAuth();
        this.assertValidTransfer();
        return this.onTransferMessage(msg);
      });
    } else {
      await this.respond(uuid, new Error("Bad Request"));
    }
  },
  async onTransferMessage(msg) {
    const { kind } = msg;
    if (kind === "action") {
      return this.onTransferAction(msg);
    }
    if (kind === "step") {
      return this.onTransferStep(msg);
    }
  },
  lockTransferStep(stage) {
    const currentStep = this.flow?.get();
    const nextStep = { kind: "transfer", stage };
    if (currentStep?.kind === "transfer" && currentStep.locked) {
      throw new ProviderTransferError(
        `It's not possible to start a new transfer stage (${stage}) while another one is in progress (${currentStep.stage})`
      );
    }
    if (this.flow?.cannot(nextStep)) {
      throw new ProviderTransferError(`Invalid stage (${stage}) provided for the current flow`, {
        step: nextStep
      });
    }
    this.flow?.set({ ...nextStep, locked: true });
  },
  unlockTransferStep(stage) {
    const currentStep = this.flow?.get();
    const nextStep = { kind: "transfer", stage };
    if (currentStep?.kind === "transfer" && !currentStep.locked) {
      throw new ProviderTransferError(
        `You need to initialize the transfer stage (${stage}) before ending it`
      );
    }
    if (this.flow?.cannot(nextStep)) {
      throw new ProviderTransferError(`Invalid stage (${stage}) provided for the current flow`, {
        step: nextStep
      });
    }
    this.flow?.set({ ...nextStep, locked: false });
  },
  async onTransferStep(msg) {
    const { step: stage } = msg;
    if (msg.action === "start") {
      this.lockTransferStep(stage);
      if (this.streams?.[stage] instanceof Writable) {
        throw new Error("Stream already created, something went wrong");
      }
      await this.createWritableStreamForStep(stage);
      return { ok: true };
    }
    if (msg.action === "stream") {
      this.assertValidStreamTransferStep(stage);
      const stream2 = this.streams?.[stage];
      if (!stream2) {
        throw new Error("You need to init first");
      }
      if (stage === "assets") {
        return this.streamAsset(msg.data);
      }
      await Promise.all(msg.data.map((item) => writeAsync(stream2, item)));
    }
    if (msg.action === "end") {
      this.unlockTransferStep(stage);
      const stream2 = this.streams?.[stage];
      if (stream2 && !stream2.closed) {
        await new Promise((resolve, reject2) => {
          stream2.on("close", resolve).on("error", reject2).end();
        });
      }
      delete this.streams?.[stage];
      return { ok: true };
    }
  },
  async onTransferAction(msg) {
    const { action: action2 } = msg;
    this.assertValidTransferAction(action2);
    const step = { kind: "action", action: action2 };
    const isStepRegistered = this.flow?.has(step);
    if (isStepRegistered) {
      if (this.flow?.cannot(step)) {
        throw new ProviderTransferError(`Invalid action "${action2}" found for the current flow `, {
          action: action2
        });
      }
      this.flow?.set(step);
    }
    return this.provider?.[action2]();
  },
  async streamAsset(payload) {
    const assetsStream = this.streams?.assets;
    if (payload === null) {
      this.streams?.assets?.end();
      return;
    }
    for (const item of payload) {
      const { action: action2, assetID } = item;
      if (!assetsStream) {
        throw new Error("Stream not defined");
      }
      if (action2 === "start") {
        this.assets[assetID] = { ...item.data, stream: new PassThrough() };
        writeAsync(assetsStream, this.assets[assetID]);
      }
      if (action2 === "stream") {
        const rawBuffer = item.data;
        const chunk = Buffer.from(rawBuffer.data);
        await writeAsync(this.assets[assetID].stream, chunk);
      }
      if (action2 === "end") {
        await new Promise((resolve, reject2) => {
          const { stream: assetStream } = this.assets[assetID];
          assetStream.on("close", () => {
            delete this.assets[assetID];
            resolve();
          }).on("error", reject2).end();
        });
      }
    }
  },
  onClose() {
    this.teardown();
  },
  onError(err) {
    this.teardown();
    strapi.log.error(err);
  },
  // Commands
  async init(params) {
    if (this.transferID || this.provider) {
      throw new Error("Transfer already in progress");
    }
    await this.verifyAuth();
    this.transferID = randomUUID();
    this.startedAt = Date.now();
    this.assets = {};
    this.streams = {};
    this.flow = createFlow(DEFAULT_TRANSFER_FLOW);
    this.provider = createLocalStrapiDestinationProvider$2({
      ...params.options,
      autoDestroy: false,
      getStrapi: () => strapi
    });
    this.provider.onWarning = (message) => {
      strapi.log.warn(message);
    };
    return { transferID: this.transferID };
  },
  async status() {
    const isStarted = this.isTransferStarted();
    if (isStarted) {
      const startedAt = this.startedAt;
      return {
        active: true,
        kind: TRANSFER_KIND$1,
        startedAt,
        elapsed: Date.now() - startedAt
      };
    }
    return { active: false, kind: null, elapsed: null, startedAt: null };
  },
  async end(params) {
    await this.verifyAuth();
    if (this.transferID !== params?.transferID) {
      throw new ProviderTransferError("Bad transfer ID provided");
    }
    this.cleanup();
    return { ok: true };
  }
}));
const TRANSFER_KIND = "pull";
const VALID_TRANSFER_ACTIONS = ["bootstrap", "close", "getMetadata", "getSchemas"];
const createPullController = handlerControllerFactory((proto) => ({
  isTransferStarted() {
    return proto.isTransferStarted.call(this) && this.provider !== void 0;
  },
  verifyAuth() {
    return proto.verifyAuth.call(this, TRANSFER_KIND);
  },
  cleanup() {
    proto.cleanup.call(this);
    this.streams = {};
    delete this.provider;
  },
  assertValidTransferAction(action2) {
    const validActions = VALID_TRANSFER_ACTIONS;
    if (validActions.includes(action2)) {
      return;
    }
    throw new ProviderTransferError(`Invalid action provided: "${action2}"`, {
      action: action2,
      validActions: Object.keys(VALID_TRANSFER_ACTIONS)
    });
  },
  async onMessage(raw) {
    const msg = JSON.parse(raw.toString());
    if (!isDataTransferMessage(msg)) {
      return;
    }
    if (!msg.uuid) {
      await this.respond(void 0, new Error("Missing uuid in message"));
    }
    if (proto.hasUUID(msg.uuid)) {
      const previousResponse = proto.response;
      if (previousResponse?.uuid === msg.uuid) {
        await this.respond(previousResponse?.uuid, previousResponse.e, previousResponse.data);
      }
      return;
    }
    const { uuid, type } = msg;
    proto.addUUID(uuid);
    if (type === "command") {
      const { command: command2 } = msg;
      await this.executeAndRespond(uuid, () => {
        this.assertValidTransferCommand(command2);
        if (command2 === "status") {
          return this.status();
        }
        return this[command2](msg.params);
      });
    } else if (type === "transfer") {
      await this.executeAndRespond(uuid, async () => {
        await this.verifyAuth();
        this.assertValidTransfer();
        return this.onTransferMessage(msg);
      });
    } else {
      await this.respond(uuid, new Error("Bad Request"));
    }
  },
  async onTransferMessage(msg) {
    const { kind } = msg;
    if (kind === "action") {
      return this.onTransferAction(msg);
    }
    if (kind === "step") {
      return this.onTransferStep(msg);
    }
  },
  async onTransferAction(msg) {
    const { action: action2 } = msg;
    this.assertValidTransferAction(action2);
    return this.provider?.[action2]();
  },
  async flush(stage, id) {
    const batchSize = 1024 * 1024;
    let batch = [];
    const stream2 = this.streams?.[stage];
    const batchLength = () => Buffer.byteLength(JSON.stringify(batch));
    const sendBatch = async () => {
      await this.confirm({
        type: "transfer",
        data: batch,
        ended: false,
        error: null,
        id
      });
    };
    if (!stream2) {
      throw new ProviderTransferError(`No available stream found for ${stage}`);
    }
    try {
      for await (const chunk of stream2) {
        if (stage !== "assets") {
          batch.push(chunk);
          if (batchLength() >= batchSize) {
            await sendBatch();
            batch = [];
          }
        } else {
          await this.confirm({
            type: "transfer",
            data: [chunk],
            ended: false,
            error: null,
            id
          });
        }
      }
      if (batch.length > 0 && stage !== "assets") {
        await sendBatch();
        batch = [];
      }
      await this.confirm({ type: "transfer", data: null, ended: true, error: null, id });
    } catch (e) {
      await this.confirm({ type: "transfer", data: null, ended: true, error: e, id });
    }
  },
  async onTransferStep(msg) {
    const { step, action: action2 } = msg;
    if (action2 === "start") {
      if (this.streams?.[step] instanceof Readable) {
        throw new Error("Stream already created, something went wrong");
      }
      const flushUUID = randomUUID();
      await this.createReadableStreamForStep(step);
      this.flush(step, flushUUID);
      return { ok: true, id: flushUUID };
    }
    if (action2 === "end") {
      const stream2 = this.streams?.[step];
      if (stream2?.readableEnded === false) {
        await new Promise((resolve) => {
          stream2?.on("close", resolve).destroy();
        });
      }
      delete this.streams?.[step];
      return { ok: true };
    }
  },
  async createReadableStreamForStep(step) {
    const mapper = {
      entities: () => this.provider?.createEntitiesReadStream(),
      links: () => this.provider?.createLinksReadStream(),
      configuration: () => this.provider?.createConfigurationReadStream(),
      assets: () => {
        const assets = this.provider?.createAssetsReadStream();
        let batch = [];
        const batchLength = () => {
          return batch.reduce(
            (acc, chunk) => chunk.action === "stream" ? acc + chunk.data.byteLength : acc,
            0
          );
        };
        const BATCH_MAX_SIZE = 1024 * 1024;
        if (!assets) {
          throw new Error("bad");
        }
        async function* generator(stream2) {
          let hasStarted = false;
          let assetID = "";
          for await (const chunk of stream2) {
            const { stream: assetStream, ...assetData } = chunk;
            if (!hasStarted) {
              assetID = randomUUID();
              batch.push({ action: "start", assetID, data: assetData });
              hasStarted = true;
            }
            for await (const assetChunk of assetStream) {
              batch.push({ action: "stream", assetID, data: assetChunk });
              if (batchLength() >= BATCH_MAX_SIZE) {
                yield batch;
                batch = [];
              }
            }
            hasStarted = false;
            batch.push({ action: "end", assetID });
            yield batch;
            batch = [];
          }
        }
        return Readable.from(generator(assets));
      }
    };
    if (!(step in mapper)) {
      throw new Error("Invalid transfer step, impossible to create a stream");
    }
    if (!this.streams) {
      throw new Error("Invalid transfer state");
    }
    this.streams[step] = await mapper[step]();
  },
  // Commands
  async init() {
    if (this.transferID || this.provider) {
      throw new Error("Transfer already in progress");
    }
    await this.verifyAuth();
    this.transferID = randomUUID();
    this.startedAt = Date.now();
    this.streams = {};
    this.provider = createLocalStrapiSourceProvider$2({
      autoDestroy: false,
      getStrapi: () => strapi
    });
    return { transferID: this.transferID };
  },
  async end(params) {
    await this.verifyAuth();
    if (this.transferID !== params?.transferID) {
      throw new ProviderTransferError("Bad transfer ID provided");
    }
    this.cleanup();
    return { ok: true };
  },
  async status() {
    const isStarted = this.isTransferStarted();
    if (!isStarted) {
      const startedAt = this.startedAt;
      return {
        active: true,
        kind: TRANSFER_KIND,
        startedAt,
        elapsed: Date.now() - startedAt
      };
    }
    return { active: false, kind: null, elapsed: null, startedAt: null };
  }
}));
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createPullController,
  createPushController,
  handlerControllerFactory
}, Symbol.toStringTag, { value: "Module" }));
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants,
  handlers: index$3
}, Symbol.toStringTag, { value: "Module" }));
const strapiDatatransfer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  providers: index$4,
  queries: index$5,
  remote: index$2
}, Symbol.toStringTag, { value: "Module" }));
const isFilePathInDirname = (posixDirName, filePath) => {
  const normalizedDir = path.posix.dirname(unknownPathToPosix(filePath));
  return isPathEquivalent(posixDirName, normalizedDir);
};
const isPathEquivalent = (pathA, pathB) => {
  const normalizedPathA = path.posix.normalize(unknownPathToPosix(pathA));
  const normalizedPathB = path.posix.normalize(unknownPathToPosix(pathB));
  return !path.posix.relative(normalizedPathB, normalizedPathA).length;
};
const unknownPathToPosix = (filePath) => {
  if (filePath.includes(path.posix.sep)) {
    return filePath;
  }
  return path.normalize(filePath).split(path.win32.sep).join(path.posix.sep);
};
const METADATA_FILE_PATH = "metadata.json";
const createLocalFileSourceProvider$1 = (options) => {
  return new LocalFileSourceProvider(options);
};
class LocalFileSourceProvider {
  type = "source";
  name = "source::local-file";
  options;
  #metadata;
  constructor(options) {
    this.options = options;
    const { encryption } = this.options;
    if (encryption.enabled && encryption.key === void 0) {
      throw new Error("Missing encryption key");
    }
  }
  /**
   * Pre flight checks regarding the provided options, making sure that the file can be opened (decrypted, decompressed), etc.
   */
  async bootstrap() {
    const { path: filePath } = this.options.file;
    try {
      await this.#loadMetadata();
    } catch (e) {
      if (this.options?.encryption?.enabled) {
        throw new ProviderInitializationError(
          `Key is incorrect or the file '${filePath}' is not a valid Strapi data file.`
        );
      }
      throw new ProviderInitializationError(`File '${filePath}' is not a valid Strapi data file.`);
    }
    if (!this.#metadata) {
      throw new ProviderInitializationError("Could not load metadata from Strapi data file.");
    }
  }
  async #loadMetadata() {
    const backupStream = this.#getBackupStream();
    this.#metadata = await this.#parseJSONFile(backupStream, METADATA_FILE_PATH);
  }
  async #loadAssetMetadata(path2) {
    const backupStream = this.#getBackupStream();
    return this.#parseJSONFile(backupStream, path2);
  }
  async getMetadata() {
    if (!this.#metadata) {
      await this.#loadMetadata();
    }
    return this.#metadata ?? null;
  }
  async getSchemas() {
    const schemas = await collect(this.createSchemasReadStream());
    if (isEmpty(schemas)) {
      throw new ProviderInitializationError("Could not load schemas from Strapi data file.");
    }
    return keyBy("uid", schemas);
  }
  createEntitiesReadStream() {
    return this.#streamJsonlDirectory("entities");
  }
  createSchemasReadStream() {
    return this.#streamJsonlDirectory("schemas");
  }
  createLinksReadStream() {
    return this.#streamJsonlDirectory("links");
  }
  createConfigurationReadStream() {
    return this.#streamJsonlDirectory("configuration");
  }
  createAssetsReadStream() {
    const inStream = this.#getBackupStream();
    const outStream = new PassThrough({ objectMode: true });
    const loadAssetMetadata = this.#loadAssetMetadata.bind(this);
    pipeline(
      [
        inStream,
        new tar.Parse({
          // find only files in the assets/uploads folder
          filter(filePath, entry) {
            if (entry.type !== "File") {
              return false;
            }
            return isFilePathInDirname("assets/uploads", filePath);
          },
          async onentry(entry) {
            const { path: filePath, size: size2 = 0 } = entry;
            const normalizedPath = unknownPathToPosix(filePath);
            const file2 = path.basename(normalizedPath);
            let metadata;
            try {
              metadata = await loadAssetMetadata(`assets/metadata/${file2}.json`);
            } catch (error) {
              console.warn(
                ` Failed to read metadata for ${file2}, Strapi will try to fix this issue automatically`
              );
            }
            const asset = {
              metadata,
              filename: file2,
              filepath: normalizedPath,
              stats: { size: size2 },
              stream: entry
            };
            outStream.write(asset);
          }
        })
      ],
      () => outStream.end()
    );
    return outStream;
  }
  #getBackupStream() {
    const { file: file2, encryption, compression } = this.options;
    const streams = [];
    try {
      streams.push(fse__default.createReadStream(file2.path));
    } catch (e) {
      throw new Error(`Could not read backup file path provided at "${this.options.file.path}"`);
    }
    if (encryption.enabled && encryption.key) {
      streams.push(createDecryptionCipher(encryption.key));
    }
    if (compression.enabled) {
      streams.push(zip$1.createGunzip());
    }
    return chain(streams);
  }
  // `directory` must be posix formatted path
  #streamJsonlDirectory(directory) {
    const inStream = this.#getBackupStream();
    const outStream = new PassThrough({ objectMode: true });
    pipeline(
      [
        inStream,
        new tar.Parse({
          filter(filePath, entry) {
            if (entry.type !== "File") {
              return false;
            }
            return isFilePathInDirname(directory, filePath);
          },
          async onentry(entry) {
            const transforms = [
              // JSONL parser to read the data chunks one by one (line by line)
              parser({
                checkErrors: true
              }),
              // The JSONL parser returns each line as key/value
              (line) => line.value
            ];
            const stream2 = entry.pipe(chain(transforms));
            try {
              for await (const chunk of stream2) {
                outStream.write(chunk);
              }
            } catch (e) {
              outStream.destroy(
                new ProviderTransferError(
                  `Error parsing backup files from backup file ${entry.path}: ${e.message}`,
                  {
                    details: {
                      error: e
                    }
                  }
                )
              );
            }
          }
        })
      ],
      async () => {
        outStream.end();
      }
    );
    return outStream;
  }
  // For collecting an entire JSON file then parsing it, not for streaming JSONL
  async #parseJSONFile(fileStream, filePath) {
    return new Promise((resolve, reject2) => {
      pipeline(
        [
          fileStream,
          // Custom backup archive parsing
          new tar.Parse({
            /**
             * Filter the parsed entries to only keep the one that matches the given filepath
             */
            filter(entryPath, entry) {
              if (entry.type !== "File") {
                return false;
              }
              return isPathEquivalent(entryPath, filePath);
            },
            async onentry(entry) {
              const content = await entry.collect();
              try {
                const parsedContent = JSON.parse(Buffer.concat(content).toString());
                resolve(parsedContent);
              } catch (e) {
                reject2(e);
              } finally {
                entry.destroy();
              }
            }
          })
        ],
        () => {
          reject2(new Error(`File "${filePath}" not found`));
        }
      );
    });
  }
}
const createFilePathFactory = (type) => (fileIndex = 0) => {
  return posix.join(
    // "{type}" directory
    type,
    // "${type}_XXXXX.jsonl" file
    `${type}_${String(fileIndex).padStart(5, "0")}.jsonl`
  );
};
const createTarEntryStream = (archive, pathFactory, maxSize = 256e6) => {
  let fileIndex = 0;
  let buffer = "";
  const flush = async () => {
    if (!buffer) {
      return;
    }
    fileIndex += 1;
    const name = pathFactory(fileIndex);
    const size2 = buffer.length;
    await new Promise((resolve, reject2) => {
      archive.entry({ name, size: size2 }, buffer, (err) => {
        if (err) {
          reject2(err);
        }
        resolve();
      });
    });
    buffer = "";
  };
  const push = (chunk) => {
    buffer += chunk;
  };
  return new Writable({
    async destroy(err, callback) {
      await flush();
      callback(err);
    },
    async write(chunk, _encoding, callback) {
      const size2 = chunk.length;
      if (chunk.length > maxSize) {
        callback(new Error(`payload too large: ${chunk.length}>${maxSize}`));
        return;
      }
      if (buffer.length + size2 > maxSize) {
        await flush();
      }
      push(chunk);
      callback(null);
    }
  });
};
const createLocalFileDestinationProvider$1 = (options) => {
  return new LocalFileDestinationProvider(options);
};
class LocalFileDestinationProvider {
  name = "destination::local-file";
  type = "destination";
  options;
  results = {};
  #providersMetadata = {};
  #archive = {};
  constructor(options) {
    this.options = options;
  }
  get #archivePath() {
    const { encryption, compression, file: file2 } = this.options;
    let filePath = `${file2.path}.tar`;
    if (compression.enabled) {
      filePath += ".gz";
    }
    if (encryption.enabled) {
      filePath += ".enc";
    }
    return filePath;
  }
  setMetadata(target, metadata) {
    this.#providersMetadata[target] = metadata;
    return this;
  }
  createGzip() {
    return zip$1.createGzip();
  }
  bootstrap() {
    const { compression, encryption } = this.options;
    if (encryption.enabled && !encryption.key) {
      throw new Error("Can't encrypt without a key");
    }
    this.#archive.stream = tar$1.pack();
    const outStream = createWriteStream(this.#archivePath);
    outStream.on("error", (err) => {
      if (err.code === "ENOSPC") {
        throw new ProviderTransferError(
          "Your server doesn't have space to proceed with the import."
        );
      }
      throw err;
    });
    const archiveTransforms = [];
    if (compression.enabled) {
      archiveTransforms.push(this.createGzip());
    }
    if (encryption.enabled && encryption.key) {
      archiveTransforms.push(createEncryptionCipher(encryption.key));
    }
    this.#archive.pipeline = chain([this.#archive.stream, ...archiveTransforms, outStream]);
    this.results.file = { path: this.#archivePath };
  }
  async close() {
    const { stream: stream2, pipeline: pipeline2 } = this.#archive;
    if (!stream2) {
      return;
    }
    await this.#writeMetadata();
    stream2.finalize();
    if (pipeline2 && !pipeline2.closed) {
      await new Promise((resolve, reject2) => {
        pipeline2.on("close", resolve).on("error", reject2);
      });
    }
  }
  async rollback() {
    await this.close();
    await rm(this.#archivePath, { force: true });
  }
  getMetadata() {
    return null;
  }
  async #writeMetadata() {
    const metadata = this.#providersMetadata.source;
    if (metadata) {
      await new Promise((resolve) => {
        const outStream = this.#getMetadataStream();
        const data = JSON.stringify(metadata, null, 2);
        Readable.from(data).pipe(outStream).on("close", resolve);
      });
    }
  }
  #getMetadataStream() {
    const { stream: stream2 } = this.#archive;
    if (!stream2) {
      throw new Error("Archive stream is unavailable");
    }
    return createTarEntryStream(stream2, () => "metadata.json");
  }
  createSchemasWriteStream() {
    if (!this.#archive.stream) {
      throw new Error("Archive stream is unavailable");
    }
    const filePathFactory = createFilePathFactory("schemas");
    const entryStream = createTarEntryStream(
      this.#archive.stream,
      filePathFactory,
      this.options.file.maxSizeJsonl
    );
    return chain([stringer(), entryStream]);
  }
  createEntitiesWriteStream() {
    if (!this.#archive.stream) {
      throw new Error("Archive stream is unavailable");
    }
    const filePathFactory = createFilePathFactory("entities");
    const entryStream = createTarEntryStream(
      this.#archive.stream,
      filePathFactory,
      this.options.file.maxSizeJsonl
    );
    return chain([stringer(), entryStream]);
  }
  createLinksWriteStream() {
    if (!this.#archive.stream) {
      throw new Error("Archive stream is unavailable");
    }
    const filePathFactory = createFilePathFactory("links");
    const entryStream = createTarEntryStream(
      this.#archive.stream,
      filePathFactory,
      this.options.file.maxSizeJsonl
    );
    return chain([stringer(), entryStream]);
  }
  createConfigurationWriteStream() {
    if (!this.#archive.stream) {
      throw new Error("Archive stream is unavailable");
    }
    const filePathFactory = createFilePathFactory("configuration");
    const entryStream = createTarEntryStream(
      this.#archive.stream,
      filePathFactory,
      this.options.file.maxSizeJsonl
    );
    return chain([stringer(), entryStream]);
  }
  createAssetsWriteStream() {
    const { stream: archiveStream } = this.#archive;
    if (!archiveStream) {
      throw new Error("Archive stream is unavailable");
    }
    return new Writable({
      objectMode: true,
      write(data, _encoding, callback) {
        const entryPath = path.posix.join("assets", "uploads", data.filename);
        const entryMetadataPath = path.posix.join("assets", "metadata", `${data.filename}.json`);
        const stringifiedMetadata = JSON.stringify(data.metadata);
        archiveStream.entry(
          {
            name: entryMetadataPath,
            size: stringifiedMetadata.length
          },
          stringifiedMetadata
        );
        const entry = archiveStream.entry({
          name: entryPath,
          size: data.stats.size
        });
        if (!entry) {
          callback(new Error(`Failed to created an asset tar entry for ${entryPath}`));
          return;
        }
        data.stream.pipe(entry);
        entry.on("finish", () => {
          callback(null);
        }).on("error", (error) => {
          callback(error);
        });
      }
    });
  }
}
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createLocalFileDestinationProvider: createLocalFileDestinationProvider$1,
  createLocalFileSourceProvider: createLocalFileSourceProvider$1
}, Symbol.toStringTag, { value: "Module" }));
const file = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  providers: index$1
}, Symbol.toStringTag, { value: "Module" }));
const bytesPerKb = 1024;
const sizes = ["B ", "KB", "MB", "GB", "TB", "PB"];
const readableBytes = (bytes, decimals = 1, padStart = 0) => {
  if (!bytes) {
    return "0";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(bytesPerKb));
  const result = `${parseFloat((bytes / bytesPerKb ** i).toFixed(decimals))} ${sizes[i].padStart(
    2
  )}`;
  return result.padStart(padStart);
};
const exitWith = (code, message, options = {}) => {
  const { logger = console, prc = process } = options;
  const log = (message2) => {
    if (code === 0) {
      logger.log(chalk.green(message2));
    } else {
      logger.error(chalk.red(message2));
    }
  };
  if (isString(message)) {
    log(message);
  } else if (isArray(message)) {
    message.forEach((msg) => log(msg));
  }
  prc.exit(code);
};
const assertUrlHasProtocol = (url, protocol) => {
  if (!url.protocol) {
    exitWith(1, `${url.toString()} does not have a protocol`);
  }
  if (!protocol) {
    return;
  }
  if (isString(protocol)) {
    if (protocol !== url.protocol) {
      exitWith(1, `${url.toString()} must have the protocol ${protocol}`);
    }
    return;
  }
  if (!protocol.some((protocol2) => url.protocol === protocol2)) {
    return exitWith(
      1,
      `${url.toString()} must have one of the following protocols: ${protocol.join(",")}`
    );
  }
};
const ifOptions = (conditionCallback, isMetCallback = async () => {
}, isNotMetCallback = async () => {
}) => {
  return async (command2) => {
    const opts = command2.opts();
    if (await conditionCallback(opts)) {
      await isMetCallback(command2);
    } else {
      await isNotMetCallback(command2);
    }
  };
};
const parseList = (value) => {
  try {
    return value.split(",").map((item) => item.trim());
  } catch (e) {
    exitWith(1, `Unrecognized input: ${value}`);
  }
  return [];
};
const getParseListWithChoices = (choices, errorMessage = "Invalid options:") => {
  return (value) => {
    const list = parseList(value);
    const invalid = list.filter((item) => {
      return !choices.includes(item);
    });
    if (invalid.length > 0) {
      exitWith(1, `${errorMessage}: ${invalid.join(",")}`);
    }
    return list;
  };
};
const parseInteger = (value) => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidOptionArgumentError(`Not an integer: ${value}`);
  }
  return parsedValue;
};
const parseURL = (value) => {
  try {
    const url = new URL(value);
    if (!url.host) {
      throw new InvalidOptionArgumentError(`Could not parse url ${value}`);
    }
    return url;
  } catch (e) {
    throw new InvalidOptionArgumentError(`Could not parse url ${value}`);
  }
};
const promptEncryptionKey = async (thisCommand) => {
  const opts = thisCommand.opts();
  if (!opts.encrypt && opts.key) {
    return exitWith(1, "Key may not be present unless encryption is used");
  }
  if (opts.encrypt && !(opts.key && opts.key.length > 0)) {
    try {
      const answers = await inquirer.prompt([
        {
          type: "password",
          message: "Please enter an encryption key",
          name: "key",
          validate(key) {
            if (key.length > 0)
              return true;
            return "Key must be present when using the encrypt option";
          }
        }
      ]);
      opts.key = answers.key;
    } catch (e) {
      return exitWith(1, "Failed to get encryption key");
    }
    if (!opts.key) {
      return exitWith(1, "Failed to get encryption key");
    }
  }
};
const getCommanderConfirmMessage = (message, { failMessage } = {}) => {
  return async (command2) => {
    const confirmed = await confirmMessage(message, { force: command2.opts().force });
    if (!confirmed) {
      exitWith(1, failMessage);
    }
  };
};
const confirmMessage = async (message, { force } = {}) => {
  if (force === true) {
    console.log(`${chalk.green("?")} ${chalk.bold(message)} ${chalk.cyan("Yes")}`);
    return true;
  }
  const answers = await inquirer.prompt([
    {
      type: "confirm",
      message,
      name: `confirm`,
      default: false
    }
  ]);
  return answers.confirm;
};
const forceOption = new Option(
  "--force",
  `Automatically answer "yes" to all prompts, including potentially destructive requests, and run non-interactively.`
);
const {
  errors: { TransferEngineInitializationError: TransferEngineInitializationError2 }
} = engineDatatransfer;
const exitMessageText = (process2, error = false) => {
  const processCapitalized = process2[0].toUpperCase() + process2.slice(1);
  if (!error) {
    return chalk.bold(
      chalk.green(`${processCapitalized} process has been completed successfully!`)
    );
  }
  return chalk.bold(chalk.red(`${processCapitalized} process failed.`));
};
const pad = (n) => {
  return (n < 10 ? "0" : "") + String(n);
};
const yyyymmddHHMMSS = () => {
  const date = /* @__PURE__ */ new Date();
  return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
};
const getDefaultExportName = () => {
  return `export_${yyyymmddHHMMSS()}`;
};
const buildTransferTable = (resultData) => {
  if (!resultData) {
    return;
  }
  const table = new Table({
    head: ["Type", "Count", "Size"].map((text) => chalk.bold.blue(text))
  });
  let totalBytes = 0;
  let totalItems = 0;
  Object.keys(resultData).forEach((stage) => {
    const item = resultData[stage];
    if (!item) {
      return;
    }
    table.push([
      { hAlign: "left", content: chalk.bold(stage) },
      { hAlign: "right", content: item.count },
      { hAlign: "right", content: `${readableBytes(item.bytes, 1, 11)} ` }
    ]);
    totalBytes += item.bytes;
    totalItems += item.count;
    if (item.aggregates) {
      Object.keys(item.aggregates).sort().forEach((subkey) => {
        if (!item.aggregates) {
          return;
        }
        const subitem = item.aggregates[subkey];
        table.push([
          { hAlign: "left", content: `-- ${chalk.bold.grey(subkey)}` },
          { hAlign: "right", content: chalk.grey(subitem.count) },
          { hAlign: "right", content: chalk.grey(`(${readableBytes(subitem.bytes, 1, 11)})`) }
        ]);
      });
    }
  });
  table.push([
    { hAlign: "left", content: chalk.bold.green("Total") },
    { hAlign: "right", content: chalk.bold.green(totalItems) },
    { hAlign: "right", content: `${chalk.bold.green(readableBytes(totalBytes, 1, 11))} ` }
  ]);
  return table;
};
const DEFAULT_IGNORED_CONTENT_TYPES = [
  "admin::permission",
  "admin::user",
  "admin::role",
  "admin::api-token",
  "admin::api-token-permission",
  "admin::transfer-token",
  "admin::transfer-token-permission",
  "admin::audit-log",
  "plugin::content-releases.release",
  "plugin::content-releases.release-action"
];
const abortTransfer = async ({
  engine,
  strapi: strapi2
}) => {
  try {
    await engine.abortTransfer();
    await strapi2.destroy();
  } catch (e) {
    return false;
  }
  return true;
};
const setSignalHandler = async (handler, signals = ["SIGINT", "SIGTERM", "SIGQUIT"]) => {
  signals.forEach((signal) => {
    process.removeAllListeners(signal);
    process.on(signal, handler);
  });
};
const createStrapiInstance = async (opts = {}) => {
  try {
    const appContext = await strapiFactory.compile();
    const app = strapiFactory({ ...opts, ...appContext });
    app.log.level = opts.logLevel || "error";
    return await app.load();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ECONNREFUSED") {
      throw new Error("Process failed. Check the database connection with your Strapi project.");
    }
    throw error;
  }
};
const transferDataTypes = Object.keys(TransferGroupPresets);
const throttleOption = new Option(
  "--throttle <delay after each entity>",
  `Add a delay in milliseconds between each transferred entity`
).argParser(parseInteger).hideHelp();
const excludeOption = new Option(
  "--exclude <comma-separated data types>",
  `Exclude data using comma-separated types. Available types: ${transferDataTypes.join(",")}`
).argParser(getParseListWithChoices(transferDataTypes, 'Invalid options for "exclude"'));
const onlyOption = new Option(
  "--only <command-separated data types>",
  `Include only these types of data (plus schemas). Available types: ${transferDataTypes.join(",")}`
).argParser(getParseListWithChoices(transferDataTypes, 'Invalid options for "only"'));
const validateExcludeOnly = (command2) => {
  const { exclude, only } = command2.opts();
  if (!only || !exclude) {
    return;
  }
  const choicesInBoth = only.filter((n) => {
    return exclude.indexOf(n) !== -1;
  });
  if (choicesInBoth.length > 0) {
    exitWith(
      1,
      `Data types may not be used in both "exclude" and "only" in the same command. Found in both: ${choicesInBoth.join(
        ","
      )}`
    );
  }
};
const errorColors = {
  fatal: chalk.red,
  error: chalk.red,
  silly: chalk.yellow
};
const formatDiagnostic = (operation) => ({ details, kind }) => {
  const logger = createLogger(
    configs.createOutputFileConfiguration(`${operation}_error_log_${Date.now()}.log`)
  );
  try {
    if (kind === "error") {
      const { message, severity = "fatal" } = details;
      const colorizeError = errorColors[severity];
      const errorMessage = colorizeError(`[${severity.toUpperCase()}] ${message}`);
      logger.error(errorMessage);
    }
    if (kind === "info") {
      const { message, params } = details;
      const msg = `${message}
${params ? JSON.stringify(params, null, 2) : ""}`;
      logger.info(msg);
    }
    if (kind === "warning") {
      const { origin: origin2, message } = details;
      logger.warn(`(${origin2 ?? "transfer"}) ${message}`);
    }
  } catch (err) {
    logger.error(err);
  }
};
const loadersFactory = (defaultLoaders = {}) => {
  const loaders = defaultLoaders;
  const updateLoader = (stage, data) => {
    if (!(stage in loaders)) {
      createLoader(stage);
    }
    const stageData = data[stage];
    const elapsedTime = stageData?.startTime ? (stageData?.endTime || Date.now()) - stageData.startTime : 0;
    const size2 = `size: ${readableBytes(stageData?.bytes ?? 0)}`;
    const elapsed = `elapsed: ${elapsedTime} ms`;
    const speed = elapsedTime > 0 ? `(${readableBytes((stageData?.bytes ?? 0) * 1e3 / elapsedTime)}/s)` : "";
    loaders[stage].text = `${stage}: ${stageData?.count ?? 0} transfered (${size2}) (${elapsed}) ${!stageData?.endTime ? speed : ""}`;
    return loaders[stage];
  };
  const createLoader = (stage) => {
    Object.assign(loaders, { [stage]: ora() });
    return loaders[stage];
  };
  const getLoader = (stage) => {
    return loaders[stage];
  };
  return {
    updateLoader,
    createLoader,
    getLoader
  };
};
const getTransferTelemetryPayload = (engine) => {
  return {
    eventProperties: {
      source: engine?.sourceProvider?.name,
      destination: engine?.destinationProvider?.name
    }
  };
};
const getDiffHandler = (engine, {
  force,
  action: action2
}) => {
  return async (context, next) => {
    setSignalHandler(async () => {
      await abortTransfer({ engine, strapi });
      exitWith(1, exitMessageText(action2, true));
    });
    let workflowsStatus;
    const source = "Schema Integrity";
    Object.entries(context.diffs).forEach(([uid, diffs]) => {
      for (const diff2 of diffs) {
        const path2 = [uid].concat(diff2.path).join(".");
        const endPath = diff2.path[diff2.path.length - 1];
        if (uid === "admin::workflow" || uid === "admin::workflow-stage" || endPath?.startsWith("strapi_stage") || endPath?.startsWith("strapi_assignee")) {
          workflowsStatus = diff2.kind;
        } else if (diff2.kind === "added") {
          engine.reportWarning(chalk.red(`${chalk.bold(path2)} does not exist on source`), source);
        } else if (diff2.kind === "deleted") {
          engine.reportWarning(
            chalk.red(`${chalk.bold(path2)} does not exist on destination`),
            source
          );
        } else if (diff2.kind === "modified") {
          engine.reportWarning(chalk.red(`${chalk.bold(path2)} has a different data type`), source);
        }
      }
    });
    if (workflowsStatus === "added") {
      engine.reportWarning(chalk.red(`Review workflows feature does not exist on source`), source);
    } else if (workflowsStatus === "deleted") {
      engine.reportWarning(
        chalk.red(`Review workflows feature does not exist on destination`),
        source
      );
    } else if (workflowsStatus === "modified") {
      engine.panic(
        new TransferEngineInitializationError2("Unresolved differences in schema [review workflows]")
      );
    }
    const confirmed = await confirmMessage(
      "There are differences in schema between the source and destination, and the data listed above will be lost. Are you sure you want to continue?",
      {
        force
      }
    );
    setSignalHandler(() => abortTransfer({ engine, strapi }));
    if (confirmed) {
      context.ignoredDiffs = merge(context.diffs, context.ignoredDiffs);
    }
    return next(context);
  };
};
const getAssetsBackupHandler = (engine, {
  force,
  action: action2
}) => {
  return async (context, next) => {
    setSignalHandler(async () => {
      await abortTransfer({ engine, strapi });
      exitWith(1, exitMessageText(action2, true));
    });
    console.warn(
      "The backup for the assets could not be created inside the public directory. Ensure Strapi has write permissions on the public directory."
    );
    const confirmed = await confirmMessage(
      "Do you want to continue without backing up your public/uploads files?",
      {
        force
      }
    );
    if (confirmed) {
      context.ignore = true;
    }
    setSignalHandler(() => abortTransfer({ engine, strapi }));
    return next(context);
  };
};
const shouldSkipStage = (opts, dataKind) => {
  if (opts.exclude?.includes(dataKind)) {
    return true;
  }
  if (opts.only) {
    return !opts.only.includes(dataKind);
  }
  return false;
};
const parseRestoreFromOptions = (opts) => {
  const entitiesOptions = {
    exclude: DEFAULT_IGNORED_CONTENT_TYPES,
    include: void 0
  };
  if (opts.only && !opts.only.includes("content") || opts.exclude?.includes("content")) {
    entitiesOptions.include = [];
  }
  const restoreConfig = {
    entities: entitiesOptions,
    assets: !shouldSkipStage(opts, "files"),
    configuration: {
      webhook: !shouldSkipStage(opts, "config"),
      coreStore: !shouldSkipStage(opts, "config")
    }
  };
  return restoreConfig;
};
const {
  providers: { createLocalFileDestinationProvider }
} = file;
const {
  providers: { createLocalStrapiSourceProvider: createLocalStrapiSourceProvider$1 }
} = strapiDatatransfer;
const BYTES_IN_MB = 1024 * 1024;
const action$2 = async (opts) => {
  if (!isObject(opts)) {
    exitWith(1, "Could not parse command arguments");
  }
  const strapi2 = await createStrapiInstance();
  const source = createSourceProvider(strapi2);
  const destination = createDestinationProvider(opts);
  const engine = createTransferEngine$2(source, destination, {
    versionStrategy: "ignore",
    // for an export to file, versionStrategy will always be skipped
    schemaStrategy: "ignore",
    // for an export to file, schemaStrategy will always be skipped
    exclude: opts.exclude,
    only: opts.only,
    throttle: opts.throttle,
    transforms: {
      links: [
        {
          filter(link2) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.left.type) && !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.right.type);
          }
        }
      ],
      entities: [
        {
          filter(entity2) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(entity2.type);
          }
        }
      ]
    }
  });
  engine.diagnostics.onDiagnostic(formatDiagnostic("export"));
  const progress = engine.progress.stream;
  const { updateLoader } = loadersFactory();
  progress.on(`stage::start`, ({ stage, data }) => {
    updateLoader(stage, data).start();
  });
  progress.on("stage::finish", ({ stage, data }) => {
    updateLoader(stage, data).succeed();
  });
  progress.on("stage::progress", ({ stage, data }) => {
    updateLoader(stage, data);
  });
  progress.on("transfer::start", async () => {
    console.log(`Starting export...`);
    await strapi2.telemetry.send("didDEITSProcessStart", getTransferTelemetryPayload(engine));
  });
  let results;
  let outFile;
  try {
    setSignalHandler(() => abortTransfer({ engine, strapi: strapi2 }));
    results = await engine.transfer();
    outFile = results.destination?.file?.path ?? "";
    const outFileExists = await fse__default.pathExists(outFile);
    if (!outFileExists) {
      throw new TransferEngineTransferError(`Export file not created "${outFile}"`);
    }
    await strapi2.telemetry.send("didDEITSProcessFinish", getTransferTelemetryPayload(engine));
    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error("There was an error displaying the results of the transfer.");
    }
    console.log(`Export archive is in ${chalk.green(outFile)}`);
    exitWith(0, exitMessageText("export"));
  } catch {
    await strapi2.telemetry.send("didDEITSProcessFail", getTransferTelemetryPayload(engine));
    exitWith(1, exitMessageText("export", true));
  }
};
const createSourceProvider = (strapi2) => {
  return createLocalStrapiSourceProvider$1({
    async getStrapi() {
      return strapi2;
    }
  });
};
const createDestinationProvider = (opts) => {
  const { file: file2, compress, encrypt, key, maxSizeJsonl } = opts;
  const filepath = isString(file2) && file2.length > 0 ? file2 : getDefaultExportName();
  const maxSizeJsonlInMb = isFinite(toNumber(maxSizeJsonl)) ? toNumber(maxSizeJsonl) * BYTES_IN_MB : void 0;
  return createLocalFileDestinationProvider({
    file: {
      path: filepath,
      maxSizeJsonl: maxSizeJsonlInMb
    },
    encryption: {
      enabled: encrypt ?? false,
      key: encrypt ? key : void 0
    },
    compression: {
      enabled: compress ?? false
    }
  });
};
const command$2 = ({ command: command2 }) => {
  command2.command("export").description("Export data from Strapi to file").allowExcessArguments(false).addOption(
    new Option("--no-encrypt", `Disables 'aes-128-ecb' encryption of the output file`).default(
      true
    )
  ).addOption(
    new Option("--no-compress", "Disables gzip compression of output file").default(true)
  ).addOption(
    new Option(
      "-k, --key <string>",
      "Provide encryption key in command instead of using the prompt"
    )
  ).addOption(
    new Option("-f, --file <file>", "name to use for exported file (without extensions)")
  ).addOption(excludeOption).addOption(onlyOption).addOption(throttleOption).hook("preAction", validateExcludeOnly).hook("preAction", promptEncryptionKey).action(action$2);
};
const {
  providers: { createLocalFileSourceProvider }
} = file;
const {
  providers: { createLocalStrapiDestinationProvider: createLocalStrapiDestinationProvider$1, DEFAULT_CONFLICT_STRATEGY }
} = strapiDatatransfer;
const { createTransferEngine: createTransferEngine$1, DEFAULT_VERSION_STRATEGY, DEFAULT_SCHEMA_STRATEGY } = engineDatatransfer;
const action$1 = async (opts) => {
  if (!isObject(opts)) {
    exitWith(1, "Could not parse arguments");
  }
  const sourceOptions = getLocalFileSourceOptions(opts);
  const source = createLocalFileSourceProvider(sourceOptions);
  const strapiInstance = await createStrapiInstance();
  const engineOptions = {
    versionStrategy: DEFAULT_VERSION_STRATEGY,
    schemaStrategy: DEFAULT_SCHEMA_STRATEGY,
    exclude: opts.exclude,
    only: opts.only,
    throttle: opts.throttle,
    transforms: {
      links: [
        {
          filter(link2) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.left.type) && !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.right.type);
          }
        }
      ],
      entities: [
        {
          filter: (entity2) => !DEFAULT_IGNORED_CONTENT_TYPES.includes(entity2.type)
        }
      ]
    }
  };
  const destinationOptions = {
    async getStrapi() {
      return strapiInstance;
    },
    autoDestroy: false,
    strategy: opts.conflictStrategy || DEFAULT_CONFLICT_STRATEGY,
    restore: parseRestoreFromOptions(engineOptions)
  };
  const destination = createLocalStrapiDestinationProvider$1(destinationOptions);
  destination.onWarning = (message) => console.warn(`
${chalk.yellow("warn")}: ${message}`);
  const engine2 = createTransferEngine$1(source, destination, engineOptions);
  engine2.diagnostics.onDiagnostic(formatDiagnostic("import"));
  const progress = engine2.progress.stream;
  const { updateLoader } = loadersFactory();
  engine2.onSchemaDiff(getDiffHandler(engine2, { force: opts.force, action: "import" }));
  progress.on(`stage::start`, ({ stage, data }) => {
    updateLoader(stage, data).start();
  });
  progress.on("stage::finish", ({ stage, data }) => {
    updateLoader(stage, data).succeed();
  });
  progress.on("stage::progress", ({ stage, data }) => {
    updateLoader(stage, data);
  });
  progress.on("transfer::start", async () => {
    console.log("Starting import...");
    await strapiInstance.telemetry.send(
      "didDEITSProcessStart",
      getTransferTelemetryPayload(engine2)
    );
  });
  let results;
  try {
    setSignalHandler(() => abortTransfer({ engine: engine2, strapi }));
    results = await engine2.transfer();
    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error("There was an error displaying the results of the transfer.");
    }
    await strapiInstance.telemetry.send(
      "didDEITSProcessFinish",
      getTransferTelemetryPayload(engine2)
    );
    await strapiInstance.destroy();
    exitWith(0, exitMessageText("import"));
  } catch (e) {
    await strapiInstance.telemetry.send("didDEITSProcessFail", getTransferTelemetryPayload(engine2));
    exitWith(1, exitMessageText("import", true));
  }
};
const getLocalFileSourceOptions = (opts) => {
  const options = {
    file: { path: opts.file ?? "" },
    compression: { enabled: !!opts.decompress },
    encryption: { enabled: !!opts.decrypt, key: opts.key }
  };
  return options;
};
const command$1 = ({ command: command2 }) => {
  command2.command("import").description("Import data from file to Strapi").allowExcessArguments(false).requiredOption(
    "-f, --file <file>",
    "path and filename for the Strapi export file you want to import"
  ).addOption(
    new Option(
      "-k, --key <string>",
      "Provide encryption key in command instead of using the prompt"
    )
  ).addOption(forceOption).addOption(excludeOption).addOption(onlyOption).addOption(throttleOption).hook("preAction", validateExcludeOnly).hook("preAction", async (thisCommand) => {
    const opts = thisCommand.opts();
    const ext = path.extname(String(opts.file));
    if (ext === ".enc") {
      if (!opts.key) {
        const answers = await inquirer.prompt([
          {
            type: "password",
            message: "Please enter your decryption key",
            name: "key"
          }
        ]);
        if (!answers.key?.length) {
          exitWith(1, "No key entered, aborting import.");
        }
        opts.key = answers.key;
      }
    }
  }).hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts();
    const { extname: extname2, parse } = path;
    let file2 = opts.file;
    if (extname2(file2) === ".enc") {
      file2 = parse(file2).name;
      thisCommand.opts().decrypt = true;
    } else {
      thisCommand.opts().decrypt = false;
    }
    if (extname2(file2) === ".gz") {
      file2 = parse(file2).name;
      thisCommand.opts().decompress = true;
    } else {
      thisCommand.opts().decompress = false;
    }
    if (extname2(file2) !== ".tar") {
      exitWith(
        1,
        `The file '${opts.file}' does not appear to be a valid Strapi data file. It must have an extension ending in .tar[.gz][.enc]`
      );
    }
  }).hook(
    "preAction",
    getCommanderConfirmMessage(
      "The import will delete your existing data! Are you sure you want to proceed?",
      { failMessage: "Import process aborted" }
    )
  ).action(action$1);
};
const { createTransferEngine } = engineDatatransfer;
const {
  providers: {
    createRemoteStrapiDestinationProvider,
    createLocalStrapiSourceProvider,
    createLocalStrapiDestinationProvider,
    createRemoteStrapiSourceProvider
  }
} = strapiDatatransfer;
const action = async (opts) => {
  if (!isObject(opts)) {
    exitWith(1, "Could not parse command arguments");
  }
  if (!(opts.from || opts.to) || opts.from && opts.to) {
    exitWith(1, "Exactly one source (from) or destination (to) option must be provided");
  }
  const strapi2 = await createStrapiInstance();
  let source;
  let destination;
  if (!opts.from) {
    source = createLocalStrapiSourceProvider({
      getStrapi: () => strapi2
    });
  } else {
    if (!opts.fromToken) {
      exitWith(1, "Missing token for remote destination");
    }
    source = createRemoteStrapiSourceProvider({
      getStrapi: () => strapi2,
      url: opts.from,
      auth: {
        type: "token",
        token: opts.fromToken
      }
    });
  }
  if (!opts.to) {
    destination = createLocalStrapiDestinationProvider({
      getStrapi: () => strapi2,
      strategy: "restore",
      restore: parseRestoreFromOptions(opts)
    });
  } else {
    if (!opts.toToken) {
      exitWith(1, "Missing token for remote destination");
    }
    destination = createRemoteStrapiDestinationProvider({
      url: opts.to,
      auth: {
        type: "token",
        token: opts.toToken
      },
      strategy: "restore",
      restore: parseRestoreFromOptions(opts)
    });
  }
  if (!source || !destination) {
    exitWith(1, "Could not create providers");
  }
  const engine = createTransferEngine(source, destination, {
    versionStrategy: "exact",
    schemaStrategy: "strict",
    exclude: opts.exclude,
    only: opts.only,
    throttle: opts.throttle,
    transforms: {
      links: [
        {
          filter(link2) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.left.type) && !DEFAULT_IGNORED_CONTENT_TYPES.includes(link2.right.type);
          }
        }
      ],
      entities: [
        {
          filter(entity2) {
            return !DEFAULT_IGNORED_CONTENT_TYPES.includes(entity2.type);
          }
        }
      ]
    }
  });
  engine.diagnostics.onDiagnostic(formatDiagnostic("transfer"));
  const progress = engine.progress.stream;
  const { updateLoader } = loadersFactory();
  engine.onSchemaDiff(getDiffHandler(engine, { force: opts.force, action: "transfer" }));
  engine.addErrorHandler(
    "ASSETS_DIRECTORY_ERR",
    getAssetsBackupHandler(engine, { force: opts.force, action: "transfer" })
  );
  progress.on(`stage::start`, ({ stage, data }) => {
    updateLoader(stage, data).start();
  });
  progress.on("stage::finish", ({ stage, data }) => {
    updateLoader(stage, data).succeed();
  });
  progress.on("stage::progress", ({ stage, data }) => {
    updateLoader(stage, data);
  });
  progress.on("stage::error", ({ stage, data }) => {
    updateLoader(stage, data).fail();
  });
  progress.on("transfer::start", async () => {
    console.log(`Starting transfer...`);
    await strapi2.telemetry.send("didDEITSProcessStart", getTransferTelemetryPayload(engine));
  });
  let results;
  try {
    setSignalHandler(() => abortTransfer({ engine, strapi: strapi2 }));
    results = await engine.transfer();
    await strapi2.telemetry.send("didDEITSProcessFinish", getTransferTelemetryPayload(engine));
    try {
      const table = buildTransferTable(results.engine);
      console.log(table?.toString());
    } catch (e) {
      console.error("There was an error displaying the results of the transfer.");
    }
    exitWith(0, exitMessageText("transfer"));
  } catch (e) {
    await strapi2.telemetry.send("didDEITSProcessFail", getTransferTelemetryPayload(engine));
    exitWith(1, exitMessageText("transfer", true));
  }
};
const command = ({ command: command2 }) => {
  command2.command("transfer").description("Transfer data from one source to another").allowExcessArguments(false).addOption(
    new Option(
      "--from <sourceURL>",
      `URL of the remote Strapi instance to get data from`
    ).argParser(parseURL)
  ).addOption(new Option("--from-token <token>", `Transfer token for the remote Strapi source`)).addOption(
    new Option(
      "--to <destinationURL>",
      `URL of the remote Strapi instance to send data to`
    ).argParser(parseURL)
  ).addOption(new Option("--to-token <token>", `Transfer token for the remote Strapi destination`)).addOption(forceOption).addOption(excludeOption).addOption(onlyOption).addOption(throttleOption).hook("preAction", validateExcludeOnly).hook(
    "preAction",
    ifOptions(
      (opts) => !(opts.from || opts.to) || opts.from && opts.to,
      async () => exitWith(
        1,
        "Exactly one remote source (from) or destination (to) option must be provided"
      )
    )
  ).hook(
    "preAction",
    ifOptions(
      (opts) => opts.from,
      async (thisCommand) => {
        assertUrlHasProtocol(thisCommand.opts().from, ["https:", "http:"]);
        if (!thisCommand.opts().fromToken) {
          const answers = await inquirer.prompt([
            {
              type: "password",
              message: "Please enter your transfer token for the remote Strapi source",
              name: "fromToken"
            }
          ]);
          if (!answers.fromToken?.length) {
            exitWith(1, "No token provided for remote source, aborting transfer.");
          }
          thisCommand.opts().fromToken = answers.fromToken;
        }
        await getCommanderConfirmMessage(
          "The transfer will delete all the local Strapi assets and its database. Are you sure you want to proceed?",
          { failMessage: "Transfer process aborted" }
        )(thisCommand);
      }
    )
  ).hook(
    "preAction",
    ifOptions(
      (opts) => opts.to,
      async (thisCommand) => {
        assertUrlHasProtocol(thisCommand.opts().to, ["https:", "http:"]);
        if (!thisCommand.opts().toToken) {
          const answers = await inquirer.prompt([
            {
              type: "password",
              message: "Please enter your transfer token for the remote Strapi destination",
              name: "toToken"
            }
          ]);
          if (!answers.toToken?.length) {
            exitWith(1, "No token provided for remote destination, aborting transfer.");
          }
          thisCommand.opts().toToken = answers.toToken;
        }
        await getCommanderConfirmMessage(
          "The transfer will delete existing data from the remote Strapi! Are you sure you want to proceed?",
          { failMessage: "Transfer process aborted" }
        )(thisCommand);
      }
    )
  ).action(action);
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  export: command$2,
  import: command$1,
  transfer: command
}, Symbol.toStringTag, { value: "Module" }));
export {
  index as commands,
  engineDatatransfer as engine,
  file,
  strapiDatatransfer as strapi,
  index$6 as utils
};
//# sourceMappingURL=index.mjs.map
