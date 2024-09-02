import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Tbody, Tr, Td, Typography, Flex, Box, IconButton } from "@strapi/design-system";
import { Link } from "@strapi/design-system/v2";
import { DynamicTable, useQueryParams, useTracking, onRowClick, pxToRem, RelativeTime, ConfirmDialog } from "@strapi/helper-plugin";
import { Trash, Eye, Pencil } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useHistory, NavLink } from "react-router-dom";
import styled from "styled-components";
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
  return /* @__PURE__ */ jsx(
    DynamicTable,
    {
      headers,
      contentType,
      rows: tokens,
      withBulkActions: canDelete || canUpdate || canRead,
      isLoading,
      onConfirmDelete,
      children: /* @__PURE__ */ jsx(
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
  const [{ query }] = useQueryParams();
  const { formatMessage } = useIntl();
  const [, sortOrder] = query && query.sort ? query.sort.split(":") : [void 0, "ASC"];
  const {
    push,
    location: { pathname }
  } = useHistory();
  const { trackUsage } = useTracking();
  const sortedTokens = [...rows].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === "DESC" ? -comparison : comparison;
  });
  return /* @__PURE__ */ jsx(Tbody, { children: sortedTokens.map((token) => {
    return /* @__PURE__ */ jsxs(
      Tr,
      {
        ...onRowClick({
          fn() {
            trackUsage("willEditTokenFromList", {
              tokenType
            });
            push(`${pathname}/${token.id}`);
          },
          condition: canUpdate
        }),
        children: [
          /* @__PURE__ */ jsx(Td, { maxWidth: pxToRem(250), children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", fontWeight: "bold", ellipsis: true, children: token.name }) }),
          /* @__PURE__ */ jsx(Td, { maxWidth: pxToRem(250), children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", ellipsis: true, children: token.description }) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsx(RelativeTime, { timestamp: new Date(token.createdAt) }) }) }),
          /* @__PURE__ */ jsx(Td, { children: token.lastUsedAt && /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: /* @__PURE__ */ jsx(
            RelativeTime,
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
          withBulkActions && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, { justifyContent: "end", children: [
            canUpdate && /* @__PURE__ */ jsx(UpdateButton, { tokenName: token.name, tokenId: token.id }),
            !canUpdate && canRead && /* @__PURE__ */ jsx(ReadButton, { tokenName: token.name, tokenId: token.id }),
            canDelete && /* @__PURE__ */ jsx(
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
  const { formatMessage } = useIntl();
  const {
    location: { pathname }
  } = useHistory();
  return /* @__PURE__ */ jsx(
    LinkStyled,
    {
      forwardedAs: NavLink,
      to: `${pathname}/${tokenId}`,
      title: formatMessage(MESSAGES_MAP[buttonType], { target: tokenName }),
      children
    }
  );
};
const LinkStyled = styled(Link)`
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
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const handleClickDelete = () => {
    setShowConfirmDialog(false);
    trackUsage("willDeleteToken", {
      tokenType
    });
    onClickDelete();
  };
  return /* @__PURE__ */ jsxs(Box, { paddingLeft: 1, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsx(
      IconButton,
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
        icon: /* @__PURE__ */ jsx(Trash, {})
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        onToggleDialog: () => setShowConfirmDialog(false),
        onConfirm: handleClickDelete,
        isOpen: showConfirmDialog
      }
    )
  ] });
};
const ReadButton = ({ tokenName, tokenId }) => {
  return /* @__PURE__ */ jsx(DefaultButton, { tokenName, tokenId, buttonType: "read", children: /* @__PURE__ */ jsx(Eye, {}) });
};
const UpdateButton = ({ tokenName, tokenId }) => {
  return /* @__PURE__ */ jsx(DefaultButton, { tokenName, tokenId, children: /* @__PURE__ */ jsx(Pencil, { width: 12 }) });
};
export {
  Table as T
};
//# sourceMappingURL=Table-nKuv1TlJ.mjs.map
