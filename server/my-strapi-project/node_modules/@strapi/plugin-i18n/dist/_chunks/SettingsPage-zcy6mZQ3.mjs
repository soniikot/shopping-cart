import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { useNotifyAT, Combobox, ComboboxOption, ModalLayout, ModalHeader, Typography, ModalBody, TabGroup, Flex, Tabs, Tab, Divider, Box, TabPanels, TabPanel, ModalFooter, Button, Grid, GridItem, TextInput, Checkbox, SingleSelect, SingleSelectOption, Table, Thead, Tr, Th, VisuallyHidden, Tbody, Td, IconButton, Main, HeaderLayout, ContentLayout, EmptyStateLayout } from "@strapi/design-system";
import { useNotification, useFetchClient, useAPIErrorHandler, translatedErrors, useRBACProvider, Form, ConfirmDialog, onRowClick, CheckPagePermissions, useRBAC, useFocusWhenNavigate, LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Check, Pencil, Trash, Plus, EmptyDocuments } from "@strapi/icons";
import { useIntl } from "react-intl";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { g as getTranslation, A as ADD_LOCALE, u as useLocales, a as useTypedDispatch, D as DELETE_LOCALE, U as UPDATE_LOCALE, P as PERMISSIONS } from "./index-8NIAyUxX.mjs";
import { useQuery } from "react-query";
import "lodash/get";
import "styled-components";
import "react-router-dom";
import "@reduxjs/toolkit";
import "qs";
import "lodash/cloneDeep";
import "lodash/merge";
import "immer";
import "lodash/set";
import "lodash/omit";
const useAddLocale = () => {
  const [isLoading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const { post } = useFetchClient();
  const { formatAPIError } = useAPIErrorHandler();
  const persistLocale = async (locale) => {
    setLoading(true);
    try {
      const { data } = await post("/i18n/locales", locale);
      toggleNotification({
        type: "success",
        message: { id: getTranslation("Settings.locales.modal.create.success") }
      });
      dispatch({ type: ADD_LOCALE, newLocale: data });
    } catch (e) {
      if (e instanceof AxiosError) {
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
  const { formatMessage } = useIntl();
  const { notifyStatus } = useNotifyAT();
  const toggleNotification = useNotification();
  const { get } = useFetchClient();
  const { isLoading, data } = useQuery(
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
            id: getTranslation("Settings.locales.modal.locales.loaded"),
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
  const { formatMessage } = useIntl();
  const { defaultLocales = [], isLoading } = useDefaultLocales();
  const { locales } = useLocales();
  const options = defaultLocales.map((locale) => ({
    label: locale.name,
    value: locale.code
  })).filter((opt) => {
    const foundLocale = locales.find(({ code }) => code === opt.value);
    return !foundLocale || foundLocale.code === value;
  });
  const computedValue = value || "";
  return /* @__PURE__ */ jsx(
    Combobox,
    {
      "aria-busy": isLoading,
      error,
      label: formatMessage({
        id: getTranslation("Settings.locales.modal.locales.label"),
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
      children: options.map((option) => /* @__PURE__ */ jsx(ComboboxOption, { value: option.value, children: option.label }, option.value))
    }
  );
};
const LOCALE_SCHEMA = yup.object().shape({
  code: yup.string().required(),
  name: yup.string().max(50, "Settings.locales.modal.locales.displayName.error").required(translatedErrors.required),
  isDefault: yup.boolean()
});
const initialFormValues = {
  code: "",
  name: "",
  isDefault: false
};
const CreateModal = ({ onClose }) => {
  const { isAdding, addLocale } = useAddLocale();
  const { formatMessage } = useIntl();
  const { refetchPermissions } = useRBACProvider();
  return /* @__PURE__ */ jsx(ModalLayout, { onClose, labelledBy: "add-locale-title", children: /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues: initialFormValues,
      onSubmit: async (values) => {
        await addLocale(values);
        await refetchPermissions();
      },
      validationSchema: LOCALE_SCHEMA,
      validateOnChange: false,
      children: /* @__PURE__ */ jsxs(Form, { children: [
        /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "add-locale-title", children: formatMessage({
          id: getTranslation("Settings.list.actions.add"),
          defaultMessage: "Add new locale"
        }) }) }),
        /* @__PURE__ */ jsx(ModalBody, { children: /* @__PURE__ */ jsxs(
          TabGroup,
          {
            label: formatMessage({
              id: getTranslation("Settings.locales.modal.title"),
              defaultMessage: "Configurations"
            }),
            id: "tabs",
            variant: "simple",
            children: [
              /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", children: [
                /* @__PURE__ */ jsx(Typography, { as: "h2", variant: "beta", children: formatMessage({
                  id: getTranslation("Settings.locales.modal.title"),
                  defaultMessage: "Configurations"
                }) }),
                /* @__PURE__ */ jsxs(Tabs, { children: [
                  /* @__PURE__ */ jsx(Tab, { children: formatMessage({
                    id: getTranslation("Settings.locales.modal.base"),
                    defaultMessage: "Basic settings"
                  }) }),
                  /* @__PURE__ */ jsx(Tab, { children: formatMessage({
                    id: getTranslation("Settings.locales.modal.advanced"),
                    defaultMessage: "Advanced settings"
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Divider, {}),
              /* @__PURE__ */ jsx(Box, { paddingTop: 7, paddingBottom: 7, children: /* @__PURE__ */ jsxs(TabPanels, { children: [
                /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(BaseForm$1, {}) }),
                /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(AdvancedForm, {}) })
              ] }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          ModalFooter,
          {
            startActions: /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: onClose, children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
            endActions: /* @__PURE__ */ jsx(Button, { type: "submit", startIcon: /* @__PURE__ */ jsx(Check, {}), disabled: isAdding, children: formatMessage({ id: "global.save", defaultMessage: "Save" }) })
          }
        )
      ] })
    }
  ) });
};
const BaseForm$1 = () => {
  const { formatMessage } = useIntl();
  const { values, handleChange, setFieldValue, errors } = useFormikContext();
  const handleLocaleChange = (nextLocale) => {
    setFieldValue("name", nextLocale.name);
    setFieldValue("code", nextLocale.code);
  };
  const handleClear = () => {
    setFieldValue("displayName", "");
    setFieldValue("code", "");
  };
  return /* @__PURE__ */ jsxs(Grid, { gap: 4, children: [
    /* @__PURE__ */ jsx(GridItem, { col: 6, children: /* @__PURE__ */ jsx(
      LocaleSelect,
      {
        error: errors.code,
        value: values.code,
        onLocaleChange: handleLocaleChange,
        onClear: handleClear
      }
    ) }),
    /* @__PURE__ */ jsx(GridItem, { col: 6, children: /* @__PURE__ */ jsx(
      TextInput,
      {
        name: "name",
        label: formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName"),
          defaultMessage: "Locale display name"
        }),
        hint: formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName.description"),
          defaultMessage: "Locale will be displayed under that name in the administration panel"
        }),
        error: errors.name ? formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName.error"),
          defaultMessage: "The locale display name can only be less than 50 characters."
        }) : void 0,
        value: values.name,
        onChange: handleChange
      }
    ) })
  ] });
};
const AdvancedForm = ({ isDefaultLocale }) => {
  const { values, setFieldValue } = useFormikContext();
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsx(
    Checkbox,
    {
      name: "isDefault",
      hint: formatMessage({
        id: getTranslation("Settings.locales.modal.advanced.setAsDefault.hint"),
        defaultMessage: "One default locale is required, change it by selecting another one"
      }),
      onChange: () => setFieldValue("isDefault", !values.isDefault),
      value: values.isDefault,
      disabled: isDefaultLocale,
      children: formatMessage({
        id: getTranslation("Settings.locales.modal.advanced.setAsDefault"),
        defaultMessage: "Set as default locale"
      })
    }
  );
};
const useDeleteLocale = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useTypedDispatch();
  const toggleNotification = useNotification();
  const { del } = useFetchClient();
  const removeLocale = async (id) => {
    try {
      setLoading(true);
      await del(`/i18n/locales/${id}`);
      toggleNotification({
        type: "success",
        message: { id: getTranslation("Settings.locales.modal.delete.success") }
      });
      dispatch({ type: DELETE_LOCALE, id });
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
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isConfirmButtonLoading: isDeleting,
      onConfirm: handleDelete,
      onToggleDialog: onClose,
      isOpen: isOpened
    }
  );
};
const useEditLocale = () => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useTypedDispatch();
  const toggleNotification = useNotification();
  const { put } = useFetchClient();
  const modifyLocale = async (id, payload) => {
    try {
      setLoading(true);
      const { data } = await put(`/i18n/locales/${id}`, payload);
      if ("id" in data) {
        toggleNotification({
          type: "success",
          message: { id: getTranslation("Settings.locales.modal.edit.success") }
        });
        dispatch({ type: UPDATE_LOCALE, editedLocale: data });
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
  const { refetchPermissions } = useRBACProvider();
  const { isEditing, editLocale } = useEditLocale();
  const { formatMessage } = useIntl();
  const handleSubmit = async ({ name, isDefault }) => {
    await editLocale(locale.id, { name, isDefault });
    await refetchPermissions();
  };
  return /* @__PURE__ */ jsx(ModalLayout, { onClose, labelledBy: "edit-locale-title", children: /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues: {
        code: locale.code ?? "",
        name: locale.name ?? "",
        isDefault: Boolean(locale.isDefault)
      },
      onSubmit: handleSubmit,
      validationSchema: LOCALE_SCHEMA,
      children: /* @__PURE__ */ jsxs(Form, { children: [
        /* @__PURE__ */ jsx(ModalHeader, { children: /* @__PURE__ */ jsx(Typography, { fontWeight: "bold", textColor: "neutral800", as: "h2", id: "edit-locale-title", children: formatMessage({
          id: getTranslation("Settings.list.actions.edit"),
          defaultMessage: "Edit a locale"
        }) }) }),
        /* @__PURE__ */ jsx(ModalBody, { children: /* @__PURE__ */ jsxs(
          TabGroup,
          {
            label: formatMessage({
              id: getTranslation("Settings.locales.modal.title"),
              defaultMessage: "Configurations"
            }),
            id: "tabs",
            variant: "simple",
            children: [
              /* @__PURE__ */ jsxs(Flex, { justifyContent: "space-between", children: [
                /* @__PURE__ */ jsx(Typography, { as: "h2", children: formatMessage({
                  id: getTranslation("Settings.locales.modal.title"),
                  defaultMessage: "Configurations"
                }) }),
                /* @__PURE__ */ jsxs(Tabs, { children: [
                  /* @__PURE__ */ jsx(Tab, { children: formatMessage({
                    id: getTranslation("Settings.locales.modal.base"),
                    defaultMessage: "Basic settings"
                  }) }),
                  /* @__PURE__ */ jsx(Tab, { children: formatMessage({
                    id: getTranslation("Settings.locales.modal.advanced"),
                    defaultMessage: "Advanced settings"
                  }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Divider, {}),
              /* @__PURE__ */ jsx(Box, { paddingTop: 7, paddingBottom: 7, children: /* @__PURE__ */ jsxs(TabPanels, { children: [
                /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(BaseForm, { locale }) }),
                /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(AdvancedForm, { isDefaultLocale: Boolean(locale && locale.isDefault) }) })
              ] }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          ModalFooter,
          {
            startActions: /* @__PURE__ */ jsx(Button, { variant: "tertiary", onClick: onClose, children: formatMessage({ id: "app.components.Button.cancel", defaultMessage: "Cancel" }) }),
            endActions: /* @__PURE__ */ jsx(Button, { type: "submit", startIcon: /* @__PURE__ */ jsx(Check, {}), disabled: isEditing, children: formatMessage({ id: "global.save", defaultMessage: "Save" }) })
          }
        )
      ] })
    }
  ) });
};
const BaseForm = ({ locale }) => {
  const { formatMessage } = useIntl();
  const { values, handleChange, errors } = useFormikContext();
  const { defaultLocales = [] } = useDefaultLocales();
  const localeDetails = defaultLocales.find((row) => row.code === locale.code);
  return /* @__PURE__ */ jsxs(Grid, { gap: 4, children: [
    /* @__PURE__ */ jsx(GridItem, { col: 6, children: /* @__PURE__ */ jsx(
      SingleSelect,
      {
        label: formatMessage({
          id: getTranslation("Settings.locales.modal.locales.label"),
          defaultMessage: "Locales"
        }),
        value: localeDetails?.code || locale.code,
        disabled: true,
        children: /* @__PURE__ */ jsx(SingleSelectOption, { value: localeDetails?.code || locale.code, children: localeDetails?.name || locale.code })
      }
    ) }),
    /* @__PURE__ */ jsx(GridItem, { col: 6, children: /* @__PURE__ */ jsx(
      TextInput,
      {
        name: "name",
        label: formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName"),
          defaultMessage: "Locale display name"
        }),
        hint: formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName.description"),
          defaultMessage: "Locale will be displayed under that name in the administration panel"
        }),
        error: errors.name ? formatMessage({
          id: getTranslation("Settings.locales.modal.locales.displayName.error"),
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
  const { formatMessage } = useIntl();
  return /* @__PURE__ */ jsxs(Table, { colCount: 4, rowCount: locales.length + 1, children: [
    /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: getTranslation("Settings.locales.row.id"),
        defaultMessage: "ID"
      }) }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: getTranslation("Settings.locales.row.displayName"),
        defaultMessage: "Display name"
      }) }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", textColor: "neutral600", children: formatMessage({
        id: getTranslation("Settings.locales.row.default-locale"),
        defaultMessage: "Default locale"
      }) }) }),
      /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(VisuallyHidden, { children: "Actions" }) })
    ] }) }),
    /* @__PURE__ */ jsx(Tbody, { children: locales.map((locale) => /* @__PURE__ */ jsxs(
      Tr,
      {
        ...onRowClick({
          fn: () => onEditLocale(locale),
          condition: Boolean(onEditLocale)
        }),
        children: [
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: locale.id }) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: locale.name }) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: locale.isDefault ? formatMessage({
            id: getTranslation("Settings.locales.default"),
            defaultMessage: "Default"
          }) : null }) }),
          /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, { gap: 1, justifyContent: "flex-end", onClick: (e) => e.stopPropagation(), children: [
            canEdit && /* @__PURE__ */ jsx(
              IconButton,
              {
                onClick: () => onEditLocale(locale),
                label: formatMessage({
                  id: getTranslation("Settings.list.actions.edit"),
                  defaultMessage: "Edit"
                }),
                icon: /* @__PURE__ */ jsx(Pencil, {}),
                borderWidth: 0
              }
            ),
            canDelete && !locale.isDefault && /* @__PURE__ */ jsx(
              IconButton,
              {
                onClick: () => onDeleteLocale(locale),
                label: formatMessage({
                  id: getTranslation("Settings.list.actions.delete"),
                  defaultMessage: "Delete"
                }),
                icon: /* @__PURE__ */ jsx(Trash, {}),
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
  const [isOpenedCreateModal, setIsOpenedCreateModal] = React.useState(false);
  const [localeToDelete, setLocaleToDelete] = React.useState();
  const [localeToEdit, setLocaleToEdit] = React.useState();
  const { locales } = useLocales();
  const { formatMessage } = useIntl();
  const {
    isLoading,
    allowedActions: { canUpdate, canCreate, canDelete }
  } = useRBAC(PERMISSIONS);
  const handleToggleModalCreate = () => {
    setIsOpenedCreateModal((s) => !s);
  };
  useFocusWhenNavigate();
  const closeModalToDelete = () => setLocaleToDelete(void 0);
  const handleDeleteLocale = (locale) => {
    setLocaleToDelete(locale);
  };
  const closeModalToEdit = () => setLocaleToEdit(void 0);
  const handleEditLocale = (locale) => {
    setLocaleToEdit(locale);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(LoadingIndicatorPage, {});
  }
  return /* @__PURE__ */ jsxs(Main, { tabIndex: -1, children: [
    /* @__PURE__ */ jsx(
      HeaderLayout,
      {
        primaryAction: /* @__PURE__ */ jsx(
          Button,
          {
            disabled: !canCreate,
            startIcon: /* @__PURE__ */ jsx(Plus, {}),
            onClick: handleToggleModalCreate,
            size: "S",
            children: formatMessage({
              id: getTranslation("Settings.list.actions.add"),
              defaultMessage: "Add new locale"
            })
          }
        ),
        title: formatMessage({
          id: getTranslation("plugin.name"),
          defaultMessage: "Internationalization"
        }),
        subtitle: formatMessage({
          id: getTranslation("Settings.list.description"),
          defaultMessage: "Configure the settings"
        })
      }
    ),
    /* @__PURE__ */ jsx(ContentLayout, { children: locales?.length > 0 ? /* @__PURE__ */ jsx(
      LocaleTable,
      {
        locales,
        canDelete,
        canEdit: canUpdate,
        onDeleteLocale: handleDeleteLocale,
        onEditLocale: handleEditLocale
      }
    ) : /* @__PURE__ */ jsx(
      EmptyStateLayout,
      {
        icon: /* @__PURE__ */ jsx(EmptyDocuments, { width: void 0, height: void 0 }),
        content: formatMessage({
          id: getTranslation("Settings.list.empty.title"),
          defaultMessage: "There are no locales"
        }),
        action: /* @__PURE__ */ jsx(
          Button,
          {
            disabled: !canCreate,
            variant: "secondary",
            startIcon: /* @__PURE__ */ jsx(Plus, {}),
            onClick: handleToggleModalCreate,
            children: formatMessage({
              id: getTranslation("Settings.list.actions.add"),
              defaultMessage: "Add new locale"
            })
          }
        )
      }
    ) }),
    isOpenedCreateModal && /* @__PURE__ */ jsx(CreateModal, { onClose: handleToggleModalCreate }),
    localeToEdit && /* @__PURE__ */ jsx(EditModal, { onClose: closeModalToEdit, locale: localeToEdit }),
    localeToDelete && /* @__PURE__ */ jsx(DeleteModal, { localeToDelete, onClose: closeModalToDelete })
  ] });
};
const ProtectedSettingsPage = () => {
  return /* @__PURE__ */ jsx(CheckPagePermissions, { permissions: PERMISSIONS.read, children: /* @__PURE__ */ jsx(SettingsPage, {}) });
};
export {
  ProtectedSettingsPage,
  SettingsPage
};
//# sourceMappingURL=SettingsPage-zcy6mZQ3.mjs.map
