"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const helperPlugin = require("@strapi/helper-plugin");
const reactRouterDom = require("react-router-dom");
const index = require("./index-CVO0Rqdm.js");
const React = require("react");
const strapiAdmin = require("@strapi/admin/strapi-admin");
const designSystem = require("@strapi/design-system");
const v2 = require("@strapi/design-system/v2");
const icons = require("@strapi/icons");
const format = require("date-fns/format");
const dateFnsTz = require("date-fns-tz");
const reactIntl = require("react-intl");
const styled = require("styled-components");
const dateFns = require("date-fns");
const formik = require("formik");
const yup = require("yup");
require("@reduxjs/toolkit/query");
require("axios");
require("@reduxjs/toolkit/query/react");
require("react-redux");
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
const format__default = /* @__PURE__ */ _interopDefault(format);
const styled__default = /* @__PURE__ */ _interopDefault(styled);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const RELEASE_SCHEMA = yup__namespace.object().shape({
  name: yup__namespace.string().trim().required(),
  scheduledAt: yup__namespace.string().nullable(),
  isScheduled: yup__namespace.boolean().optional(),
  time: yup__namespace.string().when("isScheduled", {
    is: true,
    then: yup__namespace.string().trim().required(),
    otherwise: yup__namespace.string().nullable()
  }),
  timezone: yup__namespace.string().when("isScheduled", {
    is: true,
    then: yup__namespace.string().required().nullable(),
    otherwise: yup__namespace.string().nullable()
  }),
  date: yup__namespace.string().when("isScheduled", {
    is: true,
    then: yup__namespace.string().required().nullable(),
    otherwise: yup__namespace.string().nullable()
  })
}).required().noUnknown();
const ReleaseModal = ({
  handleClose,
  handleSubmit,
  initialValues,
  isLoading = false
}) => {
  const { formatMessage } = reactIntl.useIntl();
  const { pathname } = reactRouterDom.useLocation();
  const isCreatingRelease = pathname === `/plugins/${index.pluginId}`;
  const { timezoneList, systemTimezone = { value: "UTC+00:00-Africa/Abidjan " } } = getTimezones(
    initialValues.scheduledAt ? new Date(initialValues.scheduledAt) : /* @__PURE__ */ new Date()
  );
  const getScheduledTimestamp = (values) => {
    const { date, time, timezone } = values;
    if (!date || !time || !timezone)
      return null;
    const timezoneWithoutOffset = timezone.split("&")[1];
    return dateFnsTz.zonedTimeToUtc(`${date} ${time}`, timezoneWithoutOffset);
  };
  const getTimezoneWithOffset = () => {
    const currentTimezone = timezoneList.find(
      (timezone) => timezone.value.split("&")[1] === initialValues.timezone
    );
    return currentTimezone?.value || systemTimezone.value;
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.ModalLayout, { onClose: handleClose, labelledBy: "title", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { id: "title", fontWeight: "bold", textColor: "neutral800", children: formatMessage(
      {
        id: "content-releases.modal.title",
        defaultMessage: "{isCreatingRelease, select, true {New release} other {Edit release}}"
      },
      { isCreatingRelease }
    ) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      formik.Formik,
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
        children: ({ values, errors, handleChange, setFieldValue }) => /* @__PURE__ */ jsxRuntime.jsxs(formik.Form, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalBody, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "stretch", gap: 6, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.TextInput,
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
            /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { width: "max-content", children: /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.Checkbox,
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
                children: /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.Typography,
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
            values.isScheduled && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 4, alignItems: "start", children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { width: "100%", children: /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.DatePicker,
                  {
                    label: formatMessage({
                      id: "content-releases.modal.form.input.label.date",
                      defaultMessage: "Date"
                    }),
                    name: "date",
                    error: errors.date,
                    onChange: (date) => {
                      const isoFormatDate = date ? dateFns.formatISO(date, { representation: "date" }) : null;
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
                    minDate: dateFnsTz.utcToZonedTime(/* @__PURE__ */ new Date(), values.timezone.split("&")[1])
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { width: "100%", children: /* @__PURE__ */ jsxRuntime.jsx(
                  designSystem.TimePicker,
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
              /* @__PURE__ */ jsxRuntime.jsx(TimezoneComponent, { timezoneOptions: timezoneList })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.ModalFooter,
            {
              startActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { onClick: handleClose, variant: "tertiary", name: "cancel", children: formatMessage({ id: "cancel", defaultMessage: "Cancel" }) }),
              endActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { name: "submit", loading: isLoading, type: "submit", children: formatMessage(
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
    const utcOffset = index.getTimezoneOffset(timezone, selectedDate);
    return { offset: utcOffset, value: `${utcOffset}&${timezone}` };
  });
  const systemTimezone = timezoneList.find(
    (timezone) => timezone.value.split("&")[1] === Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  return { timezoneList, systemTimezone };
};
const TimezoneComponent = ({ timezoneOptions }) => {
  const { values, errors, setFieldValue } = formik.useFormikContext();
  const { formatMessage } = reactIntl.useIntl();
  const [timezoneList, setTimezoneList] = React__namespace.useState(timezoneOptions);
  React__namespace.useEffect(() => {
    if (values.date) {
      const { timezoneList: timezoneList2 } = getTimezones(new Date(values.date));
      setTimezoneList(timezoneList2);
      const updatedTimezone = values.timezone && timezoneList2.find((tz) => tz.value.split("&")[1] === values.timezone.split("&")[1]);
      if (updatedTimezone) {
        setFieldValue("timezone", updatedTimezone.value);
      }
    }
  }, [setFieldValue, values.date, values.timezone]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Combobox,
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
      children: timezoneList.map((timezone) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.ComboboxOption, { value: timezone.value, children: timezone.value.replace(/&/, " ") }, timezone.value))
    }
  );
};
const LinkCard = styled__default.default(v2.Link)`
  display: block;
`;
const RelativeTime = styled__default.default(helperPlugin.RelativeTime)`
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
  const { formatMessage } = reactIntl.useIntl();
  if (isError) {
    return /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.AnErrorOccurred, {});
  }
  if (releases?.length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
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
        icon: /* @__PURE__ */ jsxRuntime.jsx(icons.EmptyDocuments, { width: "10rem" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Grid, { gap: 4, children: releases.map(({ id, name, scheduledAt, status }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 3, s: 6, xs: 12, children: /* @__PURE__ */ jsxRuntime.jsx(LinkCard, { href: `content-releases/${id}`, isExternal: false, children: /* @__PURE__ */ jsxRuntime.jsxs(
    designSystem.Flex,
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
        /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { direction: "column", alignItems: "start", gap: 1, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { as: "h3", variant: "delta", fontWeight: "bold", children: name }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", textColor: "neutral600", children: scheduledAt ? /* @__PURE__ */ jsxRuntime.jsx(RelativeTime, { timestamp: new Date(scheduledAt) }) : formatMessage({
            id: "content-releases.pages.Releases.not-scheduled",
            defaultMessage: "Not scheduled"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { ...getBadgeProps(status), children: status })
      ]
    }
  ) }) }, id)) });
};
const StyledAlert = styled__default.default(designSystem.Alert)`
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
  const tabRef = React__namespace.useRef(null);
  const location = reactRouterDom.useLocation();
  const [releaseModalShown, setReleaseModalShown] = React__namespace.useState(false);
  const toggleNotification = helperPlugin.useNotification();
  const { formatMessage } = reactIntl.useIntl();
  const { push, replace } = reactRouterDom.useHistory();
  const { formatAPIError } = helperPlugin.useAPIErrorHandler();
  const [{ query }, setQuery] = helperPlugin.useQueryParams();
  const response = index.useGetReleasesQuery(query);
  const [createRelease, { isLoading: isSubmittingForm }] = index.useCreateReleaseMutation();
  const { getFeature } = strapiAdmin.useLicenseLimits();
  const { maximumReleases = 3 } = getFeature("cms-content-releases");
  const { trackUsage } = helperPlugin.useTracking();
  const { isLoading, isSuccess, isError } = response;
  const activeTab = response?.currentData?.meta?.activeTab || "pending";
  const activeTabIndex = ["pending", "done"].indexOf(activeTab);
  React__namespace.useEffect(() => {
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
  React__namespace.useEffect(() => {
    if (tabRef.current) {
      tabRef.current._handlers.setSelectedTabIndex(activeTabIndex);
    }
  }, [activeTabIndex]);
  const toggleAddReleaseModal = () => {
    setReleaseModalShown((prev) => !prev);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { "aria-busy": isLoading, children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {}) });
  }
  const totalPendingReleases = isSuccess && response.currentData?.meta?.pendingReleasesCount || 0;
  const hasReachedMaximumPendingReleases = totalPendingReleases >= maximumReleases;
  const handleTabChange = (index2) => {
    setQuery({
      ...query,
      page: 1,
      pageSize: response?.currentData?.meta?.pagination?.pageSize || 16,
      filters: {
        releasedAt: {
          $notNull: index2 === 0 ? false : true
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
    } else if (index.isAxiosError(response2.error)) {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { "aria-busy": isLoading, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: formatMessage({
          id: "content-releases.pages.Releases.title",
          defaultMessage: "Releases"
        }),
        subtitle: formatMessage({
          id: "content-releases.pages.Releases.header-subtitle",
          defaultMessage: "Create and manage content updates"
        }),
        primaryAction: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.CheckPermissions, { permissions: index.PERMISSIONS.create, children: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
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
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      hasReachedMaximumPendingReleases && /* @__PURE__ */ jsxRuntime.jsx(
        StyledAlert,
        {
          marginBottom: 6,
          action: /* @__PURE__ */ jsxRuntime.jsx(v2.Link, { href: "https://strapi.io/pricing-cloud", isExternal: true, children: formatMessage({
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
      /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.TabGroup,
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
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Box, { paddingBottom: 8, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage(
                  {
                    id: "content-releases.pages.Releases.tab.pending",
                    defaultMessage: "Pending ({count})"
                  },
                  {
                    count: totalPendingReleases
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage({
                  id: "content-releases.pages.Releases.tab.done",
                  defaultMessage: "Done"
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {})
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(designSystem.TabPanels, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(
                ReleasesGrid,
                {
                  sectionTitle: "pending",
                  releases: response?.currentData?.data,
                  isError
                }
              ) }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(
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
      response.currentData?.meta?.pagination?.total ? /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { paddingTop: 4, alignItems: "flex-end", justifyContent: "space-between", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          helperPlugin.PageSizeURLQuery,
          {
            options: ["8", "16", "32", "64"],
            defaultValue: response?.currentData?.meta?.pagination?.pageSize.toString()
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          helperPlugin.PaginationURLQuery,
          {
            pagination: {
              pageCount: response?.currentData?.meta?.pagination?.pageCount || 0
            }
          }
        )
      ] }) : null
    ] }) }),
    releaseModalShown && /* @__PURE__ */ jsxRuntime.jsx(
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
const ReleaseInfoWrapper = styled__default.default(designSystem.Flex)`
  align-self: stretch;
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral150};
`;
const StyledMenuItem = styled__default.default(v2.Menu.Item)`
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
const PencilIcon = styled__default.default(icons.Pencil)`
  width: ${({ theme }) => theme.spaces[3]};
  height: ${({ theme }) => theme.spaces[3]};
  path {
    fill: ${({ theme }) => theme.colors.neutral600};
  }
`;
const TrashIcon = styled__default.default(icons.Trash)`
  width: ${({ theme }) => theme.spaces[3]};
  height: ${({ theme }) => theme.spaces[3]};
  path {
    fill: ${({ theme }) => theme.colors.danger600};
  }
`;
const TypographyMaxWidth = styled__default.default(designSystem.Typography)`
  max-width: 300px;
`;
const EntryValidationText = ({ action, schema, components, entry }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { validate } = strapiAdmin.unstable_useDocument();
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
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Icon, { color: "danger600", as: icons.CrossCircle }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tooltip, { description: validationErrorsMessages, children: /* @__PURE__ */ jsxRuntime.jsx(TypographyMaxWidth, { textColor: "danger600", variant: "omega", fontWeight: "semiBold", ellipsis: true, children: validationErrorsMessages }) })
    ] });
  }
  if (action == "publish") {
    return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Icon, { color: "success600", as: icons.CheckCircle }),
      entry.publishedAt ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "success600", fontWeight: "bold", children: formatMessage({
        id: "content-releases.pages.ReleaseDetails.entry-validation.already-published",
        defaultMessage: "Already published"
      }) }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: formatMessage({
        id: "content-releases.pages.ReleaseDetails.entry-validation.ready-to-publish",
        defaultMessage: "Ready to publish"
      }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Icon, { color: "success600", as: icons.CheckCircle }),
    !entry.publishedAt ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "success600", fontWeight: "bold", children: formatMessage({
      id: "content-releases.pages.ReleaseDetails.entry-validation.already-unpublished",
      defaultMessage: "Already unpublished"
    }) }) : /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: formatMessage({
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
  const { formatMessage, formatDate, formatTime } = reactIntl.useIntl();
  const { releaseId } = reactRouterDom.useParams();
  const {
    data,
    isLoading: isLoadingDetails,
    isError,
    error
  } = index.useGetReleaseQuery({ id: releaseId });
  const [publishRelease, { isLoading: isPublishing }] = index.usePublishReleaseMutation();
  const toggleNotification = helperPlugin.useNotification();
  const { formatAPIError } = helperPlugin.useAPIErrorHandler();
  const {
    allowedActions: { canUpdate, canDelete }
  } = helperPlugin.useRBAC(index.PERMISSIONS);
  const dispatch = index.useTypedDispatch();
  const { trackUsage } = helperPlugin.useTracking();
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
    } else if (index.isAxiosError(response.error)) {
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
      index.releaseApi.util.invalidateTags([
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
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.Main, { "aria-busy": isLoadingDetails, children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {}) });
  }
  if (isError || !release) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      reactRouterDom.Redirect,
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
      offset: index.getTimezoneOffset(release.timezone, new Date(release.scheduledAt))
    }
  ) : "";
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { "aria-busy": isLoadingDetails, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        title: release.name,
        subtitle: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, lineHeight: 6, children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral600", variant: "epsilon", children: numberOfEntriesText + (isScheduled ? ` - ${scheduledText}` : "") }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { ...getBadgeProps(release.status), children: release.status })
        ] }),
        navigationAction: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Link, { startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.ArrowLeft, {}), to: "/plugins/content-releases", children: formatMessage({
          id: "global.back",
          defaultMessage: "Back"
        }) }),
        primaryAction: !release.releasedAt && /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(v2.Menu.Root, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              v2.Menu.Trigger,
              {
                as: designSystem.IconButton,
                paddingLeft: 2,
                paddingRight: 2,
                "aria-label": formatMessage({
                  id: "content-releases.header.actions.open-release-actions",
                  defaultMessage: "Release edit and delete menu"
                }),
                icon: /* @__PURE__ */ jsxRuntime.jsx(icons.More, {}),
                variant: "tertiary"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(v2.Menu.Content, { top: 1, popoverPlacement: "bottom-end", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(
                designSystem.Flex,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  direction: "column",
                  padding: 1,
                  width: "100%",
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(StyledMenuItem, { disabled: !canUpdate, onSelect: toggleEditReleaseModal, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { alignItems: "center", gap: 2, hasRadius: true, width: "100%", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(PencilIcon, {}),
                      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { ellipsis: true, children: formatMessage({
                        id: "content-releases.header.actions.edit",
                        defaultMessage: "Edit"
                      }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      StyledMenuItem,
                      {
                        disabled: !canDelete,
                        onSelect: toggleWarningSubmit,
                        variant: "danger",
                        children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { alignItems: "center", gap: 2, hasRadius: true, width: "100%", children: [
                          /* @__PURE__ */ jsxRuntime.jsx(TrashIcon, {}),
                          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { ellipsis: true, textColor: "danger600", children: formatMessage({
                            id: "content-releases.header.actions.delete",
                            defaultMessage: "Delete"
                          }) })
                        ] })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs(
                ReleaseInfoWrapper,
                {
                  direction: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 1,
                  padding: 5,
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "pi", fontWeight: "bold", children: formatMessage({
                      id: "content-releases.header.actions.created",
                      defaultMessage: "Created"
                    }) }),
                    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Typography, { variant: "pi", color: "neutral300", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.RelativeTime, { timestamp: new Date(release.createdAt) }),
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
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { size: "S", variant: "tertiary", onClick: handleRefresh, children: formatMessage({
            id: "content-releases.header.actions.refresh",
            defaultMessage: "Refresh"
          }) }),
          /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.CheckPermissions, { permissions: index.PERMISSIONS.publish, children: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Button,
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
  const { formatMessage } = reactIntl.useIntl();
  const { releaseId } = reactRouterDom.useParams();
  const [{ query }, setQuery] = helperPlugin.useQueryParams();
  const toggleNotification = helperPlugin.useNotification();
  const { formatAPIError } = helperPlugin.useAPIErrorHandler();
  const {
    data: releaseData,
    isLoading: isReleaseLoading,
    isError: isReleaseError,
    error: releaseError
  } = index.useGetReleaseQuery({ id: releaseId });
  const {
    allowedActions: { canUpdate }
  } = helperPlugin.useRBAC(index.PERMISSIONS);
  const { runHookWaterfall } = helperPlugin.useStrapiApp();
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
  } = index.useGetReleaseActionsQuery({
    ...query,
    releaseId
  });
  const [updateReleaseAction] = index.useUpdateReleaseActionMutation();
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
      if (index.isAxiosError(response.error)) {
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
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {}) });
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
    return /* @__PURE__ */ jsxRuntime.jsx(
      reactRouterDom.Redirect,
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
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.AnErrorOccurred, {}) });
  }
  if (Object.keys(releaseActions).length === 0) {
    return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsx(
      helperPlugin.NoContent,
      {
        content: {
          id: "content-releases.pages.Details.tab.emptyEntries",
          defaultMessage: "This release is empty. Open the Content Manager, select an entry and add it to the release."
        },
        action: /* @__PURE__ */ jsxRuntime.jsx(
          v2.LinkButton,
          {
            as: reactRouterDom.Link,
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
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 8, direction: "column", alignItems: "stretch", children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.SingleSelect,
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
        children: options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: option, children: formatMessage(getGroupByOptionLabel(option)) }, option))
      }
    ) }),
    Object.keys(releaseActions).map((key) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 4, direction: "column", alignItems: "stretch", children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { role: "separator", "aria-label": key, children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Badge, { children: key }) }),
      /* @__PURE__ */ jsxRuntime.jsx(
        helperPlugin.Table.Root,
        {
          rows: releaseActions[key].map((item) => ({
            ...item,
            id: Number(item.entry.id)
          })),
          colCount: releaseActions[key].length,
          isLoading,
          isFetching,
          children: /* @__PURE__ */ jsxRuntime.jsxs(helperPlugin.Table.Content, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs(helperPlugin.Table.Head, { children: [
              displayedHeaders.map(({ key: key2, fieldSchema, metadatas, name }) => /* @__PURE__ */ jsxRuntime.jsx(
                helperPlugin.Table.HeaderCell,
                {
                  fieldSchemaType: fieldSchema.type,
                  label: formatMessage(metadatas.label),
                  name
                },
                key2
              )),
              /* @__PURE__ */ jsxRuntime.jsx(
                helperPlugin.Table.HeaderCell,
                {
                  fieldSchemaType: "string",
                  label: formatMessage({
                    id: "content-releases.page.ReleaseDetails.table.header.label.content-type",
                    defaultMessage: "content-type"
                  }),
                  name: "content-type"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                helperPlugin.Table.HeaderCell,
                {
                  fieldSchemaType: "string",
                  label: formatMessage({
                    id: "content-releases.page.ReleaseDetails.table.header.label.action",
                    defaultMessage: "action"
                  }),
                  name: "action"
                }
              ),
              !release.releasedAt && /* @__PURE__ */ jsxRuntime.jsx(
                helperPlugin.Table.HeaderCell,
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
            /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.Table.LoadingBody, {}),
            /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.Table.Body, { children: releaseActions[key].map(
              ({ id, contentType, locale, type, entry }, actionIndex) => /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { width: "25%", maxWidth: "200px", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { ellipsis: true, children: `${contentType.mainFieldValue || entry.id}` }) }),
                hasI18nEnabled && /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { width: "10%", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: `${locale?.name ? locale.name : "-"}` }) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { width: "10%", children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: contentType.displayName || "" }) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { width: "20%", children: release.releasedAt ? /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { children: formatMessage(
                  {
                    id: "content-releases.page.ReleaseDetails.table.action-published",
                    defaultMessage: "This entry was <b>{isPublish, select, true {published} other {unpublished}}</b>."
                  },
                  {
                    isPublish: type === "publish",
                    b: (children) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", children })
                  }
                ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                  index.ReleaseActionOptions,
                  {
                    selected: type,
                    handleChange: (e) => handleChangeType(e, id, [key, actionIndex]),
                    name: `release-action-${id}-type`,
                    disabled: !canUpdate
                  }
                ) }),
                !release.releasedAt && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { width: "20%", minWidth: "200px", children: /* @__PURE__ */ jsxRuntime.jsx(
                    EntryValidationText,
                    {
                      action: type,
                      schema: contentTypes?.[contentType.uid],
                      components,
                      entry
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Flex, { justifyContent: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsxs(index.ReleaseActionMenu.Root, { children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      index.ReleaseActionMenu.ReleaseActionEntryLinkItem,
                      {
                        contentTypeUid: contentType.uid,
                        entryId: entry.id,
                        locale: locale?.code
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      index.ReleaseActionMenu.DeleteReleaseActionItem,
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
    /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { paddingTop: 4, alignItems: "flex-end", justifyContent: "space-between", children: [
      /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.PageSizeURLQuery, { defaultValue: releaseMeta?.pagination?.pageSize.toString() }),
      /* @__PURE__ */ jsxRuntime.jsx(
        helperPlugin.PaginationURLQuery,
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
  const { formatMessage } = reactIntl.useIntl();
  const { releaseId } = reactRouterDom.useParams();
  const toggleNotification = helperPlugin.useNotification();
  const { formatAPIError } = helperPlugin.useAPIErrorHandler();
  const { replace } = reactRouterDom.useHistory();
  const [releaseModalShown, setReleaseModalShown] = React__namespace.useState(false);
  const [showWarningSubmit, setWarningSubmit] = React__namespace.useState(false);
  const {
    isLoading: isLoadingDetails,
    data,
    isSuccess: isSuccessDetails
  } = index.useGetReleaseQuery({ id: releaseId });
  const [updateRelease, { isLoading: isSubmittingForm }] = index.useUpdateReleaseMutation();
  const [deleteRelease, { isLoading: isDeletingRelease }] = index.useDeleteReleaseMutation();
  const toggleEditReleaseModal = () => {
    setReleaseModalShown((prev) => !prev);
  };
  const toggleWarningSubmit = () => setWarningSubmit((prevState) => !prevState);
  if (isLoadingDetails) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      ReleaseDetailsLayout,
      {
        toggleEditReleaseModal,
        toggleWarningSubmit,
        children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {}) })
      }
    );
  }
  const releaseData = isSuccessDetails && data?.data || null;
  const title = releaseData?.name || "";
  const timezone = releaseData?.timezone ?? null;
  const scheduledAt = releaseData?.scheduledAt && timezone ? dateFnsTz.utcToZonedTime(releaseData.scheduledAt, timezone) : null;
  const date = scheduledAt ? format__default.default(scheduledAt, "yyyy-MM-dd") : null;
  const time = scheduledAt ? format__default.default(scheduledAt, "HH:mm") : "";
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
    } else if (index.isAxiosError(response.error)) {
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
    } else if (index.isAxiosError(response.error)) {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ReleaseDetailsLayout,
    {
      toggleEditReleaseModal,
      toggleWarningSubmit,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(ReleaseDetailsBody, {}),
        releaseModalShown && /* @__PURE__ */ jsxRuntime.jsx(
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
        /* @__PURE__ */ jsxRuntime.jsx(
          helperPlugin.ConfirmDialog,
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
  return /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.CheckPagePermissions, { permissions: index.PERMISSIONS.main, children: /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Switch, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { exact: true, path: `/plugins/${index.pluginId}`, component: ReleasesPage }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { exact: true, path: `/plugins/${index.pluginId}/:releaseId`, component: ReleaseDetailsPage })
  ] }) });
};
exports.App = App;
//# sourceMappingURL=App-dLXY5ei3.js.map
