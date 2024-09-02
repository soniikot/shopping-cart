"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const strapiUtils = require("@strapi/utils");
const getLimitConfigDefaults = () => ({
  defaultLimit: fp.toNumber(strapi.config.get("api.rest.defaultLimit", 25)),
  maxLimit: fp.toNumber(strapi.config.get("api.rest.maxLimit")) || null
});
const shouldApplyMaxLimit = (limit, maxLimit, { isPagedPagination: isPagedPagination2 = false } = {}) => !isPagedPagination2 && limit === -1 || maxLimit !== null && limit > maxLimit;
const shouldCount = (params) => {
  if (fp.has("pagination.withCount", params)) {
    const withCount = params.pagination?.withCount;
    if (typeof withCount === "boolean") {
      return withCount;
    }
    if (typeof withCount === "undefined") {
      return false;
    }
    if (["true", "t", "1", 1].includes(withCount)) {
      return true;
    }
    if (["false", "f", "0", 0].includes(withCount)) {
      return false;
    }
    throw new strapiUtils.errors.ValidationError(
      'Invalid withCount parameter. Expected "t","1","true","false","0","f"'
    );
  }
  return Boolean(strapi.config.get("api.rest.withCount", true));
};
const isOffsetPagination = (pagination) => fp.has("start", pagination) || fp.has("limit", pagination);
const isPagedPagination = (pagination) => fp.has("page", pagination) || fp.has("pageSize", pagination);
const getPaginationInfo = (params) => {
  const { defaultLimit, maxLimit } = getLimitConfigDefaults();
  const { pagination } = params;
  const isPaged = isPagedPagination(pagination);
  const isOffset = isOffsetPagination(pagination);
  if (isOffset && isPaged) {
    throw new strapiUtils.errors.ValidationError(
      "Invalid pagination parameters. Expected either start/limit or page/pageSize"
    );
  }
  if (!isOffset && !isPaged) {
    return {
      page: 1,
      pageSize: defaultLimit
    };
  }
  if (isPagedPagination(pagination)) {
    const pageSize = fp.isUndefined(pagination.pageSize) ? defaultLimit : Math.max(1, fp.toNumber(pagination.pageSize));
    return {
      page: Math.max(1, fp.toNumber(pagination.page || 1)),
      pageSize: typeof maxLimit === "number" && shouldApplyMaxLimit(pageSize, maxLimit, { isPagedPagination: true }) ? maxLimit : Math.max(1, pageSize)
    };
  }
  const limit = fp.isUndefined(pagination.limit) ? defaultLimit : fp.toNumber(pagination.limit);
  return {
    start: Math.max(0, fp.toNumber(pagination.start || 0)),
    limit: shouldApplyMaxLimit(limit, maxLimit) ? maxLimit || -1 : Math.max(1, limit)
  };
};
const convertPagedToStartLimit = (paginationInfo) => {
  if ("page" in paginationInfo) {
    const { page, pageSize } = paginationInfo;
    return {
      start: (page - 1) * pageSize,
      limit: pageSize
    };
  }
  return paginationInfo;
};
const transformPaginationResponse = (paginationInfo, count) => {
  if ("page" in paginationInfo) {
    return {
      ...paginationInfo,
      pageCount: Math.ceil(count / paginationInfo.pageSize),
      total: count
    };
  }
  return {
    ...paginationInfo,
    total: count
  };
};
exports.convertPagedToStartLimit = convertPagedToStartLimit;
exports.getPaginationInfo = getPaginationInfo;
exports.shouldCount = shouldCount;
exports.transformPaginationResponse = transformPaginationResponse;
//# sourceMappingURL=pagination.js.map
