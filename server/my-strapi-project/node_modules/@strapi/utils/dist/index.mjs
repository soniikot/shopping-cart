import _$1, { isString, isPlainObject as isPlainObject$1, kebabCase } from "lodash";
import { eq, isEmpty, toPath, defaults, trimChars, trimCharsEnd, trimCharsStart, get, isNumber, isInteger, has, union, getOr, assoc, assign, cloneDeep, remove, merge, isNil, pipe, omit, curry, isArray, isString as isString$1, isObject, clone, pick, trim, split, map, flatten, first, join, constant, mergeAll, toNumber } from "lodash/fp";
import * as yup$1 from "yup";
import { HttpError } from "http-errors";
import slugify from "@sindresorhus/slugify";
import pMap from "p-map";
import { Writable } from "node:stream";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const parseMultipartData = (ctx) => {
  if (!ctx.is("multipart")) {
    return { data: ctx.request.body, files: {} };
  }
  const { body = {}, files = {} } = ctx.request;
  if (!body.data) {
    return ctx.badRequest(
      `When using multipart/form-data you need to provide your data in a JSON 'data' field.`
    );
  }
  let data;
  try {
    data = JSON.parse(body.data);
  } catch (error) {
    return ctx.badRequest(`Invalid 'data' field. 'data' should be a valid JSON.`);
  }
  const filesToUpload = Object.keys(files).reduce((acc2, key2) => {
    const fullPath = _$1.toPath(key2);
    if (fullPath.length <= 1 || fullPath[0] !== "files") {
      return ctx.badRequest(
        `When using multipart/form-data you need to provide your files by prefixing them with the 'files'.
For example, when a media file is named "avatar", make sure the form key name is "files.avatar"`
      );
    }
    const path = _$1.tail(fullPath);
    acc2[path.join(".")] = files[key2];
    return acc2;
  }, {});
  return {
    data,
    files: filesToUpload
  };
};
const _ = require("lodash");
const dates = require("date-fns");
const timeRegex = /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]{1,3})?$/;
const isDate = (v) => {
  return dates.isDate(v);
};
const parseTime = (value2) => {
  if (isDate(value2)) {
    return dates.format(value2, "HH:mm:ss.SSS");
  }
  if (typeof value2 !== "string") {
    throw new Error(`Expected a string, got a ${typeof value2}`);
  }
  const result = value2.match(timeRegex);
  if (result === null) {
    throw new Error("Invalid time format, expected HH:mm:ss.SSS");
  }
  const [, hours, minutes, seconds, fraction = ".000"] = result;
  const fractionPart = _.padEnd(fraction.slice(1), 3, "0");
  return `${hours}:${minutes}:${seconds}.${fractionPart}`;
};
const parseDate = (value2) => {
  if (isDate(value2)) {
    return dates.format(value2, "yyyy-MM-dd");
  }
  if (typeof value2 !== "string") {
    throw new Error(`Expected a string, got a ${typeof value2}`);
  }
  try {
    const date = dates.parseISO(value2);
    if (dates.isValid(date))
      return dates.format(date, "yyyy-MM-dd");
    throw new Error(`Invalid format, expected an ISO compatible date`);
  } catch (error) {
    throw new Error(`Invalid format, expected an ISO compatible date`);
  }
};
const parseDateTimeOrTimestamp = (value2) => {
  if (isDate(value2)) {
    return value2;
  }
  if (typeof value2 !== "string") {
    throw new Error(`Expected a string, got a ${typeof value2}`);
  }
  try {
    const date = dates.parseISO(value2);
    if (dates.isValid(date))
      return date;
    const milliUnixDate = dates.parse(value2, "T", /* @__PURE__ */ new Date());
    if (dates.isValid(milliUnixDate))
      return milliUnixDate;
    throw new Error(`Invalid format, expected a timestamp or an ISO date`);
  } catch (error) {
    throw new Error(`Invalid format, expected a timestamp or an ISO date`);
  }
};
const parseBoolean = (value2, options) => {
  const { forceCast = false } = options;
  if (typeof value2 === "boolean") {
    return value2;
  }
  if (typeof value2 === "string" || typeof value2 === "number") {
    if (["true", "t", "1", 1].includes(value2)) {
      return true;
    }
    if (["false", "f", "0", 0].includes(value2)) {
      return false;
    }
  }
  if (forceCast) {
    return Boolean(value2);
  }
  throw new Error('Invalid boolean input. Expected "t","1","true","false","0","f"');
};
const parseType = (options) => {
  const { type, value: value2, forceCast } = options;
  switch (type) {
    case "boolean":
      return parseBoolean(value2, { forceCast });
    case "integer":
    case "biginteger":
    case "float":
    case "decimal": {
      return _.toNumber(value2);
    }
    case "time": {
      return parseTime(value2);
    }
    case "date": {
      return parseDate(value2);
    }
    case "timestamp":
    case "datetime": {
      return parseDateTimeOrTimestamp(value2);
    }
    default:
      return value2;
  }
};
const PLUGIN_PREFIX = "plugin::";
const API_PREFIX = "api::";
const parsePolicy = (policy2) => {
  if (typeof policy2 === "string") {
    return { policyName: policy2, config: {} };
  }
  const { name, config } = policy2;
  return { policyName: name, config };
};
const searchLocalPolicy = (policyName, policyContext) => {
  const { pluginName, apiName } = policyContext ?? {};
  if (pluginName) {
    return strapi.policy(`${PLUGIN_PREFIX}${pluginName}.${policyName}`);
  }
  if (apiName) {
    return strapi.policy(`${API_PREFIX}${apiName}.${policyName}`);
  }
};
const globalPolicy = ({ method, endpoint, controller, action, plugin }) => {
  return async (ctx, next) => {
    ctx.request.route = {
      endpoint: `${method} ${endpoint}`,
      controller: _$1.toLower(controller),
      action: _$1.toLower(action),
      verb: _$1.toLower(method),
      plugin
    };
    await next();
  };
};
const resolvePolicies = (config, policyContext) => {
  const { pluginName, apiName } = policyContext ?? {};
  return config.map((policyConfig) => {
    return {
      handler: getPolicy(policyConfig, { pluginName, apiName }),
      config: typeof policyConfig === "object" && policyConfig.config || {}
    };
  });
};
const findPolicy = (name, policyContext) => {
  const { pluginName, apiName } = policyContext ?? {};
  const resolvedPolicy = strapi.policy(name);
  if (resolvedPolicy !== void 0) {
    return resolvedPolicy;
  }
  const localPolicy = searchLocalPolicy(name, { pluginName, apiName });
  if (localPolicy !== void 0) {
    return localPolicy;
  }
  throw new Error(`Could not find policy "${name}"`);
};
const getPolicy = (policyConfig, policyContext) => {
  const { pluginName, apiName } = policyContext ?? {};
  if (typeof policyConfig === "function") {
    return policyConfig;
  }
  const { policyName, config } = parsePolicy(policyConfig);
  const policy2 = findPolicy(policyName, { pluginName, apiName });
  if (typeof policy2 === "function") {
    return policy2;
  }
  if (policy2.validator) {
    policy2.validator(config);
  }
  return policy2.handler;
};
const createPolicy = (options) => {
  const { name = "unnamed", validator, handler } = options;
  const wrappedValidator = (config) => {
    if (validator) {
      try {
        validator(config);
      } catch (e) {
        throw new Error(`Invalid config passed to "${name}" policy.`);
      }
    }
  };
  return {
    name,
    validator: wrappedValidator,
    handler
  };
};
const createPolicyContext = (type, ctx) => {
  return Object.assign(
    {
      is: eq(type),
      get type() {
        return type;
      }
    },
    ctx
  );
};
const policy = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createPolicy,
  createPolicyContext,
  get: getPolicy,
  globalPolicy,
  resolve: resolvePolicies
}, Symbol.toStringTag, { value: "Module" }));
const regex = /\$\{[^()]*\}/g;
const excludeConfigPaths = ["info.scripts"];
const isObj$3 = (value2) => isPlainObject$1(value2);
const templateConfiguration = (obj, configPath = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (isObj$3(value) && !isString(value)) {
      acc[key] = templateConfiguration(value, `${configPath}.${key}`);
    } else if (isString(value) && !excludeConfigPaths.includes(configPath.substr(1)) && value.match(regex) !== null) {
      acc[key] = eval("`" + value + "`");
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
const formatYupInnerError = (yupError) => ({
  path: toPath(yupError.path),
  message: yupError.message,
  name: yupError.name
});
const formatYupErrors = (yupError) => ({
  errors: isEmpty(yupError.inner) ? [formatYupInnerError(yupError)] : yupError.inner.map(formatYupInnerError),
  message: yupError.message
});
class ApplicationError extends Error {
  name;
  details;
  message;
  constructor(message = "An application error occured", details = {}) {
    super();
    this.name = "ApplicationError";
    this.message = message;
    this.details = details;
  }
}
class ValidationError extends ApplicationError {
  constructor(message, details) {
    super(message, details);
    this.name = "ValidationError";
  }
}
class YupValidationError extends ValidationError {
  constructor(yupError, message) {
    super("Validation");
    const { errors: errors2, message: yupMessage } = formatYupErrors(yupError);
    this.message = message || yupMessage;
    this.details = { errors: errors2 };
  }
}
class PaginationError extends ApplicationError {
  constructor(message = "Invalid pagination", details) {
    super(message, details);
    this.name = "PaginationError";
    this.message = message;
  }
}
class NotFoundError extends ApplicationError {
  constructor(message = "Entity not found", details) {
    super(message, details);
    this.name = "NotFoundError";
    this.message = message;
  }
}
class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden access", details) {
    super(message, details);
    this.name = "ForbiddenError";
    this.message = message;
  }
}
class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized", details) {
    super(message, details);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}
