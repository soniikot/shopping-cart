"use strict";
const strapiUtils = require("@strapi/utils");
const textNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["text"]).required(),
  text: strapiUtils.yup.string().test(
    "is-valid-text",
    "Text must be defined with at least an empty string",
    (text) => {
      return typeof text === "string" || text === "";
    }
  ),
  bold: strapiUtils.yup.boolean(),
  italic: strapiUtils.yup.boolean(),
  underline: strapiUtils.yup.boolean(),
  strikethrough: strapiUtils.yup.boolean(),
  code: strapiUtils.yup.boolean()
});
const checkValidLink = (link) => {
  try {
    new URL(link.startsWith("/") ? `https://strapi.io${link}` : link);
  } catch (error) {
    return false;
  }
  return true;
};
const linkNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["link"]).required(),
  url: strapiUtils.yup.string().test("invalid-url", "Please specify a valid link.", (value) => checkValidLink(value ?? "")),
  children: strapiUtils.yup.array().of(textNodeValidator).required()
});
const inlineNodeValidator = strapiUtils.yup.lazy((value) => {
  switch (value.type) {
    case "text":
      return textNodeValidator;
    case "link":
      return linkNodeValidator;
    default:
      return strapiUtils.yup.mixed().test("invalid-type", "Inline node must be Text or Link", () => {
        return false;
      });
  }
});
const paragraphNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["paragraph"]).required(),
  children: strapiUtils.yup.array().of(inlineNodeValidator).min(1, "Paragraph node children must have at least one Text or Link node").required()
});
const headingNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["heading"]).required(),
  level: strapiUtils.yup.number().oneOf([1, 2, 3, 4, 5, 6]).required(),
  children: strapiUtils.yup.array().of(inlineNodeValidator).min(1, "Heading node children must have at least one Text or Link node").required()
});
const quoteNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["quote"]).required(),
  children: strapiUtils.yup.array().of(inlineNodeValidator).min(1, "Quote node children must have at least one Text or Link node").required()
});
const codeBlockValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["code"]).required(),
  syntax: strapiUtils.yup.string().nullable(),
  children: strapiUtils.yup.array().of(textNodeValidator).min(1, "Quote node children must have at least one Text or Link node").required()
});
const listItemNode = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["list-item"]).required(),
  children: strapiUtils.yup.array().of(inlineNodeValidator).required()
});
const listChildrenValidator = strapiUtils.yup.lazy((value) => {
  switch (value.type) {
    case "list":
      return listNodeValidator;
    case "list-item":
      return listItemNode;
    default:
      return strapiUtils.yup.mixed().test("invalid-type", "Inline node must be list-item or list", () => {
        return false;
      });
  }
});
const listNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["list"]).required(),
  format: strapiUtils.yup.string().equals(["ordered", "unordered"]).required(),
  children: strapiUtils.yup.array().of(listChildrenValidator).min(1, "List node children must have at least one ListItem or ListNode").required()
});
const imageNodeValidator = strapiUtils.yup.object().shape({
  type: strapiUtils.yup.string().equals(["image"]).required(),
  image: strapiUtils.yup.object().shape({
    name: strapiUtils.yup.string().required(),
    alternativeText: strapiUtils.yup.string().nullable(),
    url: strapiUtils.yup.string().required(),
    caption: strapiUtils.yup.string().nullable(),
    width: strapiUtils.yup.number().required(),
    height: strapiUtils.yup.number().required(),
    formats: strapiUtils.yup.object().required(),
    hash: strapiUtils.yup.string().required(),
    ext: strapiUtils.yup.string().required(),
    mime: strapiUtils.yup.string().required(),
    size: strapiUtils.yup.number().required(),
    previewUrl: strapiUtils.yup.string().nullable(),
    provider: strapiUtils.yup.string().required(),
    provider_metadata: strapiUtils.yup.mixed().nullable(),
    createdAt: strapiUtils.yup.string().required(),
    updatedAt: strapiUtils.yup.string().required()
  }),
  children: strapiUtils.yup.array().of(inlineNodeValidator).required()
});
const blockNodeValidator = strapiUtils.yup.lazy((value) => {
  switch (value.type) {
    case "paragraph":
      return paragraphNodeValidator;
    case "heading":
      return headingNodeValidator;
    case "quote":
      return quoteNodeValidator;
    case "list":
      return listNodeValidator;
    case "image":
      return imageNodeValidator;
    case "code":
      return codeBlockValidator;
    default:
      return strapiUtils.yup.mixed().test("invalid-type", "Block node is of invalid type", () => {
        return false;
      });
  }
});
const blocksValidator = strapiUtils.yup.array().of(blockNodeValidator);
const blocksValidator$1 = (metas, options) => blocksValidator;
module.exports = blocksValidator$1;
//# sourceMappingURL=blocks-validator.js.map
