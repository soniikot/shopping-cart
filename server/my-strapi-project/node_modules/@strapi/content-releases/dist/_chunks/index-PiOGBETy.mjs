import { getFetchClient, useNotification, useAPIErrorHandler, CheckPermissions, useCMEditViewDataManager, NoContent, useRBAC, SortIcon, prefixPluginTranslations } from "@strapi/helper-plugin";
import { Cross, Pencil, More, Plus, PaperPlane } from "@strapi/icons";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { IconButton, Flex, Icon, Typography, Field, FieldLabel, VisuallyHidden, FieldInput, Box, Button as Button$1, ModalLayout, ModalHeader, ModalBody, SingleSelect, SingleSelectOption, ModalFooter, Popover } from "@strapi/design-system";
import { Menu, Link, LinkButton } from "@strapi/design-system/v2";
import { isAxiosError as isAxiosError$1 } from "axios";
import { Formik, Form } from "formik";
import { useIntl } from "react-intl";
import { NavLink, Link as Link$1 } from "react-router-dom";
import * as yup from "yup";
import { createApi } from "@reduxjs/toolkit/query/react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const PERMISSIONS = {
  main: [
    {
      action: "plugin::content-releases.read",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  create: [
    {
      action: "plugin::content-releases.create",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  update: [
    {
      action: "plugin::content-releases.update",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  delete: [
    {
      action: "plugin::content-releases.delete",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  createAction: [
    {
      action: "plugin::content-releases.create-action",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  deleteAction: [
    {
      action: "plugin::content-releases.delete-action",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ],
  publish: [
    {
      action: "plugin::content-releases.publish",
      subject: null,
      id: "",
      actionParameters: {},
      properties: {},
      conditions: []
    }
  ]
};
const pluginId = "content-releases";
const axiosBaseQuery = async ({
  url,
  method,
  data,
  config
}) => {
  try {
    const { get, post, del, put } = getFetchClient();
    if (method === "POST") {
      const result2 = await post(url, data, config);
      return { data: result2.data };
    }
    if (method === "DELETE") {
      const result2 = await del(url, config);
      return { data: result2.data };
    }
    if (method === "PUT") {
      const result2 = await put(url, data, config);
      return { data: result2.data };
    }
    const result = await get(url, config);
    return { data: result.data };
  } catch (error) {
    const err = error;
    return {
      error: {
        status: err.response?.status,
        code: err.code,
        response: {
          data: err.response?.data
        }
      }
    };
  }
};
const isAxiosError = (err) => {
  return typeof err === "object" && err !== null && "response" in err && typeof err.response === "object" && err.response !== null && "data" in err.response;
};
const releaseApi = createApi({
  reducerPath: pluginId,
  baseQuery: axiosBaseQuery,
  tagTypes: ["Release", "ReleaseAction", "EntriesInRelease"],
  endpoints: (build) => {
    return {
      getReleasesForEntry: build.query({
        query(params) {
          return {
            url: "/content-releases",
            method: "GET",
            config: {
              params
            }
          };
        },
        providesTags: (result) => result ? [
          ...result.data.map(({ id }) => ({ type: "Release", id })),
          { type: "Release", id: "LIST" }
        ] : []
      }),
      getReleases: build.query({
        query({ page, pageSize, filters } = {
          page: 1,
          pageSize: 16,
          filters: {
            releasedAt: {
              $notNull: false
            }
          }
        }) {
          return {
            url: "/content-releases",
            method: "GET",
            config: {
              params: {
                page: page || 1,
                pageSize: pageSize || 16,
                filters: filters || {
                  releasedAt: {
                    $notNull: false
                  }
                }
              }
            }
          };
        },
        transformResponse(response, meta, arg) {
          const releasedAtValue = arg?.filters?.releasedAt?.$notNull;
          const isActiveDoneTab = releasedAtValue === "true";
          const newResponse = {
            ...response,
            meta: {
              ...response.meta,
              activeTab: isActiveDoneTab ? "done" : "pending"
            }
          };
          return newResponse;
        },
        providesTags: (result) => result ? [
          ...result.data.map(({ id }) => ({ type: "Release", id })),
          { type: "Release", id: "LIST" }
        ] : [{ type: "Release", id: "LIST" }]
      }),
      getRelease: build.query({
        query({ id }) {
          return {
            url: `/content-releases/${id}`,
            method: "GET"
          };
        },
        providesTags: (result, error, arg) => [{ type: "Release", id: arg.id }]
      }),
      getReleaseActions: build.query({
        query({ releaseId, ...params }) {
          return {
            url: `/content-releases/${releaseId}/actions`,
            method: "GET",
            config: {
              params
            }
          };
        },
        providesTags: [{ type: "ReleaseAction", id: "LIST" }]
      }),
      createRelease: build.mutation({
        query(data) {
          return {
            url: "/content-releases",
            method: "POST",
            data
          };
        },
        invalidatesTags: [{ type: "Release", id: "LIST" }]
      }),
      updateRelease: build.mutation({
        query({ id, ...data }) {
          return {
            url: `/content-releases/${id}`,
            method: "PUT",
            data
          };
        },
        invalidatesTags: (result, error, arg) => [{ type: "Release", id: arg.id }]
      }),
      createReleaseAction: build.mutation({
        query({ body, params }) {
          return {
            url: `/content-releases/${params.releaseId}/actions`,
            method: "POST",
            data: body
          };
        },
        invalidatesTags: [
          { type: "Release", id: "LIST" },
          { type: "ReleaseAction", id: "LIST" }
        ]
      }),
      createManyReleaseActions: build.mutation({
        query({ body, params }) {
          return {
            url: `/content-releases/${params.releaseId}/actions/bulk`,
            method: "POST",
            data: body
          };
        },
        invalidatesTags: [
          { type: "Release", id: "LIST" },
          { type: "ReleaseAction", id: "LIST" },
          { type: "EntriesInRelease" }
        ]
      }),
      updateReleaseAction: build.mutation({
        query({ body, params }) {
          return {
            url: `/content-releases/${params.releaseId}/actions/${params.actionId}`,
            method: "PUT",
            data: body
          };
        },
        invalidatesTags: () => [{ type: "ReleaseAction", id: "LIST" }],
        async onQueryStarted({ body, params, query, actionPath }, { dispatch, queryFulfilled }) {
          const paramsWithoutActionId = {
            releaseId: params.releaseId,
            ...query
          };
          const patchResult = dispatch(
            releaseApi.util.updateQueryData("getReleaseActions", paramsWithoutActionId, (draft) => {
              const [key, index] = actionPath;
              const action = draft.data[key][index];
              if (action) {
                action.type = body.type;
              }
            })
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        }
      }),
      deleteReleaseAction: build.mutation({
        query({ params }) {
          return {
            url: `/content-releases/${params.releaseId}/actions/${params.actionId}`,
            method: "DELETE"
          };
        },
        invalidatesTags: (result, error, arg) => [
          { type: "Release", id: "LIST" },
          { type: "Release", id: arg.params.releaseId },
          { type: "ReleaseAction", id: "LIST" },
          { type: "EntriesInRelease" }
        ]
      }),
      publishRelease: build.mutation({
        query({ id }) {
          return {
            url: `/content-releases/${id}/publish`,
            method: "POST"
          };
        },
        invalidatesTags: (result, error, arg) => [{ type: "Release", id: arg.id }]
      }),
      deleteRelease: build.mutation({
        query({ id }) {
          return {
            url: `/content-releases/${id}`,
            method: "DELETE"
          };
        },
        invalidatesTags: () => [{ type: "Release", id: "LIST" }, { type: "EntriesInRelease" }]
      }),
      getMappedEntriesInReleases: build.query({
        query(params) {
          return {
            url: "/content-releases/mapEntriesToReleases",
            method: "GET",
            config: {
              params
            }
          };
        },
        transformResponse(response) {
          return response.data;
        },
        providesTags: [{ type: "EntriesInRelease" }]
      })
    };
  }
});
const {
  useGetReleasesQuery,
  useGetReleasesForEntryQuery,
  useGetReleaseQuery,
  useGetReleaseActionsQuery,
  useCreateReleaseMutation,
  useCreateReleaseActionMutation,
  useCreateManyReleaseActionsMutation,
  useUpdateReleaseMutation,
  useUpdateReleaseActionMutation,
  usePublishReleaseMutation,
  useDeleteReleaseActionMutation,
  useDeleteReleaseMutation,
  useGetMappedEntriesInReleasesQuery
} = releaseApi;
const getTimezoneOffset = (timezone, date) => {
  try {
    const offsetPart = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "longOffset"
    }).formatToParts(date).find((part) => part.type === "timeZoneName");
    const offset = offsetPart ? offsetPart.value : "";
    let utcOffset = offset.replace("GMT", "UTC");
    if (!utcOffset.includes("+") && !utcOffset.includes("-")) {
      utcOffset = `${utcOffset}+00:00`;
    }
    return utcOffset;
  } catch (error) {
    return "";
  }
};
const useTypedDispatch = useDispatch;
const useTypedSelector = useSelector;
const StyledMenuItem = styled(Menu.Item)`
  &:hover {
    background: ${({ theme, variant = "neutral" }) => theme.colors[`${variant}100`]};

    svg {
      path {
        fill: ${({ theme, variant = "neutral" }) => theme.colors[`${variant}600`]};
      }
    }

    a {
      color: ${({ theme }) => theme.colors.neutral800};
    }
  }

  svg {
    path {
      fill: ${({ theme, variant = "neutral" }) => theme.colors[`${variant}600`]};
    }
  }

  a {
    color: ${({ theme }) => theme.colors.neutral800};
  }

  span,
  a {
    width: 100%;
  }
`;
const StyledIconButton = styled(IconButton)`
  /* Setting this style inline with borderColor will not apply the style */
  border: ${({ theme }) => `1px solid ${theme.colors.neutral200}`};
`;
const DeleteReleaseActionItem = ({ releaseId, actionId }) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const [deleteReleaseAction] = useDeleteReleaseActionMutation();
  const handleDeleteAction = async () => {
    const response = await deleteReleaseAction({
      params: { releaseId, actionId }
    });
    if ("data" in response) {
      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "content-releases.content-manager-edit-view.remove-from-release.notification.success",
          defaultMessage: "Entry removed from release"
        })
      });
      return;
    }
    if ("error" in response) {
      if (isAxiosError$1(response.error)) {
        toggleNotification({
          type: "warning",
          message: formatAPIError(response.error)
        });
      } else {
        toggleNotification({
          type: "warning",
          message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
        });
      }
    }
  };
  return /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.deleteAction, children: /* @__PURE__ */ jsx(StyledMenuItem, { variant: "danger", onSelect: handleDeleteAction, children: /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(Icon, { as: Cross, width: 3, height: 3 }),
    /* @__PURE__ */ jsx(Typography, { textColor: "danger600", variant: "omega", children: formatMessage({
      id: "content-releases.content-manager-edit-view.remove-from-release",
      defaultMessage: "Remove from release"
    }) })
  ] }) }) });
};
const ReleaseActionEntryLinkItem = ({
  contentTypeUid,
  entryId,
  locale
}) => {
  const { formatMessage } = useIntl();
  const collectionTypePermissions = useTypedSelector(
    (state) => state.rbacProvider.collectionTypesRelatedPermissions
  );
  const updatePermissions = contentTypeUid ? collectionTypePermissions[contentTypeUid]?.["plugin::content-manager.explorer.update"] : [];
  const canUpdateEntryForLocale = Boolean(
    !locale || updatePermissions?.find(
      (permission) => permission.properties?.locales?.includes(locale)
    )
  );
  return /* @__PURE__ */ jsx(
    CheckPermissions,
    {
      permissions: [
        {
          action: "plugin::content-manager.explorer.update",
          subject: contentTypeUid
        }
      ],
      children: canUpdateEntryForLocale && /* @__PURE__ */ jsx(StyledMenuItem, { children: /* @__PURE__ */ jsx(
        Link,
        {
          as: NavLink,
          to: {
            pathname: `/content-manager/collection-types/${contentTypeUid}/${entryId}`,
            search: locale && `?plugins[i18n][locale]=${locale}`
          },
          startIcon: /* @__PURE__ */ jsx(Icon, { as: Pencil, width: 3, height: 3 }),
          children: /* @__PURE__ */ jsx(Typography, { variant: "omega", children: formatMessage({
            id: "content-releases.content-manager-edit-view.edit-entry",
            defaultMessage: "Edit entry"
          }) })
        }
      ) })
    }
  );
};
const EditReleaseItem = ({ releaseId }) => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(StyledMenuItem, { children: /* @__PURE__ */ jsx(
    Link,
    {
      href: `/admin/plugins/content-releases/${releaseId}`,
      startIcon: /* @__PURE__ */ jsx(Icon, { as: Pencil, width: 3, height: 3 }),
      isExternal: false,
      children: /* @__PURE__ */ jsx(Typography, { variant: "omega", children: formatMessage({
        id: "content-releases.content-manager-edit-view.edit-release",
        defaultMessage: "Edit release"
      }) })
    }
  ) });
};
const Root = ({ children, hasTriggerBorder = false }) => {
  const { formatMessage } = useIntl();
  return (
    // A user can access the dropdown if they have permissions to delete a release-action OR update a release
    /* @__PURE__ */ jsx(CheckPermissions, { permissions: [...PERMISSIONS.deleteAction, ...PERMISSIONS.update], children: /* @__PURE__ */ jsxs(Menu.Root, { children: [
      /* @__PURE__ */ jsx(
        Menu.Trigger,
        {
          as: hasTriggerBorder ? StyledIconButton : IconButton,
          paddingLeft: 2,
          paddingRight: 2,
          "aria-label": formatMessage({
            id: "content-releases.content-manager-edit-view.release-action-menu",
            defaultMessage: "Release action options"
          }),
          icon: /* @__PURE__ */ jsx(More, {})
        }
      ),
      /* @__PURE__ */ jsx(Menu.Content, { top: 1, popoverPlacement: "bottom-end", children })
    ] }) })
  );
};
const ReleaseActionMenu = {
  Root,
  EditReleaseItem,
  DeleteReleaseActionItem,
  ReleaseActionEntryLinkItem
};
const getBorderLeftRadiusValue = (actionType) => {
  return actionType === "publish" ? 1 : 0;
};
const getBorderRightRadiusValue = (actionType) => {
  return actionType === "publish" ? 0 : 1;
};
const FieldWrapper = styled(Field)`
  border-top-left-radius: ${({ actionType, theme }) => theme.spaces[getBorderLeftRadiusValue(actionType)]};
  border-bottom-left-radius: ${({ actionType, theme }) => theme.spaces[getBorderLeftRadiusValue(actionType)]};
  border-top-right-radius: ${({ actionType, theme }) => theme.spaces[getBorderRightRadiusValue(actionType)]};
  border-bottom-right-radius: ${({ actionType, theme }) => theme.spaces[getBorderRightRadiusValue(actionType)]};

  > label {
    color: inherit;
    padding: ${({ theme }) => `${theme.spaces[2]} ${theme.spaces[3]}`};
    text-align: center;
    vertical-align: middle;
    text-transform: capitalize;
  }

  &[data-checked='true'] {
    color: ${({ theme, actionType }) => actionType === "publish" ? theme.colors.primary700 : theme.colors.danger600};
    background-color: ${({ theme, actionType }) => actionType === "publish" ? theme.colors.primary100 : theme.colors.danger100};
    border-color: ${({ theme, actionType }) => actionType === "publish" ? theme.colors.primary700 : theme.colors.danger600};
  }

  &[data-checked='false'] {
    border-left: ${({ actionType }) => actionType === "unpublish" && "none"};
    border-right: ${({ actionType }) => actionType === "publish" && "none"};
  }

  &[data-checked='false'][data-disabled='false']:hover {
    color: ${({ theme }) => theme.colors.neutral700};
    background-color: ${({ theme }) => theme.colors.neutral100};
    border-color: ${({ theme }) => theme.colors.neutral200};

    & > label {
      cursor: pointer;
    }
  }

  &[data-disabled='true'] {
    color: ${({ theme }) => theme.colors.neutral600};
    background-color: ${({ theme }) => theme.colors.neutral150};
    border-color: ${({ theme }) => theme.colors.neutral300};
  }
`;
const ActionOption = ({
  selected,
  actionType,
  handleChange,
  name,
  disabled = false
}) => {
  return /* @__PURE__ */ jsx(
    FieldWrapper,
    {
      actionType,
      background: "primary0",
      borderColor: "neutral200",
      color: selected === actionType ? "primary600" : "neutral600",
      position: "relative",
      cursor: "pointer",
      "data-checked": selected === actionType,
      "data-disabled": disabled && selected !== actionType,
      children: /* @__PURE__ */ jsxs(FieldLabel, { htmlFor: `${name}-${actionType}`, children: [
        /* @__PURE__ */ jsx(VisuallyHidden, { children: /* @__PURE__ */ jsx(
          FieldInput,
          {
            type: "radio",
            id: `${name}-${actionType}`,
            name,
            checked: selected === actionType,
            onChange: handleChange,
            value: actionType,
            disabled
          }
        ) }),
        actionType
      ] })
    }
  );
};
const ReleaseActionOptions = ({
  selected,
  handleChange,
  name,
  disabled = false
}) => {
  return /* @__PURE__ */ jsxs(Flex, { children: [
    /* @__PURE__ */ jsx(
      ActionOption,
      {
        actionType: "publish",
        selected,
        handleChange,
        name,
        disabled
      }
    ),
    /* @__PURE__ */ jsx(
      ActionOption,
      {
        actionType: "unpublish",
        selected,
        handleChange,
        name,
        disabled
      }
    )
  ] });
};
const RELEASE_ACTION_FORM_SCHEMA = yup.object().shape({
  type: yup.string().oneOf(["publish", "unpublish"]).required(),
  releaseId: yup.string().required()
});
const INITIAL_VALUES = {
  type: "publish",
  releaseId: ""
};
const NoReleases = () => {
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(
    NoContent,
    {
      content: {
        id: "content-releases.content-manager-edit-view.add-to-release.no-releases-message",
        defaultMessage: "No available releases. Open the list of releases and create a new one from there."
      },
      action: /* @__PURE__ */ jsx(
        LinkButton,
        {
          to: {
            pathname: "/plugins/content-releases"
          },
          as: Link$1,
          variant: "secondary",
          children: formatMessage({
            id: "content-releases.content-manager-edit-view.add-to-release.redirect-button",
            defaultMessage: "Open the list of releases"
          })
        }
      )
    }
  );
};
const AddActionToReleaseModal = ({
  handleClose,
  contentTypeUid,
  entryId
}) => {
  const releaseHeaderId = React.useId();
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const { modifiedData } = useCMEditViewDataManager();
  const response = useGetReleasesForEntryQuery({
    contentTypeUid,
    entryId,
    hasEntryAttached: false
  });
  const releases = response.data?.data;
  const [createReleaseAction, { isLoading }] = useCreateReleaseActionMutation();
  const handleSubmit = async (values) => {
    const locale = modifiedData.locale;
    const releaseActionEntry = {
      contentType: contentTypeUid,
      id: entryId,
      locale
    };
    const response2 = await createReleaseAction({
      body: { type: values.type, entry: releaseActionEntry },
      params: { releaseId: values.releaseId }
    });
    if ("data" in response2) {
      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "content-releases.content-manager-edit-view.add-to-release.notification.success",
          defaultMessage: "Entry added to release"
        })
      });
      handleClose();
      return;
    }
    if ("error" in response2) {
      if (isAxiosError$1(response2.error)) {
        toggleNotification({
          type: "warning",
          message: formatAPIError(response2.error)
        });
      } else {
        toggleNotification({
          type: "warning",
          message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
        });
      }
    }
  };
  return /* @__PURE__ */ jsxs(ModalLayout, { onClose: handleClose, labelledBy: releaseHeaderId, children: [
    /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx(Typography, { id: releaseHeaderId, fontWeight: "bold", textColor: "neutral800", children: formatMessage({
      id: "content-releases.content-manager-edit-view.add-to-release",
      defaultMessage: "Add to release"
    }) }) }),
    /* @__PURE__ */ jsx(
      Formik,
      {
        onSubmit: handleSubmit,
        validationSchema: RELEASE_ACTION_FORM_SCHEMA,
        initialValues: INITIAL_VALUES,
        children: ({ values, setFieldValue }) => {
          return /* @__PURE__ */ jsxs(Form, { children: [
            releases?.length === 0 ? /* @__PURE__ */ jsx(NoReleases, {}) : /* @__PURE__ */ jsx(ModalBody, { children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
              /* @__PURE__ */ jsx(Box, { paddingBottom: 6, children: /* @__PURE__ */ jsx(
                SingleSelect,
                {
                  required: true,
                  label: formatMessage({
                    id: "content-releases.content-manager-edit-view.add-to-release.select-label",
                    defaultMessage: "Select a release"
                  }),
                  placeholder: formatMessage({
                    id: "content-releases.content-manager-edit-view.add-to-release.select-placeholder",
                    defaultMessage: "Select"
                  }),
                  onChange: (value) => setFieldValue("releaseId", value),
                  value: values.releaseId,
                  children: releases?.map((release) => /* @__PURE__ */ jsx(SingleSelectOption, { value: release.id, children: release.name }, release.id))
                }
              ) }),
              /* @__PURE__ */ jsx(FieldLabel, { children: formatMessage({
                id: "content-releases.content-manager-edit-view.add-to-release.action-type-label",
                defaultMessage: "What do you want to do with this entry?"
              }) }),
              /* @__PURE__ */ jsx(
                ReleaseActionOptions,
                {
                  selected: values.type,
                  handleChange: (e) => setFieldValue("type", e.target.value),
                  name: "type"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx(
              ModalFooter,
              {
                startActions: /* @__PURE__ */ jsx(Button$1, { onClick: handleClose, variant: "tertiary", name: "cancel", children: formatMessage({
                  id: "content-releases.content-manager-edit-view.add-to-release.cancel-button",
                  defaultMessage: "Cancel"
                }) }),
                endActions: (
                  /**
                   * TODO: Ideally we would use isValid from Formik to disable the button, however currently it always returns true
                   * for yup.string().required(), even when the value is falsy (including empty string)
                   */
                  /* @__PURE__ */ jsx(Button$1, { type: "submit", disabled: !values.releaseId, loading: isLoading, children: formatMessage({
                    id: "content-releases.content-manager-edit-view.add-to-release.continue-button",
                    defaultMessage: "Continue"
                  }) })
                )
              }
            )
          ] });
        }
      }
    )
  ] });
};
const CMReleasesContainer = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { formatMessage, formatDate, formatTime } = useIntl();
  const {
    isCreatingEntry,
    hasDraftAndPublish,
    initialData: { id: entryId },
    slug
  } = useCMEditViewDataManager();
  const contentTypeUid = slug;
  const canFetch = entryId != null && contentTypeUid != null;
  const fetchParams = canFetch ? {
    contentTypeUid,
    entryId,
    hasEntryAttached: true
  } : skipToken;
  const response = useGetReleasesForEntryQuery(fetchParams);
  const releases = response.data?.data;
  if (!canFetch) {
    return null;
  }
  if (isCreatingEntry || !hasDraftAndPublish) {
    return null;
  }
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const getReleaseColorVariant = (actionType, shade) => {
    if (actionType === "unpublish") {
      return `secondary${shade}`;
    }
    return `success${shade}`;
  };
  return /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.main, children: /* @__PURE__ */ jsxs(
    Box,
    {
      as: "aside",
      "aria-label": formatMessage({
        id: "content-releases.plugin.name",
        defaultMessage: "Releases"
      }),
      background: "neutral0",
      borderColor: "neutral150",
      hasRadius: true,
      padding: 4,
      shadow: "tableShadow",
      children: [
        /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 3, children: [
          /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", textTransform: "uppercase", children: formatMessage({
            id: "content-releases.plugin.name",
            defaultMessage: "Releases"
          }) }),
          releases?.map((release) => {
            return /* @__PURE__ */ jsxs(
              Flex,
              {
                direction: "column",
                alignItems: "start",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: getReleaseColorVariant(release.actions[0].type, "200"),
                overflow: "hidden",
                hasRadius: true,
                children: [
                  /* @__PURE__ */ jsx(
                    Box,
                    {
                      paddingTop: 3,
                      paddingBottom: 3,
                      paddingLeft: 4,
                      paddingRight: 4,
                      background: getReleaseColorVariant(release.actions[0].type, "100"),
                      width: "100%",
                      children: /* @__PURE__ */ jsx(
                        Typography,
                        {
                          fontSize: 1,
                          variant: "pi",
                          textColor: getReleaseColorVariant(release.actions[0].type, "600"),
                          children: formatMessage(
                            {
                              id: "content-releases.content-manager-edit-view.list-releases.title",
                              defaultMessage: "{isPublish, select, true {Will be published in} other {Will be unpublished in}}"
                            },
                            { isPublish: release.actions[0].type === "publish" }
                          )
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs(Flex, { padding: 4, direction: "column", gap: 2, width: "100%", alignItems: "flex-start", children: [
                    /* @__PURE__ */ jsx(Typography, { fontSize: 2, fontWeight: "bold", variant: "omega", textColor: "neutral700", children: release.name }),
                    release.scheduledAt && release.timezone && /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", children: formatMessage(
                      {
                        id: "content-releases.content-manager-edit-view.scheduled.date",
                        defaultMessage: "{date} at {time} ({offset})"
                      },
                      {
                        date: formatDate(new Date(release.scheduledAt), {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          timeZone: release.timezone
                        }),
                        time: formatTime(new Date(release.scheduledAt), {
                          hourCycle: "h23",
                          timeZone: release.timezone
                        }),
                        offset: getTimezoneOffset(
                          release.timezone,
                          new Date(release.scheduledAt)
                        )
                      }
                    ) }),
                    /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.deleteAction, children: /* @__PURE__ */ jsxs(ReleaseActionMenu.Root, { hasTriggerBorder: true, children: [
                      /* @__PURE__ */ jsx(ReleaseActionMenu.EditReleaseItem, { releaseId: release.id }),
                      /* @__PURE__ */ jsx(
                        ReleaseActionMenu.DeleteReleaseActionItem,
                        {
                          releaseId: release.id,
                          actionId: release.actions[0].id
                        }
                      )
                    ] }) })
                  ] })
                ]
              },
              release.id
            );
          }),
          /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.createAction, children: /* @__PURE__ */ jsx(
            Button$1,
            {
              justifyContent: "center",
              paddingLeft: 4,
              paddingRight: 4,
              color: "neutral700",
              variant: "tertiary",
              startIcon: /* @__PURE__ */ jsx(Plus, {}),
              onClick: toggleModal,
              children: formatMessage({
                id: "content-releases.content-manager-edit-view.add-to-release",
                defaultMessage: "Add to release"
              })
            }
          ) })
        ] }),
        isModalOpen && /* @__PURE__ */ jsx(
          AddActionToReleaseModal,
          {
            handleClose: toggleModal,
            contentTypeUid,
            entryId
          }
        )
      ]
    }
  ) });
};
const getContentPermissions = (subject) => {
  const permissions = {
    publish: [
      {
        action: "plugin::content-manager.explorer.publish",
        subject,
        id: "",
        actionParameters: {},
        properties: {},
        conditions: []
      }
    ]
  };
  return permissions;
};
const ReleaseAction = ({ ids, model }) => {
  const { formatMessage } = useIntl();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const { modifiedData } = useCMEditViewDataManager();
  const contentPermissions = getContentPermissions(model);
  const {
    allowedActions: { canPublish }
  } = useRBAC(contentPermissions);
  const {
    allowedActions: { canCreate }
  } = useRBAC(PERMISSIONS);
  const response = useGetReleasesQuery();
  const releases = response.data?.data;
  const [createManyReleaseActions, { isLoading }] = useCreateManyReleaseActionsMutation();
  const handleSubmit = async (values) => {
    const locale = modifiedData.locale;
    const releaseActionEntries = ids.map((id) => ({
      type: values.type,
      entry: {
        contentType: model,
        id,
        locale
      }
    }));
    const response2 = await createManyReleaseActions({
      body: releaseActionEntries,
      params: { releaseId: values.releaseId }
    });
    if ("data" in response2) {
      const notificationMessage = formatMessage(
        {
          id: "content-releases.content-manager-list-view.add-to-release.notification.success.message",
          defaultMessage: "{entriesAlreadyInRelease} out of {totalEntries} entries were already in the release."
        },
        {
          entriesAlreadyInRelease: response2.data.meta.entriesAlreadyInRelease,
          totalEntries: response2.data.meta.totalEntries
        }
      );
      const notification = {
        type: "success",
        title: formatMessage(
          {
            id: "content-releases.content-manager-list-view.add-to-release.notification.success.title",
            defaultMessage: "Successfully added to release."
          },
          {
            entriesAlreadyInRelease: response2.data.meta.entriesAlreadyInRelease,
            totalEntries: response2.data.meta.totalEntries
          }
        ),
        message: response2.data.meta.entriesAlreadyInRelease ? notificationMessage : ""
      };
      toggleNotification(notification);
      return true;
    }
    if ("error" in response2) {
      if (isAxiosError$1(response2.error)) {
        toggleNotification({
          type: "warning",
          message: formatAPIError(response2.error)
        });
      } else {
        toggleNotification({
          type: "warning",
          message: formatMessage({ id: "notification.error", defaultMessage: "An error occurred" })
        });
      }
    }
  };
  if (!canCreate || !canPublish)
    return null;
  return {
    actionType: "release",
    variant: "tertiary",
    label: formatMessage({
      id: "content-manager-list-view.add-to-release",
      defaultMessage: "Add to Release"
    }),
    dialog: {
      type: "modal",
      title: formatMessage({
        id: "content-manager-list-view.add-to-release",
        defaultMessage: "Add to Release"
      }),
      content: ({ onClose }) => {
        return /* @__PURE__ */ jsx(
          Formik,
          {
            onSubmit: async (values) => {
              const data = await handleSubmit(values);
              if (data) {
                return onClose();
              }
            },
            validationSchema: RELEASE_ACTION_FORM_SCHEMA,
            initialValues: INITIAL_VALUES,
            children: ({ values, setFieldValue }) => /* @__PURE__ */ jsxs(Form, { children: [
              releases?.length === 0 ? /* @__PURE__ */ jsx(NoReleases, {}) : /* @__PURE__ */ jsx(ModalBody, { children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 2, children: [
                /* @__PURE__ */ jsx(Box, { paddingBottom: 6, children: /* @__PURE__ */ jsx(
                  SingleSelect,
                  {
                    required: true,
                    label: formatMessage({
                      id: "content-releases.content-manager-list-view.add-to-release.select-label",
                      defaultMessage: "Select a release"
                    }),
                    placeholder: formatMessage({
                      id: "content-releases.content-manager-list-view.add-to-release.select-placeholder",
                      defaultMessage: "Select"
                    }),
                    onChange: (value) => setFieldValue("releaseId", value),
                    value: values.releaseId,
                    children: releases?.map((release) => /* @__PURE__ */ jsx(SingleSelectOption, { value: release.id, children: release.name }, release.id))
                  }
                ) }),
                /* @__PURE__ */ jsx(FieldLabel, { children: formatMessage({
                  id: "content-releases.content-manager-list-view.add-to-release.action-type-label",
                  defaultMessage: "What do you want to do with these entries?"
                }) }),
                /* @__PURE__ */ jsx(
                  ReleaseActionOptions,
                  {
                    selected: values.type,
                    handleChange: (e) => setFieldValue("type", e.target.value),
                    name: "type"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx(
                ModalFooter,
                {
                  startActions: /* @__PURE__ */ jsx(Button$1, { onClick: onClose, variant: "tertiary", name: "cancel", children: formatMessage({
                    id: "content-releases.content-manager-list-view.add-to-release.cancel-button",
                    defaultMessage: "Cancel"
                  }) }),
                  endActions: (
                    /**
                     * TODO: Ideally we would use isValid from Formik to disable the button, however currently it always returns true
                     * for yup.string().required(), even when the value is falsy (including empty string)
                     */
                    /* @__PURE__ */ jsx(Button$1, { type: "submit", disabled: !values.releaseId, loading: isLoading, children: formatMessage({
                      id: "content-releases.content-manager-list-view.add-to-release.continue-button",
                      defaultMessage: "Continue"
                    }) })
                  )
                }
              )
            ] })
          }
        );
      }
    }
  };
};
const Button = styled.button`
  svg {
    > g,
    path {
      fill: ${({ theme }) => theme.colors.neutral500};
    }
  }
  &:hover {
    svg {
      > g,
      path {
        fill: ${({ theme }) => theme.colors.neutral600};
      }
    }
  }
  &:active {
    svg {
      > g,
      path {
        fill: ${({ theme }) => theme.colors.neutral400};
      }
    }
  }
`;
const ActionWrapper = styled(Flex)`
  svg {
    height: ${4 / 16}rem;
  }
`;
const useReleasesList = (entryId) => {
  const { uid: contentTypeUid } = useTypedSelector(
    (state) => state["content-manager_listView"].contentType
  );
  const listViewData = useTypedSelector((state) => state["content-manager_listView"].data);
  const entriesIds = listViewData.map((entry) => entry.id);
  const response = useGetMappedEntriesInReleasesQuery(
    { contentTypeUid, entriesIds },
    { skip: !entriesIds || !contentTypeUid || entriesIds.length === 0 }
  );
  const mappedEntriesInReleases = response.data || {};
  return mappedEntriesInReleases?.[entryId] || [];
};
const addColumnToTableHook = ({ displayedHeaders, layout }) => {
  const { contentType } = layout;
  if (!contentType.options?.draftAndPublish) {
    return { displayedHeaders, layout };
  }
  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        key: "__release_key__",
        fieldSchema: { type: "string" },
        metadatas: { label: "To be released in", searchable: true, sortable: false },
        name: "releasedAt",
        cellFormatter: (props) => /* @__PURE__ */ jsx(ReleaseListCell, { ...props })
      }
    ],
    layout
  };
};
const ReleaseListCell = ({ id }) => {
  const releases = useReleasesList(id);
  const [visible, setVisible] = React.useState(false);
  const buttonRef = React.useRef(null);
  const { formatMessage } = useIntl();
  const handleTogglePopover = () => setVisible((prev) => !prev);
  return /* @__PURE__ */ jsx(Flex, { onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx(Button, { type: "button", onClick: handleTogglePopover, ref: buttonRef, children: /* @__PURE__ */ jsxs(ActionWrapper, { height: "2rem", width: "2rem", children: [
    /* @__PURE__ */ jsx(Typography, { style: { maxWidth: "252px", cursor: "pointer" }, textColor: "neutral800", children: releases.length > 0 ? formatMessage(
      {
        id: "content-releases.content-manager.list-view.releases-number",
        defaultMessage: "{number} {number, plural, one {release} other {releases}}"
      },
      {
        number: releases.length
      }
    ) : "-" }),
    /* @__PURE__ */ jsxs(Flex, { children: [
      releases.length > 0 && /* @__PURE__ */ jsx(SortIcon, {}),
      visible && /* @__PURE__ */ jsx(
        Popover,
        {
          onDismiss: handleTogglePopover,
          source: buttonRef,
          spacing: 16,
          children: /* @__PURE__ */ jsx("ul", { children: releases.map(({ id: id2, name }) => /* @__PURE__ */ jsx(Box, { padding: 3, as: "li", children: /* @__PURE__ */ jsx(Link, { href: `/admin/plugins/content-releases/${id2}`, isExternal: false, children: name }) }, id2)) })
        }
      )
    ] })
  ] }) }) });
};
const admin = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(app) {
    app.createHook("ContentReleases/pages/ReleaseDetails/add-locale-in-releases");
    if (window.strapi.features.isEnabled("cms-content-releases")) {
      app.addMenuLink({
        to: `/plugins/${pluginId}`,
        icon: PaperPlane,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: "Releases"
        },
        async Component() {
          const { App } = await import("./App-jrh58sXY.mjs");
          return App;
        },
        permissions: PERMISSIONS.main
      });
      app.addMiddlewares([() => releaseApi.middleware]);
      app.addReducers({
        [releaseApi.reducerPath]: releaseApi.reducer
      });
      app.injectContentManagerComponent("editView", "right-links", {
        name: `${pluginId}-link`,
        Component: CMReleasesContainer
      });
      app.plugins["content-manager"].apis.addBulkAction((actions) => {
        const deleteActionIndex = actions.findIndex((action) => action.name === "DeleteAction");
        actions.splice(deleteActionIndex, 0, ReleaseAction);
        return actions;
      });
      app.registerHook("Admin/CM/pages/ListView/inject-column-in-table", addColumnToTableHook);
    } else if (!window.strapi.features.isEnabled("cms-content-releases") && window.strapi?.flags?.promoteEE) {
      app.addMenuLink({
        to: `/plugins/purchase-content-releases`,
        icon: PaperPlane,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: "Releases"
        },
        async Component() {
          const { PurchaseContentReleases } = await import("./PurchaseContentReleases-3tRbmbY3.mjs");
          return PurchaseContentReleases;
        },
        lockIcon: true
        // TODO: to replace with another name in v5
      });
    }
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-ltT1TlKQ.mjs") }), `./translations/${locale}.json`).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, "content-releases"),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTrads);
  }
};
export {
  PERMISSIONS as P,
  ReleaseActionOptions as R,
  useCreateReleaseMutation as a,
  useGetReleaseQuery as b,
  useUpdateReleaseMutation as c,
  useDeleteReleaseMutation as d,
  usePublishReleaseMutation as e,
  useTypedDispatch as f,
  getTimezoneOffset as g,
  useGetReleaseActionsQuery as h,
  isAxiosError as i,
  useUpdateReleaseActionMutation as j,
  ReleaseActionMenu as k,
  admin as l,
  pluginId as p,
  releaseApi as r,
  useGetReleasesQuery as u
};
//# sourceMappingURL=index-PiOGBETy.mjs.map
