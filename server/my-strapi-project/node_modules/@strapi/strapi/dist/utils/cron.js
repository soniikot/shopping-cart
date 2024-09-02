"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const fp = require("lodash/fp");
const INTEGER_REGEX = /^\d+$/;
const STEP_REGEX = /^\*\/\d+$/;
const COMPONENTS = [
  { limit: 60, zeroBasedIndices: true, functionName: "getSeconds" },
  { limit: 60, zeroBasedIndices: true, functionName: "getMinutes" },
  { limit: 24, zeroBasedIndices: true, functionName: "getHours" },
  { limit: 31, zeroBasedIndices: false, functionName: "getDate" },
  { limit: 12, zeroBasedIndices: false, functionName: "getMonth" },
  { limit: 7, zeroBasedIndices: true, functionName: "getDay" }
];
const shift = (component, index, date) => {
  if (component === "*") {
    return "*";
  }
  const { limit, zeroBasedIndices, functionName } = COMPONENTS[index];
  const offset = +!zeroBasedIndices;
  const currentValue = date[functionName]();
  if (INTEGER_REGEX.test(component)) {
    return (Number.parseInt(component, 10) + currentValue) % limit + offset;
  }
  if (STEP_REGEX.test(component)) {
    const [, step] = component.split("/");
    const frequency = Math.floor(limit / Number(step));
    const list = Array.from({ length: frequency }, (_, index2) => index2 * Number(step));
    return list.map((value) => (value + currentValue) % limit + offset).sort((a, b) => a - b);
  }
  return component;
};
const shiftCronExpression = (rule, date = /* @__PURE__ */ new Date()) => {
  const components = rule.trim().split(" ").filter(fp.negate(fp.isEmpty));
  const secondsIncluded = components.length === 6;
  return components.map((component, index) => shift(component, secondsIncluded ? index : index + 1, date)).join(" ");
};
exports.shiftCronExpression = shiftCronExpression;
//# sourceMappingURL=cron.js.map
