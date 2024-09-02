import { lightTheme } from "@strapi/design-system";
const REDUX_NAMESPACE = "settings_review-workflows";
const ACTION_RESET_WORKFLOW = `Settings/Review_Workflows/RESET_WORKFLOW`;
const ACTION_SET_CONTENT_TYPES = `Settings/Review_Workflows/SET_CONTENT_TYPES`;
const ACTION_SET_IS_LOADING = `Settings/Review_Workflows/SET_IS_LOADING`;
const ACTION_SET_ROLES = `Settings/Review_Workflows/SET_ROLES`;
const ACTION_SET_WORKFLOW = `Settings/Review_Workflows/SET_WORKFLOW`;
const ACTION_SET_WORKFLOWS = `Settings/Review_Workflows/SET_WORKFLOWS`;
const ACTION_DELETE_STAGE = `Settings/Review_Workflows/WORKFLOW_DELETE_STAGE`;
const ACTION_ADD_STAGE = `Settings/Review_Workflows/WORKFLOW_ADD_STAGE`;
const ACTION_CLONE_STAGE = `Settings/Review_Workflows/WORKFLOW_CLONE_STAGE`;
const ACTION_UPDATE_STAGE = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGE`;
const ACTION_UPDATE_STAGES = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGES`;
const ACTION_UPDATE_STAGE_POSITION = `Settings/Review_Workflows/WORKFLOW_UPDATE_STAGE_POSITION`;
const ACTION_UPDATE_WORKFLOW = `Settings/Review_Workflows/WORKFLOW_UPDATE`;
const STAGE_COLORS = {
  primary600: "Blue",
  primary200: "Lilac",
  alternative600: "Violet",
  alternative200: "Lavender",
  success600: "Green",
  success200: "Pale Green",
  danger500: "Cherry",
  danger200: "Pink",
  warning600: "Orange",
  warning200: "Yellow",
  secondary600: "Teal",
  secondary200: "Baby Blue",
  neutral400: "Gray",
  neutral0: "White"
};
const STAGE_COLOR_DEFAULT = lightTheme.colors.primary600;
const DRAG_DROP_TYPES = {
  STAGE: "stage"
};
const CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME = "numberOfWorkflows";
const CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME = "stagesPerWorkflow";
export {
  ACTION_SET_WORKFLOW as A,
  CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME as C,
  DRAG_DROP_TYPES as D,
  REDUX_NAMESPACE as R,
  STAGE_COLORS as S,
  CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME as a,
  STAGE_COLOR_DEFAULT as b,
  ACTION_SET_WORKFLOWS as c,
  ACTION_ADD_STAGE as d,
  ACTION_RESET_WORKFLOW as e,
  ACTION_SET_CONTENT_TYPES as f,
  ACTION_SET_ROLES as g,
  ACTION_SET_IS_LOADING as h,
  ACTION_UPDATE_WORKFLOW as i,
  ACTION_CLONE_STAGE as j,
  ACTION_DELETE_STAGE as k,
  ACTION_UPDATE_STAGE as l,
  ACTION_UPDATE_STAGES as m,
  ACTION_UPDATE_STAGE_POSITION as n
};
//# sourceMappingURL=constants-8sAt6dKz.mjs.map
