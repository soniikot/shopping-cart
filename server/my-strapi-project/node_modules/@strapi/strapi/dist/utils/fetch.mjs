import nodeFetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
function createStrapiFetch(strapi) {
  function fetch(url, options) {
    return nodeFetch(url, {
      ...fetch.agent ? { agent: fetch.agent } : {},
      ...options
    });
  }
  const { globalProxy: proxy } = strapi.config.get("server");
  if (proxy) {
    fetch.agent = new HttpsProxyAgent(proxy);
  }
  return fetch;
}
export {
  createStrapiFetch
};
//# sourceMappingURL=fetch.mjs.map
