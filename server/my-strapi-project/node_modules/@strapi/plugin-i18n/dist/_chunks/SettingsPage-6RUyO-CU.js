"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const designSystem = require("@strapi/design-system");
const helperPlugin = require("@strapi/helper-plugin");
const icons = require("@strapi/icons");
const reactIntl = require("react-intl");
const formik = require("formik");
const yup = require("yup");
const axios = require("axios");
const reactRedux = require("react-redux");
const index = require("./index-RIeoTSs3.js");
const reactQuery = require("react-query");
require("lodash/get");
require("styled-components");
require("react-router-dom");
require("@reduxjs/toolkit");
require("qs");
require("lodash/cloneDeep");
require("lodash/merge");
require("immer");
require("lodash/set");
require("lodash/omit");
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
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const useAddLocale = () => {
  const [isLoading, setLoading] = React__namespace.useState(false);
  const dispatch = reactRedux.useDispatch();
  const toggleNotification = helperPlugin.useNotification();
  const { post } = helperPlugin.useFetchClient();
  const { formatAPIError } = helperPlugin.useAPIErrorHandler();
  const persistLocale = async (locale) => {
    setLoading(true);
    try {
      const { data } = await post("/i18n/locales", locale);
      toggleNotification({
        type: "success",
        message: { id: index.getTranslation("Settings.locales.modal.create.success") }
      });
      dispatch({ type: index.ADD_LOCALE, newLocale: data });
    } catch (e) {
      if (e instanceof axios.AxiosError) {
        toggleNotification({
          type: "warning",
          message: formatAPIError(e)
        });
      } else {
        toggleNotification({
          type: "warning",
          message: { id: "notification.error" }
        });
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { isAdding: isLoading, addLocale: persistLocale };
};
const useDefaultLocales = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { notifyStatus } = designSystem.useNotifyAT();
  const toggleNotification = helperPlugin.useNotification();
  const { get } = helperPlugin.useFetchClient();
  const { isLoading, data } = reactQuery.useQuery(
    ["plugin-i18n", "locales"],
    async () => {
      const { data: data2 } = await get("/i18n/iso-locales");
      if (Array.isArray(data2)) {
        return data2;
      } else {
        throw new Error("The response is not an array.");
      }
    },
    {
      onSuccess() {
        notifyStatus(
          formatMessage({
            id: index.getTranslation("Settings.locales.modal.locales.loaded"),
            defaultMessage: "The locales have been successfully loaded."
          })
        );
      },
      onError() {
        toggleNotification({
          type: "warning",
          message: { id: "notification.error" }
        });
      },
      initialData: []
    }
  );
  return { defaultLocales: data, isLoading };
};
const LocaleSelect = ({ value, onClear, onLocaleChange, error }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { defaultLocales = [], isLoading } = useDefaultLocales();
  const { locales } = index.useLocales();
  const options = defaultLocales.map((locale) => ({
    label: locale.name,
    value: locale.code
  })).filter((opt) => {
    const foundLocale = locales.find(({ code }) => code === opt.value);
    return !foundLocale || foundLocale.code === value;
  });
  const computedValue = value || "";
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Combobox,
    {
      "aria-busy": isLoading,
      error,
      label: formatMessage({
        id: index.getTranslation("Settings.locales.modal.locales.label"),
        defaultMessage: "Locales"
      }),
      value: computedValue,
      onClear,
      onChange: (selectedLocaleKey) => {
        const selectedLocale = options.find((locale) => locale.value === selectedLocaleKey);
        if (selectedLocale) {
          onLocaleChange({ code: selectedLocale.value, name: selectedLocale.label });
        }
      },
      placeholder: formatMessage({
        id: "components.placeholder.select",
        defaultMessage: "Select"
      }),
      children: options.map((option) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.ComboboxOption, { value: option.value, children: option.label }, option.value))
    }
  );
};
const LOCALE_SCHEMA = yup__namespace.object().shape({
  code: yup__namespace.string().required(),
  name: yup__namespace.string().max(50, "Settings.locales.modal.locales.displayName.error").required(helperPlugin.translatedErrors.required),
  isDefault: yup__namespace.boolean()
});
const initialFormValues = {
  code: "",
  name: "",
  isDefault: false
};
const CreateModal = ({ onClose }) => {
  const { isAdding, addLocale } = useAddLocale();
  const { formatMessage } = reactIntl.useIntl();
  const { refetchPermissions } = helperPlugin.useRBACProvider();
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalLayout, { onClose, labelledBy: "add-locale-title", children: /* @__PURE__ */ jsxRuntime.jsx(
    formik.Formik,
    {
      initialValues: initialFormValues,
      onSubmit: async (values) => {
        await addLocale(values);
        await refetchPermissions();
      },
      validationSchema: LOCALE_SCHEMA,
      validateOnChange: false,
      children: /* @__PURE__ */ jsxRuntime.jsxs(helperPlugin.Form, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "add-locale-title", children: formatMessage({
          id: index.getTranslation("Settings.list.actions.add"),
          defaultMessage: "Add new locale"
        }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalBody, { children: /* @__PURE__ */ jsxRuntime.jsxs(
          designSystem.TabGroup,
          {
            label: formatMessage({
              id: index.getTranslation("Settings.locales.modal.title"),
              defaultMessage: "Configurations"
            }),
            id: "tabs",
            variant: "simple",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { as: "h2", variant: "beta", children: formatMessage({
                  id: index.getTranslation("Settings.locales.modal.title"),
                  defaultMessage: "Configurations"
                }) }),
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage({
                    id: index.getTranslation("Settings.locales.modal.base"),
                    defaultMessage: "Basic settings"
                  }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage({
                    id: index.getTranslation("Settings.locales.modal.advanced"),
                    defaultMessage: "Advanced settings"
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 7, paddingBottom: 7, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.TabPanels, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(BaseForm$1, {}) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(AdvancedForm, {}) })
              ] }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.ModalFooter,
          {
            startActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", onClick: onClose, children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
            endActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { type: "submit", startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Check, {}), disabled: isAdding, children: formatMessage({ id: "global.save", defaultMessage: "Save" }) })
          }
        )
      ] })
    }
  ) });
};
const BaseForm$1 = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { values, handleChange, setFieldValue, errors } = formik.useFormikContext();
  const handleLocaleChange = (nextLocale) => {
    setFieldValue("name", nextLocale.name);
    setFieldValue("code", nextLocale.code);
  };
  const handleClear = () => {
    setFieldValue("displayName", "");
    setFieldValue("code", "");
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid, { gap: 4, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
      LocaleSelect,
      {
        error: errors.code,
        value: values.code,
        onLocaleChange: handleLocaleChange,
        onClear: handleClear
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.TextInput,
      {
        name: "name",
        label: formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName"),
          defaultMessage: "Locale display name"
        }),
        hint: formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName.description"),
          defaultMessage: "Locale will be displayed under that name in the administration panel"
        }),
        error: errors.name ? formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName.error"),
          defaultMessage: "The locale display name can only be less than 50 characters."
        }) : void 0,
        value: values.name,
        onChange: handleChange
      }
    ) })
  ] });
};
const AdvancedForm = ({ isDefaultLocale }) => {
  const { values, setFieldValue } = formik.useFormikContext();
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsx(
    designSystem.Checkbox,
    {
      name: "isDefault",
      hint: formatMessage({
        id: index.getTranslation("Settings.locales.modal.advanced.setAsDefault.hint"),
        defaultMessage: "One default locale is required, change it by selecting another one"
      }),
      onChange: () => setFieldValue("isDefault", !values.isDefault),
      value: values.isDefault,
      disabled: isDefaultLocale,
      children: formatMessage({
        id: index.getTranslation("Settings.locales.modal.advanced.setAsDefault"),
        defaultMessage: "Set as default locale"
      })
    }
  );
};
const useDeleteLocale = () => {
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = index.useTypedDispatch();
  const toggleNotification = helperPlugin.useNotification();
  const { del } = helperPlugin.useFetchClient();
  const removeLocale = async (id) => {
    try {
      setLoading(true);
      await del(`/i18n/locales/${id}`);
      toggleNotification({
        type: "success",
        message: { id: index.getTranslation("Settings.locales.modal.delete.success") }
      });
      dispatch({ type: index.DELETE_LOCALE, id });
    } catch {
      toggleNotification({
        type: "warning",
        message: { id: "notification.error" }
      });
    } finally {
      setLoading(false);
    }
  };
  return { isDeleting: isLoading, deleteLocale: removeLocale };
};
const DeleteModal = ({ localeToDelete, onClose }) => {
  const { isDeleting, deleteLocale } = useDeleteLocale();
  const isOpened = Boolean(localeToDelete);
  const handleDelete = () => deleteLocale(localeToDelete.id).then(onClose);
  return /* @__PURE__ */ jsxRuntime.jsx(
    helperPlugin.ConfirmDialog,
    {
      isConfirmButtonLoading: isDeleting,
      onConfirm: handleDelete,
      onToggleDialog: onClose,
      isOpen: isOpened
    }
  );
};
const useEditLocale = () => {
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = index.useTypedDispatch();
  const toggleNotification = helperPlugin.useNotification();
  const { put } = helperPlugin.useFetchClient();
  const modifyLocale = async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await put(`/i18n/locales/${id}`, payload);
      if ("id" in data) {
        toggleNotification({
          type: "success",
          message: { id: index.getTranslation("Settings.locales.modal.edit.success") }
        });
        dispatch({ type: index.UPDATE_LOCALE, editedLocale: data });
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      toggleNotification({
        type: "warning",
        message: { id: "notification.error" }
      });
    } finally {
      setLoading(false);
    }
  };
  return { isEditing: isLoading, editLocale: modifyLocale };
};
const EditModal = ({ locale, onClose }) => {
  const { refetchPermissions } = helperPlugin.useRBACProvider();
  const { isEditing, editLocale } = useEditLocale();
  const { formatMessage } = reactIntl.useIntl();
  const handleSubmit = async ({ name, isDefault }) => {
    await editLocale(locale.id, { name, isDefault });
    await refetchPermissions();
  };
  return /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalLayout, { onClose, labelledBy: "edit-locale-title", children: /* @__PURE__ */ jsxRuntime.jsx(
    formik.Formik,
    {
      initialValues: {
        code: locale.code ?? "",
        name: locale.name ?? "",
        isDefault: Boolean(locale.isDefault)
      },
      onSubmit: handleSubmit,
      validationSchema: LOCALE_SCHEMA,
      children: /* @__PURE__ */ jsxRuntime.jsxs(helperPlugin.Form, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "edit-locale-title", children: formatMessage({
          id: index.getTranslation("Settings.list.actions.edit"),
          defaultMessage: "Edit a locale"
        }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(designSystem.ModalBody, { children: /* @__PURE__ */ jsxRuntime.jsxs(
          designSystem.TabGroup,
          {
            label: formatMessage({
              id: index.getTranslation("Settings.locales.modal.title"),
              defaultMessage: "Configurations"
            }),
            id: "tabs",
            variant: "simple",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { justifyContent: "space-between", children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { as: "h2", children: formatMessage({
                  id: index.getTranslation("Settings.locales.modal.title"),
                  defaultMessage: "Configurations"
                }) }),
                /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tabs, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage({
                    id: index.getTranslation("Settings.locales.modal.base"),
                    defaultMessage: "Basic settings"
                  }) }),
                  /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tab, { children: formatMessage({
                    id: index.getTranslation("Settings.locales.modal.advanced"),
                    defaultMessage: "Advanced settings"
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Divider, {}),
              /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { paddingTop: 7, paddingBottom: 7, children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.TabPanels, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(BaseForm, { locale }) }),
                /* @__PURE__ */ jsxRuntime.jsx(designSystem.TabPanel, { children: /* @__PURE__ */ jsxRuntime.jsx(AdvancedForm, { isDefaultLocale: Boolean(locale && locale.isDefault) }) })
              ] }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.ModalFooter,
          {
            startActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { variant: "tertiary", onClick: onClose, children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
            endActions: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Button, { type: "submit", startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Check, {}), disabled: isEditing, children: formatMessage({ id: "global.save", defaultMessage: "Save" }) })
          }
        )
      ] })
    }
  ) });
};
const BaseForm = ({ locale }) => {
  const { formatMessage } = reactIntl.useIntl();
  const { values, handleChange, errors } = formik.useFormikContext();
  const { defaultLocales = [] } = useDefaultLocales();
  const localeDetails = defaultLocales.find((row) => row.code === locale.code);
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Grid, { gap: 4, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.SingleSelect,
      {
        label: formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.label"),
          defaultMessage: "Locales"
        }),
        value: localeDetails?.code || locale.code,
        disabled: true,
        children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value: localeDetails?.code || locale.code, children: localeDetails?.name || locale.code })
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.GridItem, { col: 6, children: /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.TextInput,
      {
        name: "name",
        label: formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName"),
          defaultMessage: "Locale display name"
        }),
        hint: formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName.description"),
          defaultMessage: "Locale will be displayed under that name in the administration panel"
        }),
        error: errors.name ? formatMessage({
          id: index.getTranslation("Settings.locales.modal.locales.displayName.error"),
          defaultMessage: "The locale display name can only be less than 50 characters."
        }) : void 0,
        value: values.name,
        onChange: handleChange
      }
    ) })
  ] });
};
const LocaleTable = ({
  locales = [],
  onDeleteLocale,
  onEditLocale,
  canDelete = true,
  canEdit = true
}) => {
  const { formatMessage } = reactIntl.useIntl();
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Table, { colCount: 4, rowCount: locales.length + 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Thead, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Tr, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: index.getTranslation("Settings.locales.row.id"),
        defaultMessage: "ID"
      }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: index.getTranslation("Settings.locales.row.displayName"),
        defaultMessage: "Display name"
      }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: index.getTranslation("Settings.locales.row.default-locale"),
        defaultMessage: "Default locale"
      }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(designSystem.Th, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.VisuallyHidden, { children: "Actions" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Tbody, { children: locales.map((locale) => /* @__PURE__ */ jsxRuntime.jsxs(
      designSystem.Tr,
      {
        ...helperPlugin.onRowClick({
          fn: () => onEditLocale(locale),
          condition: Boolean(onEditLocale)
        }),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: locale.id }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: locale.name }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsx(designSystem.Typography, { textColor: "neutral800", children: locale.isDefault ? formatMessage({
            id: index.getTranslation("Settings.locales.default"),
            defaultMessage: "Default"
          }) : null }) }),
          /* @__PURE__ */ jsxRuntime.jsx(designSystem.Td, { children: /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Flex, { gap: 1, justifyContent: "flex-end", onClick: (e) => e.stopPropagation(), children: [
            canEdit && /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.IconButton,
              {
                onClick: () => onEditLocale(locale),
                label: formatMessage({
                  id: index.getTranslation("Settings.list.actions.edit"),
                  defaultMessage: "Edit"
                }),
                icon: /* @__PURE__ */ jsxRuntime.jsx(icons.Pencil, {}),
                borderWidth: 0
              }
            ),
            canDelete && !locale.isDefault && /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.IconButton,
              {
                onClick: () => onDeleteLocale(locale),
                label: formatMessage({
                  id: index.getTranslation("Settings.list.actions.delete"),
                  defaultMessage: "Delete"
                }),
                icon: /* @__PURE__ */ jsxRuntime.jsx(icons.Trash, {}),
                borderWidth: 0
              }
            )
          ] }) })
        ]
      },
      locale.id
    )) })
  ] });
};
const SettingsPage = () => {
  const [isOpenedCreateModal, setIsOpenedCreateModal] = React__namespace.useState(false);
  const [localeToDelete, setLocaleToDelete] = React__namespace.useState();
  const [localeToEdit, setLocaleToEdit] = React__namespace.useState();
  const { locales } = index.useLocales();
  const { formatMessage } = reactIntl.useIntl();
  const {
    isLoading,
    allowedActions: { canUpdate, canCreate, canDelete }
  } = helperPlugin.useRBAC(index.PERMISSIONS);
  const handleToggleModalCreate = () => {
    setIsOpenedCreateModal((s) => !s);
  };
  helperPlugin.useFocusWhenNavigate();
  const closeModalToDelete = () => setLocaleToDelete(void 0);
  const handleDeleteLocale = (locale) => {
    setLocaleToDelete(locale);
  };
  const closeModalToEdit = () => setLocaleToEdit(void 0);
  const handleEditLocale = (locale) => {
    setLocaleToEdit(locale);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.LoadingIndicatorPage, {});
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(designSystem.Main, { tabIndex: -1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.HeaderLayout,
      {
        primaryAction: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            disabled: !canCreate,
            startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
            onClick: handleToggleModalCreate,
            size: "S",
            children: formatMessage({
              id: index.getTranslation("Settings.list.actions.add"),
              defaultMessage: "Add new locale"
            })
          }
        ),
        title: formatMessage({
          id: index.getTranslation("plugin.name"),
          defaultMessage: "Internationalization"
        }),
        subtitle: formatMessage({
          id: index.getTranslation("Settings.list.description"),
          defaultMessage: "Configure the settings"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.ContentLayout, { children: locales?.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx(
      LocaleTable,
      {
        locales,
        canDelete,
        canEdit: canUpdate,
        onDeleteLocale: handleDeleteLocale,
        onEditLocale: handleEditLocale
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx(
      designSystem.EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(icons.EmptyDocuments, { width: void 0, height: void 0 }),
        content: formatMessage({
          id: index.getTranslation("Settings.list.empty.title"),
          defaultMessage: "There are no locales"
        }),
        action: /* @__PURE__ */ jsxRuntime.jsx(
          designSystem.Button,
          {
            disabled: !canCreate,
            variant: "secondary",
            startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Plus, {}),
            onClick: handleToggleModalCreate,
            children: formatMessage({
              id: index.getTranslation("Settings.list.actions.add"),
              defaultMessage: "Add new locale"
            })
          }
        )
      }
    ) }),
    isOpenedCreateModal && /* @__PURE__ */ jsxRuntime.jsx(CreateModal, { onClose: handleToggleModalCreate }),
    localeToEdit && /* @__PURE__ */ jsxRuntime.jsx(EditModal, { onClose: closeModalToEdit, locale: localeToEdit }),
    localeToDelete && /* @__PURE__ */ jsxRuntime.jsx(DeleteModal, { localeToDelete, onClose: closeModalToDelete })
  ] });
};
const ProtectedSettingsPage = () => {
  return /* @__PURE__ */ jsxRuntime.jsx(helperPlugin.CheckPagePermissions, { permissions: index.PERMISSIONS.read, children: /* @__PURE__ */ jsxRuntime.jsx(SettingsPage, {}) });
};
exports.ProtectedSettingsPage = ProtectedSettingsPage;
exports.SettingsPage = SettingsPage;
//# sourceMappingURL=SettingsPage-6RUyO-CU.js.map