class RateLimitError extends ApplicationError {
  constructor(message = "Too many requests, please try again later.", details) {
    super(message, details);
    this.name = "RateLimitError";
    this.message = message;
    this.details = details || {};
  }
}
class PayloadTooLargeError extends ApplicationError {
  constructor(message = "Entity too large", details) {
    super(message, details);
    this.name = "PayloadTooLargeError";
    this.message = message;
  }
}
class PolicyError extends ForbiddenError {
  constructor(message = "Policy Failed", details) {
    super(message, details);
    this.name = "PolicyError";
    this.message = message;
    this.details = details || {};
  }
}
class NotImplementedError extends ApplicationError {
  constructor(message = "This feature is not implemented yet", details) {
    super(message, details);
    this.name = "NotImplementedError";
    this.message = message;
  }
}
const errors = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ApplicationError,
  ForbiddenError,
  HttpError,
  NotFoundError,
  NotImplementedError,
  PaginationError,
  PayloadTooLargeError,
  PolicyError,
  RateLimitError,
  UnauthorizedError,
  ValidationError,
  YupValidationError
}, Symbol.toStringTag, { value: "Module" }));
const handleYupError = (error, errorMessage) => {
  throw new YupValidationError(error, errorMessage);
};
const defaultValidationParam = { strict: true, abortEarly: false };
const validateYupSchema = (schema, options = {}) => async (body, errorMessage) => {
  try {
    const optionsWithDefaults = defaults(defaultValidationParam, options);
    const result = await schema.validate(body, optionsWithDefaults);
    return result;
  } catch (e) {
    if (e instanceof yup$1.ValidationError) {
      handleYupError(e, errorMessage);
    }
    throw e;
  }
};
const validateYupSchemaSync = (schema, options = {}) => (body, errorMessage) => {
  try {
    const optionsWithDefaults = defaults(defaultValidationParam, options);
    return schema.validateSync(body, optionsWithDefaults);
  } catch (e) {
    if (e instanceof yup$1.ValidationError) {
      handleYupError(e, errorMessage);
    }
    throw e;
  }
};
const nameToSlug = (name, options = { separator: "-" }) => slugify(name, options);
const nameToCollectionName = (name) => slugify(name, { separator: "_" });
const toRegressedEnumValue = (value2) => slugify(value2, {
  decamelize: false,
  lowercase: false,
  separator: "_"
});
const getCommonBeginning = (...strings) => _$1.takeWhile(strings[0], (char, index2) => strings.every((string) => string[index2] === char)).join(
  ""
);
const getCommonPath = (...paths) => {
  const [segments, ...otherSegments] = paths.map((it) => _$1.split(it, "/"));
  return _$1.join(
    _$1.takeWhile(segments, (str, index2) => otherSegments.every((it) => it[index2] === str)),
    "/"
  );
};
const escapeQuery = (query, charsToEscape, escapeChar = "\\") => {
  return query.split("").reduce(
    (escapedQuery, char) => charsToEscape.includes(char) ? `${escapedQuery}${escapeChar}${char}` : `${escapedQuery}${char}`,
    ""
  );
};
const stringIncludes = (arr, val) => arr.map(String).includes(String(val));
const stringEquals = (a, b) => String(a) === String(b);
const isCamelCase = (value2) => /^[a-z][a-zA-Z0-9]+$/.test(value2);
const isKebabCase = (value2) => /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(value2);
const startsWithANumber = (value2) => /^[0-9]/.test(value2);
const joinBy = (joint, ...args) => {
  const trim2 = trimChars(joint);
  const trimEnd = trimCharsEnd(joint);
  const trimStart = trimCharsStart(joint);
  return args.reduce((url, path, index2) => {
    if (args.length === 1)
      return path;
    if (index2 === 0)
      return trimEnd(path);
    if (index2 === args.length - 1)
      return url + joint + trimStart(path);
    return url + joint + trim2(path);
  }, "");
};
const toKebabCase = (value2) => kebabCase(value2);
const { toString } = Object.prototype;
const errorToString = Error.prototype.toString;
const regExpToString = RegExp.prototype.toString;
const symbolToString = typeof Symbol !== "undefined" ? Symbol.prototype.toString : () => "";
const SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
function printNumber(val) {
  if (val != +val)
    return "NaN";
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? "-0" : `${val}`;
}
function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false)
    return `${val}`;
  if (typeof val === "number")
    return printNumber(val);
  if (typeof val === "string")
    return quoteStrings ? `"${val}"` : val;
  if (typeof val === "function")
    return `[Function ${val.name || "anonymous"}]`;
  if (typeof val === "symbol")
    return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  const tag = toString.call(val).slice(8, -1);
  if (tag === "Date") {
    const v = val;
    return Number.isNaN(v.getTime()) ? `${v}` : v.toISOString();
  }
  if (tag === "Error" || val instanceof Error)
    return `[${errorToString.call(val)}]`;
  if (tag === "RegExp")
    return regExpToString.call(val);
  return null;
}
function printValue(value2, quoteStrings) {
  const result = printSimpleValue(value2, quoteStrings);
  if (result !== null)
    return result;
  return JSON.stringify(
    value2,
    function replacer(key2, value22) {
      const result2 = printSimpleValue(this[key2], quoteStrings);
      if (result2 !== null)
        return result2;
      return value22;
    },
    2
  );
}
const strapiID = () => new StrapiIDSchema();
const isNotNilTest = (value2) => !_$1.isNil(value2);
const isNotNullTest = (value2) => !_$1.isNull(value2);
yup$1.addMethod(yup$1.mixed, "notNil", function isNotNill(msg = "${path} must be defined.") {
  return this.test("defined", msg, isNotNilTest);
});
yup$1.addMethod(yup$1.mixed, "notNull", function isNotNull(msg = "${path} cannot be null.") {
  return this.test("defined", msg, isNotNullTest);
});
yup$1.addMethod(yup$1.mixed, "isFunction", function isFunction(message = "${path} is not a function") {
  return this.test(
    "is a function",
    message,
    (value2) => _$1.isUndefined(value2) || _$1.isFunction(value2)
  );
});
yup$1.addMethod(
  yup$1.string,
  "isCamelCase",
  function isCamelCase$1(message = "${path} is not in camel case (anExampleOfCamelCase)") {
    return this.test(
      "is in camelCase",
      message,
      (value2) => value2 ? isCamelCase(value2) : true
    );
  }
);
yup$1.addMethod(
  yup$1.string,
  "isKebabCase",
  function isKebabCase$1(message = "${path} is not in kebab case (an-example-of-kebab-case)") {
    return this.test(
      "is in kebab-case",
      message,
      (value2) => value2 ? isKebabCase(value2) : true
    );
  }
);
yup$1.addMethod(
  yup$1.object,
  "onlyContainsFunctions",
  function onlyContainsFunctions(message = "${path} contains values that are not functions") {
    return this.test(
      "only contains functions",
      message,
      (value2) => _$1.isUndefined(value2) || value2 && Object.values(value2).every(_$1.isFunction)
    );
  }
);
yup$1.addMethod(
  yup$1.array,
  "uniqueProperty",
  function uniqueProperty(propertyName, message) {
    return this.test("unique", message, function unique(list) {
      const errors2 = [];
      list?.forEach((element, index2) => {
        const sameElements = list.filter(
          (e) => get(propertyName, e) === get(propertyName, element)
        );
        if (sameElements.length > 1) {
          errors2.push(
            this.createError({
              path: `${this.path}[${index2}].${propertyName}`,
              message
            })
          );
        }
      });
      if (errors2.length) {
        throw new yup$1.ValidationError(errors2);
      }
      return true;
    });
  }
);
class StrapiIDSchema extends yup$1.MixedSchema {
  constructor() {
    super({ type: "strapiID" });
  }
  _typeCheck(value2) {
    return typeof value2 === "string" || isNumber(value2) && isInteger(value2) && value2 >= 0;
  }
}
yup$1.setLocale({
  mixed: {
    notType(options) {
      const { path, type, value: value2, originalValue } = options;
      const isCast = originalValue != null && originalValue !== value2;
      const msg = `${path} must be a \`${type}\` type, but the final value was: \`${printValue(value2, true)}\`${isCast ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : "."}`;
      return msg;
    }
  }
});
const yup = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  StrapiIDSchema,
  strapiID
}, [yup$1]);
const removeUndefined = (obj2) => _$1.pickBy(obj2, (value2) => typeof value2 !== "undefined");
const keysDeep = (obj2, path = []) => !_$1.isObject(obj2) ? [path.join(".")] : _$1.reduce(
  obj2,
  (acc2, next, key2) => _$1.concat(acc2, keysDeep(next, [...path, key2])),
  []
);
const getConfigUrls = (config, forAdminBuild = false) => {
  const serverConfig = config.get("server");
  const adminConfig = config.get("admin");
  let serverUrl = _$1.get(serverConfig, "url", "");
  serverUrl = _$1.trim(serverUrl, "/ ");
  if (typeof serverUrl !== "string") {
    throw new Error("Invalid server url config. Make sure the url is a string.");
  }
  if (serverUrl.startsWith("http")) {
    try {
      serverUrl = _$1.trim(new URL(serverConfig.url).toString(), "/");
    } catch (e) {
      throw new Error(
        "Invalid server url config. Make sure the url defined in server.js is valid."
      );
    }
  } else if (serverUrl !== "") {
    serverUrl = `/${serverUrl}`;
  }
  let adminUrl = _$1.get(adminConfig, "url", "/admin");
  adminUrl = _$1.trim(adminUrl, "/ ");
  if (typeof adminUrl !== "string") {
    throw new Error("Invalid admin url config. Make sure the url is a non-empty string.");
  }
  if (adminUrl.startsWith("http")) {
    try {
      adminUrl = _$1.trim(new URL(adminUrl).toString(), "/");
    } catch (e) {
      throw new Error("Invalid admin url config. Make sure the url defined in server.js is valid.");
    }
  } else {
    adminUrl = `${serverUrl}/${adminUrl}`;
  }
  let adminPath = adminUrl;
  if (serverUrl.startsWith("http") && adminUrl.startsWith("http") && new URL(adminUrl).origin === new URL(serverUrl).origin && !forAdminBuild) {
    adminPath = adminUrl.replace(getCommonPath(serverUrl, adminUrl), "");
    adminPath = `/${_$1.trim(adminPath, "/")}`;
  } else if (adminUrl.startsWith("http")) {
    adminPath = new URL(adminUrl).pathname;
  }
  return {
    serverUrl,
    adminUrl,
    adminPath
  };
};
const getAbsoluteUrl = (adminOrServer) => (config, forAdminBuild = false) => {
  const { serverUrl, adminUrl } = getConfigUrls(config, forAdminBuild);
  const url = adminOrServer === "server" ? serverUrl : adminUrl;
  if (url.startsWith("http")) {
    return url;
  }
  const hostname = config.get("environment") === "development" && ["127.0.0.1", "0.0.0.0"].includes(config.get("server.host")) ? "localhost" : config.get("server.host");
  return `http://${hostname}:${config.get("server.port")}${url}`;
};
const getAbsoluteAdminUrl = getAbsoluteUrl("admin");
const getAbsoluteServerUrl = getAbsoluteUrl("server");
const generateTimestampCode = (date) => {
  const referDate = date || /* @__PURE__ */ new Date();
  return referDate.getTime().toString(36);
};
const SINGLE_TYPE = "singleType";
const COLLECTION_TYPE = "collectionType";
const ID_ATTRIBUTE = "id";
const PUBLISHED_AT_ATTRIBUTE$1 = "publishedAt";
const CREATED_BY_ATTRIBUTE$3 = "createdBy";
const UPDATED_BY_ATTRIBUTE$3 = "updatedBy";
const CREATED_AT_ATTRIBUTE = "createdAt";
const UPDATED_AT_ATTRIBUTE = "updatedAt";
const DP_PUB_STATE_LIVE = "live";
const DP_PUB_STATE_PREVIEW = "preview";
const DP_PUB_STATES = [DP_PUB_STATE_LIVE, DP_PUB_STATE_PREVIEW];
const constants$1 = {
  ID_ATTRIBUTE,
  PUBLISHED_AT_ATTRIBUTE: PUBLISHED_AT_ATTRIBUTE$1,
  CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$3,
  UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$3,
  CREATED_AT_ATTRIBUTE,
  UPDATED_AT_ATTRIBUTE,
  DP_PUB_STATES,
  DP_PUB_STATE_LIVE,
  DP_PUB_STATE_PREVIEW,
  SINGLE_TYPE,
  COLLECTION_TYPE
};
const getTimestamps = (model) => {
  const attributes = [];
  if (has(CREATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(CREATED_AT_ATTRIBUTE);
  }
  if (has(UPDATED_AT_ATTRIBUTE, model.attributes)) {
    attributes.push(UPDATED_AT_ATTRIBUTE);
  }
  return attributes;
};
const getCreatorFields = (model) => {
  const attributes = [];
  if (has(CREATED_BY_ATTRIBUTE$3, model.attributes)) {
    attributes.push(CREATED_BY_ATTRIBUTE$3);
  }
  if (has(UPDATED_BY_ATTRIBUTE$3, model.attributes)) {
    attributes.push(UPDATED_BY_ATTRIBUTE$3);
  }
  return attributes;
};
const getNonWritableAttributes = (model) => {
  if (!model)
    return [];
  const nonWritableAttributes = _$1.reduce(
    model.attributes,
    (acc2, attr, attrName) => attr.writable === false ? acc2.concat(attrName) : acc2,
    []
  );
  return _$1.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonWritableAttributes]);
};
const getWritableAttributes = (model) => {
  if (!model)
    return [];
  return _$1.difference(Object.keys(model.attributes), getNonWritableAttributes(model));
};
const isWritableAttribute = (model, attributeName) => {
  return getWritableAttributes(model).includes(attributeName);
};
const getNonVisibleAttributes = (model) => {
  const nonVisibleAttributes = _$1.reduce(
    model.attributes,
    (acc2, attr, attrName) => attr.visible === false ? acc2.concat(attrName) : acc2,
    []
  );
  return _$1.uniq([ID_ATTRIBUTE, ...getTimestamps(model), ...nonVisibleAttributes]);
};
const getVisibleAttributes = (model) => {
  return _$1.difference(_$1.keys(model.attributes), getNonVisibleAttributes(model));
};
const isVisibleAttribute = (model, attributeName) => {
  return getVisibleAttributes(model).includes(attributeName);
};
const getOptions = (model) => _$1.assign({ draftAndPublish: false }, _$1.get(model, "options", {}));
const hasDraftAndPublish = (model) => _$1.get(model, "options.draftAndPublish", false) === true;
const isDraft = (data, model) => hasDraftAndPublish(model) && _$1.get(data, PUBLISHED_AT_ATTRIBUTE$1) === null;
const isSingleType = ({ kind = COLLECTION_TYPE }) => kind === SINGLE_TYPE;
const isCollectionType = ({ kind = COLLECTION_TYPE }) => kind === COLLECTION_TYPE;
const isKind = (kind) => (model) => model.kind === kind;
const getStoredPrivateAttributes = (model) => union(
  strapi?.config?.get("api.responses.privateAttributes", []) ?? [],
  getOr([], "options.privateAttributes", model)
);
const getPrivateAttributes = (model) => {
  return _$1.union(
    getStoredPrivateAttributes(model),
    _$1.keys(_$1.pickBy(model.attributes, (attr) => !!attr.private))
  );
};
const isPrivateAttribute = (model, attributeName) => {
  if (model?.attributes?.[attributeName]?.private === true) {
    return true;
  }
  return getStoredPrivateAttributes(model).includes(attributeName);
};
const isScalarAttribute = (attribute) => {
  return !["media", "component", "relation", "dynamiczone"].includes(attribute?.type);
};
const isMediaAttribute = (attribute) => attribute?.type === "media";
const isRelationalAttribute = (attribute) => attribute?.type === "relation";
const isComponentAttribute = (attribute) => ["component", "dynamiczone"].includes(attribute?.type);
const isDynamicZoneAttribute = (attribute) => attribute?.type === "dynamiczone";
const isMorphToRelationalAttribute = (attribute) => {
  return isRelationalAttribute(attribute) && attribute?.relation?.startsWith?.("morphTo");
};
const getComponentAttributes = (schema) => {
  return _$1.reduce(
    schema.attributes,
    (acc2, attr, attrName) => {
      if (isComponentAttribute(attr))
        acc2.push(attrName);
      return acc2;
    },
    []
  );
};
const getScalarAttributes = (schema) => {
  return _$1.reduce(
    schema.attributes,
    (acc2, attr, attrName) => {
      if (isScalarAttribute(attr))
        acc2.push(attrName);
      return acc2;
    },
    []
  );
};
const isTypedAttribute = (attribute, type) => {
  return _$1.has(attribute, "type") && attribute.type === type;
};
const getContentTypeRoutePrefix = (contentType) => {
  return isSingleType(contentType) ? _$1.kebabCase(contentType.info.singularName) : _$1.kebabCase(contentType.info.pluralName);
};
const contentTypes = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants: constants$1,
  getComponentAttributes,
  getContentTypeRoutePrefix,
  getCreatorFields,
  getNonVisibleAttributes,
  getNonWritableAttributes,
  getOptions,
  getPrivateAttributes,
  getScalarAttributes,
  getTimestamps,
  getVisibleAttributes,
  getWritableAttributes,
  hasDraftAndPublish,
  isCollectionType,
  isComponentAttribute,
  isDraft,
  isDynamicZoneAttribute,
  isKind,
  isMediaAttribute,
  isMorphToRelationalAttribute,
  isPrivateAttribute,
  isRelationalAttribute,
  isScalarAttribute,
  isSingleType,
  isTypedAttribute,
  isVisibleAttribute,
  isWritableAttribute
}, Symbol.toStringTag, { value: "Module" }));
function envFn(key2, defaultValue) {
  return _$1.has(process.env, key2) ? process.env[key2] : defaultValue;
}
function getKey(key2) {
  return process.env[key2] ?? "";
}
const utils = {
  int(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    return parseInt(getKey(key2), 10);
  },
  float(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    return parseFloat(getKey(key2));
  },
  bool(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    return getKey(key2) === "true";
  },
  json(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    try {
      return JSON.parse(getKey(key2));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Invalid json environment variable ${key2}: ${error.message}`);
      }
      throw error;
    }
  },
  array(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    let value2 = getKey(key2);
    if (value2.startsWith("[") && value2.endsWith("]")) {
      value2 = value2.substring(1, value2.length - 1);
    }
    return value2.split(",").map((v) => {
      return _$1.trim(_$1.trim(v, " "), '"');
    });
  },
  date(key2, defaultValue) {
    if (!_$1.has(process.env, key2)) {
      return defaultValue;
    }
    return new Date(getKey(key2));
  },
  /**
   * Gets a value from env that matches oneOf provided values
   * @param {string} key
   * @param {string[]} expectedValues
   * @param {string|undefined} defaultValue
   * @returns {string|undefined}
   */
  oneOf(key2, expectedValues, defaultValue) {
    if (!expectedValues) {
      throw new Error(`env.oneOf requires expectedValues`);
    }
    if (defaultValue && !expectedValues.includes(defaultValue)) {
      throw new Error(`env.oneOf requires defaultValue to be included in expectedValues`);
    }
    const rawValue = env(key2, defaultValue);
    return expectedValues.includes(rawValue) ? rawValue : defaultValue;
  }
};
const env = Object.assign(envFn, utils);
const MANY_RELATIONS = ["oneToMany", "manyToMany"];
const getRelationalFields = (contentType) => {
  return Object.keys(contentType.attributes).filter((attributeName) => {
    return contentType.attributes[attributeName].type === "relation";
  });
};
const isOneToAny = (attribute) => isRelationalAttribute(attribute) && ["oneToOne", "oneToMany"].includes(attribute.relation);
const isManyToAny = (attribute) => isRelationalAttribute(attribute) && ["manyToMany", "manyToOne"].includes(attribute.relation);
const isAnyToOne = (attribute) => isRelationalAttribute(attribute) && ["oneToOne", "manyToOne"].includes(attribute.relation);
const isAnyToMany = (attribute) => isRelationalAttribute(attribute) && ["oneToMany", "manyToMany"].includes(attribute.relation);
const constants = {
  MANY_RELATIONS
};
const relations = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  constants,
  getRelationalFields,
  isAnyToMany,
  isAnyToOne,
  isManyToAny,
  isOneToAny
}, Symbol.toStringTag, { value: "Module" }));
const { CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$2, UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$2 } = constants$1;
const setCreatorFields = ({ user, isEdition = false }) => (data) => {
  if (isEdition) {
    return assoc(UPDATED_BY_ATTRIBUTE$2, user.id, data);
  }
  return assign(data, {
    [CREATED_BY_ATTRIBUTE$2]: user.id,
    [UPDATED_BY_ATTRIBUTE$2]: user.id
  });
};
const createHook = () => {
  const state = {
    handlers: []
  };
  return {
    getHandlers() {
      return state.handlers;
    },
    register(handler) {
      state.handlers.push(handler);
      return this;
    },
    delete(handler) {
      state.handlers = remove(eq(handler), state.handlers);
      return this;
    },
    call() {
      throw new Error("Method not implemented");
    }
  };
};
const createAsyncSeriesHook = () => ({
  ...createHook(),
  async call(context) {
    for (const handler of this.getHandlers()) {
      await handler(context);
    }
  }
});
const createAsyncSeriesWaterfallHook = () => ({
  ...createHook(),
  async call(param) {
    let res = param;
    for (const handler of this.getHandlers()) {
      res = await handler(res);
    }
    return res;
  }
});
const createAsyncParallelHook = () => ({
  ...createHook(),
  async call(context) {
    const promises = this.getHandlers().map((handler) => handler(cloneDeep(context)));
    return Promise.all(promises);
  }
});
const createAsyncBailHook = () => ({
  ...createHook(),
  async call(context) {
    for (const handler of this.getHandlers()) {
      const result = await handler(context);
      if (result !== void 0) {
        return result;
      }
    }
  }
});
const internals = {
  // Internal utils
  createHook
};
const hooks = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createAsyncBailHook,
  createAsyncParallelHook,
  createAsyncSeriesHook,
  createAsyncSeriesWaterfallHook,
  internals
}, Symbol.toStringTag, { value: "Module" }));
const createProviderHooksMap = () => ({
  // Register events
  willRegister: createAsyncSeriesHook(),
  didRegister: createAsyncParallelHook(),
  // Delete events
  willDelete: createAsyncParallelHook(),
  didDelete: createAsyncParallelHook()
});
const providerFactory = (options = {}) => {
  const { throwOnDuplicates = true } = options;
  const state = {
    hooks: createProviderHooksMap(),
    registry: /* @__PURE__ */ new Map()
  };
  return {
    hooks: state.hooks,
    async register(key2, item) {
      if (throwOnDuplicates && this.has(key2)) {
        throw new Error(`Duplicated item key: ${key2}`);
      }
      await state.hooks.willRegister.call({ key: key2, value: item });
      state.registry.set(key2, item);
      await state.hooks.didRegister.call({ key: key2, value: cloneDeep(item) });
      return this;
    },
    async delete(key2) {
      if (this.has(key2)) {
        const item = this.get(key2);
        await state.hooks.willDelete.call({ key: key2, value: cloneDeep(item) });
        state.registry.delete(key2);
        await state.hooks.didDelete.call({ key: key2, value: cloneDeep(item) });
      }
      return this;
    },
    get(key2) {
      return state.registry.get(key2);
    },
    values() {
      return Array.from(state.registry.values());
    },
    keys() {
      return Array.from(state.registry.keys());
    },
    has(key2) {
      return state.registry.has(key2);
    },
    size() {
      return state.registry.size;
    },
    async clear() {
      const keys = this.keys();
      for (const key2 of keys) {
        await this.delete(key2);
      }
      return this;
    }
  };
};
const STRAPI_DEFAULTS = {
  offset: {
    start: 0,
    limit: 10
  },
  page: {
    page: 1,
    pageSize: 10
  }
};
const paginationAttributes = ["start", "limit", "page", "pageSize"];
const withMaxLimit = (limit, maxLimit = -1) => {
  if (maxLimit === -1 || limit < maxLimit) {
    return limit;
  }
  return maxLimit;
};
const ensureMinValues = ({ start, limit }) => ({
  start: Math.max(start, 0),
  limit: limit === -1 ? limit : Math.max(limit, 1)
});
const ensureMaxValues = (maxLimit = -1) => ({ start, limit }) => ({
  start,
  limit: withMaxLimit(limit, maxLimit)
});
const withNoLimit = (pagination2, maxLimit = -1) => ({
  ...pagination2,
  limit: pagination2.limit === -1 ? maxLimit : pagination2.limit
});
const withDefaultPagination = (args, { defaults: defaults2 = {}, maxLimit = -1 } = {}) => {
  const defaultValues = merge(STRAPI_DEFAULTS, defaults2);
  const usePagePagination = !isNil(args.page) || !isNil(args.pageSize);
  const useOffsetPagination = !isNil(args.start) || !isNil(args.limit);
  const ensureValidValues = pipe(ensureMinValues, ensureMaxValues(maxLimit));
  if (!usePagePagination && !useOffsetPagination) {
    return merge(args, ensureValidValues(defaultValues.offset));
  }
  if (usePagePagination && useOffsetPagination) {
    throw new PaginationError("Cannot use both page & offset pagination in the same query");
  }
  const pagination2 = {
    start: 0,
    limit: 0
  };
  if (useOffsetPagination) {
    const { start, limit } = merge(defaultValues.offset, args);
    Object.assign(pagination2, { start, limit });
  }
  if (usePagePagination) {
    const { page, pageSize } = merge(defaultValues.page, {
      ...args,
      pageSize: Math.max(1, args.pageSize ?? 0)
    });
    Object.assign(pagination2, {
      start: (page - 1) * pageSize,
      limit: pageSize
    });
  }
  Object.assign(pagination2, withNoLimit(pagination2, maxLimit));
  const replacePaginationAttributes = pipe(
    // Remove pagination attributes
    omit(paginationAttributes),
    // Merge the object with the new pagination + ensure minimum & maximum values
    merge(ensureValidValues(pagination2))
  );
  return replacePaginationAttributes(args);
};
const pagination = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  withDefaultPagination
}, Symbol.toStringTag, { value: "Module" }));
function pipeAsync(...fns) {
  const [firstFn, ...fnRest] = fns;
  return async (...args) => {
    let res = await firstFn.apply(firstFn, args);
    for (let i = 0; i < fnRest.length; i += 1) {
      res = await fnRest[i](res);
    }
    return res;
  };
}
const mapAsync = curry(pMap);
const reduceAsync = (mixedArray) => async (iteratee, initialValue) => {
  let acc2 = initialValue;
  for (let i = 0; i < mixedArray.length; i += 1) {
    acc2 = await iteratee(acc2, await mixedArray[i], i);
  }
  return acc2;
};
const forEachAsync = async (array, func, options) => {
  await pMap(array, func, options);
};
const visitor$7 = ({ key: key2, attribute }, { remove: remove2 }) => {
  if (attribute?.type === "password") {
    remove2(key2);
  }
};
const visitor$6 = ({ schema, key: key2, attribute }, { remove: remove2 }) => {
  if (!attribute) {
    return;
  }
  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key2);
  if (isPrivate) {
    remove2(key2);
  }
};
const ACTIONS_TO_VERIFY$1 = ["find"];
const { CREATED_BY_ATTRIBUTE: CREATED_BY_ATTRIBUTE$1, UPDATED_BY_ATTRIBUTE: UPDATED_BY_ATTRIBUTE$1 } = constants$1;
const removeRestrictedRelations = (auth) => async ({ data, key: key2, attribute, schema }, { remove: remove2, set }) => {
  if (!attribute) {
    return;
  }
  const isRelation = attribute.type === "relation";
  if (!isRelation) {
    return;
  }
  const handleMorphRelation = async () => {
    const newMorphValue = [];
    for (const element of data[key2]) {
      const scopes = ACTIONS_TO_VERIFY$1.map((action) => `${element.__type}.${action}`);
      const isAllowed = await hasAccessToSomeScopes$1(scopes, auth);
      if (isAllowed) {
        newMorphValue.push(element);
      }
    }
    if (newMorphValue.length === 0) {
      remove2(key2);
    } else {
      set(key2, newMorphValue);
    }
  };
  const handleRegularRelation = async () => {
    const scopes = ACTIONS_TO_VERIFY$1.map((action) => `${attribute.target}.${action}`);
    const isAllowed = await hasAccessToSomeScopes$1(scopes, auth);
    if (!isAllowed) {
      remove2(key2);
    }
  };
  const isCreatorRelation = [CREATED_BY_ATTRIBUTE$1, UPDATED_BY_ATTRIBUTE$1].includes(key2);
  if (isMorphToRelationalAttribute(attribute)) {
    await handleMorphRelation();
    return;
  }
  if (isCreatorRelation && schema.options?.populateCreatorFields) {
    return;
  }
  await handleRegularRelation();
};
const hasAccessToSomeScopes$1 = async (scopes, auth) => {
  for (const scope of scopes) {
    try {
      await strapi.auth.verify(auth, { scope });
      return true;
    } catch {
      continue;
    }
  }
  return false;
};
const visitor$5 = ({ key: key2, attribute }, { remove: remove2 }) => {
  if (isMorphToRelationalAttribute(attribute)) {
    remove2(key2);
  }
};
const visitor$4 = ({ key: key2, attribute }, { remove: remove2 }) => {
  if (isDynamicZoneAttribute(attribute)) {
    remove2(key2);
  }
};
const removeDisallowedFields = (allowedFields = null) => ({ key: key2, path: { attribute: path } }, { remove: remove2 }) => {
  if (allowedFields === null) {
    return;
  }
  if (!(isArray(allowedFields) && allowedFields.every(isString$1))) {
    throw new TypeError(
      `Expected array of strings for allowedFields but got "${typeof allowedFields}"`
    );
  }
  if (isNil(path)) {
    return;
  }
  const containedPaths = getContainedPaths$1(path);
  const isPathAllowed = allowedFields.some(
    (p) => containedPaths.includes(p) || p.startsWith(`${path}.`)
  );
  if (isPathAllowed) {
    return;
  }
  remove2(key2);
};
const getContainedPaths$1 = (path) => {
  const parts = toPath(path);
  return parts.reduce((acc2, value2, index2, list) => {
    return [...acc2, list.slice(0, index2 + 1).join(".")];
  }, []);
};
const removeRestrictedFields = (restrictedFields = null) => ({ key: key2, path: { attribute: path } }, { remove: remove2 }) => {
  if (restrictedFields === null) {
    remove2(key2);
    return;
  }
  if (!(isArray(restrictedFields) && restrictedFields.every(isString$1))) {
    throw new TypeError(
      `Expected array of strings for restrictedFields but got "${typeof restrictedFields}"`
    );
  }
  if (restrictedFields.includes(path)) {
    remove2(key2);
    return;
  }
  const isRestrictedNested = restrictedFields.some(
    (allowedPath) => path?.toString().startsWith(`${allowedPath}.`)
  );
  if (isRestrictedNested) {
    remove2(key2);
  }
};
const visitors$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  removeDisallowedFields,
  removeDynamicZones: visitor$4,
  removeMorphToRelations: visitor$5,
  removePassword: visitor$7,
  removePrivate: visitor$6,
  removeRestrictedFields,
  removeRestrictedRelations
}, Symbol.toStringTag, { value: "Module" }));
const traverseMorphRelationTarget = async (visitor2, path, entry) => {
  const targetSchema = strapi.getModel(entry.__type);
  const traverseOptions = { schema: targetSchema, path };
  return traverseEntity(visitor2, traverseOptions, entry);
};
const traverseRelationTarget = (schema) => async (visitor2, path, entry) => {
  const traverseOptions = { schema, path };
  return traverseEntity(visitor2, traverseOptions, entry);
};
const traverseMediaTarget = async (visitor2, path, entry) => {
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = strapi.getModel(targetSchemaUID);
  const traverseOptions = { schema: targetSchema, path };
  return traverseEntity(visitor2, traverseOptions, entry);
};
const traverseComponent = async (visitor2, path, schema, entry) => {
  const traverseOptions = { schema, path };
  return traverseEntity(visitor2, traverseOptions, entry);
};
const visitDynamicZoneEntry = async (visitor2, path, entry) => {
  const targetSchema = strapi.getModel(entry.__component);
  const traverseOptions = { schema: targetSchema, path };
  return traverseEntity(visitor2, traverseOptions, entry);
};
const traverseEntity = async (visitor2, options, entity) => {
  const { path = { raw: null, attribute: null }, schema } = options;
  if (!isObject(entity) || isNil(schema)) {
    return entity;
  }
  const copy = clone(entity);
  const visitorUtils = createVisitorUtils({ data: copy });
  const keys = Object.keys(copy);
  for (let i = 0; i < keys.length; i += 1) {
    const key2 = keys[i];
    const attribute = schema.attributes[key2];
    if (isNil(attribute)) {
      continue;
    }
    const newPath = { ...path };
    newPath.raw = isNil(path.raw) ? key2 : `${path.raw}.${key2}`;
    if (!isNil(attribute)) {
      newPath.attribute = isNil(path.attribute) ? key2 : `${path.attribute}.${key2}`;
    }
    const visitorOptions = {
      data: copy,
      schema,
      key: key2,
      value: copy[key2],
      attribute,
      path: newPath
    };
    await visitor2(visitorOptions, visitorUtils);
    const value2 = copy[key2];
    if (isNil(value2)) {
      continue;
    }
    if (isRelationalAttribute(attribute)) {
      const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
      const method = isMorphRelation ? traverseMorphRelationTarget : traverseRelationTarget(strapi.getModel(attribute.target));
      if (isArray(value2)) {
        const res = new Array(value2.length);
        for (let i2 = 0; i2 < value2.length; i2 += 1) {
          res[i2] = await method(visitor2, newPath, value2[i2]);
        }
        copy[key2] = res;
      } else {
        copy[key2] = await method(visitor2, newPath, value2);
      }
      continue;
    }
    if (isMediaAttribute(attribute)) {
      if (isArray(value2)) {
        const res = new Array(value2.length);
        for (let i2 = 0; i2 < value2.length; i2 += 1) {
          res[i2] = await traverseMediaTarget(visitor2, newPath, value2[i2]);
        }
        copy[key2] = res;
      } else {
        copy[key2] = await traverseMediaTarget(visitor2, newPath, value2);
      }
      continue;
    }
    if (attribute.type === "component") {
      const targetSchema = strapi.getModel(attribute.component);
      if (isArray(value2)) {
        const res = new Array(value2.length);
        for (let i2 = 0; i2 < value2.length; i2 += 1) {
          res[i2] = await traverseComponent(visitor2, newPath, targetSchema, value2[i2]);
        }
        copy[key2] = res;
      } else {
        copy[key2] = await traverseComponent(visitor2, newPath, targetSchema, value2);
      }
      continue;
    }
    if (attribute.type === "dynamiczone" && isArray(value2)) {
      const res = new Array(value2.length);
      for (let i2 = 0; i2 < value2.length; i2 += 1) {
        res[i2] = await visitDynamicZoneEntry(visitor2, newPath, value2[i2]);
      }
      copy[key2] = res;
      continue;
    }
  }
  return copy;
};
const createVisitorUtils = ({ data }) => ({
  remove(key2) {
    delete data[key2];
  },
  set(key2, value2) {
    data[key2] = value2;
  }
});
const traverseEntity$1 = curry(traverseEntity);
const DEFAULT_PATH = { raw: null, attribute: null };
const traverseFactory = () => {
  const state = {
    parsers: [],
    interceptors: [],
    ignore: [],
    handlers: {
      attributes: [],
      common: []
    }
  };
  const traverse = async (visitor2, options, data) => {
    const { path = DEFAULT_PATH, schema } = options ?? {};
    for (const { predicate, handler } of state.interceptors) {
      if (predicate(data)) {
        return handler(visitor2, options, data, { recurse: traverse });
      }
    }
    const parser = state.parsers.find((parser2) => parser2.predicate(data))?.parser;
    const utils2 = parser?.(data);
    if (!utils2) {
      return data;
    }
    let out = utils2.transform(data);
    const keys = utils2.keys(out);
    for (const key2 of keys) {
      const attribute = schema?.attributes?.[key2] ?? // FIX: Needed to not break existing behavior on the API.
      //      It looks for the attribute in the DB metadata when the key is in snake_case
      schema?.attributes?.[strapi.db.metadata.get(schema?.uid).columnToAttribute[key2]];
      const newPath = { ...path };
      newPath.raw = isNil(path.raw) ? key2 : `${path.raw}.${key2}`;
      if (!isNil(attribute)) {
        newPath.attribute = isNil(path.attribute) ? key2 : `${path.attribute}.${key2}`;
      }
      const visitorOptions = {
        key: key2,
        value: utils2.get(key2, out),
        attribute,
        schema,
        path: newPath,
        data: out
      };
      const transformUtils = {
        remove(key22) {
          out = utils2.remove(key22, out);
        },
        set(key22, value22) {
          out = utils2.set(key22, value22, out);
        },
        recurse: traverse
      };
      await visitor2(visitorOptions, pick(["remove", "set"], transformUtils));
      const value2 = utils2.get(key2, out);
      const createContext = () => ({
        key: key2,
        value: value2,
        attribute,
        schema,
        path: newPath,
        data: out,
        visitor: visitor2
      });
      const ignoreCtx = createContext();
      const shouldIgnore = state.ignore.some((predicate) => predicate(ignoreCtx));
      if (shouldIgnore) {
        continue;
      }
      const handlers = [...state.handlers.common, ...state.handlers.attributes];
      for await (const handler of handlers) {
        const ctx = createContext();
        const pass = await handler.predicate(ctx);
        if (pass) {
          await handler.handler(ctx, pick(["recurse", "set"], transformUtils));
        }
      }
    }
    return out;
  };
  return {
    traverse,
    intercept(predicate, handler) {
      state.interceptors.push({ predicate, handler });
      return this;
    },
    parse(predicate, parser) {
      state.parsers.push({ predicate, parser });
      return this;
    },
    ignore(predicate) {
      state.ignore.push(predicate);
      return this;
    },
    on(predicate, handler) {
      state.handlers.common.push({ predicate, handler });
      return this;
    },
    onAttribute(predicate, handler) {
      state.handlers.attributes.push({ predicate, handler });
      return this;
    },
    onRelation(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "relation", handler);
    },
    onMedia(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "media", handler);
    },
    onComponent(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "component", handler);
    },
    onDynamicZone(handler) {
      return this.onAttribute(({ attribute }) => attribute?.type === "dynamiczone", handler);
    }
  };
};
const isObj$2 = (value2) => isObject(value2);
const filters = traverseFactory().intercept(
  // Intercept filters arrays and apply the traversal to each one individually
  isArray,
  async (visitor2, options, filters2, { recurse }) => {
    return Promise.all(
      filters2.map((filter, i) => {
        const newPath = options.path ? { ...options.path, raw: `${options.path.raw}[${i}]` } : options.path;
        return recurse(visitor2, { ...options, path: newPath }, filter);
      })
      // todo: move that to the visitors
    ).then((res) => res.filter((val) => !(isObject(val) && isEmpty(val))));
  }
).intercept(
  // Ignore non object filters and return the value as-is
  (filters2) => !isObject(filters2),
  (_2, __, filters2) => {
    return filters2;
  }
).parse(isObj$2, () => ({
  transform: cloneDeep,
  remove(key2, data) {
    return omit(key2, data);
  },
  set(key2, value2, data) {
    return { ...data, [key2]: value2 };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key2, data) {
    return data[key2];
  }
})).ignore(({ value: value2 }) => isNil(value2)).on(
  ({ attribute }) => isNil(attribute),
  async ({ key: key2, visitor: visitor2, path, value: value2, schema }, { set, recurse }) => {
    set(key2, await recurse(visitor2, { schema, path }, value2));
  }
).onRelation(async ({ key: key2, attribute, visitor: visitor2, path, value: value2 }, { set, recurse }) => {
  const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
  if (isMorphRelation) {
    return;
  }
  const targetSchemaUID = attribute.target;
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onComponent(async ({ key: key2, attribute, visitor: visitor2, path, value: value2 }, { set, recurse }) => {
  const targetSchema = strapi.getModel(attribute.component);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onMedia(async ({ key: key2, visitor: visitor2, path, value: value2 }, { set, recurse }) => {
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
});
const traverseQueryFilters = curry(filters.traverse);
const ORDERS = { asc: "asc", desc: "desc" };
const ORDER_VALUES = Object.values(ORDERS);
const isSortOrder = (value2) => ORDER_VALUES.includes(value2.toLowerCase());
const isStringArray$3 = (value2) => Array.isArray(value2) && value2.every(isString$1);
const isObjectArray = (value2) => Array.isArray(value2) && value2.every(isObject);
const isNestedSorts = (value2) => isString$1(value2) && value2.split(",").length > 1;
const isObj$1 = (value2) => isObject(value2);
const sort = traverseFactory().intercept(
  // String with chained sorts (foo,bar,foobar) => split, map(recurse), then recompose
  isNestedSorts,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(
      sort2.split(",").map(trim).map((nestedSort) => recurse(visitor2, options, nestedSort))
    ).then((res) => res.filter((part) => !isEmpty(part)).join(","));
  }
).intercept(
  // Array of strings ['foo', 'foo,bar'] => map(recurse), then filter out empty items
  isStringArray$3,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(sort2.map((nestedSort) => recurse(visitor2, options, nestedSort))).then(
      (res) => res.filter((nestedSort) => !isEmpty(nestedSort))
    );
  }
).intercept(
  // Array of objects [{ foo: 'asc' }, { bar: 'desc', baz: 'asc' }] => map(recurse), then filter out empty items
  isObjectArray,
  async (visitor2, options, sort2, { recurse }) => {
    return Promise.all(sort2.map((nestedSort) => recurse(visitor2, options, nestedSort))).then(
      (res) => res.filter((nestedSort) => !isEmpty(nestedSort))
    );
  }
).parse(isString$1, () => {
  const tokenize = pipe(split("."), map(split(":")), flatten);
  const recompose = (parts) => {
    if (parts.length === 0) {
      return void 0;
    }
    return parts.reduce((acc2, part) => {
      if (isEmpty(part)) {
        return acc2;
      }
      if (acc2 === "") {
        return part;
      }
      return isSortOrder(part) ? `${acc2}:${part}` : `${acc2}.${part}`;
    }, "");
  };
  return {
    transform: trim,
    remove(key2, data) {
      const [root] = tokenize(data);
      return root === key2 ? void 0 : data;
    },
    set(key2, value2, data) {
      const [root] = tokenize(data);
      if (root !== key2) {
        return data;
      }
      return isNil(value2) ? root : `${root}.${value2}`;
    },
    keys(data) {
      const v = first(tokenize(data));
      return v ? [v] : [];
    },
    get(key2, data) {
      const [root, ...rest] = tokenize(data);
      return key2 === root ? recompose(rest) : void 0;
    }
  };
}).parse(isObj$1, () => ({
  transform: cloneDeep,
  remove(key2, data) {
    const { [key2]: ignored, ...rest } = data;
    return rest;
  },
  set(key2, value2, data) {
    return { ...data, [key2]: value2 };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key2, data) {
    return data[key2];
  }
})).onRelation(async ({ key: key2, value: value2, attribute, visitor: visitor2, path }, { set, recurse }) => {
  const isMorphRelation = attribute.relation.toLowerCase().startsWith("morph");
  if (isMorphRelation) {
    return;
  }
  const targetSchemaUID = attribute.target;
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onMedia(async ({ key: key2, path, visitor: visitor2, value: value2 }, { recurse, set }) => {
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onComponent(async ({ key: key2, value: value2, visitor: visitor2, path, attribute }, { recurse, set }) => {
  const targetSchema = strapi.getModel(attribute.component);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
});
const traverseQuerySort = curry(sort.traverse);
const isKeyword = (keyword) => {
  return ({ key: key2, attribute }) => {
    return !attribute && keyword === key2;
  };
};
const isStringArray$2 = (value2) => isArray(value2) && value2.every(isString$1);
const isWildCardConstant = (value2) => value2 === "*";
const isObj = (value2) => isObject(value2);
const populate = traverseFactory().intercept(isStringArray$2, async (visitor2, options, populate2, { recurse }) => {
  const visitedPopulate = await Promise.all(
    populate2.map((nestedPopulate) => recurse(visitor2, options, nestedPopulate))
  );
  return visitedPopulate.filter((item) => !isNil(item));
}).intercept(isWildCardConstant, (visitor2, options, _data, { recurse }) => {
  const attributes = options.schema?.attributes;
  if (!attributes) {
    return "*";
  }
  const parsedPopulate = Object.entries(attributes).filter(([, value2]) => ["relation", "component", "dynamiczone", "media"].includes(value2.type)).reduce((acc2, [key2]) => ({ ...acc2, [key2]: true }), {});
  return recurse(visitor2, options, parsedPopulate);
}).parse(isString$1, () => {
  const tokenize = split(".");
  const recompose = join(".");
  return {
    transform: trim,
    remove(key2, data) {
      const [root] = tokenize(data);
      return root === key2 ? void 0 : data;
    },
    set(key2, value2, data) {
      const [root] = tokenize(data);
      if (root !== key2) {
        return data;
      }
      return isNil(value2) || isEmpty(value2) ? root : `${root}.${value2}`;
    },
    keys(data) {
      const v = first(tokenize(data));
      return v ? [v] : [];
    },
    get(key2, data) {
      const [root, ...rest] = tokenize(data);
      return key2 === root ? recompose(rest) : void 0;
    }
  };
}).parse(isObj, () => ({
  transform: cloneDeep,
  remove(key2, data) {
    const { [key2]: ignored, ...rest } = data;
    return rest;
  },
  set(key2, value2, data) {
    return { ...data, [key2]: value2 };
  },
  keys(data) {
    return Object.keys(data);
  },
  get(key2, data) {
    return data[key2];
  }
})).ignore(({ key: key2, attribute }) => {
  return ["sort", "filters", "fields"].includes(key2) && !attribute;
}).on(
  // Handle recursion on populate."populate"
  isKeyword("populate"),
  async ({ key: key2, visitor: visitor2, path, value: value2, schema }, { set, recurse }) => {
    const newValue = await recurse(visitor2, { schema, path }, value2);
    set(key2, newValue);
  }
).on(isKeyword("on"), async ({ key: key2, visitor: visitor2, path, value: value2 }, { set, recurse }) => {
  const newOn = {};
  if (!isObj(value2)) {
    return;
  }
  for (const [uid, subPopulate] of Object.entries(value2)) {
    const model = strapi.getModel(uid);
    const newPath = { ...path, raw: `${path.raw}[${uid}]` };
    newOn[uid] = await recurse(visitor2, { schema: model, path: newPath }, subPopulate);
  }
  set(key2, newOn);
}).onRelation(async ({ key: key2, value: value2, attribute, visitor: visitor2, path, schema }, { set, recurse }) => {
  if (isNil(value2)) {
    return;
  }
  if (isMorphToRelationalAttribute(attribute)) {
    if (!isObject(value2) || !("on" in value2 && isObject(value2?.on))) {
      return;
    }
    const newValue2 = await recurse(visitor2, { schema, path }, { on: value2?.on });
    set(key2, { on: newValue2 });
  }
  const targetSchemaUID = attribute.target;
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onMedia(async ({ key: key2, path, visitor: visitor2, value: value2 }, { recurse, set }) => {
  if (isNil(value2)) {
    return;
  }
  const targetSchemaUID = "plugin::upload.file";
  const targetSchema = strapi.getModel(targetSchemaUID);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onComponent(async ({ key: key2, value: value2, visitor: visitor2, path, attribute }, { recurse, set }) => {
  if (isNil(value2)) {
    return;
  }
  const targetSchema = strapi.getModel(attribute.component);
  const newValue = await recurse(visitor2, { schema: targetSchema, path }, value2);
  set(key2, newValue);
}).onDynamicZone(async ({ key: key2, value: value2, attribute, schema, visitor: visitor2, path }, { set, recurse }) => {
  if (isNil(value2)) {
    return;
  }
  if (isObject(value2)) {
    const { components } = attribute;
    const newValue = {};
    let newProperties = omit("on", value2);
    for (const componentUID of components) {
      const componentSchema = strapi.getModel(componentUID);
      const properties = await recurse(visitor2, { schema: componentSchema, path }, value2);
      newProperties = merge(newProperties, properties);
    }
    Object.assign(newValue, newProperties);
    if ("on" in value2 && value2.on) {
      const newOn = await recurse(visitor2, { schema, path }, { on: value2.on });
      Object.assign(newValue, newOn);
    }
    set(key2, newValue);
  } else {
    const newValue = await recurse(visitor2, { schema, path }, value2);
    set(key2, newValue);
  }
});
const traverseQueryPopulate = curry(populate.traverse);
const isStringArray$1 = (value2) => isArray(value2) && value2.every(isString$1);
const fields = traverseFactory().intercept(isStringArray$1, async (visitor2, options, fields2, { recurse }) => {
  return Promise.all(fields2.map((field) => recurse(visitor2, options, field)));
}).intercept((value2) => eq("*", value2), constant("*")).parse(isString$1, () => ({
  transform: trim,
  remove(key2, data) {
    return data === key2 ? void 0 : data;
  },
  set(_key, _value, data) {
    return data;
  },
  keys(data) {
    return [data];
  },
  get(key2, data) {
    return key2 === data ? data : void 0;
  }
}));
const traverseQueryFields = curry(fields.traverse);
const index$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  factory: traverseFactory,
  traverseQueryFields,
  traverseQueryFilters,
  traverseQueryPopulate,
  traverseQuerySort
}, Symbol.toStringTag, { value: "Module" }));
const GROUP_OPERATORS = ["$and", "$or"];
const WHERE_OPERATORS = [
  "$not",
  "$in",
  "$notIn",
  "$eq",
  "$eqi",
  "$ne",
  "$nei",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$null",
  "$notNull",
  "$between",
  "$startsWith",
  "$endsWith",
  "$startsWithi",
  "$endsWithi",
  "$contains",
  "$notContains",
  "$containsi",
  "$notContainsi",
  // Experimental, only for internal use
  "$jsonSupersetOf"
];
const CAST_OPERATORS = [
  "$not",
  "$in",
  "$notIn",
  "$eq",
  "$ne",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$between"
];
const ARRAY_OPERATORS = ["$in", "$notIn", "$between"];
const OPERATORS = {
  where: WHERE_OPERATORS,
  cast: CAST_OPERATORS,
  group: GROUP_OPERATORS,
  array: ARRAY_OPERATORS
};
const OPERATORS_LOWERCASE = Object.fromEntries(
  Object.entries(OPERATORS).map(([key2, values]) => [
    key2,
    values.map((value2) => value2.toLowerCase())
  ])
);
const isObjKey = (key2, obj2) => {
  return key2 in obj2;
};
const isOperatorOfType = (type, key2, ignoreCase = false) => {
  if (ignoreCase) {
    return OPERATORS_LOWERCASE[type]?.includes(key2.toLowerCase()) ?? false;
  }
  if (isObjKey(type, OPERATORS)) {
    return OPERATORS[type]?.includes(key2) ?? false;
  }
  return false;
};
const isOperator = (key2, ignoreCase = false) => {
  return Object.keys(OPERATORS).some((type) => isOperatorOfType(type, key2, ignoreCase));
};
const sanitizePasswords = (schema) => async (entity) => {
  if (!schema) {
    throw new Error("Missing schema in sanitizePasswords");
  }
  return traverseEntity$1(visitor$7, { schema }, entity);
};
const defaultSanitizeOutput = async (schema, entity) => {
  if (!schema) {
    throw new Error("Missing schema in defaultSanitizeOutput");
  }
  return traverseEntity$1(
    (...args) => {
      visitor$7(...args);
      visitor$6(...args);
    },
    { schema },
    entity
  );
};
const defaultSanitizeFilters = curry((schema, filters2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultSanitizeFilters");
  }
  return pipeAsync(
    // Remove keys that are not attributes or valid operators
    traverseQueryFilters(
      ({ key: key2, attribute }, { remove: remove2 }) => {
        const isAttribute = !!attribute;
        if (key2 === "id") {
          return;
        }
        if (!isAttribute && !isOperator(key2)) {
          remove2(key2);
        }
      },
      { schema }
    ),
    // Remove dynamic zones from filters
    traverseQueryFilters(visitor$4, { schema }),
    // Remove morpTo relations from filters
    traverseQueryFilters(visitor$5, { schema }),
    // Remove passwords from filters
    traverseQueryFilters(visitor$7, { schema }),
    // Remove private from filters
    traverseQueryFilters(visitor$6, { schema }),
    // Remove empty objects
    traverseQueryFilters(
      ({ key: key2, value: value2 }, { remove: remove2 }) => {
        if (isObject(value2) && isEmpty(value2)) {
          remove2(key2);
        }
      },
      { schema }
    )
  )(filters2);
});
const defaultSanitizeSort = curry((schema, sort2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultSanitizeSort");
  }
  return pipeAsync(
    // Remove non attribute keys
    traverseQuerySort(
      ({ key: key2, attribute }, { remove: remove2 }) => {
        if (key2 === "id") {
          return;
        }
        if (!attribute) {
          remove2(key2);
        }
      },
      { schema }
    ),
    // Remove dynamic zones from sort
    traverseQuerySort(visitor$4, { schema }),
    // Remove morpTo relations from sort
    traverseQuerySort(visitor$5, { schema }),
    // Remove private from sort
    traverseQuerySort(visitor$6, { schema }),
    // Remove passwords from filters
    traverseQuerySort(visitor$7, { schema }),
    // Remove keys for empty non-scalar values
    traverseQuerySort(
      ({ key: key2, attribute, value: value2 }, { remove: remove2 }) => {
        if (key2 === "id") {
          return;
        }
        if (!isScalarAttribute(attribute) && isEmpty(value2)) {
          remove2(key2);
        }
      },
      { schema }
    )
  )(sort2);
});
const defaultSanitizeFields = curry((schema, fields2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultSanitizeFields");
  }
  return pipeAsync(
    // Only keep scalar attributes
    traverseQueryFields(
      ({ key: key2, attribute }, { remove: remove2 }) => {
        if (key2 === "id") {
          return;
        }
        if (isNil(attribute) || !isScalarAttribute(attribute)) {
          remove2(key2);
        }
      },
      { schema }
    ),
    // Remove private fields
    traverseQueryFields(visitor$6, { schema }),
    // Remove password fields
    traverseQueryFields(visitor$7, { schema }),
    // Remove nil values from fields array
    (value2) => isArray(value2) ? value2.filter((field) => !isNil(field)) : value2
  )(fields2);
});
const defaultSanitizePopulate = curry((schema, populate2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultSanitizePopulate");
  }
  return pipeAsync(
    traverseQueryPopulate(
      async ({ key: key2, value: value2, schema: schema2, attribute }, { set }) => {
        if (attribute) {
          return;
        }
        if (key2 === "sort") {
          set(key2, await defaultSanitizeSort(schema2, value2));
        }
        if (key2 === "filters") {
          set(key2, await defaultSanitizeFilters(schema2, value2));
        }
        if (key2 === "fields") {
          set(key2, await defaultSanitizeFields(schema2, value2));
        }
      },
      { schema }
    ),
    // Remove private fields
    traverseQueryPopulate(visitor$6, { schema })
  )(populate2);
});
const sanitizers = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultSanitizeFields,
  defaultSanitizeFilters,
  defaultSanitizeOutput,
  defaultSanitizePopulate,
  defaultSanitizeSort,
  sanitizePasswords
}, Symbol.toStringTag, { value: "Module" }));
const createContentAPISanitizers = () => {
  const sanitizeInput = (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeInput");
    }
    if (isArray(data)) {
      return Promise.all(data.map((entry) => sanitizeInput(entry, schema, { auth })));
    }
    const nonWritableAttributes = getNonWritableAttributes(schema);
    const transforms = [
      // Remove first level ID in inputs
      omit("id"),
      // Remove non-writable attributes
      traverseEntity$1(removeRestrictedFields(nonWritableAttributes), { schema })
    ];
    if (auth) {
      transforms.push(traverseEntity$1(removeRestrictedRelations(auth), { schema }));
    }
    strapi.sanitizers.get("content-api.input").forEach((sanitizer) => transforms.push(sanitizer(schema)));
    return pipeAsync(...transforms)(data);
  };
  const sanitizeOutput = async (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeOutput");
    }
    if (isArray(data)) {
      const res = new Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        res[i] = await sanitizeOutput(data[i], schema, { auth });
      }
      return res;
    }
    const transforms = [(data2) => defaultSanitizeOutput(schema, data2)];
    if (auth) {
      transforms.push(traverseEntity$1(removeRestrictedRelations(auth), { schema }));
    }
    strapi.sanitizers.get("content-api.output").forEach((sanitizer) => transforms.push(sanitizer(schema)));
    return pipeAsync(...transforms)(data);
  };
  const sanitizeQuery = async (query, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeQuery");
    }
    const { filters: filters2, sort: sort2, fields: fields2, populate: populate2 } = query;
    const sanitizedQuery = cloneDeep(query);
    if (filters2) {
      Object.assign(sanitizedQuery, { filters: await sanitizeFilters(filters2, schema, { auth }) });
    }
    if (sort2) {
      Object.assign(sanitizedQuery, { sort: await sanitizeSort(sort2, schema, { auth }) });
    }
    if (fields2) {
      Object.assign(sanitizedQuery, { fields: await sanitizeFields(fields2, schema) });
    }
    if (populate2) {
      Object.assign(sanitizedQuery, { populate: await sanitizePopulate(populate2, schema) });
    }
    return sanitizedQuery;
  };
  const sanitizeFilters = (filters2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeFilters");
    }
    if (isArray(filters2)) {
      return Promise.all(filters2.map((filter) => sanitizeFilters(filter, schema, { auth })));
    }
    const transforms = [defaultSanitizeFilters(schema)];
    if (auth) {
      transforms.push(traverseQueryFilters(removeRestrictedRelations(auth), { schema }));
    }
    return pipeAsync(...transforms)(filters2);
  };
  const sanitizeSort = (sort2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeSort");
    }
    const transforms = [defaultSanitizeSort(schema)];
    if (auth) {
      transforms.push(traverseQuerySort(removeRestrictedRelations(auth), { schema }));
    }
    return pipeAsync(...transforms)(sort2);
  };
  const sanitizeFields = (fields2, schema) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizeFields");
    }
    const transforms = [defaultSanitizeFields(schema)];
    return pipeAsync(...transforms)(fields2);
  };
  const sanitizePopulate = (populate2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in sanitizePopulate");
    }
    const transforms = [defaultSanitizePopulate(schema)];
    if (auth) {
      transforms.push(traverseQueryPopulate(removeRestrictedRelations(auth), { schema }));
    }
    return pipeAsync(...transforms)(populate2);
  };
  return {
    input: sanitizeInput,
    output: sanitizeOutput,
    query: sanitizeQuery,
    filters: sanitizeFilters,
    sort: sanitizeSort,
    fields: sanitizeFields,
    populate: sanitizePopulate
  };
};
const contentAPI$1 = createContentAPISanitizers();
const index$1 = {
  contentAPI: contentAPI$1,
  sanitizers,
  visitors: visitors$1
};
const throwInvalidParam = ({ key: key2 }) => {
  throw new ValidationError(`Invalid parameter ${key2}`);
};
const visitor$3 = ({ key: key2, attribute }) => {
  if (attribute?.type === "password") {
    throwInvalidParam({ key: key2 });
  }
};
const visitor$2 = ({ schema, key: key2, attribute }) => {
  if (!attribute) {
    return;
  }
  const isPrivate = attribute.private === true || isPrivateAttribute(schema, key2);
  if (isPrivate) {
    throwInvalidParam({ key: key2 });
  }
};
const ACTIONS_TO_VERIFY = ["find"];
const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = constants$1;
const throwRestrictedRelations = (auth) => async ({ data, key: key2, attribute, schema }) => {
  if (!attribute) {
    return;
  }
  const isRelation = attribute.type === "relation";
  if (!isRelation) {
    return;
  }
  const handleMorphRelation = async () => {
    for (const element of data[key2]) {
      const scopes = ACTIONS_TO_VERIFY.map((action) => `${element.__type}.${action}`);
      const isAllowed = await hasAccessToSomeScopes(scopes, auth);
      if (!isAllowed) {
        throwInvalidParam({ key: key2 });
      }
    }
  };
  const handleRegularRelation = async () => {
    const scopes = ACTIONS_TO_VERIFY.map((action) => `${attribute.target}.${action}`);
    const isAllowed = await hasAccessToSomeScopes(scopes, auth);
    if (!isAllowed) {
      throwInvalidParam({ key: key2 });
    }
  };
  const isCreatorRelation = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(key2);
  if (isMorphToRelationalAttribute(attribute)) {
    await handleMorphRelation();
    return;
  }
  if (isCreatorRelation && schema.options?.populateCreatorFields) {
    return;
  }
  await handleRegularRelation();
};
const hasAccessToSomeScopes = async (scopes, auth) => {
  for (const scope of scopes) {
    try {
      await strapi.auth.verify(auth, { scope });
      return true;
    } catch {
      continue;
    }
  }
  return false;
};
const visitor$1 = ({ key: key2, attribute }) => {
  if (isMorphToRelationalAttribute(attribute)) {
    throwInvalidParam({ key: key2 });
  }
};
const visitor = ({ key: key2, attribute }) => {
  if (isDynamicZoneAttribute(attribute)) {
    throwInvalidParam({ key: key2 });
  }
};
const throwDisallowedFields = (allowedFields = null) => ({ key: key2, path: { attribute: path } }) => {
  if (allowedFields === null) {
    return;
  }
  if (!(isArray(allowedFields) && allowedFields.every(isString$1))) {
    throw new TypeError(
      `Expected array of strings for allowedFields but got "${typeof allowedFields}"`
    );
  }
  if (isNil(path)) {
    return;
  }
  const containedPaths = getContainedPaths(path);
  const isPathAllowed = allowedFields.some(
    (p) => containedPaths.includes(p) || p.startsWith(`${path}.`)
  );
  if (isPathAllowed) {
    return;
  }
  throwInvalidParam({ key: key2 });
};
const getContainedPaths = (path) => {
  const parts = toPath(path);
  return parts.reduce((acc2, value2, index2, list) => {
    return [...acc2, list.slice(0, index2 + 1).join(".")];
  }, []);
};
const throwRestrictedFields = (restrictedFields = null) => ({ key: key2, path: { attribute: path } }) => {
  if (restrictedFields === null) {
    throwInvalidParam({ key: key2 });
  }
  if (!(isArray(restrictedFields) && restrictedFields.every(isString$1))) {
    throw new TypeError(
      `Expected array of strings for restrictedFields but got "${typeof restrictedFields}"`
    );
  }
  if (restrictedFields.includes(path)) {
    throwInvalidParam({ key: key2 });
  }
  const isRestrictedNested = restrictedFields.some(
    (allowedPath) => path?.toString().startsWith(`${allowedPath}.`)
  );
  if (isRestrictedNested) {
    throwInvalidParam({ key: key2 });
  }
};
const visitors = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  throwDisallowedFields,
  throwDynamicZones: visitor,
  throwMorphToRelations: visitor$1,
  throwPassword: visitor$3,
  throwPrivate: visitor$2,
  throwRestrictedFields,
  throwRestrictedRelations
}, Symbol.toStringTag, { value: "Module" }));
const throwPasswords = (schema) => async (entity) => {
  if (!schema) {
    throw new Error("Missing schema in throwPasswords");
  }
  return traverseEntity$1(visitor$3, { schema }, entity);
};
const defaultValidateFilters = curry((schema, filters2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultValidateFilters");
  }
  return pipeAsync(
    // keys that are not attributes or valid operators
    traverseQueryFilters(
      ({ key: key2, attribute }) => {
        if (key2 === "id") {
          return;
        }
        const isAttribute = !!attribute;
        if (!isAttribute && !isOperator(key2)) {
          throwInvalidParam({ key: key2 });
        }
      },
      { schema }
    ),
    // dynamic zones from filters
    traverseQueryFilters(visitor, { schema }),
    // morphTo relations from filters; because you can't have deep filtering on morph relations
    traverseQueryFilters(visitor$1, { schema }),
    // passwords from filters
    traverseQueryFilters(visitor$3, { schema }),
    // private from filters
    traverseQueryFilters(visitor$2, { schema })
    // we allow empty objects to validate and only sanitize them out, so that users may write "lazy" queries without checking their params exist
  )(filters2);
});
const defaultValidateSort = curry((schema, sort2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultValidateSort");
  }
  return pipeAsync(
    // non attribute keys
    traverseQuerySort(
      ({ key: key2, attribute }) => {
        if (key2 === "id") {
          return;
        }
        if (!attribute) {
          throwInvalidParam({ key: key2 });
        }
      },
      { schema }
    ),
    // dynamic zones from sort
    traverseQuerySort(visitor, { schema }),
    // morphTo relations from sort
    traverseQuerySort(visitor$1, { schema }),
    // private from sort
    traverseQuerySort(visitor$2, { schema }),
    // passwords from filters
    traverseQuerySort(visitor$3, { schema }),
    // keys for empty non-scalar values
    traverseQuerySort(
      ({ key: key2, attribute, value: value2 }) => {
        if (key2 === "id") {
          return;
        }
        if (!isScalarAttribute(attribute) && isEmpty(value2)) {
          throwInvalidParam({ key: key2 });
        }
      },
      { schema }
    )
  )(sort2);
});
const defaultValidateFields = curry((schema, fields2) => {
  if (!schema) {
    throw new Error("Missing schema in defaultValidateFields");
  }
  return pipeAsync(
    // Only allow scalar attributes
    traverseQueryFields(
      ({ key: key2, attribute }) => {
        if (key2 === "id") {
          return;
        }
        if (isNil(attribute) || !isScalarAttribute(attribute)) {
          throwInvalidParam({ key: key2 });
        }
      },
      { schema }
    ),
    // private fields
    traverseQueryFields(visitor$2, { schema }),
    // password fields
    traverseQueryFields(visitor$3, { schema })
  )(fields2);
});
const validators = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  defaultValidateFields,
  defaultValidateFilters,
  defaultValidateSort,
  throwPasswords
}, Symbol.toStringTag, { value: "Module" }));
const createContentAPIValidators = () => {
  const validateInput = async (data, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateInput");
    }
    if (isArray(data)) {
      await Promise.all(data.map((entry) => validateInput(entry, schema, { auth })));
      return;
    }
    const nonWritableAttributes = getNonWritableAttributes(schema);
    const transforms = [
      (data2) => {
        if (isObject(data2) && "id" in data2) {
          throwInvalidParam({ key: "id" });
        }
      },
      // non-writable attributes
      traverseEntity$1(throwRestrictedFields(nonWritableAttributes), { schema })
    ];
    if (auth) {
      transforms.push(traverseEntity$1(throwRestrictedRelations(auth), { schema }));
    }
    strapi.validators.get("content-api.input").forEach((validator) => transforms.push(validator(schema)));
    pipeAsync(...transforms)(data);
  };
  const validateQuery = async (query, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateQuery");
    }
    const { filters: filters2, sort: sort2, fields: fields2 } = query;
    if (filters2) {
      await validateFilters(filters2, schema, { auth });
    }
    if (sort2) {
      await validateSort(sort2, schema, { auth });
    }
    if (fields2) {
      await validateFields(fields2, schema);
    }
  };
  const validateFilters = async (filters2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateFilters");
    }
    if (isArray(filters2)) {
      await Promise.all(filters2.map((filter) => validateFilters(filter, schema, { auth })));
      return;
    }
    const transforms = [defaultValidateFilters(schema)];
    if (auth) {
      transforms.push(traverseQueryFilters(throwRestrictedRelations(auth), { schema }));
    }
    return pipeAsync(...transforms)(filters2);
  };
  const validateSort = async (sort2, schema, { auth } = {}) => {
    if (!schema) {
      throw new Error("Missing schema in validateSort");
    }
    const transforms = [defaultValidateSort(schema)];
    if (auth) {
      transforms.push(traverseQuerySort(throwRestrictedRelations(auth), { schema }));
    }
    return pipeAsync(...transforms)(sort2);
  };
  const validateFields = (fields2, schema) => {
    if (!schema) {
      throw new Error("Missing schema in validateFields");
    }
    const transforms = [defaultValidateFields(schema)];
    return pipeAsync(...transforms)(fields2);
  };
  return {
    input: validateInput,
    query: validateQuery,
    filters: validateFilters,
    sort: validateSort,
    fields: validateFields
  };
};
const contentAPI = createContentAPIValidators();
const index = {
  contentAPI,
  validators,
  visitors
};
const { PUBLISHED_AT_ATTRIBUTE } = constants$1;
class InvalidOrderError extends Error {
  constructor() {
    super();
    this.message = "Invalid order. order can only be one of asc|desc|ASC|DESC";
  }
}
class InvalidSortError extends Error {
  constructor() {
    super();
    this.message = "Invalid sort parameter. Expected a string, an array of strings, a sort object or an array of sort objects";
  }
}
function validateOrder(order) {
  if (!isString$1(order) || !["asc", "desc"].includes(order.toLocaleLowerCase())) {
    throw new InvalidOrderError();
  }
}
const convertCountQueryParams = (countQuery) => {
  return parseType({ type: "boolean", value: countQuery });
};
const convertOrderingQueryParams = (ordering) => {
  return ordering;
};
const isPlainObject = (value2) => _$1.isPlainObject(value2);
const isStringArray = (value2) => isArray(value2) && value2.every(isString$1);
const convertSortQueryParams = (sortQuery) => {
  if (typeof sortQuery === "string") {
    return convertStringSortQueryParam(sortQuery);
  }
  if (isStringArray(sortQuery)) {
    return sortQuery.flatMap((sortValue) => convertStringSortQueryParam(sortValue));
  }
  if (Array.isArray(sortQuery)) {
    return sortQuery.map((sortValue) => convertNestedSortQueryParam(sortValue));
  }
  if (isPlainObject(sortQuery)) {
    return convertNestedSortQueryParam(sortQuery);
  }
  throw new InvalidSortError();
};
const convertStringSortQueryParam = (sortQuery) => {
  return sortQuery.split(",").map((value2) => convertSingleSortQueryParam(value2));
};
const convertSingleSortQueryParam = (sortQuery) => {
  if (!sortQuery) {
    return {};
  }
  if (!isString$1(sortQuery)) {
    throw new Error("Invalid sort query");
  }
  const [field, order = "asc"] = sortQuery.split(":");
  if (field.length === 0) {
    throw new Error("Field cannot be empty");
  }
  validateOrder(order);
  return _$1.set({}, field, order);
};
const convertNestedSortQueryParam = (sortQuery) => {
  const transformedSort = {};
  for (const field of Object.keys(sortQuery)) {
    const order = sortQuery[field];
    if (isPlainObject(order)) {
      transformedSort[field] = convertNestedSortQueryParam(order);
    } else if (typeof order === "string") {
      validateOrder(order);
      transformedSort[field] = order;
    } else {
      throw Error(`Invalid sort type expected object or string got ${typeof order}`);
    }
  }
  return transformedSort;
};
const convertStartQueryParams = (startQuery) => {
  const startAsANumber = _$1.toNumber(startQuery);
  if (!_$1.isInteger(startAsANumber) || startAsANumber < 0) {
    throw new Error(`convertStartQueryParams expected a positive integer got ${startAsANumber}`);
  }
  return startAsANumber;
};
const convertLimitQueryParams = (limitQuery) => {
  const limitAsANumber = _$1.toNumber(limitQuery);
  if (!_$1.isInteger(limitAsANumber) || limitAsANumber !== -1 && limitAsANumber < 0) {
    throw new Error(`convertLimitQueryParams expected a positive integer got ${limitAsANumber}`);
  }
  if (limitAsANumber === -1) {
    return void 0;
  }
  return limitAsANumber;
};
const convertPageQueryParams = (page) => {
  const pageVal = toNumber(page);
  if (!isInteger(pageVal) || pageVal <= 0) {
    throw new PaginationError(
      `Invalid 'page' parameter. Expected an integer > 0, received: ${page}`
    );
  }
  return pageVal;
};
const convertPageSizeQueryParams = (pageSize, page) => {
  const pageSizeVal = toNumber(pageSize);
  if (!isInteger(pageSizeVal) || pageSizeVal <= 0) {
    throw new PaginationError(
      `Invalid 'pageSize' parameter. Expected an integer > 0, received: ${page}`
    );
  }
  return pageSizeVal;
};
const validatePaginationParams = (page, pageSize, start, limit) => {
  const isPagePagination = !isNil(page) || !isNil(pageSize);
  const isOffsetPagination = !isNil(start) || !isNil(limit);
  if (isPagePagination && isOffsetPagination) {
    throw new PaginationError(
      "Invalid pagination attributes. You cannot use page and offset pagination in the same query"
    );
  }
};
class InvalidPopulateError extends Error {
  constructor() {
    super();
    this.message = "Invalid populate parameter. Expected a string, an array of strings, a populate object";
  }
}
const convertPopulateQueryParams = (populate2, schema, depth = 0) => {
  if (depth === 0 && populate2 === "*") {
    return true;
  }
  if (typeof populate2 === "string") {
    return populate2.split(",").map((value2) => _$1.trim(value2));
  }
  if (Array.isArray(populate2)) {
    return _$1.uniq(
      populate2.flatMap((value2) => {
        if (typeof value2 !== "string") {
          throw new InvalidPopulateError();
        }
        return value2.split(",").map((value22) => _$1.trim(value22));
      })
    );
  }
  if (_$1.isPlainObject(populate2)) {
    return convertPopulateObject(populate2, schema);
  }
  throw new InvalidPopulateError();
};
const convertPopulateObject = (populate2, schema) => {
  if (!schema) {
    return {};
  }
  const { attributes } = schema;
  return Object.entries(populate2).reduce((acc2, [key2, subPopulate]) => {
    const attribute = attributes[key2];
    if (!attribute) {
      return acc2;
    }
    const isAllowedAttributeForFragmentPopulate = isDynamicZoneAttribute(attribute) || isMorphToRelationalAttribute(attribute);
    const hasFragmentPopulateDefined = typeof subPopulate === "object" && "on" in subPopulate && !isNil(subPopulate.on);
    if (isAllowedAttributeForFragmentPopulate && hasFragmentPopulateDefined) {
      return {
        ...acc2,
        [key2]: {
          on: Object.entries(subPopulate.on).reduce(
            (acc22, [type, typeSubPopulate]) => ({
              ...acc22,
              [type]: convertNestedPopulate(typeSubPopulate, strapi.getModel(type))
            }),
            {}
          )
        }
      };
    }
    if (isDynamicZoneAttribute(attribute)) {
      const populates = attribute.components.map((uid) => strapi.getModel(uid)).map((schema2) => convertNestedPopulate(subPopulate, schema2)).map((populate22) => populate22 === true ? {} : populate22).filter((populate22) => populate22 !== false);
      if (isEmpty(populates)) {
        return acc2;
      }
      return {
        ...acc2,
        [key2]: mergeAll(populates)
      };
    }
    if (isMorphToRelationalAttribute(attribute)) {
      return { ...acc2, [key2]: convertNestedPopulate(subPopulate, void 0) };
    }
    let targetSchemaUID;
    if (attribute.type === "relation") {
      targetSchemaUID = attribute.target;
    } else if (attribute.type === "component") {
      targetSchemaUID = attribute.component;
    } else if (attribute.type === "media") {
      targetSchemaUID = "plugin::upload.file";
    } else {
      return acc2;
    }
    const targetSchema = strapi.getModel(targetSchemaUID);
    if (!targetSchema) {
      return acc2;
    }
    const populateObject = convertNestedPopulate(subPopulate, targetSchema);
    if (!populateObject) {
      return acc2;
    }
    return {
      ...acc2,
      [key2]: populateObject
    };
  }, {});
};
const convertNestedPopulate = (subPopulate, schema) => {
  if (_$1.isString(subPopulate)) {
    return parseType({ type: "boolean", value: subPopulate, forceCast: true });
  }
  if (_$1.isBoolean(subPopulate)) {
    return subPopulate;
  }
  if (!isPlainObject(subPopulate)) {
    throw new Error(`Invalid nested populate. Expected '*' or an object`);
  }
  const { sort: sort2, filters: filters2, fields: fields2, populate: populate2, count, ordering, page, pageSize, start, limit } = subPopulate;
  const query = {};
  if (sort2) {
    query.orderBy = convertSortQueryParams(sort2);
  }
  if (filters2) {
    query.where = convertFiltersQueryParams(filters2, schema);
  }
  if (fields2) {
    query.select = convertFieldsQueryParams(fields2);
  }
  if (populate2) {
    query.populate = convertPopulateQueryParams(populate2, schema);
  }
  if (count) {
    query.count = convertCountQueryParams(count);
  }
  if (ordering) {
    query.ordering = convertOrderingQueryParams(ordering);
  }
  validatePaginationParams(page, pageSize, start, limit);
  if (!isNil(page)) {
    query.page = convertPageQueryParams(page);
  }
  if (!isNil(pageSize)) {
    query.pageSize = convertPageSizeQueryParams(pageSize, page);
  }
  if (!isNil(start)) {
    query.offset = convertStartQueryParams(start);
  }
  if (!isNil(limit)) {
    query.limit = convertLimitQueryParams(limit);
  }
  convertPublicationStateParams(schema, subPopulate, query);
  return query;
};
const convertFieldsQueryParams = (fields2, depth = 0) => {
  if (depth === 0 && fields2 === "*") {
    return void 0;
  }
  if (typeof fields2 === "string") {
    const fieldsValues = fields2.split(",").map((value2) => _$1.trim(value2));
    return _$1.uniq(["id", ...fieldsValues]);
  }
  if (isStringArray(fields2)) {
    const fieldsValues = fields2.flatMap((value2) => convertFieldsQueryParams(value2, depth + 1)).filter((v) => !isNil(v));
    return _$1.uniq(["id", ...fieldsValues]);
  }
  throw new Error("Invalid fields parameter. Expected a string or an array of strings");
};
const isValidSchemaAttribute = (key2, schema) => {
  if (key2 === "id") {
    return true;
  }
  if (!schema) {
    return false;
  }
  return Object.keys(schema.attributes).includes(key2);
};
const convertFiltersQueryParams = (filters2, schema) => {
  if (!isObject(filters2)) {
    throw new Error("The filters parameter must be an object or an array");
  }
  const filtersCopy = cloneDeep(filters2);
  return convertAndSanitizeFilters(filtersCopy, schema);
};
const convertAndSanitizeFilters = (filters2, schema) => {
  if (Array.isArray(filters2)) {
    return filters2.map((filter) => convertAndSanitizeFilters(filter, schema)).filter((filter) => !isPlainObject(filter) || !isEmpty(filter));
  }
  if (!isPlainObject(filters2)) {
    return filters2;
  }
  const removeOperator = (operator) => delete filters2[operator];
  for (const [key2, value2] of Object.entries(filters2)) {
    const attribute = get(key2, schema?.attributes);
    const validKey = isOperator(key2) || isValidSchemaAttribute(key2, schema);
    if (!validKey) {
      removeOperator(key2);
    } else if (attribute) {
      if (attribute.type === "relation") {
        filters2[key2] = convertAndSanitizeFilters(value2, strapi.getModel(attribute.target));
      } else if (attribute.type === "component") {
        filters2[key2] = convertAndSanitizeFilters(value2, strapi.getModel(attribute.component));
      } else if (attribute.type === "media") {
        filters2[key2] = convertAndSanitizeFilters(value2, strapi.getModel("plugin::upload.file"));
      } else if (attribute.type === "dynamiczone") {
        removeOperator(key2);
      } else if (attribute.type === "password") {
        removeOperator(key2);
      } else {
        filters2[key2] = convertAndSanitizeFilters(value2, schema);
      }
    } else if (["$null", "$notNull"].includes(key2)) {
      filters2[key2] = parseType({ type: "boolean", value: filters2[key2], forceCast: true });
    } else if (isObject(value2)) {
      filters2[key2] = convertAndSanitizeFilters(value2, schema);
    }
    if (isPlainObject(filters2[key2]) && isEmpty(filters2[key2])) {
      removeOperator(key2);
    }
  }
  return filters2;
};
const convertPublicationStateParams = (schema, params = {}, query = {}) => {
  if (!schema) {
    return;
  }
  const { publicationState } = params;
  if (!_$1.isNil(publicationState)) {
    if (!constants$1.DP_PUB_STATES.includes(publicationState)) {
      throw new Error(
        `Invalid publicationState. Expected one of 'preview','live' received: ${publicationState}.`
      );
    }
    query.filters = ({ meta }) => {
      if (publicationState === "live" && has(PUBLISHED_AT_ATTRIBUTE, meta.attributes)) {
        return { [PUBLISHED_AT_ATTRIBUTE]: { $notNull: true } };
      }
    };
  }
};
const transformParamsToQuery = (uid, params) => {
  const schema = strapi.getModel(uid);
  const query = {};
  const { _q, sort: sort2, filters: filters2, fields: fields2, populate: populate2, page, pageSize, start, limit } = params;
  if (!isNil(_q)) {
    query._q = _q;
  }
  if (!isNil(sort2)) {
    query.orderBy = convertSortQueryParams(sort2);
  }
  if (!isNil(filters2)) {
    query.where = convertFiltersQueryParams(filters2, schema);
  }
  if (!isNil(fields2)) {
    query.select = convertFieldsQueryParams(fields2);
  }
  if (!isNil(populate2)) {
    query.populate = convertPopulateQueryParams(populate2, schema);
  }
  validatePaginationParams(page, pageSize, start, limit);
  if (!isNil(page)) {
    query.page = convertPageQueryParams(page);
  }
  if (!isNil(pageSize)) {
    query.pageSize = convertPageSizeQueryParams(pageSize, page);
  }
  if (!isNil(start)) {
    query.offset = convertStartQueryParams(start);
  }
  if (!isNil(limit)) {
    query.limit = convertLimitQueryParams(limit);
  }
  convertPublicationStateParams(schema, params, query);
  return query;
};
const convertQueryParams = {
  convertSortQueryParams,
  convertStartQueryParams,
  convertLimitQueryParams,
  convertPopulateQueryParams,
  convertFiltersQueryParams,
  convertFieldsQueryParams,
  convertPublicationStateParams,
  transformParamsToQuery
};
function importDefault(modName) {
  const mod = require(modName);
  return mod && mod.__esModule ? mod.default : mod;
}
const createStrictInterpolationRegExp = (allowedVariableNames, flags) => {
  const oneOfVariables = allowedVariableNames.join("|");
  return new RegExp(`<%=\\s*(${oneOfVariables})\\s*%>`, flags);
};
const createLooseInterpolationRegExp = (flags) => new RegExp(/<%=([\s\S]+?)%>/, flags);
const template = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createLooseInterpolationRegExp,
  createStrictInterpolationRegExp
}, Symbol.toStringTag, { value: "Module" }));
const kbytesToBytes = (kbytes) => kbytes * 1e3;
const bytesToKbytes = (bytes) => Math.round(bytes / 1e3 * 100) / 100;
const bytesToHumanReadable = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  if (bytes === 0)
    return "0 Bytes";
  const i = parseInt(`${Math.floor(Math.log(bytes) / Math.log(1e3))}`, 10);
  return `${Math.round(bytes / 1e3 ** i)} ${sizes[i]}`;
};
const streamToBuffer = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on("data", (chunk) => {
    chunks.push(chunk);
  });
  stream.on("end", () => {
    resolve(Buffer.concat(chunks));
  });
  stream.on("error", reject);
});
const getStreamSize = (stream) => new Promise((resolve, reject) => {
  let size = 0;
  stream.on("data", (chunk) => {
    size += Buffer.byteLength(chunk);
  });
  stream.on("close", () => resolve(size));
  stream.on("error", reject);
  stream.resume();
});
function writableDiscardStream(options) {
  return new Writable({
    ...options,
    write(chunk, encding, callback) {
      setImmediate(callback);
    }
  });
}
const file = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bytesToHumanReadable,
  bytesToKbytes,
  getStreamSize,
  kbytesToBytes,
  streamToBuffer,
  writableDiscardStream
}, Symbol.toStringTag, { value: "Module" }));
const webhookEvents = {
  ENTRY_CREATE: "entry.create",
  ENTRY_UPDATE: "entry.update",
  ENTRY_DELETE: "entry.delete",
  ENTRY_PUBLISH: "entry.publish",
  ENTRY_UNPUBLISH: "entry.unpublish",
  MEDIA_CREATE: "media.create",
  MEDIA_UPDATE: "media.update",
  MEDIA_DELETE: "media.delete"
};
const deprecatedWebhookEvents = new Proxy(webhookEvents, {
  get(target, prop) {
    console.warn(
      "[deprecated] @strapi/utils/webhook will no longer exist in the next major release of Strapi. Instead, the webhookEvents object can be retrieved from strapi.webhookStore.allowedEvents"
    );
    return target[prop];
  }
});
const webhook = {
  webhookEvents: deprecatedWebhookEvents
};
export {
  contentTypes,
  convertQueryParams,
  env,
  errors,
  escapeQuery,
  file,
  forEachAsync,
  generateTimestampCode,
  getAbsoluteAdminUrl,
  getAbsoluteServerUrl,
  getCommonBeginning,
  getConfigUrls,
  handleYupError,
  hooks,
  importDefault,
  isCamelCase,
  isKebabCase,
  isOperator,
  isOperatorOfType,
  joinBy,
  keysDeep,
  mapAsync,
  nameToCollectionName,
  nameToSlug,
  pagination,
  parseMultipartData,
  parseType,
  pipeAsync,
  policy,
  providerFactory,
  reduceAsync,
  relations,
  removeUndefined,
  index$1 as sanitize,
  setCreatorFields,
  startsWithANumber,
  stringEquals,
  stringIncludes,
  template,
  templateConfiguration,
  toKebabCase,
  toRegressedEnumValue,
  index$2 as traverse,
  traverseEntity$1 as traverseEntity,
  index as validate,
  validateYupSchema,
  validateYupSchemaSync,
  webhook,
  yup
};
//# sourceMappingURL=index.mjs.map
