import open from "open";
import { getAbsoluteAdminUrl } from "@strapi/utils";
async function openBrowser(config) {
  const url = getAbsoluteAdminUrl(config);
  return open(url);
}
export {
  openBrowser as default
};
//# sourceMappingURL=open-browser.mjs.map
