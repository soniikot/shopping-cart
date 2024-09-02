"use strict";
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const helperPlugin = require("@strapi/helper-plugin");
const Icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const reactRouterDom = require("react-router-dom");
const styled = require("styled-components");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const Table = ({
  permissions,
  headers = [],
  contentType,
  isLoading = false,
  tokens = [],
  onConfirmDelete,
  tokenType
}) => {
  const { canDelete, canUpdate, canRead } = permissions;
  return /* @__PURE__ */ jsxRuntime.jsx(
    helperPlugin.DynamicTable,
    {
      headers,
      contentType,
      rows: tokens,
      withBulkActions: canDelete || canUpdate || canRead,
      isLoading,
      onConfirmDelete,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        TableRows,
        {
          tokenType,
          permissions,
          onConfirmDelete
        }
      )
    }
  );
};
const TableRows = ({
  tokenType,
  permissions,
  rows = [],
  withBulkActions,
  onConfirmDelete
}) => {
  const { canDelete, canUpdate, canRead } = permissions;
  const [{ query }] = helperPlugin.useQueryParams();
  const { formatMessage } = reactIntl.useIntl();
  const [, sortOrder] = query && query.sort ? query.sort.split(":") : [void 0, "ASC"];
  const {
    push,
    location: { pathname }
  } = reactRouterDom.useHistory();
  const { trackUsage } = helperPlugin.useTracking();
  const sortedTokens = [...rows].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === "DESC" ? -comparison : comparison;
  });
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: sortedTokens.map((token) => {
    return /* @__PURE__ */ jsxRuntime.jsxs(
      designSystem.Tr,
      {
        ...helperPlugin.onRowClick({
          fn() {
            trackUsage("willEditTokenFromList", {
              tokenType
            });
            push(`${pathname}/${token.id}`);
          },
          condition: canUpdate
        }),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { maxWidth: helperPlugin.pxToRem(250), children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", fontWeight: "bold", ellipsis: true, children: token.name }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { maxWidth: helperPlugin.pxToRem(250), children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", ellipsis: true, children: token.description }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.RelativeTime, { timestamp: new Date(token.createdAt) }) }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: token.lastUsedAt && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsxRuntime.jsx(
            helperPlugin.RelativeTime,
            {
              timestamp: new Date(token.lastUsedAt),
              customIntervals: [
                {
                  unit: "hours",
                  threshold: 1,
                  text: formatMessage({
                    id: "Settings.apiTokens.lastHour",
                    defaultMessage: "last hour"
                  })
                }
              ]
            }
          ) }) }),
          withBulkActions && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "end", children: [
            canUpdate && /* @__PURE__ */ jsxRuntime.jsx(UpdateButton, { tokenName: token.name, tokenId: token.id }),
            !canUpdate && canRead && /* @__PURE__ */ jsxRuntime.jsx(ReadButton, { tokenName: token.name, tokenId: token.id }),
            canDelete && /* @__PURE__ */ jsxRuntime.jsx(
              DeleteButton,
              {
                tokenName: token.name,
                onClickDelete: () => onConfirmDelete?.(token.id),
                tokenType
              }
            )
          ] }) })
        ]
      },
      token.id
    );
  }) });
};
const MESSAGES_MAP = {
  edit: {
    id: "app.component.table.edit",
    defaultMessage: "Edit {target}"
  },
  read: {
    id: "app.component.table.read",
    defaultMessage: "Read {target}"
  }
};
const DefaultButton = ({
  tokenName,
  tokenId,
  buttonType = "edit",
  children
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const {
    location: { pathname }
  } = reactRouterDom.useHistory();
  return /* @__PURE__ */ jsxRuntime.jsx(
    LinkStyled,
    {
      forwardedAs: reactRouterDom.NavLink,
      to: `${pathname}/${tokenId}`,
      title: formatMessage(MESSAGES_MAP[buttonType], { target: tokenName }),
      children
    }
  );
};
const LinkStyled = styled__default.default(v2.Link)`
  svg {
    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }

  &:hover,
  &:focus {
    svg {
      path {
        fill: ${({ theme }) => theme.colors.neutral800};
      }
    }
  }
`;
const DeleteButton = ({ tokenName, onClickDelete, tokenType }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { trackUsage } = helperPlugin.useTracking();
  const [showConfirmDialog, setShowConfirmDialog] = React__namespace.useState(false);
  const handleClickDelete = () => {
    setShowConfirmDialog(false);
    trackUsage("willDeleteToken", {
      tokenType
    });
    onClickDelete();
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingLeft: 1, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.IconButton,
      {
        onClick: () => {
          setShowConfirmDialog(true);
        },
        label: formatMessage(
          {
            id: "global.delete-target",
            defaultMessage: "Delete {target}"
          },
          { target: `${tokenName}` }
        ),
        name: "delete",
        borderWidth: 0,
        icon: /* @__PURE__ */ jsxRuntime.jsx(Icons.Trash, {})
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      helperPlugin.ConfirmDialog,
      {
        onToggleDialog: () => setShowConfirmDialog(false),
        onConfirm: handleClickDelete,
        isOpen: showConfirmDialog
      }
    )
  ] });
};
const ReadButton = ({ tokenName, tokenId }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(DefaultButton, { tokenName, tokenId, buttonType: "read", children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Eye, {}) });
};
const UpdateButton = ({ tokenName, tokenId }) => {
  return /* @__PURE__ */ jsxRuntime.jsx(DefaultButton, { tokenName, tokenId, children: /* @__PURE__ */ jsxRuntime.jsx(Icons.Pencil, { width: 12 }) });
};
exports.Table = Table;
//# sourceMappingURL=Table-T-qYlZ1f.js.map
