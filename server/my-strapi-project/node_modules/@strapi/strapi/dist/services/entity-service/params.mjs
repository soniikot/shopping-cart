import { pick } from "lodash/fp";
const pickSelectionParams = (data) => {
  return pick(["fields", "populate"], data);
};
export {
  pickSelectionParams
};
//# sourceMappingURL=params.mjs.map
