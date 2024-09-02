"use strict";
const designSystem = require("@strapi/design-system");
const constants = require("./constants-L1I-Y-RJ.js");
function getStageColorByHex(hex) {
  if (!hex) {
    return null;
  }
  const themeColors = Object.entries(
    designSystem.lightTheme.colors
  ).filter(([, value]) => value.toUpperCase() === hex.toUpperCase());
  const themeColorName = themeColors.reduce((acc, [name]) => {
    if (constants.STAGE_COLORS?.[name]) {
      acc = name;
    }
    return acc;
  }, null);
  if (!themeColorName) {
    return null;
  }
  return {
    themeColorName,
    name: constants.STAGE_COLORS[themeColorName]
  };
}
function getAvailableStageColors() {
  return Object.entries(constants.STAGE_COLORS).map(([themeColorName, name]) => ({
    hex: designSystem.lightTheme.colors[themeColorName].toUpperCase(),
    name
  }));
}
exports.getAvailableStageColors = getAvailableStageColors;
exports.getStageColorByHex = getStageColorByHex;
//# sourceMappingURL=colors-6VKZqnio.js.map
