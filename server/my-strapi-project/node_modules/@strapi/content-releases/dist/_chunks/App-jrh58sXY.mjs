import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { RelativeTime as RelativeTime$1, useNotification, useAPIErrorHandler, useQueryParams, useTracking, LoadingIndicatorPage, CheckPermissions, PageSizeURLQuery, PaginationURLQuery, AnErrorOccurred, ConfirmDialog, useRBAC, useStrapiApp, NoContent, Table, CheckPagePermissions } from "@strapi/helper-plugin";
import { useLocation, useHistory, useParams, Redirect, Link as Link$2, Switch, Route } from "react-router-dom";
import { g as getTimezoneOffset, p as pluginId, u as useGetReleasesQuery, a as useCreateReleaseMutation, P as PERMISSIONS, i as isAxiosError, b as useGetReleaseQuery, c as useUpdateReleaseMutation, d as useDeleteReleaseMutation, e as usePublishReleaseMutation, f as useTypedDispatch, h as useGetReleaseActionsQuery, j as useUpdateReleaseActionMutation, R as ReleaseActionOptions, k as ReleaseActionMenu, r as releaseApi } from "./index-PiOGBETy.mjs";
import * as React from "react";
import { useLicenseLimits, unstable_useDocument } from "@strapi/admin/strapi-admin";
import { ModalLayout, ModalHeader, Typography, ModalBody, Flex, TextInput, Box, Checkbox, DatePicker, TimePicker, ModalFooter, Button, Combobox, ComboboxOption, Alert, Main, HeaderLayout, ContentLayout, TabGroup, Tabs, Tab, Divider, TabPanels, TabPanel, EmptyStateLayout, Grid, GridItem, Badge, Link as Link$1, IconButton, SingleSelect, SingleSelectOption, Tr, Td, Icon, Tooltip } from "@strapi/design-system";
import { Link, Menu, LinkButton } from "@strapi/design-system/v2";
import { Plus, EmptyDocuments, Pencil, Trash, ArrowLeft, More, CrossCircle, CheckCircle } from "@strapi/icons";
import format from "date-fns/format";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { formatISO } from "date-fns";
import { Formik, Form, useFormikContext } from "formik";
import * as yup from "yup";
import "@reduxjs/toolkit/query";
import "axios";
import "@reduxjs/toolkit/query/react";
import "react-redux";
const RELEASE_SCHEMA = yup.object().shape({
  name: yup.string().trim().required(),
  scheduledAt: yup.string().nullable(),
  isScheduled: yup.boolean().optional(),
  time: yup.string().when("isScheduled", {
    is: true,
    then: yup.string().trim().required(),
    otherwise: yup.string().nullable()
  }),
  timezone: yup.string().when("isScheduled", {
    is: true,
    then: yup.string().required().nullable(),
    otherwise: yup.string().nullable()
  }),
  date: yup.string().when("isScheduled", {
    is: true,
    then: yup.string().required().nullable(),
    otherwise: yup.string().nullable()
  })
}).required().noUnknown();
const ReleaseModal = ({
  handleClose,
  handleSubmit,
  initialValues,
  isLoading = false
}) => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const isCreatingRelease = pathname === `/plugins/${pluginId}`;
  const { timezoneList, systemTimezone = { value: "UTC+00:00-Africa/Abidjan " } } = getTimezones(
    initialValues.scheduledAt ? new Date(initialValues.scheduledAt) : /* @__PURE__ */ new Date()
  );
  const getScheduledTimestamp = (values) => {
    const { date, time, timezone } = values;
    if (!date || !time || !timezone)
      return null;
    const timezoneWithoutOffset = timezone.split("&")[1];
    return zonedTimeToUtc(`${date} ${time}`, timezoneWithoutOffset);
  };
  const getTimezoneWithOffset = () => {
    const currentTimezone = timezoneList.find(
      (timezone) => timezone.value.split("&")[1] === initialValues.timezone
    );
    return currentTimezone?.value || systemTimezone.value;
  };
  return /* @__PURE__ */ jsxs(ModalLayout, { onClose: handleClose, labelledBy: "title", children: [
    /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx(Typography, { id: "title", fontWeight: "bold", textColor: "neutral800", children: formatMessage(
      {
        id: "content-releases.modal.title",
        defaultMessage: "{isCreatingRelease, select, true {New release} other {Edit release}}"
      },
      { isCreatingRelease }
    ) }) }),
    /* @__PURE__ */ jsx(
      Formik,
      {
        onSubmit: (values) => {
          handleSubmit({
            ...values,
            timezone: values.timezone ? values.timezone.split("&")[1] : null,
            scheduledAt: values.isScheduled ? getScheduledTimestamp(values) : null
          });
        },
        initialValues: {
          ...initialValues,
          timezone: initialValues.timezone ? getTimezoneWithOffset() : systemTimezone.value
        },
        validationSchema: RELEASE_SCHEMA,
        validateOnChange: false,
        children: ({ values, errors, handleChange, setFieldValue }) => /* @__PURE__ */ jsxs(Form, { children: [
          /* @__PURE__ */ jsx(ModalBody, { children: /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            /* @__PURE__ */ jsx(
              TextInput,
              {
                label: formatMessage({
                  id: "content-releases.modal.form.input.label.release-name",
                  defaultMessage: "Name"
                }),
                name: "name",
                value: values.name,
                error: errors.name,
                onChange: handleChange,
                required: true
              }
            ),
            /* @__PURE__ */ jsx(Box, { width: "max-content", children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                name: "isScheduled",
                value: values.isScheduled,
                onChange: (event) => {
                  setFieldValue("isScheduled", event.target.checked);
                  if (!event.target.checked) {
                    setFieldValue("date", null);
                    setFieldValue("time", "");
                    setFieldValue("timezone", null);
                  } else {
                    setFieldValue("date", initialValues.date);
                    setFieldValue("time", initialValues.time);
                    setFieldValue("timezone", initialValues.timezone ?? systemTimezone?.value);
                  }
                },
                children: /* @__PURE__ */ jsx(
                  Typography,
                  {
                    textColor: values.isScheduled ? "primary600" : "neutral800",
                    fontWeight: values.isScheduled ? "semiBold" : "regular",
                    children: formatMessage({
                      id: "modal.form.input.label.schedule-release",
                      defaultMessage: "Schedule release"
                    })
                  }
                )
              }
            ) }),
            values.isScheduled && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Flex, { gap: 4, alignItems: "start", children: [
                /* @__PURE__ */ jsx(Box, { width: "100%", children: /* @__PURE__ */ jsx(
                  DatePicker,
                  {
                    label: formatMessage({
                      id: "content-releases.modal.form.input.label.date",
                      defaultMessage: "Date"
                    }),
                    name: "date",
                    error: errors.date,
                    onChange: (date) => {
                      const isoFormatDate = date ? formatISO(date, { representation: "date" }) : null;
                      setFieldValue("date", isoFormatDate);
                    },
                    clearLabel: formatMessage({
                      id: "content-releases.modal.form.input.clearLabel",
                      defaultMessage: "Clear"
                    }),
                    onClear: () => {
                      setFieldValue("date", null);
                    },
                    selectedDate: values.date || void 0,
                    required: true,
                    minDate: utcToZonedTime(/* @__PURE__ */ new Date(), values.timezone.split("&")[1])
                  }
                ) }),
                /* @__PURE__ */ jsx(Box, { width: "100%", children: /* @__PURE__ */ jsx(
                  TimePicker,
                  {
                    label: formatMessage({
                      id: "content-releases.modal.form.input.label.time",
                      defaultMessage: "Time"
                    }),
                    name: "time",
                    error: errors.time,
                    onChange: (time) => {
                      setFieldValue("time", time);
                    },
                    clearLabel: formatMessage({
                      id: "content-releases.modal.form.input.clearLabel",
                      defaultMessage: "Clear"
                    }),
                    onClear: () => {
                      setFieldValue("time", "");
                    },
                    value: values.time || void 0,
                    required: true
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx(TimezoneComponent, { timezoneOptions: timezoneList })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(
            ModalFooter,
            {
              startActions: /* @__PURE__ */ jsx(Button, { onClick: handleClose, variant: "tertiary", name: "cancel", children: formatMessage({ id: "cancel", defaultMessage: "Cancel" }) }),
              endActions: /* @__PURE__ */ jsx(Button, { name: "submit", loading: isLoading, type: "submit", children: formatMessage(
                {
                  id: "content-releases.modal.form.button.submit",
                  defaultMessage: "{isCreatingRelease, select, true {Continue} other {Save}}"
                },
                { isCreatingRelease }
              ) })
            }
          )
        ] })
      }
    )
  ] });
};
const getTimezones = (selectedDate) => {
  const timezoneList = Intl.supportedValuesOf("timeZone").map((timezone) => {
    const utcOffset = getTimezoneOffset(timezone, selectedDate);
    return { offset: utcOffset, value: `${utcOffset}&${timezone}` };
  });
  const systemTimezone = timezoneList.find(
    (timezone) => timezone.value.split("&")[1] === Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  return { timezoneList, systemTimezone };
};
const TimezoneComponent = ({ timezoneOptions }) => {
  const { values, errors, setFieldValue } = useFormikContext();
  const { formatMessage } = useIntl();
  const [timezoneList, setTimezoneList] = React.useState(timezoneOptions);
  React.useEffect(() => {
    if (values.date) {
      const { timezoneList: timezoneList2 } = getTimezones(new Date(values.date));
      setTimezoneList(timezoneList2);
      const updatedTimezone = values.timezone && timezoneList2.find((tz) => tz.value.split("&")[1] === values.timezone.split("&")[1]);
      if (updatedTimezone) {
        setFieldValue("timezone", updatedTimezone.value);
      }
    }
  }, [setFieldValue, values.date, values.timezone]);
  return /* @__PURE__ */ jsx(
    Combobox,
    {
      label: formatMessage({
        id: "content-releases.modal.form.input.label.timezone",
        defaultMessage: "Timezone"
      }),
      autocomplete: { type: "list", filter: "contains" },
      name: "timezone",
      value: values.timezone || void 0,
      textValue: values.timezone ? values.timezone.replace(/&/, " ") : void 0,
      onChange: (timezone) => {
        setFieldValue("timezone", timezone);
      },
      onTextValueChange: (timezone) => {
        setFieldValue("timezone", timezone);
      },
      onClear: () => {
        setFieldValue("timezone", "");
      },
      error: errors.timezone,
      required: true,
      children: timezoneList.map((timezone) => /* @__PURE__ */ jsx(ComboboxOption, { value: timezone.value, children: timezone.value.replace(/&/, " ") }, timezone.value))
    }
  );
};
const LinkCard = styled(Link)`
  display: block;
`;
const RelativeTime = styled(RelativeTime$1)`
  display: inline-block;
  &::first-letter {
    text-transform: uppercase;
  }
`;
const getBadgeProps = (status) => {
  let color;
  switch (status) {
    case "ready":
      color = "success";
      break;
    case "blocked":
      color = "warning";
      break;
    case "failed":
      color = "danger";
      break;
    case "done":
      color = "primary";
      break;
    case "empty":
    default:
      color = "neutral";
  }
  return {
    textColor: `${color}600`,
    backgroundColor: `${color}100`,
    borderColor: `${color}200`
  };
};
const ReleasesGrid = ({ sectionTitle, releases = [], isError = false }) => {
  const { formatMessage } = useIntl();
  if (isError) {
    return /* @__PURE__ */ jsx(AnErrorOccurred, {});
  }
  if (releases?.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        content: formatMessage(
          {
            id: "content-releases.page.Releases.tab.emptyEntries",
            defaultMessage: "No releases"
          },
          {
            target: sectionTitle
          }
        ),
        icon: /* @__PURE__ */ jsx(EmptyDocuments, { width: "10rem" })
      }
    );
  }
  return /* @__PURE__ */ jsx(Grid, { gap: 4, children: releases.map(({ id, name, scheduledAt, status }) => /* @__PURE__ */ jsx(GridItem, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsx(LinkCard, { href: `content-releases/${id}`, isExternal: false, children: /* @__PURE__ */ jsxs(
    Flex,
    {
      direction: "column",
      justifyContent: "space-between",
      padding: 4,
      hasRadius: true,
      background: "neutral0",
      shadow: "tableShadow",
      height: "100%",
      width: "100%",
      alignItems: "start",
      gap: 4,
      children: [
        /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "start", gap: 1, children: [
          /* @__PURE__ */ jsx(Typography, { as: "h3", variant: "delta", fontWeight: "bold", children: name }),
          /* @__PURE__ */ jsx(Typography, { variant: "pi", textColor: "neutral600", children: scheduledAt ? /* @__PURE__ */ jsx(RelativeTime, { timestamp: new Date(scheduledAt) }) : formatMessage({
            id: "content-releases.pages.Releases.not-scheduled",
            defaultMessage: "Not scheduled"
          }) })
        ] }),
        /* @__PURE__ */ jsx(Badge, { ...getBadgeProps(status), children: status })
      ]
    }
  ) }) }, id)) });
};
const StyledAlert = styled(Alert)`
  button {
    display: none;
  }
  p + div {
    margin-left: auto;
  }
`;
const INITIAL_FORM_VALUES = {
  name: "",
  date: null,
  time: "",
  isScheduled: true,
  scheduledAt: null,
  timezone: null
};
const ReleasesPage = () => {
  const tabRef = React.useRef(null);
  const location = useLocation();
  const [releaseModalShown, setReleaseModalShown] = React.useState(false);
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();
  const { push, replace } = useHistory();
  const { formatAPIError } = useAPIErrorHandler();
  const [{ query }, setQuery] = useQueryParams();
  const response = useGetReleasesQuery(query);
  const [createRelease, { isLoading: isSubmittingForm }] = useCreateReleaseMutation();
  const { getFeature } = useLicenseLimits();
  const { maximumReleases = 3 } = getFeature("cms-content-releases");
  const { trackUsage } = useTracking();
  const { isLoading, isSuccess, isError } = response;
  const activeTab = response?.currentData?.meta?.activeTab || "pending";
  const activeTabIndex = ["pending", "done"].indexOf(activeTab);
  React.useEffect(() => {
    if (location?.state?.errors) {
      toggleNotification({
        type: "warning",
        title: formatMessage({
          id: "content-releases.pages.Releases.notification.error.title",
          defaultMessage: "Your request could not be processed."
        }),
        message: formatMessage({
          id: "content-releases.pages.Releases.notification.error.message",
          defaultMessage: "Please try again or open another release."
        })
      });
      replace({ state: null });
    }
  }, [formatMessage, location?.state?.errors, replace, toggleNotification]);
  React.useEffect(() => {
    if (tabRef.current) {
      tabRef.current._handlers.setSelectedTabIndex(activeTabIndex);
    }
  }, [activeTabIndex]);
  const toggleAddReleaseModal = () => {
    setReleaseModalShown((prev) => !prev);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Main, { "aria-busy": isLoading, children: /* @__PURE__ */ jsx(LoadingIndicatorPage, {}) });
  }
  const totalPendingReleases = isSuccess && response.currentData?.meta?.pendingReleasesCount || 0;
  const hasReachedMaximumPendingReleases = totalPendingReleases >= maximumReleases;
  const handleTabChange = (index) => {
    setQuery({
      ...query,
      page: 1,
      pageSize: response?.currentData?.meta?.pagination?.pageSize || 16,
      filters: {
        releasedAt: {
          $notNull: index === 0 ? false : true
        }
      }
    });
  };
  const handleAddRelease = async ({ name, scheduledAt, timezone }) => {
    const response2 = await createRelease({
      name,
      scheduledAt,
      timezone
    });
    if ("data" in response2) {
      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "content-releases.modal.release-created-notification-success",
          defaultMessage: "Release created."
        })
      });
      trackUsage("didCreateRelease");
      push(`/plugins/content-releases/${response2.data.data.id}`);
    } else if (isAxiosError(response2.error)) {
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
  };
  return /* @__PURE__ */ jsxs(Main, { "aria-busy": isLoading, children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        title: formatMessage({
          id: "content-releases.pages.Releases.title",
          defaultMessage: "Releases"
        }),
        subtitle: formatMessage({
          id: "content-releases.pages.Releases.header-subtitle",
          defaultMessage: "Create and manage content updates"
        }),
        primaryAction: /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.create, children: /* @__PURE__ */ jsx(
          Button,
          {
            startIcon: /* @__PURE__ */ jsx(Plus, {}),
            onClick: toggleAddReleaseModal,
            disabled: hasReachedMaximumPendingReleases,
            children: formatMessage({
              id: "content-releases.header.actions.add-release",
              defaultMessage: "New release"
            })
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
      hasReachedMaximumPendingReleases && /* @__PURE__ */ jsx(
        StyledAlert,
        {
          marginBottom: 6,
          action: /* @__PURE__ */ jsx(Link, { href: "https://strapi.io/pricing-cloud", isExternal: true, children: formatMessage({
            id: "content-releases.pages.Releases.max-limit-reached.action",
            defaultMessage: "Explore plans"
          }) }),
          title: formatMessage(
            {
              id: "content-releases.pages.Releases.max-limit-reached.title",
              defaultMessage: "You have reached the {number} pending {number, plural, one {release} other {releases}} limit."
            },
            { number: maximumReleases }
          ),
          onClose: () => {
          },
          closeLabel: "",
          children: formatMessage({
            id: "content-releases.pages.Releases.max-limit-reached.message",
            defaultMessage: "Upgrade to manage an unlimited number of releases."
          })
        }
      ),
      /* @__PURE__ */ jsxs(
        TabGroup,
        {
          label: formatMessage({
            id: "content-releases.pages.Releases.tab-group.label",
            defaultMessage: "Releases list"
          }),
          variant: "simple",
          initialSelectedTabIndex: activeTabIndex,
          onTabChange: handleTabChange,
          ref: tabRef,
          children: [
            /* @__PURE__ */ jsxs(Box, { paddingBottom: 8, children: [
              /* @__PURE__ */ jsxs(Tabs, { children: [
                /* @__PURE__ */ jsx(Tab, { children: formatMessage(
                  {
                    id: "content-releases.pages.Releases.tab.pending",
                    defaultMessage: "Pending ({count})"
                  },
                  {
                    count: totalPendingReleases
                  }
                ) }),
                /* @__PURE__ */ jsx(Tab, { children: formatMessage({
                  id: "content-releases.pages.Releases.tab.done",
                  defaultMessage: "Done"
                }) })
              ] }),
              /* @__PURE__ */ jsx(Divider, {})
            ] }),
            /* @__PURE__ */ jsxs(TabPanels, { children: [
              /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(
                ReleasesGrid,
                {
                  sectionTitle: "pending",
                  releases: response?.currentData?.data,
                  isError
                }
              ) }),
              /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(
                ReleasesGrid,
                {
                  sectionTitle: "done",
                  releases: response?.currentData?.data,
                  isError
                }
              ) })
            ] })
          ]
        }
      ),
      response.currentData?.meta?.pagination?.total ? /* @__PURE__ */ jsxs(Flex, { paddingTop: 4, alignItems: "flex-end", justifyContent: "space-between", children: [
        /* @__PURE__ */ jsx(
          PageSizeURLQuery,
          {
            options: ["8", "16", "32", "64"],
            defaultValue: response?.currentData?.meta?.pagination?.pageSize.toString()
          }
        ),
        /* @__PURE__ */ jsx(
          PaginationURLQuery,
          {
            pagination: {
              pageCount: response?.currentData?.meta?.pagination?.pageCount || 0
            }
          }
        )
      ] }) : null
    ] }) }),
    releaseModalShown && /* @__PURE__ */ jsx(
      ReleaseModal,
      {
        handleClose: toggleAddReleaseModal,
        handleSubmit: handleAddRelease,
        isLoading: isSubmittingForm,
        initialValues: INITIAL_FORM_VALUES
      }
    )
  ] });
};
const ReleaseInfoWrapper = styled(Flex)`
  align-self: stretch;
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral150};
`;
const StyledMenuItem = styled(Menu.Item)`
  svg path {
    fill: ${({ theme, disabled }) => disabled && theme.colors.neutral500};
  }
  span {
    color: ${({ theme, disabled }) => disabled && theme.colors.neutral500};
  }

  &:hover {
    background: ${({ theme, variant = "neutral" }) => theme.colors[`${variant}100`]};
  }
`;
const PencilIcon = styled(Pencil)`
  width: ${({ theme }) => theme.spaces[3]};
  height: ${({ theme }) => theme.spaces[3]};
  path {
    fill: ${({ theme }) => theme.colors.neutral600};
  }
`;
const TrashIcon = styled(Trash)`
  width: ${({ theme }) => theme.spaces[3]};
  height: ${({ theme }) => theme.spaces[3]};
  path {
    fill: ${({ theme }) => theme.colors.danger600};
  }
`;
const TypographyMaxWidth = styled(Typography)`
  max-width: 300px;
`;
const EntryValidationText = ({ action, schema, components, entry }) => {
  const { formatMessage } = useIntl();
  const { validate } = unstable_useDocument();
  const { errors } = validate(entry, {
    contentType: schema,
    components,
    isCreatingEntry: false
  });
  if (Object.keys(errors).length > 0) {
    const validationErrorsMessages = Object.entries(errors).map(
      ([key, value]) => formatMessage(
        { id: `${value.id}.withField`, defaultMessage: value.defaultMessage },
        { field: key }
      )
    ).join(" ");
    return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(Icon, { color: "danger600", as: CrossCircle }),
      /* @__PURE__ */ jsx(Tooltip, { description: validationErrorsMessages, children: /* @__PURE__ */ jsx(TypographyMaxWidth, { textColor: "danger600", variant: "omega", fontWeight: "semiBold", ellipsis: true, children: validationErrorsMessages }) })
    ] });
  }
  if (action == "publish") {
    return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
      /* @__PURE__ */ jsx(Icon, { color: "success600", as: CheckCircle }),
      entry.publishedAt ? /* @__PURE__ */ jsx(Typography, { textColor: "success600", fontWeight: "bold", children: formatMessage({
        id: "content-releases.pages.ReleaseDetails.entry-validation.already-published",
        defaultMessage: "Already published"
      }) }) : /* @__PURE__ */ jsx(Typography, { children: formatMessage({
        id: "content-releases.pages.ReleaseDetails.entry-validation.ready-to-publish",
        defaultMessage: "Ready to publish"
      }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
    /* @__PURE__ */ jsx(Icon, { color: "success600", as: CheckCircle }),
    !entry.publishedAt ? /* @__PURE__ */ jsx(Typography, { textColor: "success600", fontWeight: "bold", children: formatMessage({
      id: "content-releases.pages.ReleaseDetails.entry-validation.already-unpublished",
      defaultMessage: "Already unpublished"
    }) }) : /* @__PURE__ */ jsx(Typography, { children: formatMessage({
      id: "content-releases.pages.ReleaseDetails.entry-validation.ready-to-unpublish",
      defaultMessage: "Ready to unpublish"
    }) })
  ] });
};
const ReleaseDetailsLayout = ({
  toggleEditReleaseModal,
  toggleWarningSubmit,
  children
}) => {
  const { formatMessage, formatDate, formatTime } = useIntl();
  const { releaseId } = useParams();
  const {
    data,
    isLoading: isLoadingDetails,
    isError,
    error
  } = useGetReleaseQuery({ id: releaseId });
  const [publishRelease, { isLoading: isPublishing }] = usePublishReleaseMutation();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const {
    allowedActions: { canUpdate, canDelete }
  } = useRBAC(PERMISSIONS);
  const dispatch = useTypedDispatch();
  const { trackUsage } = useTracking();
  const release = data?.data;
  const handlePublishRelease = async () => {
    const response = await publishRelease({ id: releaseId });
    if ("data" in response) {
      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "content-releases.pages.ReleaseDetails.publish-notification-success",
          defaultMessage: "Release was published successfully."
        })
      });
      const { totalEntries: totalEntries2, totalPublishedEntries, totalUnpublishedEntries } = response.data.meta;
      trackUsage("didPublishRelease", {
        totalEntries: totalEntries2,
        totalPublishedEntries,
        totalUnpublishedEntries
      });
    } else if (isAxiosError(response.error)) {
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
  };
  const handleRefresh = () => {
    dispatch(
      releaseApi.util.invalidateTags([
        { type: "ReleaseAction", id: "LIST" },
        { type: "Release", id: releaseId }
      ])
    );
  };
  const getCreatedByUser = () => {
    if (!release?.createdBy) {
      return null;
    }
    if (release.createdBy.username) {
      return release.createdBy.username;
    }
    if (release.createdBy.firstname) {
      return `${release.createdBy.firstname} ${release.createdBy.lastname || ""}`.trim();
    }
    return release.createdBy.email;
  };
  if (isLoadingDetails) {
    return /* @__PURE__ */ jsx(Main, { "aria-busy": isLoadingDetails, children: /* @__PURE__ */ jsx(LoadingIndicatorPage, {}) });
  }
  if (isError || !release) {
    return /* @__PURE__ */ jsx(
      Redirect,
      {
        to: {
          pathname: "/plugins/content-releases",
          state: {
            errors: [
              {
                code: error?.code
              }
            ]
          }
        }
      }
    );
  }
  const totalEntries = release.actions.meta.count || 0;
  const hasCreatedByUser = Boolean(getCreatedByUser());
  const isScheduled = release.scheduledAt && release.timezone;
  const numberOfEntriesText = formatMessage(
    {
      id: "content-releases.pages.Details.header-subtitle",
      defaultMessage: "{number, plural, =0 {No entries} one {# entry} other {# entries}}"
    },
    { number: totalEntries }
  );
  const scheduledText = isScheduled ? formatMessage(
    {
      id: "content-releases.pages.ReleaseDetails.header-subtitle.scheduled",
      defaultMessage: "Scheduled for {date} at {time} ({offset})"
    },
    {
      date: formatDate(new Date(release.scheduledAt), {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: release.timezone
      }),
      time: formatTime(new Date(release.scheduledAt), {
        timeZone: release.timezone,
        hourCycle: "h23"
      }),
      offset: getTimezoneOffset(release.timezone, new Date(release.scheduledAt))
    }
  ) : "";
  return /* @__PURE__ */ jsxs(Main, { "aria-busy": isLoadingDetails, children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        title: release.name,
        subtitle: /* @__PURE__ */ jsxs(Flex, { gap: 2, lineHeight: 6, children: [
          /* @__PURE__ */ jsx(Typography, { textColor: "neutral600", variant: "epsilon", children: numberOfEntriesText + (isScheduled ? ` - ${scheduledText}` : "") }),
          /* @__PURE__ */ jsx(Badge, { ...getBadgeProps(release.status), children: release.status })
        ] }),
        navigationAction: /* @__PURE__ */ jsx(Link$1, { startIcon: /* @__PURE__ */ jsx(ArrowLeft, {}), to: "/plugins/content-releases", children: formatMessage({
          id: "global.back",
          defaultMessage: "Back"
        }) }),
        primaryAction: !release.releasedAt && /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
          /* @__PURE__ */ jsxs(Menu.Root, { children: [
            /* @__PURE__ */ jsx(
              Menu.Trigger,
              {
                as: IconButton,
                paddingLeft: 2,
                paddingRight: 2,
                "aria-label": formatMessage({
                  id: "content-releases.header.actions.open-release-actions",
                  defaultMessage: "Release edit and delete menu"
                }),
                icon: /* @__PURE__ */ jsx(More, {}),
                variant: "tertiary"
              }
            ),
            /* @__PURE__ */ jsxs(Menu.Content, { top: 1, popoverPlacement: "bottom-end", children: [
              /* @__PURE__ */ jsxs(
                Flex,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  direction: "column",
                  padding: 1,
                  width: "100%",
                  children: [
                    /* @__PURE__ */ jsx(StyledMenuItem, { disabled: !canUpdate, onSelect: toggleEditReleaseModal, children: /* @__PURE__ */ jsxs(Flex, { alignItems: "center", gap: 2, hasRadius: true, width: "100%", children: [
                      /* @__PURE__ */ jsx(PencilIcon, {}),
                      /* @__PURE__ */ jsx(Typography, { ellipsis: true, children: formatMessage({
                        id: "content-releases.header.actions.edit",
                        defaultMessage: "Edit"
                      }) })
                    ] }) }),
                    /* @__PURE__ */ jsx(
                      StyledMenuItem,
                      {
                        disabled: !canDelete,
                        onSelect: toggleWarningSubmit,
                        variant: "danger",
                        children: /* @__PURE__ */ jsxs(Flex, { alignItems: "center", gap: 2, hasRadius: true, width: "100%", children: [
                          /* @__PURE__ */ jsx(TrashIcon, {}),
                          /* @__PURE__ */ jsx(Typography, { ellipsis: true, textColor: "danger600", children: formatMessage({
                            id: "content-releases.header.actions.delete",
                            defaultMessage: "Delete"
                          }) })
                        ] })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                ReleaseInfoWrapper,
                {
                  direction: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 1,
                  padding: 5,
                  children: [
                    /* @__PURE__ */ jsx(Typography, { variant: "pi", fontWeight: "bold", children: formatMessage({
                      id: "content-releases.header.actions.created",
                      defaultMessage: "Created"
                    }) }),
                    /* @__PURE__ */ jsxs(Typography, { variant: "pi", color: "neutral300", children: [
                      /* @__PURE__ */ jsx(RelativeTime$1, { timestamp: new Date(release.createdAt) }),
                      formatMessage(
                        {
                          id: "content-releases.header.actions.created.description",
                          defaultMessage: "{hasCreatedByUser, select, true { by {createdBy}} other { by deleted user}}"
                        },
                        { createdBy: getCreatedByUser(), hasCreatedByUser }
                      )
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "S", variant: "tertiary", onClick: handleRefresh, children: formatMessage({
            id: "content-releases.header.actions.refresh",
            defaultMessage: "Refresh"
          }) }),
          /* @__PURE__ */ jsx(CheckPermissions, { permissions: PERMISSIONS.publish, children: /* @__PURE__ */ jsx(
            Button,
            {
              size: "S",
              variant: "default",
              onClick: handlePublishRelease,
              loading: isPublishing,
              disabled: release.actions.meta.count === 0,
              children: formatMessage({
                id: "content-releases.header.actions.publish",
                defaultMessage: "Publish"
              })
            }
          ) })
        ] })
      }
    ),
    children
  ] });
};
const GROUP_BY_OPTIONS = ["contentType", "locale", "action"];
const GROUP_BY_OPTIONS_NO_LOCALE = ["contentType", "action"];
const getGroupByOptionLabel = (value) => {
  if (value === "locale") {
    return {
      id: "content-releases.pages.ReleaseDetails.groupBy.option.locales",
      defaultMessage: "Locales"
    };
  }
  if (value === "action") {
    return {
      id: "content-releases.pages.ReleaseDetails.groupBy.option.actions",
      defaultMessage: "Actions"
    };
  }
  return {
    id: "content-releases.pages.ReleaseDetails.groupBy.option.content-type",
    defaultMessage: "Content-Types"
  };
};
const DEFAULT_RELEASE_DETAILS_HEADER = [
  {
    key: "__name__",
    fieldSchema: { type: "string" },
    metadatas: {
      label: {
        id: "content-releases.page.ReleaseDetails.table.header.label.name",
        defaultMessage: "name"
      },
      searchable: false,
      sortable: false
    },
    name: "name"
  }
];
const ReleaseDetailsBody = () => {
  const { formatMessage } = useIntl();
  const { releaseId } = useParams();
  const [{ query }, setQuery] = useQueryParams();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const {
    data: releaseData,
    isLoading: isReleaseLoading,
    isError: isReleaseError,
    error: releaseError
  } = useGetReleaseQuery({ id: releaseId });
  const {
    allowedActions: { canUpdate }
  } = useRBAC(PERMISSIONS);
  const { runHookWaterfall } = useStrapiApp();
  const {
    displayedHeaders,
    hasI18nEnabled
  } = runHookWaterfall(
    "ContentReleases/pages/ReleaseDetails/add-locale-in-releases",
    {
      displayedHeaders: DEFAULT_RELEASE_DETAILS_HEADER,
      hasI18nEnabled: false
    }
  );
  const release = releaseData?.data;
  const selectedGroupBy = query?.groupBy || "contentType";
  const {
    isLoading,
    isFetching,
    isError,
    data,
    error: releaseActionsError
  } = useGetReleaseActionsQuery({
    ...query,
    releaseId
  });
  const [updateReleaseAction] = useUpdateReleaseActionMutation();
  const handleChangeType = async (e, actionId, actionPath) => {
    const response = await updateReleaseAction({
      params: {
        releaseId,
        actionId
      },
      body: {
        type: e.target.value
      },
      query,
      // We are passing the query params to make optimistic updates
      actionPath
      // We are passing the action path to found the position in the cache of the action for optimistic updates
    });
    if ("error" in response) {
      if (isAxiosError(response.error)) {
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
  if (isLoading || isReleaseLoading) {
    return /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsx(LoadingIndicatorPage, {}) });
  }
  const releaseActions = data?.data;
  const releaseMeta = data?.meta;
  const contentTypes = releaseMeta?.contentTypes || {};
  const components = releaseMeta?.components || {};
  if (isReleaseError || !release) {
    const errorsArray = [];
    if (releaseError) {
      errorsArray.push({
        code: releaseError.code
      });
    }
    if (releaseActionsError) {
      errorsArray.push({
        code: releaseActionsError.code
      });
    }
    return /* @__PURE__ */ jsx(
      Redirect,
      {
        to: {
          pathname: "/plugins/content-releases",
          state: {
            errors: errorsArray
          }
        }
      }
    );
  }
  if (isError || !releaseActions) {
    return /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsx(AnErrorOccurred, {}) });
  }
  if (Object.keys(releaseActions).length === 0) {
    return /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsx(
      NoContent,
      {
        content: {
          id: "content-releases.pages.Details.tab.emptyEntries",
          defaultMessage: "This release is empty. Open the Content Manager, select an entry and add it to the release."
        },
        action: /* @__PURE__ */ jsx(
          LinkButton,
          {
            as: Link$2,
            to: {
              pathname: "/content-manager"
            },
            style: { textDecoration: "none" },
            variant: "secondary",
            children: formatMessage({
              id: "content-releases.page.Details.button.openContentManager",
              defaultMessage: "Open the Content Manager"
            })
          }
        )
      }
    ) });
  }
  const options = hasI18nEnabled ? GROUP_BY_OPTIONS : GROUP_BY_OPTIONS_NO_LOCALE;
  return /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsxs(Flex, { gap: 8, direction: "column", alignItems: "stretch", children: [
    /* @__PURE__ */ jsx(Flex, { children: /* @__PURE__ */ jsx(
      SingleSelect,
      {
        "aria-label": formatMessage({
          id: "content-releases.pages.ReleaseDetails.groupBy.aria-label",
          defaultMessage: "Group by"
        }),
        customizeContent: (value) => formatMessage(
          {
            id: `content-releases.pages.ReleaseDetails.groupBy.label`,
            defaultMessage: `Group by {groupBy}`
          },
          {
            groupBy: value
          }
        ),
        value: formatMessage(getGroupByOptionLabel(selectedGroupBy)),
        onChange: (value) => setQuery({ groupBy: value }),
        children: options.map((option) => /* @__PURE__ */ jsx(SingleSelectOption, { value: option, children: formatMessage(getGroupByOptionLabel(option)) }, option))
      }
    ) }),
    Object.keys(releaseActions).map((key) => /* @__PURE__ */ jsxs(Flex, { gap: 4, direction: "column", alignItems: "stretch", children: [
      /* @__PURE__ */ jsx(Flex, { role: "separator", "aria-label": key, children: /* @__PURE__ */ jsx(Badge, { children: key }) }),
      /* @__PURE__ */ jsx(
        Table.Root,
        {
          rows: releaseActions[key].map((item) => ({
            ...item,
            id: Number(item.entry.id)
          })),
          colCount: releaseActions[key].length,
          isLoading,
          isFetching,
          children: /* @__PURE__ */ jsxs(Table.Content, { children: [
            /* @__PURE__ */ jsxs(Table.Head, { children: [
              displayedHeaders.map(({ key: key2, fieldSchema, metadatas, name }) => /* @__PURE__ */ jsx(
                Table.HeaderCell,
                {
                  fieldSchemaType: fieldSchema.type,
                  label: formatMessage(metadatas.label),
                  name
                },
                key2
              )),
              /* @__PURE__ */ jsx(
                Table.HeaderCell,
                {
                  fieldSchemaType: "string",
                  label: formatMessage({
                    id: "content-releases.page.ReleaseDetails.table.header.label.content-type",
                    defaultMessage: "content-type"
                  }),
                  name: "content-type"
                }
              ),
              /* @__PURE__ */ jsx(
                Table.HeaderCell,
                {
                  fieldSchemaType: "string",
                  label: formatMessage({
                    id: "content-releases.page.ReleaseDetails.table.header.label.action",
                    defaultMessage: "action"
                  }),
                  name: "action"
                }
              ),
              !release.releasedAt && /* @__PURE__ */ jsx(
                Table.HeaderCell,
                {
                  fieldSchemaType: "string",
                  label: formatMessage({
                    id: "content-releases.page.ReleaseDetails.table.header.label.status",
                    defaultMessage: "status"
                  }),
                  name: "status"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Table.LoadingBody, {}),
            /* @__PURE__ */ jsx(Table.Body, { children: releaseActions[key].map(
              ({ id, contentType, locale, type, entry }, actionIndex) => /* @__PURE__ */ jsxs(Tr, { children: [
                /* @__PURE__ */ jsx(Td, { width: "25%", maxWidth: "200px", children: /* @__PURE__ */ jsx(Typography, { ellipsis: true, children: `${contentType.mainFieldValue || entry.id}` }) }),
                hasI18nEnabled && /* @__PURE__ */ jsx(Td, { width: "10%", children: /* @__PURE__ */ jsx(Typography, { children: `${locale?.name ? locale.name : "-"}` }) }),
                /* @__PURE__ */ jsx(Td, { width: "10%", children: /* @__PURE__ */ jsx(Typography, { children: contentType.displayName || "" }) }),
                /* @__PURE__ */ jsx(Td, { width: "20%", children: release.releasedAt ? /* @__PURE__ */ jsx(Typography, { children: formatMessage(
                  {
                    id: "content-releases.page.ReleaseDetails.table.action-published",
                    defaultMessage: "This entry was <b>{isPublish, select, true {published} other {unpublished}}</b>."
                  },
                  {
                    isPublish: type === "publish",
                    b: (children) => /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", children })
                  }
                ) }) : /* @__PURE__ */ jsx(
                  ReleaseActionOptions,
                  {
                    selected: type,
                    handleChange: (e) => handleChangeType(e, id, [key, actionIndex]),
                    name: `release-action-${id}-type`,
                    disabled: !canUpdate
                  }
                ) }),
                !release.releasedAt && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Td, { width: "20%", minWidth: "200px", children: /* @__PURE__ */ jsx(
                    EntryValidationText,
                    {
                      action: type,
                      schema: contentTypes?.[contentType.uid],
                      components,
                      entry
                    }
                  ) }),
                  /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsxs(ReleaseActionMenu.Root, { children: [
                    /* @__PURE__ */ jsx(
                      ReleaseActionMenu.ReleaseActionEntryLinkItem,
                      {
                        contentTypeUid: contentType.uid,
                        entryId: entry.id,
                        locale: locale?.code
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      ReleaseActionMenu.DeleteReleaseActionItem,
                      {
                        releaseId: release.id,
                        actionId: id
                      }
                    )
                  ] }) }) })
                ] })
              ] }, id)
            ) })
          ] })
        }
      )
    ] }, `releases-group-${key}`)),
    /* @__PURE__ */ jsxs(Flex, { paddingTop: 4, alignItems: "flex-end", justifyContent: "space-between", children: [
      /* @__PURE__ */ jsx(PageSizeURLQuery, { defaultValue: releaseMeta?.pagination?.pageSize.toString() }),
      /* @__PURE__ */ jsx(
        PaginationURLQuery,
        {
          pagination: {
            pageCount: releaseMeta?.pagination?.pageCount || 0
          }
        }
      )
    ] })
  ] }) });
};
const ReleaseDetailsPage = () => {
  const { formatMessage } = useIntl();
  const { releaseId } = useParams();
  const toggleNotification = useNotification();
  const { formatAPIError } = useAPIErrorHandler();
  const { replace } = useHistory();
  const [releaseModalShown, setReleaseModalShown] = React.useState(false);
  const [showWarningSubmit, setWarningSubmit] = React.useState(false);
  const {
    isLoading: isLoadingDetails,
    data,
    isSuccess: isSuccessDetails
  } = useGetReleaseQuery({ id: releaseId });
  const [updateRelease, { isLoading: isSubmittingForm }] = useUpdateReleaseMutation();
  const [deleteRelease, { isLoading: isDeletingRelease }] = useDeleteReleaseMutation();
  const toggleEditReleaseModal = () => {
    setReleaseModalShown((prev) => !prev);
  };
  const toggleWarningSubmit = () => setWarningSubmit((prevState) => !prevState);
  if (isLoadingDetails) {
    return /* @__PURE__ */ jsx(
      ReleaseDetailsLayout,
      {
        toggleEditReleaseModal,
        toggleWarningSubmit,
        children: /* @__PURE__ */ jsx(ContentLayout, { children: /* @__PURE__ */ jsx(LoadingIndicatorPage, {}) })
      }
    );
  }
  const releaseData = isSuccessDetails && data?.data || null;
  const title = releaseData?.name || "";
  const timezone = releaseData?.timezone ?? null;
  const scheduledAt = releaseData?.scheduledAt && timezone ? utcToZonedTime(releaseData.scheduledAt, timezone) : null;
  const date = scheduledAt ? format(scheduledAt, "yyyy-MM-dd") : null;
  const time = scheduledAt ? format(scheduledAt, "HH:mm") : "";
  const handleEditRelease = async (values) => {
    const response = await updateRelease({
      id: releaseId,
      name: values.name,
      scheduledAt: values.scheduledAt,
      timezone: values.timezone
    });
    if ("data" in response) {
      toggleNotification({
        type: "success",
        message: formatMessage({
          id: "content-releases.modal.release-updated-notification-success",
          defaultMessage: "Release updated."
        })
      });
      toggleEditReleaseModal();
    } else if (isAxiosError(response.error)) {
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
  };
  const handleDeleteRelease = async () => {
    const response = await deleteRelease({
      id: releaseId
    });
    if ("data" in response) {
      replace("/plugins/content-releases");
    } else if (isAxiosError(response.error)) {
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
  };
  return /* @__PURE__ */ jsxs(
    ReleaseDetailsLayout,
    {
      toggleEditReleaseModal,
      toggleWarningSubmit,
      children: [
        /* @__PURE__ */ jsx(ReleaseDetailsBody, {}),
        releaseModalShown && /* @__PURE__ */ jsx(
          ReleaseModal,
          {
            handleClose: toggleEditReleaseModal,
            handleSubmit: handleEditRelease,
            isLoading: isLoadingDetails || isSubmittingForm,
            initialValues: {
              name: title || "",
              scheduledAt,
              date,
              time,
              isScheduled: Boolean(scheduledAt),
              timezone
            }
          }
        ),
        /* @__PURE__ */ jsx(
          ConfirmDialog,
          {
            bodyText: {
              id: "content-releases.dialog.confirmation-message",
              defaultMessage: "Are you sure you want to delete this release?"
            },
            isOpen: showWarningSubmit,
            isConfirmButtonLoading: isDeletingRelease,
            onToggleDialog: toggleWarningSubmit,
            onConfirm: handleDeleteRelease
          }
        )
      ]
    }
  );
};
const App = () => {
  return /* @__PURE__ */ jsx(CheckPagePermissions, { permissions: PERMISSIONS.main, children: /* @__PURE__ */ jsxs(Switch, { children: [
    /* @__PURE__ */ jsx(Route, { exact: true, path: `/plugins/${pluginId}`, component: ReleasesPage }),
    /* @__PURE__ */ jsx(Route, { exact: true, path: `/plugins/${pluginId}/:releaseId`, component: ReleaseDetailsPage })
  ] }) });
};
export {
  App
};
//# sourceMappingURL=App-jrh58sXY.mjs.map
