"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fetch = require("node-fetch");
const httpsProxyAgent = require("https-proxy-agent");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
const fetch__default = /* @__PURE__ */ _interopDefault(fetch);
function createStrapiFetch(strapi) {
  function fetch2(url, options) {
    return fetch__default.default(url, {
      ...fetch2.agent ? { agent: fetch2.agent } : {},
      ...options
    });
  }
  const { globalProxy: proxy } = strapi.config.get("server");
  if (proxy) {
    fetch2.agent = new httpsProxyAgent.HttpsProxyAgent(proxy);
  }
  return fetch2;
}
exports.createStrapiFetch = createStrapiFetch;
//# sourceMappingURL=fetch.js.map
