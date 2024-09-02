"use strict";
const fp = require("lodash/fp");
const getNumberOfDynamicZones = () => {
  return fp.pipe(
    fp.map("attributes"),
    fp.flatMap(fp.values),
    fp.sumBy((item) => {
      if (item.type === "dynamiczone") {
        return 1;
      }
      return 0;
    })
  )(strapi.contentTypes);
};
module.exports = getNumberOfDynamicZones;
//# sourceMappingURL=dynamic-zones.js.map
