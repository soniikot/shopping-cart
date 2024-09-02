"use strict";
const designSystem = require("@strapi/design-system");
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
const STAGE_COLOR_DEFAULT = designSystem.lightTheme.colors.primary600;
const DRAG_DROP_TYPES = {
  STAGE: "stage"
};
const CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME = "numberOfWorkflows";
const CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME = "stagesPerWorkflow";
exports.ACTION_ADD_STAGE = ACTION_ADD_STAGE;
exports.ACTION_CLONE_STAGE = ACTION_CLONE_STAGE;
exports.ACTION_DELETE_STAGE = ACTION_DELETE_STAGE;
exports.ACTION_RESET_WORKFLOW = ACTION_RESET_WORKFLOW;
exports.ACTION_SET_CONTENT_TYPES = ACTION_SET_CONTENT_TYPES;
exports.ACTION_SET_IS_LOADING = ACTION_SET_IS_LOADING;
exports.ACTION_SET_ROLES = ACTION_SET_ROLES;
exports.ACTION_SET_WORKFLOW = ACTION_SET_WORKFLOW;
exports.ACTION_SET_WORKFLOWS = ACTION_SET_WORKFLOWS;
exports.ACTION_UPDATE_STAGE = ACTION_UPDATE_STAGE;
exports.ACTION_UPDATE_STAGES = ACTION_UPDATE_STAGES;
exports.ACTION_UPDATE_STAGE_POSITION = ACTION_UPDATE_STAGE_POSITION;
exports.ACTION_UPDATE_WORKFLOW = ACTION_UPDATE_WORKFLOW;
exports.CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME = CHARGEBEE_STAGES_PER_WORKFLOW_ENTITLEMENT_NAME;
exports.CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME = CHARGEBEE_WORKFLOW_ENTITLEMENT_NAME;
exports.DRAG_DROP_TYPES = DRAG_DROP_TYPES;
exports.REDUX_NAMESPACE = REDUX_NAMESPACE;
exports.STAGE_COLORS = STAGE_COLORS;
exports.STAGE_COLOR_DEFAULT = STAGE_COLOR_DEFAULT;
//# sourceMappingURL=constants-L1I-Y-RJ.js.map
