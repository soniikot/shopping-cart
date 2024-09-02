import _ from "lodash";
import { get, identity, propEq, prop, merge, isArray, getOr, isEmpty, reduce, isNil, has, omit, map, toPath, keys, pick, pipe, difference, cloneDeep, flatten, uniq } from "lodash/fp";
import * as utils from "@strapi/utils";
import utils__default, { errors, mapAsync, convertQueryParams, contentTypes as contentTypes$3, yup, validateYupSchema } from "@strapi/utils";
const getCoreStore = () => {
  return strapi.store({ type: "plugin", name: "i18n" });
};
const getService = (name) => {
  return strapi.plugin("i18n").service(name);
};
const registerModelsHooks = () => {
  const i18nModelUIDs = Object.values(strapi.contentTypes).filter((contentType) => getService("content-types").isLocalizedContentType(contentType)).map((contentType) => contentType.uid);
  if (i18nModelUIDs.length > 0) {
    strapi.db.lifecycles.subscribe({
      models: i18nModelUIDs,
      async beforeCreate(event) {
        await getService("localizations").assignDefaultLocaleToEntries(event.params.data);
      },
      async beforeCreateMany(event) {
        await getService("localizations").assignDefaultLocaleToEntries(event.params.data);
      }
    });
  }
  strapi.db.lifecycles.subscribe({
    models: ["plugin::i18n.locale"],
    async afterCreate() {
      await getService("permissions").actions.syncSuperAdminPermissionsWithLocales();
    },
    async afterDelete() {
      await getService("permissions").actions.syncSuperAdminPermissionsWithLocales();
    }
  });
};
const bootstrap = async ({ strapi: strapi2 }) => {
  const { sendDidInitializeEvent: sendDidInitializeEvent2 } = getService("metrics");
  const { decorator: decorator2 } = getService("entity-service-decorator");
  const { initDefaultLocale: initDefaultLocale2 } = getService("locales");
  const { sectionsBuilder, actions: actions2, engine } = getService("permissions");
  strapi2.entityService.decorate(decorator2);
  await initDefaultLocale2();
  sectionsBuilder.registerLocalesPropertyHandler();
  await actions2.registerI18nActions();
  actions2.registerI18nActionsHooks();
  actions2.updateActionsProperties();
  engine.registerI18nPermissionsHandlers();
  registerModelsHooks();
  sendDidInitializeEvent2();
};
const { ApplicationError: ApplicationError$5 } = errors;
const validateLocaleCreation = async (ctx, next) => {
  const { model } = ctx.params;
  const { query, body } = ctx.request;
  const {
    getValidLocale: getValidLocale2,
    getNewLocalizationsFrom: getNewLocalizationsFrom2,
    isLocalizedContentType: isLocalizedContentType2,
    getAndValidateRelatedEntity: getAndValidateRelatedEntity2,
    fillNonLocalizedAttributes: fillNonLocalizedAttributes2
  } = getService("content-types");
  const modelDef = strapi.getModel(model);
  if (!isLocalizedContentType2(modelDef)) {
    return next();
  }
  const locale2 = get("locale", query);
  const relatedEntityId = get("relatedEntityId", query);
  ctx.request.query = {};
  let entityLocale;
  try {
    entityLocale = await getValidLocale2(locale2);
  } catch (e) {
    throw new ApplicationError$5("This locale doesn't exist");
  }
  body.locale = entityLocale;
  if (modelDef.kind === "singleType") {
    const entity = await strapi.entityService.findMany(modelDef.uid, {
      locale: entityLocale
    });
    ctx.request.query.locale = body.locale;
    if (entity) {
      return next();
    }
  }
  let relatedEntity;
  try {
    relatedEntity = await getAndValidateRelatedEntity2(relatedEntityId, model, entityLocale);
  } catch (e) {
    throw new ApplicationError$5(
      "The related entity doesn't exist or the entity already exists in this locale"
    );
  }
  fillNonLocalizedAttributes2(body, relatedEntity, { model });
  const localizations2 = await getNewLocalizationsFrom2(relatedEntity);
  body.localizations = localizations2;
  return next();
};
const { ValidationError } = errors;
const LOCALE_SCALAR_TYPENAME = "I18NLocaleCode";
const LOCALE_ARG_PLUGIN_NAME = "I18NLocaleArg";
const getLocalizedTypesFromRegistry = ({ strapi: strapi2, typeRegistry }) => {
  const { KINDS } = strapi2.plugin("graphql").service("constants");
  const { isLocalizedContentType: isLocalizedContentType2 } = strapi2.plugin("i18n").service("content-types");
  return typeRegistry.where(
    ({ config }) => config.kind === KINDS.type && isLocalizedContentType2(config.contentType)
  );
};
const graphqlProvider = ({ strapi: strapi2 }) => ({
  register() {
    const { service: getGraphQLService } = strapi2.plugin("graphql");
    const { service: getI18NService } = strapi2.plugin("i18n");
    const { isLocalizedContentType: isLocalizedContentType2 } = getI18NService("content-types");
    const extensionService = getGraphQLService("extension");
    const getCreateLocalizationMutationType = (contentType) => {
      const { getTypeName } = getGraphQLService("utils").naming;
      return `create${getTypeName(contentType)}Localization`;
    };
    extensionService.shadowCRUD("plugin::i18n.locale").disableMutations();
    Object.entries(strapi2.contentTypes).forEach(([uid, ct]) => {
      if (isLocalizedContentType2(ct)) {
        extensionService.shadowCRUD(uid).field("locale").disableInput();
        extensionService.shadowCRUD(uid).field("localizations").disableInput();
      }
    });
    extensionService.use(({ nexus, typeRegistry }) => {
      const i18nLocaleArgPlugin = getI18nLocaleArgPlugin({ nexus, typeRegistry });
      const i18nLocaleScalar = getLocaleScalar({ nexus });
      const {
        mutations: createLocalizationMutations,
        resolversConfig: createLocalizationResolversConfig
      } = getCreateLocalizationMutations({ nexus, typeRegistry });
      return {
        plugins: [i18nLocaleArgPlugin],
        types: [i18nLocaleScalar, createLocalizationMutations],
        resolversConfig: {
          // Auth for createLocalization mutations
          ...createLocalizationResolversConfig,
          // locale arg transformation for localized createEntity mutations
          ...getLocalizedCreateMutationsResolversConfigs({ typeRegistry }),
          // Modify the default scope associated to find and findOne locale queries to match the actual action name
          "Query.i18NLocale": { auth: { scope: "plugin::i18n.locales.listLocales" } },
          "Query.i18NLocales": { auth: { scope: "plugin::i18n.locales.listLocales" } }
        }
      };
    });
    const getLocaleScalar = ({ nexus }) => {
      const locales2 = getI18NService("iso-locales").getIsoLocales();
      return nexus.scalarType({
        name: LOCALE_SCALAR_TYPENAME,
        description: "A string used to identify an i18n locale",
        serialize: identity,
        parseValue: identity,
        parseLiteral(ast) {
          if (ast.kind !== "StringValue") {
            throw new ValidationError("Locale cannot represent non string type");
          }
          const isValidLocale = ast.value === "all" || locales2.find(propEq("code", ast.value));
          if (!isValidLocale) {
            throw new ValidationError("Unknown locale supplied");
          }
          return ast.value;
        }
      });
    };
    const getCreateLocalizationMutations = ({ nexus, typeRegistry }) => {
      const localizedContentTypes = getLocalizedTypesFromRegistry({ strapi: strapi2, typeRegistry }).map(
        prop("config.contentType")
      );
      const createLocalizationComponents = localizedContentTypes.map(
        (ct) => getCreateLocalizationComponents(ct, { nexus })
      );
      const resolversConfig = createLocalizationComponents.map(prop("resolverConfig")).reduce(merge, {});
      const mutations = createLocalizationComponents.map(prop("mutation"));
      return { mutations, resolversConfig };
    };
    const getCreateLocalizationComponents = (contentType, { nexus }) => {
      const { getEntityResponseName, getContentTypeInputName } = getGraphQLService("utils").naming;
      const { createCreateLocalizationHandler: createCreateLocalizationHandler2 } = getI18NService("core-api");
      const responseType = getEntityResponseName(contentType);
      const mutationName = getCreateLocalizationMutationType(contentType);
      const resolverHandler = createCreateLocalizationHandler2(contentType);
      const mutation = nexus.extendType({
        type: "Mutation",
        definition(t) {
          t.field(mutationName, {
            type: responseType,
            // The locale arg will be automatically added through the i18n graphql extension
            args: {
              id: "ID",
              data: getContentTypeInputName(contentType)
            },
            async resolve(parent, args) {
              const { id, locale: locale2, data } = args;
              const ctx = {
                id,
                data: { ...data, locale: locale2 }
              };
              const value = await resolverHandler(ctx);
              return { value, info: { args, resourceUID: contentType.uid } };
            }
          });
        }
      });
      const resolverConfig = {
        [`Mutation.${mutationName}`]: {
          auth: {
            scope: [`${contentType.uid}.createLocalization`]
          }
        }
      };
      return { mutation, resolverConfig };
    };
    const getLocalizedCreateMutationsResolversConfigs = ({ typeRegistry }) => {
      const localizedCreateMutationsNames = getLocalizedTypesFromRegistry({
        strapi: strapi2,
        typeRegistry
      }).map(prop("config.contentType")).map(getGraphQLService("utils").naming.getCreateMutationTypeName);
      return localizedCreateMutationsNames.reduce(
        (acc, mutationName) => ({
          ...acc,
          [`Mutation.${mutationName}`]: {
            middlewares: [
              // Set data's locale using args' locale
              (resolve, parent, args, context, info2) => {
                args.data.locale = args.locale;
                return resolve(parent, args, context, info2);
              }
            ]
          }
        }),
        {}
      );
    };
    const getI18nLocaleArgPlugin = ({ nexus, typeRegistry }) => {
      const { isLocalizedContentType: isLocalizedContentType22 } = getI18NService("content-types");
      const addLocaleArg = (config) => {
        const { parentType } = config;
        if (parentType !== "Query" && parentType !== "Mutation") {
          return;
        }
        const registryType = typeRegistry.get(config.type);
        if (!registryType) {
          return;
        }
        const { contentType } = registryType.config;
        if (!isLocalizedContentType22(contentType)) {
          return;
        }
        config.args.locale = nexus.arg({ type: LOCALE_SCALAR_TYPENAME });
      };
      return nexus.plugin({
        name: LOCALE_ARG_PLUGIN_NAME,
        onAddOutputField(config) {
          addLocaleArg(config);
        }
      });
    };
  }
});
const isoLocales = [
  {
    code: "af",
    name: "Afrikaans (af)"
  },
  {
    code: "af-NA",
    name: "Afrikaans (Namibia) (af-NA)"
  },
  {
    code: "af-ZA",
    name: "Afrikaans (South Africa) (af-ZA)"
  },
  {
    code: "agq",
    name: "Aghem (agq)"
  },
  {
    code: "agq-CM",
    name: "Aghem (Cameroon) (agq-CM)"
  },
  {
    code: "ak",
    name: "Akan (ak)"
  },
  {
    code: "ak-GH",
    name: "Akan (Ghana) (ak-GH)"
  },
  {
    code: "sq",
    name: "Albanian (sq)"
  },
  {
    code: "sq-AL",
    name: "Albanian (Albania) (sq-AL)"
  },
  {
    code: "am",
    name: "Amharic (am)"
  },
  {
    code: "am-ET",
    name: "Amharic (Ethiopia) (am-ET)"
  },
  {
    code: "aig",
    name: "Antigua and Barbuda Creole English"
  },
  {
    code: "ar",
    name: "Arabic (ar)"
  },
  {
    code: "ar-DZ",
    name: "Arabic (Algeria) (ar-DZ)"
  },
  {
    code: "ar-BH",
    name: "Arabic (Bahrain) (ar-BH)"
  },
  {
    code: "ar-EG",
    name: "Arabic (Egypt) (ar-EG)"
  },
  {
    code: "ar-IQ",
    name: "Arabic (Iraq) (ar-IQ)"
  },
  {
    code: "ar-JO",
    name: "Arabic (Jordan) (ar-JO)"
  },
  {
    code: "ar-KW",
    name: "Arabic (Kuwait) (ar-KW)"
  },
  {
    code: "ar-LB",
    name: "Arabic (Lebanon) (ar-LB)"
  },
  {
    code: "ar-LY",
    name: "Arabic (Libya) (ar-LY)"
  },
  {
    code: "ar-MA",
    name: "Arabic (Morocco) (ar-MA)"
  },
  {
    code: "ar-OM",
    name: "Arabic (Oman) (ar-OM)"
  },
  {
    code: "ar-QA",
    name: "Arabic (Qatar) (ar-QA)"
  },
  {
    code: "ar-SA",
    name: "Arabic (Saudi Arabia) (ar-SA)"
  },
  {
    code: "ar-SD",
    name: "Arabic (Sudan) (ar-SD)"
  },
  {
    code: "ar-SY",
    name: "Arabic (Syria) (ar-SY)"
  },
  {
    code: "ar-TN",
    name: "Arabic (Tunisia) (ar-TN)"
  },
  {
    code: "ar-AE",
    name: "Arabic (United Arab Emirates) (ar-AE)"
  },
  {
    code: "ar-001",
    name: "Arabic (World) (ar-001)"
  },
  {
    code: "ar-YE",
    name: "Arabic (Yemen) (ar-YE)"
  },
  {
    code: "hy",
    name: "Armenian (hy)"
  },
  {
    code: "hy-AM",
    name: "Armenian (Armenia) (hy-AM)"
  },
  {
    code: "as",
    name: "Assamese (as)"
  },
  {
    code: "as-IN",
    name: "Assamese (India) (as-IN)"
  },
  {
    code: "ast",
    name: "Asturian (ast)"
  },
  {
    code: "ast-ES",
    name: "Asturian (Spain) (ast-ES)"
  },
  {
    code: "asa",
    name: "Asu (asa)"
  },
  {
    code: "asa-TZ",
    name: "Asu (Tanzania) (asa-TZ)"
  },
  {
    code: "az",
    name: "Azerbaijani (az)"
  },
  {
    code: "az-Cyrl",
    name: "Azerbaijani (Cyrillic) (az-Cyrl)"
  },
  {
    code: "az-Cyrl-AZ",
    name: "Azerbaijani (Cyrillic, Azerbaijan) (az-Cyrl-AZ)"
  },
  {
    code: "az-Latn",
    name: "Azerbaijani (Latin) (az-Latn)"
  },
  {
    code: "az-Latn-AZ",
    name: "Azerbaijani (Latin, Azerbaijan) (az-Latn-AZ)"
  },
  {
    code: "ksf",
    name: "Bafia (ksf)"
  },
  {
    code: "ksf-CM",
    name: "Bafia (Cameroon) (ksf-CM)"
  },
  {
    code: "bah",
    name: "Bahamas Creole English"
  },
  {
    code: "bm",
    name: "Bambara (bm)"
  },
  {
    code: "bm-ML",
    name: "Bambara (Mali) (bm-ML)"
  },
  {
    code: "bas",
    name: "Basaa (bas)"
  },
  {
    code: "bas-CM",
    name: "Basaa (Cameroon) (bas-CM)"
  },
  {
    code: "eu",
    name: "Basque (eu)"
  },
  {
    code: "eu-ES",
    name: "Basque (Spain) (eu-ES)"
  },
  {
    code: "be",
    name: "Belarusian (be)"
  },
  {
    code: "be-BY",
    name: "Belarusian (Belarus) (be-BY)"
  },
  {
    code: "bem",
    name: "Bemba (bem)"
  },
  {
    code: "bem-ZM",
    name: "Bemba (Zambia) (bem-ZM)"
  },
  {
    code: "bez",
    name: "Bena (bez)"
  },
  {
    code: "bez-TZ",
    name: "Bena (Tanzania) (bez-TZ)"
  },
  {
    code: "bn",
    name: "Bengali (bn)"
  },
  {
    code: "bn-BD",
    name: "Bengali (Bangladesh) (bn-BD)"
  },
  {
    code: "bn-IN",
    name: "Bengali (India) (bn-IN)"
  },
  {
    code: "brx",
    name: "Bodo (brx)"
  },
  {
    code: "brx-IN",
    name: "Bodo (India) (brx-IN)"
  },
  {
    code: "bs",
    name: "Bosnian (bs)"
  },
  {
    code: "bs-BA",
    name: "Bosnian (Bosnia and Herzegovina) (bs-BA)"
  },
  {
    code: "br",
    name: "Breton (br)"
  },
  {
    code: "br-FR",
    name: "Breton (France) (br-FR)"
  },
  {
    code: "bg",
    name: "Bulgarian (bg)"
  },
  {
    code: "bg-BG",
    name: "Bulgarian (Bulgaria) (bg-BG)"
  },
  {
    code: "my",
    name: "Burmese (my)"
  },
  {
    code: "my-MM",
    name: "Burmese (Myanmar [Burma]) (my-MM)"
  },
  {
    code: "ca",
    name: "Catalan (ca)"
  },
  {
    code: "ca-ES",
    name: "Catalan (Spain) (ca-ES)"
  },
  {
    code: "ckb",
    name: "Central Kurdish (ckb)"
  },
  {
    code: "kmr",
    name: "Northern Kurdish (kmr)"
  },
  {
    code: "sdh",
    name: "Southern Kurdish (sdh)"
  },
  {
    code: "tzm",
    name: "Central Morocco Tamazight (tzm)"
  },
  {
    code: "tzm-Latn",
    name: "Central Morocco Tamazight (Latin) (tzm-Latn)"
  },
  {
    code: "tzm-Latn-MA",
    name: "Central Morocco Tamazight (Latin, Morocco) (tzm-Latn-MA) "
  },
  {
    code: "chr",
    name: "Cherokee (chr)"
  },
  {
    code: "chr-US",
    name: "Cherokee (United States) (chr-US)"
  },
  {
    code: "cgg",
    name: "Chiga (cgg)"
  },
  {
    code: "cgg-UG",
    name: "Chiga (Uganda) (cgg-UG)"
  },
  {
    code: "zh",
    name: "Chinese (zh)"
  },
  {
    code: "zh-Hans",
    name: "Chinese (Simplified) (zh-Hans)"
  },
  {
    code: "zh-CN",
    name: "Chinese (Simplified, China) (zh-CN)"
  },
  {
    code: "zh-Hans-CN",
    name: "Chinese (Simplified, China) (zh-Hans-CN)"
  },
  {
    code: "zh-Hans-HK",
    name: "Chinese (Simplified, Hong Kong SAR China) (zh-Hans-HK)"
  },
  {
    code: "zh-Hans-MO",
    name: "Chinese (Simplified, Macau SAR China) (zh-Hans-MO) "
  },
  {
    code: "zh-Hans-SG",
    name: "Chinese (Simplified, Singapore) (zh-Hans-SG)"
  },
  {
    code: "zh-Hant",
    name: "Chinese (Traditional) (zh-Hant)"
  },
  {
    code: "zh-Hant-HK",
    name: "Chinese (Traditional, Hong Kong SAR China) (zh-Hant-HK) "
  },
  {
    code: "zh-Hant-MO",
    name: "Chinese (Traditional, Macau SAR China) (zh-Hant-MO) "
  },
  {
    code: "zh-Hant-TW",
    name: "Chinese (Traditional, Taiwan) (zh-Hant-TW)"
  },
  {
    code: "swc",
    name: "Congo Swahili (swc)"
  },
  {
    code: "swc-CD",
    name: "Congo Swahili (Congo - Kinshasa) (swc-CD)"
  },
  {
    code: "kw",
    name: "Cornish (kw)"
  },
  {
    code: "kw-GB",
    name: "Cornish (United Kingdom) (kw-GB)"
  },
  {
    code: "hr",
    name: "Croatian (hr)"
  },
  {
    code: "hr-HR",
    name: "Croatian (Croatia) (hr-HR)"
  },
  {
    code: "cs",
    name: "Czech (cs)"
  },
  {
    code: "cs-CZ",
    name: "Czech (Czech Republic) (cs-CZ)"
  },
  {
    code: "da",
    name: "Danish (da)"
  },
  {
    code: "da-DK",
    name: "Danish (Denmark) (da-DK)"
  },
  {
    code: "dua",
    name: "Duala (dua)"
  },
  {
    code: "dua-CM",
    name: "Duala (Cameroon) (dua-CM)"
  },
  {
    code: "dv",
    name: "Dhivehi (Maldives)"
  },
  {
    code: "nl",
    name: "Dutch (nl)"
  },
  {
    code: "nl-AW",
    name: "Dutch (Aruba) (nl-AW)"
  },
  {
    code: "nl-BE",
    name: "Dutch (Belgium) (nl-BE)"
  },
  {
    code: "nl-CW",
    name: "Dutch (Curaçao) (nl-CW)"
  },
  {
    code: "nl-NL",
    name: "Dutch (Netherlands) (nl-NL)"
  },
  {
    code: "nl-SX",
    name: "Dutch (Sint Maarten) (nl-SX)"
  },
  {
    code: "ebu",
    name: "Embu (ebu)"
  },
  {
    code: "ebu-KE",
    name: "Embu (Kenya) (ebu-KE)"
  },
  {
    code: "en",
    name: "English (en)"
  },
  {
    code: "en-AI",
    name: "English (Anguilla) (en-AI)"
  },
  {
    code: "en-AS",
    name: "English (American Samoa) (en-AS)"
  },
  {
    code: "en-AU",
    name: "English (Australia) (en-AU)"
  },
  {
    code: "en-AT",
    name: "English (Austria) (en-AT)"
  },
  {
    code: "en-BB",
    name: "English (Barbados) (en-BB)"
  },
  {
    code: "en-BE",
    name: "English (Belgium) (en-BE)"
  },
  {
    code: "en-BZ",
    name: "English (Belize) (en-BZ)"
  },
  {
    code: "en-BM",
    name: "English (Bermuda) (en-BM)"
  },
  {
    code: "en-BW",
    name: "English (Botswana) (en-BW)"
  },
  {
    code: "en-IO",
    name: "English (British Indian Ocean Territory) (en-IO)"
  },
  {
    code: "en-BI",
    name: "English (Burundi) (en-BI)"
  },
  {
    code: "en-CM",
    name: "English (Cameroon) (en-CM)"
  },
  {
    code: "en-CA",
    name: "English (Canada) (en-CA)"
  },
  {
    code: "en-KY",
    name: "English (Cayman Islands) (en-KY)"
  },
  {
    code: "en-CX",
    name: "English (Christmas Island) (en-CX)"
  },
  {
    code: "en-CC",
    name: "English (Cocos [Keeling] Islands) (en-CC)"
  },
  {
    code: "en-CK",
    name: "English (Cook Islands) (en-CK)"
  },
  {
    code: "en-CY",
    name: "English (Cyprus) (en-CY)"
  },
  {
    code: "en-DK",
    name: "English (Denmark) (en-DK)"
  },
  {
    code: "en-DG",
    name: "English (Diego Garcia) (en-DG)"
  },
  {
    code: "en-DM",
    name: "English (Dominica) (en-DM)"
  },
  {
    code: "en-EG",
    name: "English (Egypt) (en-EG)"
  },
  {
    code: "en-ER",
    name: "English (Eritrea) (en-ER)"
  },
  {
    code: "en-EU",
    name: "English (Europe) (en-EU)"
  },
  {
    code: "en-FK",
    name: "English (Falkland Islands) (en-FK)"
  },
  {
    code: "en-FJ",
    name: "English (Fiji) (en-FJ)"
  },
  {
    code: "en-FI",
    name: "English (Finland) (en-FI)"
  },
  {
    code: "en-GM",
    name: "English (Gambia) (en-GM)"
  },
  {
    code: "en-DE",
    name: "English (Germany) (en-DE)"
  },
  {
    code: "en-GH",
    name: "English (Ghana) (en-GH)"
  },
  {
    code: "en-GI",
    name: "English (Gibraltar) (en-GI)"
  },
  {
    code: "en-GD",
    name: "English (Grenada) (en-GD)"
  },
  {
    code: "en-GU",
    name: "English (Guam) (en-GU)"
  },
  {
    code: "en-GG",
    name: "English (Guernsey) (en-GG)"
  },
  {
    code: "en-GY",
    name: "English (Guyana) (en-GY)"
  },
  {
    code: "en-HK",
    name: "English (Hong Kong SAR China) (en-HK)"
  },
  {
    code: "en-IN",
    name: "English (India) (en-IN)"
  },
  {
    code: "en-IE",
    name: "English (Ireland) (en-IE)"
  },
  {
    code: "en-IM",
    name: "English (Isle of Man) (en-IM)"
  },
  {
    code: "en-IL",
    name: "English (Israel) (en-IL)"
  },
  {
    code: "en-JM",
    name: "English (Jamaica) (en-JM)"
  },
  {
    code: "en-JE",
    name: "English (Jersey) (en-JE)"
  },
  {
    code: "en-KE",
    name: "English (Kenya) (en-KE)"
  },
  {
    code: "en-KI",
    name: "English (Kiribati) (en-KI)"
  },
  {
    code: "en-KW",
    name: "English (Kuwait) (en-KW)"
  },
  {
    code: "en-LS",
    name: "English (Lesotho) (en-LS)"
  },
  {
    code: "en-MO",
    name: "English (Macao SAR China) (en-MO)"
  },
  {
    code: "en-MG",
    name: "English (Madagascar) (en-MG)"
  },
  {
    code: "en-MW",
    name: "English (Malawi) (en-MW)"
  },
  {
    code: "en-MY",
    name: "English (Malaysia) (en-MY)"
  },
  {
    code: "en-MT",
    name: "English (Malta) (en-MT)"
  },
  {
    code: "en-MH",
    name: "English (Marshall Islands) (en-MH)"
  },
  {
    code: "en-MU",
    name: "English (Mauritius) (en-MU)"
  },
  {
    code: "en-FM",
    name: "English (Micronesia) (en-FM)"
  },
  {
    code: "en-MS",
    name: "English (Montserrat) (en-MS)"
  },
  {
    code: "en-NA",
    name: "English (Namibia) (en-NA)"
  },
  {
    code: "en-NR",
    name: "English (Nauru) (en-NR)"
  },
  {
    code: "en-NL",
    name: "English (Netherlands) (en-NL)"
  },
  {
    code: "en-NZ",
    name: "English (New Zealand) (en-NZ)"
  },
  {
    code: "en-NG",
    name: "English (Nigeria) (en-NG)"
  },
  {
    code: "en-NU",
    name: "English (Niue) (en-NU)"
  },
  {
    code: "en-NF",
    name: "English (Norfolk Island) (en-NF)"
  },
  {
    code: "en-MP",
    name: "English (Northern Mariana Islands) (en-MP)"
  },
  {
    code: "en-NO",
    name: "English (Norway) (en-NO)"
  },
  {
    code: "en-PA",
    name: "English (Panama) (en-PA)"
  },
  {
    code: "en-PK",
    name: "English (Pakistan) (en-PK)"
  },
  {
    code: "en-PW",
    name: "English (Palau) (en-PW)"
  },
  {
    code: "en-PG",
    name: "English (Papua New Guinea) (en-PG)"
  },
  {
    code: "en-PH",
    name: "English (Philippines) (en-PH)"
  },
  {
    code: "en-PN",
    name: "English (Pitcairn Islands) (en-PN)"
  },
  {
    code: "en-PR",
    name: "English (Puerto Rico) (en-PR)"
  },
  {
    code: "en-RW",
    name: "English (Rwanda) (en-RW)"
  },
  {
    code: "en-WS",
    name: "English (Samoa) (en-WS)"
  },
  {
    code: "en-SA",
    name: "English (Saudi Arabia) (en-SA)"
  },
  {
    code: "en-SC",
    name: "English (Seychelles) (en-SC)"
  },
  {
    code: "en-SL",
    name: "English (Sierra Leone) (en-SL)"
  },
  {
    code: "en-SG",
    name: "English (Singapore) (en-SG)"
  },
  {
    code: "en-SX",
    name: "English (Sint Maarten) (en-SX)"
  },
  {
    code: "en-SI",
    name: "English (Slovenia) (en-SI)"
  },
  {
    code: "en-SB",
    name: "English (Solomon Islands) (en-SB)"
  },
  {
    code: "en-SS",
    name: "English (South Sudan) (en-SS)"
  },
  {
    code: "en-SH",
    name: "English (St Helena) (en-SH)"
  },
  {
    code: "en-KN",
    name: "English (St Kitts & Nevis) (en-KN)"
  },
  {
    code: "en-LC",
    name: "English (St Lucia) (en-LC)"
  },
  {
    code: "svc",
    name: "Vincentian Creole English"
  },
  {
    code: "vic",
    name: "Virgin Islands Creole English"
  },
  {
    code: "en-SD",
    name: "English (Sudan) (en-SD)"
  },
  {
    code: "en-SZ",
    name: "English (Swaziland) (en-SZ)"
  },
  {
    code: "en-SE",
    name: "English (Sweden) (en-SE)"
  },
  {
    code: "en-CH",
    name: "English (Switzerland) (en-CH)"
  },
  {
    code: "en-TZ",
    name: "English (Tanzania) (en-TZ)"
  },
  {
    code: "en-TK",
    name: "English (Tokelau) (en-TK)"
  },
  {
    code: "en-TO",
    name: "English (Tonga) (en-TO)"
  },
  {
    code: "en-TT",
    name: "English (Trinidad and Tobago) (en-TT)"
  },
  {
    code: "en-TV",
    name: "English (Tuvalu) (en-TV)"
  },
  {
    code: "en-ZA",
    name: "English (South Africa) (en-ZA)"
  },
  {
    code: "en-AE",
    name: "English (U.A.E.) (en-AE)"
  },
  {
    code: "en-UM",
    name: "English (U.S. Minor Outlying Islands) (en-UM)"
  },
  {
    code: "en-VI",
    name: "English (U.S. Virgin Islands) (en-VI)"
  },
  {
    code: "en-US-POSIX",
    name: "English (U.S., Computer) (en-US-POSIX)"
  },
  {
    code: "en-UG",
    name: "English (Uganda) (en-UG)"
  },
  {
    code: "en-GB",
    name: "English (United Kingdom) (en-GB)"
  },
  {
    code: "en-US",
    name: "English (United States) (en-US)"
  },
  {
    code: "en-VU",
    name: "English (Vanuatu) (en-VU)"
  },
  {
    code: "en-ZM",
    name: "English (Zambia) (en-ZM)"
  },
  {
    code: "en-ZW",
    name: "English (Zimbabwe) (en-ZW)"
  },
  {
    code: "eo",
    name: "Esperanto (eo)"
  },
  {
    code: "et",
    name: "Estonian (et)"
  },
  {
    code: "et-EE",
    name: "Estonian (Estonia) (et-EE)"
  },
  {
    code: "ee",
    name: "Ewe (ee)"
  },
  {
    code: "ee-GH",
    name: "Ewe (Ghana) (ee-GH)"
  },
  {
    code: "ee-TG",
    name: "Ewe (Togo) (ee-TG)"
  },
  {
    code: "ewo",
    name: "Ewondo (ewo)"
  },
  {
    code: "ewo-CM",
    name: "Ewondo (Cameroon) (ewo-CM)"
  },
  {
    code: "fo",
    name: "Faroese (fo)"
  },
  {
    code: "fo-FO",
    name: "Faroese (Faroe Islands) (fo-FO)"
  },
  {
    code: "fil",
    name: "Filipino (fil)"
  },
  {
    code: "fil-PH",
    name: "Filipino (Philippines) (fil-PH)"
  },
  {
    code: "fi",
    name: "Finnish (fi)"
  },
  {
    code: "fi-FI",
    name: "Finnish (Finland) (fi-FI)"
  },
  {
    code: "fr",
    name: "French (fr)"
  },
  {
    code: "fr-BE",
    name: "French (Belgium) (fr-BE)"
  },
  {
    code: "fr-BJ",
    name: "French (Benin) (fr-BJ)"
  },
  {
    code: "fr-BF",
    name: "French (Burkina Faso) (fr-BF)"
  },
  {
    code: "fr-BI",
    name: "French (Burundi) (fr-BI)"
  },
  {
    code: "fr-CM",
    name: "French (Cameroon) (fr-CM)"
  },
  {
    code: "fr-CA",
    name: "French (Canada) (fr-CA)"
  },
  {
    code: "fr-CF",
    name: "French (Central African Republic) (fr-CF)"
  },
  {
    code: "fr-TD",
    name: "French (Chad) (fr-TD)"
  },
  {
    code: "fr-KM",
    name: "French (Comoros) (fr-KM)"
  },
  {
    code: "fr-CG",
    name: "French (Congo - Brazzaville) (fr-CG)"
  },
  {
    code: "fr-CD",
    name: "French (Congo - Kinshasa) (fr-CD)"
  },
  {
    code: "fr-CI",
    name: "French (Côte d’Ivoire) (fr-CI)"
  },
  {
    code: "fr-DJ",
    name: "French (Djibouti) (fr-DJ)"
  },
  {
    code: "fr-GQ",
    name: "French (Equatorial Guinea) (fr-GQ)"
  },
  {
    code: "fr-FR",
    name: "French (France) (fr-FR)"
  },
  {
    code: "fr-GF",
    name: "French (French Guiana) (fr-GF)"
  },
  {
    code: "fr-GA",
    name: "French (Gabon) (fr-GA)"
  },
  {
    code: "fr-GP",
    name: "French (Guadeloupe) (fr-GP)"
  },
  {
    code: "fr-GN",
    name: "French (Guinea) (fr-GN)"
  },
  {
    code: "fr-LU",
    name: "French (Luxembourg) (fr-LU)"
  },
  {
    code: "fr-MG",
    name: "French (Madagascar) (fr-MG)"
  },
  {
    code: "fr-ML",
    name: "French (Mali) (fr-ML)"
  },
  {
    code: "fr-MQ",
    name: "French (Martinique) (fr-MQ)"
  },
  {
    code: "fr-YT",
    name: "French (Mayotte) (fr-YT)"
  },
  {
    code: "fr-MC",
    name: "French (Monaco) (fr-MC)"
  },
  {
    code: "fr-NE",
    name: "French (Niger) (fr-NE)"
  },
  {
    code: "fr-RW",
    name: "French (Rwanda) (fr-RW)"
  },
  {
    code: "fr-RE",
    name: "French (Réunion) (fr-RE)"
  },
  {
    code: "fr-BL",
    name: "French (Saint Barthélemy) (fr-BL)"
  },
  {
    code: "fr-MF",
    name: "French (Saint Martin) (fr-MF)"
  },
  {
    code: "fr-MU",
    name: "French (Mauritius) (fr-MU)"
  },
  {
    code: "fr-SN",
    name: "French (Senegal) (fr-SN)"
  },
  {
    code: "fr-CH",
    name: "French (Switzerland) (fr-CH)"
  },
  {
    code: "fr-TG",
    name: "French (Togo) (fr-TG)"
  },
  {
    code: "ff",
    name: "Fulah (ff)"
  },
  {
    code: "ff-SN",
    name: "Fulah (Senegal) (ff-SN)"
  },
  {
    code: "gl",
    name: "Galician (gl)"
  },
  {
    code: "gl-ES",
    name: "Galician (Spain) (gl-ES)"
  },
  {
    code: "lao",
    name: "Laotian (Laos) (lao)"
  },
  {
    code: "lg",
    name: "Ganda (lg)"
  },
  {
    code: "lg-UG",
    name: "Ganda (Uganda) (lg-UG)"
  },
  {
    code: "ka",
    name: "Georgian (ka)"
  },
  {
    code: "ka-GE",
    name: "Georgian (Georgia) (ka-GE)"
  },
  {
    code: "de",
    name: "German (de)"
  },
  {
    code: "de-AT",
    name: "German (Austria) (de-AT)"
  },
  {
    code: "de-BE",
    name: "German (Belgium) (de-BE)"
  },
  {
    code: "de-DE",
    name: "German (Germany) (de-DE)"
  },
  {
    code: "de-LI",
    name: "German (Liechtenstein) (de-LI)"
  },
  {
    code: "de-LU",
    name: "German (Luxembourg) (de-LU)"
  },
  {
    code: "de-CH",
    name: "German (Switzerland) (de-CH)"
  },
  {
    code: "el",
    name: "Greek (el)"
  },
  {
    code: "el-CY",
    name: "Greek (Cyprus) (el-CY)"
  },
  {
    code: "el-GR",
    name: "Greek (Greece) (el-GR)"
  },
  {
    code: "gu",
    name: "Gujarati (gu)"
  },
  {
    code: "gu-IN",
    name: "Gujarati (India) (gu-IN)"
  },
  {
    code: "guz",
    name: "Gusii (guz)"
  },
  {
    code: "guz-KE",
    name: "Gusii (Kenya) (guz-KE)"
  },
  {
    code: "ha",
    name: "Hausa (ha)"
  },
  {
    code: "ha-Latn",
    name: "Hausa (Latin) (ha-Latn)"
  },
  {
    code: "ha-Latn-GH",
    name: "Hausa (Latin, Ghana) (ha-Latn-GH)"
  },
  {
    code: "ha-Latn-NE",
    name: "Hausa (Latin, Niger) (ha-Latn-NE)"
  },
  {
    code: "ha-Latn-NG",
    name: "Hausa (Latin, Nigeria) (ha-Latn-NG)"
  },
  {
    code: "haw",
    name: "Hawaiian (haw)"
  },
  {
    code: "haw-US",
    name: "Hawaiian (United States) (haw-US)"
  },
  {
    code: "he",
    name: "Hebrew (he)"
  },
  {
    code: "he-IL",
    name: "Hebrew (Israel) (he-IL)"
  },
  {
    code: "hi",
    name: "Hindi (hi)"
  },
  {
    code: "hi-IN",
    name: "Hindi (India) (hi-IN)"
  },
  {
    code: "hu",
    name: "Hungarian (hu)"
  },
  {
    code: "hu-HU",
    name: "Hungarian (Hungary) (hu-HU)"
  },
  {
    code: "is",
    name: "Icelandic (is)"
  },
  {
    code: "is-IS",
    name: "Icelandic (Iceland) (is-IS)"
  },
  {
    code: "ig",
    name: "Igbo (ig)"
  },
  {
    code: "ig-NG",
    name: "Igbo (Nigeria) (ig-NG)"
  },
  {
    code: "smn",
    name: "Inari Sami"
  },
  {
    code: "smn-FI",
    name: "Inari Sami (Finland)"
  },
  {
    code: "id",
    name: "Indonesian (id)"
  },
  {
    code: "id-ID",
    name: "Indonesian (Indonesia) (id-ID)"
  },
  {
    code: "ga",
    name: "Irish (ga)"
  },
  {
    code: "ga-IE",
    name: "Irish (Ireland) (ga-IE)"
  },
  {
    code: "it",
    name: "Italian (it)"
  },
  {
    code: "it-IT",
    name: "Italian (Italy) (it-IT)"
  },
  {
    code: "it-CH",
    name: "Italian (Switzerland) (it-CH)"
  },
  {
    code: "ja",
    name: "Japanese (ja)"
  },
  {
    code: "ja-JP",
    name: "Japanese (Japan) (ja-JP)"
  },
  {
    code: "dyo",
    name: "Jola-Fonyi (dyo)"
  },
  {
    code: "dyo-SN",
    name: "Jola-Fonyi (Senegal) (dyo-SN)"
  },
  {
    code: "kea",
    name: "Kabuverdianu (kea)"
  },
  {
    code: "kea-CV",
    name: "Kabuverdianu (Cape Verde) (kea-CV)"
  },
  {
    code: "kab",
    name: "Kabyle (kab)"
  },
  {
    code: "kab-DZ",
    name: "Kabyle (Algeria) (kab-DZ)"
  },
  {
    code: "kl",
    name: "Kalaallisut (kl)"
  },
  {
    code: "kl-GL",
    name: "Kalaallisut (Greenland) (kl-GL)"
  },
  {
    code: "kln",
    name: "Kalenjin (kln)"
  },
  {
    code: "kln-KE",
    name: "Kalenjin (Kenya) (kln-KE)"
  },
  {
    code: "kam",
    name: "Kamba (kam)"
  },
  {
    code: "kam-KE",
    name: "Kamba (Kenya) (kam-KE)"
  },
  {
    code: "kn",
    name: "Kannada (kn)"
  },
  {
    code: "kn-IN",
    name: "Kannada (India) (kn-IN)"
  },
  {
    code: "kaa",
    name: "Kara-Kalpak (kaa)"
  },
  {
    code: "kk",
    name: "Kazakh (kk)"
  },
  {
    code: "kk-Cyrl",
    name: "Kazakh (Cyrillic) (kk-Cyrl)"
  },
  {
    code: "kk-Cyrl-KZ",
    name: "Kazakh (Cyrillic, Kazakhstan) (kk-Cyrl-KZ)"
  },
  {
    code: "km",
    name: "Khmer (km)"
  },
  {
    code: "km-KH",
    name: "Khmer (Cambodia) (km-KH)"
  },
  {
    code: "ki",
    name: "Kikuyu (ki)"
  },
  {
    code: "ki-KE",
    name: "Kikuyu (Kenya) (ki-KE)"
  },
  {
    code: "rw",
    name: "Kinyarwanda (rw)"
  },
  {
    code: "rw-RW",
    name: "Kinyarwanda (Rwanda) (rw-RW)"
  },
  {
    code: "kok",
    name: "Konkani (kok)"
  },
  {
    code: "kok-IN",
    name: "Konkani (India) (kok-IN)"
  },
  {
    code: "ko",
    name: "Korean (ko)"
  },
  {
    code: "ko-KR",
    name: "Korean (South Korea) (ko-KR)"
  },
  {
    code: "khq",
    name: "Koyra Chiini (khq)"
  },
  {
    code: "khq-ML",
    name: "Koyra Chiini (Mali) (khq-ML)"
  },
  {
    code: "ses",
    name: "Koyraboro Senni (ses)"
  },
  {
    code: "ses-ML",
    name: "Koyraboro Senni (Mali) (ses-ML)"
  },
  {
    code: "nmg",
    name: "Kwasio (nmg)"
  },
  {
    code: "nmg-CM",
    name: "Kwasio (Cameroon) (nmg-CM)"
  },
  {
    code: "ky",
    name: "Kyrgyz (ky)"
  },
  {
    code: "lag",
    name: "Langi (lag)"
  },
  {
    code: "lag-TZ",
    name: "Langi (Tanzania) (lag-TZ)"
  },
  {
    code: "lv",
    name: "Latvian (lv)"
  },
  {
    code: "lv-LV",
    name: "Latvian (Latvia) (lv-LV)"
  },
  {
    code: "lir",
    name: "Liberian English"
  },
  {
    code: "ln",
    name: "Lingala (ln)"
  },
  {
    code: "ln-CG",
    name: "Lingala (Congo - Brazzaville) (ln-CG)"
  },
  {
    code: "ln-CD",
    name: "Lingala (Congo - Kinshasa) (ln-CD)"
  },
  {
    code: "lt",
    name: "Lithuanian (lt)"
  },
  {
    code: "lt-LT",
    name: "Lithuanian (Lithuania) (lt-LT)"
  },
  {
    code: "lu",
    name: "Luba-Katanga (lu)"
  },
  {
    code: "lu-CD",
    name: "Luba-Katanga (Congo - Kinshasa) (lu-CD)"
  },
  {
    code: "luo",
    name: "Luo (luo)"
  },
  {
    code: "luo-KE",
    name: "Luo (Kenya) (luo-KE)"
  },
  {
    code: "luy",
    name: "Luyia (luy)"
  },
  {
    code: "luy-KE",
    name: "Luyia (Kenya) (luy-KE)"
  },
  {
    code: "mk",
    name: "Macedonian (mk)"
  },
  {
    code: "mk-MK",
    name: "Macedonian (Macedonia) (mk-MK)"
  },
  {
    code: "jmc",
    name: "Machame (jmc)"
  },
  {
    code: "jmc-TZ",
    name: "Machame (Tanzania) (jmc-TZ)"
  },
  {
    code: "mgh",
    name: "Makhuwa-Meetto (mgh)"
  },
  {
    code: "mgh-MZ",
    name: "Makhuwa-Meetto (Mozambique) (mgh-MZ)"
  },
  {
    code: "kde",
    name: "Makonde (kde)"
  },
  {
    code: "kde-TZ",
    name: "Makonde (Tanzania) (kde-TZ)"
  },
  {
    code: "mg",
    name: "Malagasy (mg)"
  },
  {
    code: "mg-MG",
    name: "Malagasy (Madagascar) (mg-MG)"
  },
  {
    code: "ms",
    name: "Malay (ms)"
  },
  {
    code: "ms-BN",
    name: "Malay (Brunei) (ms-BN)"
  },
  {
    code: "ms-MY",
    name: "Malay (Malaysia) (ms-MY)"
  },
  {
    code: "ml",
    name: "Malayalam (ml)"
  },
  {
    code: "ml-IN",
    name: "Malayalam (India) (ml-IN)"
  },
  {
    code: "mt",
    name: "Maltese (mt)"
  },
  {
    code: "mt-MT",
    name: "Maltese (Malta) (mt-MT)"
  },
  {
    code: "gv",
    name: "Manx (gv)"
  },
  {
    code: "gv-GB",
    name: "Manx (United Kingdom) (gv-GB)"
  },
  {
    code: "mr",
    name: "Marathi (mr)"
  },
  {
    code: "mr-IN",
    name: "Marathi (India) (mr-IN)"
  },
  {
    code: "mas",
    name: "Masai (mas)"
  },
  {
    code: "mas-KE",
    name: "Masai (Kenya) (mas-KE)"
  },
  {
    code: "mas-TZ",
    name: "Masai (Tanzania) (mas-TZ)"
  },
  {
    code: "mer",
    name: "Meru (mer)"
  },
  {
    code: "mer-KE",
    name: "Meru (Kenya) (mer-KE)"
  },
  {
    code: "mn",
    name: "Mongolian (mn)"
  },
  {
    code: "mfe",
    name: "Morisyen (mfe)"
  },
  {
    code: "mfe-MU",
    name: "Morisyen (Mauritius) (mfe-MU)"
  },
  {
    code: "mua",
    name: "Mundang (mua)"
  },
  {
    code: "mua-CM",
    name: "Mundang (Cameroon) (mua-CM)"
  },
  {
    code: "naq",
    name: "Nama (naq)"
  },
  {
    code: "naq-NA",
    name: "Nama (Namibia) (naq-NA)"
  },
  {
    code: "ne",
    name: "Nepali (ne)"
  },
  {
    code: "ne-IN",
    name: "Nepali (India) (ne-IN)"
  },
  {
    code: "ne-NP",
    name: "Nepali (Nepal) (ne-NP)"
  },
  {
    code: "se",
    name: "Northern Sami"
  },
  {
    code: "se-FI",
    name: "Northern Sami (Finland)"
  },
  {
    code: "se-NO",
    name: "Northern Sami (Norway)"
  },
  {
    code: "se-SE",
    name: "Northern Sami (Sweden)"
  },
  {
    code: "nd",
    name: "North Ndebele (nd)"
  },
  {
    code: "nd-ZW",
    name: "North Ndebele (Zimbabwe) (nd-ZW)"
  },
  {
    code: "nb",
    name: "Norwegian Bokmål (nb)"
  },
  {
    code: "nb-NO",
    name: "Norwegian Bokmål (Norway) (nb-NO)"
  },
  {
    code: "nn",
    name: "Norwegian Nynorsk (nn)"
  },
  {
    code: "nn-NO",
    name: "Norwegian Nynorsk (Norway) (nn-NO)"
  },
  {
    code: "nus",
    name: "Nuer (nus)"
  },
  {
    code: "nus-SD",
    name: "Nuer (Sudan) (nus-SD)"
  },
  {
    code: "nyn",
    name: "Nyankole (nyn)"
  },
  {
    code: "nyn-UG",
    name: "Nyankole (Uganda) (nyn-UG)"
  },
  {
    code: "or",
    name: "Oriya (or)"
  },
  {
    code: "or-IN",
    name: "Oriya (India) (or-IN)"
  },
  {
    code: "om",
    name: "Oromo (om)"
  },
  {
    code: "om-ET",
    name: "Oromo (Ethiopia) (om-ET)"
  },
  {
    code: "om-KE",
    name: "Oromo (Kenya) (om-KE)"
  },
  {
    code: "ps",
    name: "Pashto (ps)"
  },
  {
    code: "ps-AF",
    name: "Pashto (Afghanistan) (ps-AF)"
  },
  {
    code: "fa",
    name: "Persian (fa)"
  },
  {
    code: "fa-AF",
    name: "Persian (Afghanistan) (fa-AF)"
  },
  {
    code: "fa-IR",
    name: "Persian (Iran) (fa-IR)"
  },
  {
    code: "pl",
    name: "Polish (pl)"
  },
  {
    code: "pl-PL",
    name: "Polish (Poland) (pl-PL)"
  },
  {
    code: "pt",
    name: "Portuguese (pt)"
  },
  {
    code: "pt-AO",
    name: "Portuguese (Angola) (pt-AO)"
  },
  {
    code: "pt-BR",
    name: "Portuguese (Brazil) (pt-BR)"
  },
  {
    code: "pt-GW",
    name: "Portuguese (Guinea-Bissau) (pt-GW)"
  },
  {
    code: "pt-MZ",
    name: "Portuguese (Mozambique) (pt-MZ)"
  },
  {
    code: "pt-PT",
    name: "Portuguese (Portugal) (pt-PT)"
  },
  {
    code: "pt-ST",
    name: "Portuguese (São Tomé and Príncipe) (pt-ST)"
  },
  {
    code: "pa",
    name: "Punjabi (pa)"
  },
  {
    code: "pa-Arab",
    name: "Punjabi (Arabic) (pa-Arab)"
  },
  {
    code: "pa-Arab-PK",
    name: "Punjabi (Arabic, Pakistan) (pa-Arab-PK)"
  },
  {
    code: "pa-Guru",
    name: "Punjabi (Gurmukhi) (pa-Guru)"
  },
  {
    code: "pa-Guru-IN",
    name: "Punjabi (Gurmukhi, India) (pa-Guru-IN)"
  },
  {
    code: "ro",
    name: "Romanian (ro)"
  },
  {
    code: "ro-MD",
    name: "Romanian (Moldova) (ro-MD)"
  },
  {
    code: "ro-RO",
    name: "Romanian (Romania) (ro-RO)"
  },
  {
    code: "rm",
    name: "Romansh (rm)"
  },
  {
    code: "rm-CH",
    name: "Romansh (Switzerland) (rm-CH)"
  },
  {
    code: "rof",
    name: "Rombo (rof)"
  },
  {
    code: "rof-TZ",
    name: "Rombo (Tanzania) (rof-TZ)"
  },
  {
    code: "rn",
    name: "Rundi (rn)"
  },
  {
    code: "rn-BI",
    name: "Rundi (Burundi) (rn-BI)"
  },
  {
    code: "ru",
    name: "Russian (ru)"
  },
  {
    code: "ru-MD",
    name: "Russian (Moldova) (ru-MD)"
  },
  {
    code: "ru-RU",
    name: "Russian (Russia) (ru-RU)"
  },
  {
    code: "ru-UA",
    name: "Russian (Ukraine) (ru-UA)"
  },
  {
    code: "rwk",
    name: "Rwa (rwk)"
  },
  {
    code: "rwk-TZ",
    name: "Rwa (Tanzania) (rwk-TZ)"
  },
  {
    code: "saq",
    name: "Samburu (saq)"
  },
  {
    code: "saq-KE",
    name: "Samburu (Kenya) (saq-KE)"
  },
  {
    code: "sg",
    name: "Sango (sg)"
  },
  {
    code: "sg-CF",
    name: "Sango (Central African Republic) (sg-CF)"
  },
  {
    code: "sbp",
    name: "Sangu (sbp)"
  },
  {
    code: "sbp-TZ",
    name: "Sangu (Tanzania) (sbp-TZ)"
  },
  {
    code: "sa",
    name: "Sanskrit (sa)"
  },
  {
    code: "gd",
    name: "Scottish Gaelic (gd)"
  },
  {
    code: "gd-GB",
    name: "Scottish Gaelic (United Kingdom)"
  },
  {
    code: "seh",
    name: "Sena (seh)"
  },
  {
    code: "seh-MZ",
    name: "Sena (Mozambique) (seh-MZ)"
  },
  {
    code: "sr",
    name: "Serbian (sr)"
  },
  {
    code: "sr-Cyrl",
    name: "Serbian (Cyrillic) (sr-Cyrl)"
  },
  {
    code: "sr-Cyrl-BA",
    name: "Serbian (Cyrillic, Bosnia and Herzegovina)(sr-Cyrl-BA) "
  },
  {
    code: "sr-Cyrl-ME",
    name: "Serbian (Cyrillic, Montenegro) (sr-Cyrl-ME)"
  },
  {
    code: "sr-Cyrl-RS",
    name: "Serbian (Cyrillic, Serbia) (sr-Cyrl-RS)"
  },
  {
    code: "sr-Latn",
    name: "Serbian (Latin) (sr-Latn)"
  },
  {
    code: "sr-Latn-BA",
    name: "Serbian (Latin, Bosnia and Herzegovina) (sr-Latn-BA) "
  },
  {
    code: "sr-Latn-ME",
    name: "Serbian (Latin, Montenegro) (sr-Latn-ME)"
  },
  {
    code: "sr-Latn-RS",
    name: "Serbian (Latin, Serbia) (sr-Latn-RS)"
  },
  {
    code: "ksb",
    name: "Shambala (ksb)"
  },
  {
    code: "ksb-TZ",
    name: "Shambala (Tanzania) (ksb-TZ)"
  },
  {
    code: "sn",
    name: "Shona (sn)"
  },
  {
    code: "sn-ZW",
    name: "Shona (Zimbabwe) (sn-ZW)"
  },
  {
    code: "ii",
    name: "Sichuan Yi (ii)"
  },
  {
    code: "ii-CN",
    name: "Sichuan Yi (China) (ii-CN)"
  },
  {
    code: "si",
    name: "Sinhala (si)"
  },
  {
    code: "si-LK",
    name: "Sinhala (Sri Lanka) (si-LK)"
  },
  {
    code: "sk",
    name: "Slovak (sk)"
  },
  {
    code: "sk-SK",
    name: "Slovak (Slovakia) (sk-SK)"
  },
  {
    code: "sl",
    name: "Slovenian (sl)"
  },
  {
    code: "sl-SI",
    name: "Slovenian (Slovenia) (sl-SI)"
  },
  {
    code: "xog",
    name: "Soga (xog)"
  },
  {
    code: "xog-UG",
    name: "Soga (Uganda) (xog-UG)"
  },
  {
    code: "so",
    name: "Somali (so)"
  },
  {
    code: "so-DJ",
    name: "Somali (Djibouti) (so-DJ)"
  },
  {
    code: "so-ET",
    name: "Somali (Ethiopia) (so-ET)"
  },
  {
    code: "so-KE",
    name: "Somali (Kenya) (so-KE)"
  },
  {
    code: "so-SO",
    name: "Somali (Somalia) (so-SO)"
  },
  {
    code: "es",
    name: "Spanish (es)"
  },
  {
    code: "es-AR",
    name: "Spanish (Argentina) (es-AR)"
  },
  {
    code: "es-BO",
    name: "Spanish (Bolivia) (es-BO)"
  },
  {
    code: "es-CL",
    name: "Spanish (Chile) (es-CL)"
  },
  {
    code: "es-CO",
    name: "Spanish (Colombia) (es-CO)"
  },
  {
    code: "es-CR",
    name: "Spanish (Costa Rica) (es-CR)"
  },
  {
    code: "es-DO",
    name: "Spanish (Dominican Republic) (es-DO)"
  },
  {
    code: "es-EC",
    name: "Spanish (Ecuador) (es-EC)"
  },
  {
    code: "es-SV",
    name: "Spanish (El Salvador) (es-SV)"
  },
  {
    code: "es-GQ",
    name: "Spanish (Equatorial Guinea) (es-GQ)"
  },
  {
    code: "es-GT",
    name: "Spanish (Guatemala) (es-GT)"
  },
  {
    code: "es-HN",
    name: "Spanish (Honduras) (es-HN)"
  },
  {
    code: "es-419",
    name: "Spanish (Latin America) (es-419)"
  },
  {
    code: "es-MX",
    name: "Spanish (Mexico) (es-MX)"
  },
  {
    code: "es-NI",
    name: "Spanish (Nicaragua) (es-NI)"
  },
  {
    code: "es-PA",
    name: "Spanish (Panama) (es-PA)"
  },
  {
    code: "es-PY",
    name: "Spanish (Paraguay) (es-PY)"
  },
  {
    code: "es-PE",
    name: "Spanish (Peru) (es-PE)"
  },
  {
    code: "es-PR",
    name: "Spanish (Puerto Rico) (es-PR)"
  },
  {
    code: "es-ES",
    name: "Spanish (Spain) (es-ES)"
  },
  {
    code: "es-US",
    name: "Spanish (United States) (es-US)"
  },
  {
    code: "es-UY",
    name: "Spanish (Uruguay) (es-UY)"
  },
  {
    code: "es-VE",
    name: "Spanish (Venezuela) (es-VE)"
  },
  {
    code: "sw",
    name: "Swahili (sw)"
  },
  {
    code: "sw-KE",
    name: "Swahili (Kenya) (sw-KE)"
  },
  {
    code: "sw-TZ",
    name: "Swahili (Tanzania) (sw-TZ)"
  },
  {
    code: "sv",
    name: "Swedish (sv)"
  },
  {
    code: "sv-FI",
    name: "Swedish (Finland) (sv-FI)"
  },
  {
    code: "sv-SE",
    name: "Swedish (Sweden) (sv-SE)"
  },
  {
    code: "gsw",
    name: "Swiss German (gsw)"
  },
  {
    code: "gsw-CH",
    name: "Swiss German (Switzerland) (gsw-CH)"
  },
  {
    code: "shi",
    name: "Tachelhit (shi)"
  },
  {
    code: "shi-Latn",
    name: "Tachelhit (Latin) (shi-Latn)"
  },
  {
    code: "shi-Latn-MA",
    name: "Tachelhit (Latin, Morocco) (shi-Latn-MA)"
  },
  {
    code: "shi-Tfng",
    name: "Tachelhit (Tifinagh) (shi-Tfng)"
  },
  {
    code: "shi-Tfng-MA",
    name: "Tachelhit (Tifinagh, Morocco) (shi-Tfng-MA)"
  },
  {
    code: "dav",
    name: "Taita (dav)"
  },
  {
    code: "dav-KE",
    name: "Taita (Kenya) (dav-KE)"
  },
  {
    code: "tg",
    name: "Tajik (tg)"
  },
  {
    code: "ta",
    name: "Tamil (ta)"
  },
  {
    code: "ta-IN",
    name: "Tamil (India) (ta-IN)"
  },
  {
    code: "ta-LK",
    name: "Tamil (Sri Lanka) (ta-LK)"
  },
  {
    code: "twq",
    name: "Tasawaq (twq)"
  },
  {
    code: "twq-NE",
    name: "Tasawaq (Niger) (twq-NE)"
  },
  {
    code: "mi",
    name: "Te Reo Māori (mi)"
  },
  {
    code: "te",
    name: "Telugu (te)"
  },
  {
    code: "te-IN",
    name: "Telugu (India) (te-IN)"
  },
  {
    code: "teo",
    name: "Teso (teo)"
  },
  {
    code: "teo-KE",
    name: "Teso (Kenya) (teo-KE)"
  },
  {
    code: "teo-UG",
    name: "Teso (Uganda) (teo-UG)"
  },
  {
    code: "th",
    name: "Thai (th)"
  },
  {
    code: "th-TH",
    name: "Thai (Thailand) (th-TH)"
  },
  {
    code: "bo",
    name: "Tibetan (bo)"
  },
  {
    code: "bo-CN",
    name: "Tibetan (China) (bo-CN)"
  },
  {
    code: "bo-IN",
    name: "Tibetan (India) (bo-IN)"
  },
  {
    code: "ti",
    name: "Tigrinya (ti)"
  },
  {
    code: "ti-ER",
    name: "Tigrinya (Eritrea) (ti-ER)"
  },
  {
    code: "ti-ET",
    name: "Tigrinya (Ethiopia) (ti-ET)"
  },
  {
    code: "to",
    name: "Tongan (to)"
  },
  {
    code: "to-TO",
    name: "Tongan (Tonga) (to-TO)"
  },
  {
    code: "tr",
    name: "Turkish (tr)"
  },
  {
    code: "tk",
    name: "Turkmen (tk)"
  },
  {
    code: "tr-TR",
    name: "Turkish (Turkey) (tr-TR)"
  },
  {
    code: "tch",
    name: "Turks And Caicos Creole English"
  },
  {
    code: "uk",
    name: "Ukrainian (uk)"
  },
  {
    code: "uk-UA",
    name: "Ukrainian (Ukraine) (uk-UA)"
  },
  {
    code: "ur",
    name: "Urdu (ur)"
  },
  {
    code: "ur-IN",
    name: "Urdu (India) (ur-IN)"
  },
  {
    code: "ur-PK",
    name: "Urdu (Pakistan) (ur-PK)"
  },
  {
    code: "ug",
    name: "Uyghur"
  },
  {
    code: "ug-CN",
    name: "Uyghur (China)"
  },
  {
    code: "uz",
    name: "Uzbek (uz)"
  },
  {
    code: "uz-Arab",
    name: "Uzbek (Arabic) (uz-Arab)"
  },
  {
    code: "uz-Arab-AF",
    name: "Uzbek (Arabic, Afghanistan) (uz-Arab-AF)"
  },
  {
    code: "uz-Cyrl",
    name: "Uzbek (Cyrillic) (uz-Cyrl)"
  },
  {
    code: "uz-Cyrl-UZ",
    name: "Uzbek (Cyrillic, Uzbekistan) (uz-Cyrl-UZ)"
  },
  {
    code: "uz-Latn",
    name: "Uzbek (Latin) (uz-Latn)"
  },
  {
    code: "uz-Latn-UZ",
    name: "Uzbek (Latin, Uzbekistan) (uz-Latn-UZ)"
  },
  {
    code: "vai",
    name: "Vai (vai)"
  },
  {
    code: "vai-Latn",
    name: "Vai (Latin) (vai-Latn)"
  },
  {
    code: "vai-Latn-LR",
    name: "Vai (Latin, Liberia) (vai-Latn-LR)"
  },
  {
    code: "vai-Vaii",
    name: "Vai (Vai) (vai-Vaii)"
  },
  {
    code: "vai-Vaii-LR",
    name: "Vai (Vai, Liberia) (vai-Vaii-LR)"
  },
  {
    code: "val",
    name: "Valencian (val)"
  },
  {
    code: "val-ES",
    name: "Valencian (Spain) (val-ES)"
  },
  {
    code: "ca-ES-valencia",
    name: "Valencian (Spain Catalan) (ca-ES-valencia)"
  },
  {
    code: "vi",
    name: "Vietnamese (vi)"
  },
  {
    code: "vi-VN",
    name: "Vietnamese (Vietnam) (vi-VN)"
  },
  {
    code: "vun",
    name: "Vunjo (vun)"
  },
  {
    code: "vun-TZ",
    name: "Vunjo (Tanzania) (vun-TZ)"
  },
  {
    code: "cy",
    name: "Welsh (cy)"
  },
  {
    code: "cy-GB",
    name: "Welsh (United Kingdom) (cy-GB)"
  },
  {
    code: "yav",
    name: "Yangben (yav)"
  },
  {
    code: "yav-CM",
    name: "Yangben (Cameroon) (yav-CM)"
  },
  {
    code: "yo",
    name: "Yoruba (yo)"
  },
  {
    code: "yo-NG",
    name: "Yoruba (Nigeria) (yo-NG)"
  },
  {
    code: "dje",
    name: "Zarma (dje)"
  },
  {
    code: "dje-NE",
    name: "Zarma (Niger) (dje-NE)"
  },
  {
    code: "zu",
    name: "Zulu (zu)"
  },
  {
    code: "zu-ZA",
    name: "Zulu (South Africa) (zu-ZA)"
  }
];
const getInitLocale = () => {
  const envLocaleCode = process.env.STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE;
  if (envLocaleCode) {
    const matchingLocale = isoLocales.find(({ code }) => code === envLocaleCode);
    if (!matchingLocale) {
      throw new Error(
        "Unknown locale code provided in the environment variable STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE"
      );
    }
    return { ...matchingLocale };
  }
  return {
    code: "en",
    name: "English (en)"
  };
};
const DEFAULT_LOCALE = getInitLocale();
const enableContentType = async ({ oldContentTypes, contentTypes: contentTypes2 }) => {
  const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
  const { getDefaultLocale: getDefaultLocale2 } = getService("locales");
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes2) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes2[uid];
    if (!isLocalizedContentType2(oldContentType) && isLocalizedContentType2(contentType)) {
      const defaultLocale = await getDefaultLocale2() || DEFAULT_LOCALE.code;
      await strapi.db.queryBuilder(uid).update({ locale: defaultLocale }).where({ locale: null }).execute();
    }
  }
};
const disableContentType = async ({ oldContentTypes, contentTypes: contentTypes2 }) => {
  const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
  const { getDefaultLocale: getDefaultLocale2 } = getService("locales");
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes2) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes2[uid];
    if (isLocalizedContentType2(oldContentType) && !isLocalizedContentType2(contentType)) {
      const defaultLocale = await getDefaultLocale2() || DEFAULT_LOCALE.code;
      await strapi.db.queryBuilder(uid).delete().where({ locale: { $ne: defaultLocale } }).execute();
    }
  }
};
const register = ({ strapi: strapi2 }) => {
  extendLocalizedContentTypes(strapi2);
  addContentManagerLocaleMiddleware(strapi2);
  addContentTypeSyncHooks(strapi2);
};
const isUrlForCreation = (url) => {
  if (!url)
    return false;
  const path = url.split("?")[0];
  const splitUrl = path.split("/").filter(Boolean);
  const model = splitUrl[splitUrl.length - 1];
  return model.includes("::");
};
const addContentManagerLocaleMiddleware = (strapi2) => {
  strapi2.server.router.use("/content-manager/collection-types/:model", (ctx, next) => {
    if (ctx.method === "POST" && isUrlForCreation(ctx.originalUrl)) {
      return validateLocaleCreation(ctx, next);
    }
    return next();
  });
  strapi2.server.router.use("/content-manager/single-types/:model", (ctx, next) => {
    if (ctx.method === "PUT" && isUrlForCreation(ctx.originalUrl)) {
      return validateLocaleCreation(ctx, next);
    }
    return next();
  });
};
const addContentTypeSyncHooks = (strapi2) => {
  strapi2.hook("strapi::content-types.beforeSync").register(disableContentType);
  strapi2.hook("strapi::content-types.afterSync").register(enableContentType);
};
const extendLocalizedContentTypes = (strapi2) => {
  const contentTypeService = getService("content-types");
  const coreApiService = getService("core-api");
  Object.values(strapi2.contentTypes).forEach((contentType) => {
    if (contentTypeService.isLocalizedContentType(contentType)) {
      const { attributes: attributes2 } = contentType;
      _.set(attributes2, "localizations", {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "relation",
        relation: "oneToMany",
        target: contentType.uid
      });
      _.set(attributes2, "locale", {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: "string"
      });
      coreApiService.addCreateLocalizationAction(contentType);
    }
  });
  if (strapi2.plugin("graphql")) {
    graphqlProvider({ strapi: strapi2 }).register();
  }
};
const info = {
  singularName: "locale",
  pluralName: "locales",
  collectionName: "locales",
  displayName: "Locale",
  description: ""
};
const options = {
  draftAndPublish: false
};
const pluginOptions = {
  "content-manager": {
    visible: false
  },
  "content-type-builder": {
    visible: false
  }
};
const attributes = {
  name: {
    type: "string",
    min: 1,
    max: 50,
    configurable: false
  },
  code: {
    type: "string",
    unique: true,
    configurable: false
  }
};
const schema = {
  info,
  options,
  pluginOptions,
  attributes
};
const locale = {
  schema
};
const contentTypes$2 = {
  locale
};
const actions = [
  {
    section: "settings",
    category: "Internationalization",
    subCategory: "Locales",
    pluginName: "i18n",
    displayName: "Create",
    uid: "locale.create"
  },
  {
    section: "settings",
    category: "Internationalization",
    subCategory: "Locales",
    pluginName: "i18n",
    displayName: "Read",
    uid: "locale.read",
    aliases: [
      { actionId: "plugin::content-manager.explorer.read", subjects: ["plugin::i18n.locale"] }
    ]
  },
  {
    section: "settings",
    category: "Internationalization",
    subCategory: "Locales",
    pluginName: "i18n",
    displayName: "Update",
    uid: "locale.update"
  },
  {
    section: "settings",
    category: "Internationalization",
    subCategory: "Locales",
    pluginName: "i18n",
    displayName: "Delete",
    uid: "locale.delete"
  }
];
const addLocalesPropertyIfNeeded = ({ value: action }) => {
  const {
    section,
    options: { applyToProperties }
  } = action;
  if (section !== "contentTypes") {
    return;
  }
  if (isArray(applyToProperties) && applyToProperties.includes("locales")) {
    return;
  }
  action.options.applyToProperties = isArray(applyToProperties) ? applyToProperties.concat("locales") : ["locales"];
};
const shouldApplyLocalesPropertyToSubject = ({ property, subject }) => {
  if (property === "locales") {
    const model = strapi.getModel(subject);
    return getService("content-types").isLocalizedContentType(model);
  }
  return true;
};
const addAllLocalesToPermissions = async (permissions2) => {
  const { actionProvider } = strapi.admin.services.permission;
  const { find: findAllLocales } = getService("locales");
  const allLocales = await findAllLocales();
  const allLocalesCode = allLocales.map(prop("code"));
  return Promise.all(
    permissions2.map(async (permission) => {
      const { action, subject } = permission;
      const appliesToLocalesProperty = await actionProvider.appliesToProperty(
        "locales",
        action,
        subject
      );
      if (!appliesToLocalesProperty) {
        return permission;
      }
      const oldPermissionProperties = getOr({}, "properties", permission);
      return { ...permission, properties: { ...oldPermissionProperties, locales: allLocalesCode } };
    })
  );
};
const syncSuperAdminPermissionsWithLocales = async () => {
  const roleService = strapi.admin.services.role;
  const permissionService = strapi.admin.services.permission;
  const superAdminRole = await roleService.getSuperAdmin();
  if (!superAdminRole) {
    return;
  }
  const superAdminPermissions = await permissionService.findMany({
    where: {
      role: {
        id: superAdminRole.id
      }
    }
  });
  const newSuperAdminPermissions = await addAllLocalesToPermissions(superAdminPermissions);
  await roleService.assignPermissions(superAdminRole.id, newSuperAdminPermissions);
};
const registerI18nActions = async () => {
  const { actionProvider } = strapi.admin.services.permission;
  await actionProvider.registerMany(actions);
};
const registerI18nActionsHooks = () => {
  const { actionProvider } = strapi.admin.services.permission;
  const { hooks } = strapi.admin.services.role;
  actionProvider.hooks.appliesPropertyToSubject.register(shouldApplyLocalesPropertyToSubject);
  hooks.willResetSuperAdminPermissions.register(addAllLocalesToPermissions);
};
const updateActionsProperties = () => {
  const { actionProvider } = strapi.admin.services.permission;
  actionProvider.hooks.willRegister.register(addLocalesPropertyIfNeeded);
  actionProvider.values().forEach((action) => addLocalesPropertyIfNeeded({ value: action }));
};
const i18nActionsService = {
  actions,
  registerI18nActions,
  registerI18nActionsHooks,
  updateActionsProperties,
  syncSuperAdminPermissionsWithLocales
};
const localesPropertyHandler = async ({ action, section }) => {
  const { actionProvider } = strapi.admin.services.permission;
  const locales2 = await getService("locales").find();
  if (isEmpty(locales2)) {
    return;
  }
  for (const subject of section.subjects) {
    const applies = await actionProvider.appliesToProperty("locales", action.actionId, subject.uid);
    const hasLocalesProperty = subject.properties.find(
      (property) => property.value === "locales"
    );
    if (applies && !hasLocalesProperty) {
      subject.properties.push({
        label: "Locales",
        value: "locales",
        children: locales2.map(({ name, code }) => ({ label: name || code, value: code }))
      });
    }
  }
};
const registerLocalesPropertyHandler = () => {
  const { sectionsBuilder } = strapi.admin.services.permission;
  sectionsBuilder.addHandler("singleTypes", localesPropertyHandler);
  sectionsBuilder.addHandler("collectionTypes", localesPropertyHandler);
};
const sectionsBuilderService = {
  localesPropertyHandler,
  registerLocalesPropertyHandler
};
const willRegisterPermission = (context) => {
  const { permission, condition, user } = context;
  const { subject, properties } = permission;
  const isSuperAdmin = strapi.admin.services.role.hasSuperAdminRole(user);
  if (isSuperAdmin) {
    return;
  }
  const { locales: locales2 } = properties || {};
  const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
  if (!subject) {
    return;
  }
  const ct = strapi.contentTypes[subject];
  if (!isLocalizedContentType2(ct)) {
    return;
  }
  if (locales2 === null) {
    return;
  }
  condition.and({
    locale: {
      $in: locales2 || []
    }
  });
};
const registerI18nPermissionsHandlers = () => {
  const { engine } = strapi.admin.services.permission;
  engine.hooks["before-register.permission"].register(willRegisterPermission);
};
const engineService = {
  willRegisterPermission,
  registerI18nPermissionsHandlers
};
const permissions = () => ({
  actions: i18nActionsService,
  sectionsBuilder: sectionsBuilderService,
  engine: engineService
});
const sendDidInitializeEvent = async () => {
  const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
  const numberOfContentTypes = reduce(
    (sum, contentType) => isLocalizedContentType2(contentType) ? sum + 1 : sum,
    0
  )(strapi.contentTypes);
  await strapi.telemetry.send("didInitializeI18n", { groupProperties: { numberOfContentTypes } });
};
const sendDidUpdateI18nLocalesEvent = async () => {
  const numberOfLocales = await getService("locales").count();
  await strapi.telemetry.send("didUpdateI18nLocales", {
    groupProperties: { numberOfLocales }
  });
};
const metrics = () => ({
  sendDidInitializeEvent,
  sendDidUpdateI18nLocalesEvent
});
const isDialectMySQL = () => strapi.db.dialect.client === "mysql";
const assignDefaultLocaleToEntries = async (data) => {
  const { getDefaultLocale: getDefaultLocale2 } = getService("locales");
  if (isArray(data) && data.some((entry) => !entry.locale)) {
    const defaultLocale = await getDefaultLocale2();
    data.forEach((entry) => {
      entry.locale = entry.locale || defaultLocale;
    });
  } else if (!isArray(data) && isNil(data.locale)) {
    data.locale = await getDefaultLocale2();
  }
};
const syncLocalizations = async (entry, { model }) => {
  if (Array.isArray(entry?.localizations)) {
    const newLocalizations = [entry.id, ...entry.localizations.map(prop("id"))];
    const updateLocalization = (id) => {
      const localizations2 = newLocalizations.filter((localizationId) => localizationId !== id);
      return strapi.query(model.uid).update({ where: { id }, data: { localizations: localizations2 } });
    };
    await mapAsync(
      entry.localizations,
      (localization) => updateLocalization(localization.id),
      {
        concurrency: isDialectMySQL() && !strapi.db.inTransaction() ? 1 : Infinity
      }
    );
  }
};
const syncNonLocalizedAttributes = async (entry, { model }) => {
  const { copyNonLocalizedAttributes: copyNonLocalizedAttributes2 } = getService("content-types");
  if (Array.isArray(entry?.localizations)) {
    const nonLocalizedAttributes = copyNonLocalizedAttributes2(model, entry);
    if (isEmpty(nonLocalizedAttributes)) {
      return;
    }
    const updateLocalization = (id) => {
      return strapi.entityService.update(model.uid, id, { data: nonLocalizedAttributes });
    };
    await mapAsync(
      entry.localizations,
      (localization) => updateLocalization(localization.id),
      {
        concurrency: isDialectMySQL() && !strapi.db.inTransaction() ? 1 : Infinity
      }
    );
  }
};
const localizations = () => ({
  assignDefaultLocaleToEntries,
  syncLocalizations,
  syncNonLocalizedAttributes
});
const find = (params = {}) => strapi.query("plugin::i18n.locale").findMany({ where: params });
const findById = (id) => strapi.query("plugin::i18n.locale").findOne({ where: { id } });
const findByCode = (code) => strapi.query("plugin::i18n.locale").findOne({ where: { code } });
const count = (params = {}) => strapi.query("plugin::i18n.locale").count({ where: params });
const create = async (locale2) => {
  const result = await strapi.query("plugin::i18n.locale").create({ data: locale2 });
  getService("metrics").sendDidUpdateI18nLocalesEvent();
  return result;
};
const update = async (params, updates) => {
  const result = await strapi.query("plugin::i18n.locale").update({ where: params, data: updates });
  getService("metrics").sendDidUpdateI18nLocalesEvent();
  return result;
};
const deleteFn = async ({ id }) => {
  const localeToDelete = await findById(id);
  if (localeToDelete) {
    await deleteAllLocalizedEntriesFor({ locale: localeToDelete.code });
    const result = await strapi.query("plugin::i18n.locale").delete({ where: { id } });
    getService("metrics").sendDidUpdateI18nLocalesEvent();
    return result;
  }
  return localeToDelete;
};
const setDefaultLocale = ({ code }) => getCoreStore().set({ key: "default_locale", value: code });
const getDefaultLocale = () => getCoreStore().get({ key: "default_locale" });
const setIsDefault = async (locales2) => {
  if (isNil(locales2)) {
    return locales2;
  }
  const actualDefault = await getDefaultLocale();
  if (Array.isArray(locales2)) {
    return locales2.map((locale2) => ({ ...locale2, isDefault: actualDefault === locale2.code }));
  }
  return { ...locales2, isDefault: actualDefault === locales2.code };
};
const initDefaultLocale = async () => {
  const existingLocalesNb = await strapi.query("plugin::i18n.locale").count();
  if (existingLocalesNb === 0) {
    await create(DEFAULT_LOCALE);
    await setDefaultLocale({ code: DEFAULT_LOCALE.code });
  }
};
const deleteAllLocalizedEntriesFor = async ({ locale: locale2 }) => {
  const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
  const localizedModels = Object.values(strapi.contentTypes).filter(isLocalizedContentType2);
  for (const model of localizedModels) {
    await strapi.query(model.uid).deleteMany({ where: { locale: locale2 } });
  }
};
const locales = () => ({
  find,
  findById,
  findByCode,
  create,
  update,
  count,
  setDefaultLocale,
  getDefaultLocale,
  setIsDefault,
  delete: deleteFn,
  initDefaultLocale
});
const getIsoLocales = () => isoLocales;
const isoLocalesService = () => ({
  getIsoLocales
});
const { transformParamsToQuery } = convertQueryParams;
const { ApplicationError: ApplicationError$4 } = errors;
const LOCALE_QUERY_FILTER = "locale";
const SINGLE_ENTRY_ACTIONS = ["findOne", "update", "delete"];
const BULK_ACTIONS = ["delete"];
const paramsContain = (key, params) => {
  return has(key, params.filters) || isArray(params.filters) && params.filters.some((clause) => has(key, clause)) || isArray(get("$and", params.filters)) && params.filters.$and.some((clause) => has(key, clause));
};
const wrapParams = async (params = {}, ctx = {}) => {
  const { action } = ctx;
  if (has(LOCALE_QUERY_FILTER, params)) {
    if (params[LOCALE_QUERY_FILTER] === "all") {
      return omit(LOCALE_QUERY_FILTER, params);
    }
    return {
      ...omit(LOCALE_QUERY_FILTER, params),
      filters: {
        $and: [{ locale: params[LOCALE_QUERY_FILTER] }].concat(params.filters || [])
      }
    };
  }
  const entityDefinedById = paramsContain("id", params) && SINGLE_ENTRY_ACTIONS.includes(action);
  const entitiesDefinedByIds = paramsContain("id.$in", params) && BULK_ACTIONS.includes(action);
  if (entityDefinedById || entitiesDefinedByIds) {
    return params;
  }
  const { getDefaultLocale: getDefaultLocale2 } = getService("locales");
  return {
    ...params,
    filters: {
      $and: [{ locale: await getDefaultLocale2() }].concat(params.filters || [])
    }
  };
};
const assignValidLocale = async (data) => {
  const { getValidLocale: getValidLocale2 } = getService("content-types");
  if (!data) {
    return;
  }
  try {
    data.locale = await getValidLocale2(data.locale);
  } catch (e) {
    throw new ApplicationError$4("This locale doesn't exist");
  }
};
const decorator = (service) => ({
  /**
   * Wraps result
   * @param {object} result - result object of query
   * @param {object} ctx - Query context
   * @param {object} ctx.model - Model that is being used
   */
  async wrapResult(result = {}, ctx = {}) {
    return service.wrapResult.call(this, result, ctx);
  },
  /**
   * Wraps query options. In particular will add default locale to query params
   * @param {object} params - Query options object (params, data, files, populate)
   * @param {object} ctx - Query context
   * @param {object} ctx.model - Model that is being used
   */
  async wrapParams(params = {}, ctx = {}) {
    const wrappedParams = await service.wrapParams.call(this, params, ctx);
    const model = strapi.getModel(ctx.uid);
    const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
    if (!isLocalizedContentType2(model)) {
      return wrappedParams;
    }
    return wrapParams(wrappedParams, ctx);
  },
  /**
   * Creates an entry & make links between it and its related localizations
   * @param {string} uid - Model uid
   * @param {object} opts - Query options object (params, data, files, populate)
   */
  async create(uid, opts = {}) {
    const model = strapi.getModel(uid);
    const { syncLocalizations: syncLocalizations2, syncNonLocalizedAttributes: syncNonLocalizedAttributes2 } = getService("localizations");
    const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
    if (!isLocalizedContentType2(model)) {
      return service.create.call(this, uid, opts);
    }
    const { data } = opts;
    await assignValidLocale(data);
    const entry = await service.create.call(this, uid, opts);
    await syncLocalizations2(entry, { model });
    await syncNonLocalizedAttributes2(entry, { model });
    return entry;
  },
  /**
   * Updates an entry & update related localizations fields
   * @param {string} uid
   * @param {string} entityId
   * @param {object} opts - Query options object (params, data, files, populate)
   */
  async update(uid, entityId, opts = {}) {
    const model = strapi.getModel(uid);
    const { syncNonLocalizedAttributes: syncNonLocalizedAttributes2 } = getService("localizations");
    const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
    if (!isLocalizedContentType2(model)) {
      return service.update.call(this, uid, entityId, opts);
    }
    const { data, ...restOptions } = opts;
    const entry = await service.update.call(this, uid, entityId, {
      ...restOptions,
      data: omit(["locale", "localizations"], data)
    });
    await syncNonLocalizedAttributes2(entry, { model });
    return entry;
  },
  /**
   * Find an entry or several if fetching all locales
   * @param {string} uid - Model uid
   * @param {object} opts - Query options object (params, data, files, populate)
   */
  async findMany(uid, opts) {
    const model = strapi.getModel(uid);
    const { isLocalizedContentType: isLocalizedContentType2 } = getService("content-types");
    if (!isLocalizedContentType2(model)) {
      return service.findMany.call(this, uid, opts);
    }
    const { kind } = model;
    if (kind === "singleType") {
      if (opts[LOCALE_QUERY_FILTER] === "all") {
        const wrappedParams = await this.wrapParams(opts, { uid, action: "findMany" });
        const query = transformParamsToQuery(uid, wrappedParams);
        const entities = await strapi.db.query(uid).findMany(query);
        return this.wrapResult(entities, { uid, action: "findMany" });
      }
      return service.findMany.call(this, uid, opts);
    }
    return service.findMany.call(this, uid, opts);
  }
});
const entityServiceDecorator = () => ({
  decorator,
  wrapParams
});
const { contentTypes: contentTypes$1, parseMultipartData, sanitize: sanitize$1 } = utils__default;
const { ApplicationError: ApplicationError$3, NotFoundError } = utils__default.errors;
const { getContentTypeRoutePrefix, isSingleType, getWritableAttributes } = contentTypes$1;
const getAllLocales = (entry) => {
  return [entry.locale, ...map(prop("locale"), entry.localizations)];
};
const getAllLocalizationsIds = (entry) => {
  return [entry.id, ...map(prop("id"), entry.localizations)];
};
const createSanitizer = (contentType) => {
  const getAllowedAttributes = () => {
    return getWritableAttributes(contentType).filter(
      (attributeName) => !["locale", "localizations"].includes(attributeName)
    );
  };
  const sanitizeInputFiles = (files) => {
    const allowedFields = getAllowedAttributes();
    return reduce(
      (acc, keyPath) => {
        const [rootKey] = toPath(keyPath);
        if (allowedFields.includes(rootKey)) {
          acc[keyPath] = files[keyPath];
        }
        return acc;
      },
      {},
      keys(files)
    );
  };
  const sanitizeInput = (data) => {
    return pick(getAllowedAttributes(), data);
  };
  return { sanitizeInput, sanitizeInputFiles };
};
const createLocalizationHandler = (contentType) => {
  const handler = createCreateLocalizationHandler(contentType);
  return (ctx = {}) => {
    const { id } = ctx.params;
    const { data, files } = parseMultipartData(ctx);
    return handler({ id, data, files });
  };
};
const createCreateLocalizationHandler = (contentType) => async (args = {}) => {
  const { copyNonLocalizedAttributes: copyNonLocalizedAttributes2 } = getService("content-types");
  const { sanitizeInput, sanitizeInputFiles } = createSanitizer(contentType);
  const entry = isSingleType(contentType) ? await strapi.query(contentType.uid).findOne({ populate: ["localizations"] }) : await strapi.query(contentType.uid).findOne({ where: { id: args.id }, populate: ["localizations"] });
  if (!entry) {
    throw new NotFoundError();
  }
  const { data, files } = args;
  const { findByCode: findByCode2 } = getService("locales");
  if (isNil(data.locale)) {
    throw new ApplicationError$3("locale is missing");
  }
  const matchingLocale = await findByCode2(data.locale);
  if (!matchingLocale) {
    throw new ApplicationError$3("locale is invalid");
  }
  const usedLocales = getAllLocales(entry);
  if (usedLocales.includes(data.locale)) {
    throw new ApplicationError$3("locale is already used");
  }
  const sanitizedData = {
    ...copyNonLocalizedAttributes2(contentType, entry),
    ...sanitizeInput(data),
    locale: data.locale,
    localizations: getAllLocalizationsIds(entry)
  };
  const sanitizedFiles = sanitizeInputFiles(files);
  const newEntry = await strapi.entityService.create(contentType.uid, {
    data: sanitizedData,
    files: sanitizedFiles,
    populate: ["localizations"]
  });
  return sanitize$1.contentAPI.output(newEntry, strapi.getModel(contentType.uid));
};
const createLocalizationRoute = (contentType) => {
  const { modelName } = contentType;
  const routePrefix = getContentTypeRoutePrefix(contentType);
  const routePath = isSingleType(contentType) ? `/${routePrefix}/localizations` : `/${routePrefix}/:id/localizations`;
  return {
    method: "POST",
    path: routePath,
    handler: `${modelName}.createLocalization`,
    config: {
      policies: []
    }
  };
};
const addCreateLocalizationAction = (contentType) => {
  const { modelName, apiName } = contentType;
  if (!apiName) {
    return;
  }
  const localizationRoute = createLocalizationRoute(contentType);
  strapi.api[apiName].routes[modelName].routes.push(localizationRoute);
  strapi.container.get("controllers").extend(`api::${apiName}.${modelName}`, (controller2) => {
    return Object.assign(controller2, {
      createLocalization: createLocalizationHandler(contentType)
    });
  });
};
const mergeCustomizer = (dest, src) => {
  if (typeof dest === "string") {
    return `${dest}
${src}`;
  }
};
const addGraphqlSchema = (schema2) => {
  _.mergeWith(strapi.config.get("plugin.i18n.schema.graphql"), schema2, mergeCustomizer);
};
const addGraphqlLocalizationAction = (contentType) => {
  const { globalId, modelName } = contentType;
  if (!strapi.plugins.graphql) {
    return;
  }
  const { toSingular, toPlural } = strapi.plugin("graphql").service("naming");
  const localeArgs = {
    args: {
      locale: "String"
    }
  };
  if (isSingleType(contentType)) {
    const queryName = toSingular(modelName);
    const mutationSuffix = _.upperFirst(queryName);
    addGraphqlSchema({
      resolver: {
        Query: {
          [queryName]: localeArgs
        },
        Mutation: {
          [`update${mutationSuffix}`]: localeArgs,
          [`delete${mutationSuffix}`]: localeArgs
        }
      }
    });
  } else {
    const queryName = toPlural(modelName);
    addGraphqlSchema({
      resolver: {
        Query: {
          [queryName]: localeArgs,
          [`${queryName}Connection`]: localeArgs
        }
      }
    });
  }
  const typeName = globalId;
  const capitalizedName = _.upperFirst(toSingular(modelName));
  const mutationName = `create${capitalizedName}Localization`;
  const mutationDef = `${mutationName}(input: update${capitalizedName}Input!): ${typeName}!`;
  const actionName = `${contentType.uid}.createLocalization`;
  addGraphqlSchema({
    mutation: mutationDef,
    resolver: {
      Mutation: {
        [mutationName]: {
          resolver: actionName
        }
      }
    }
  });
};
const coreApi = () => ({
  addCreateLocalizationAction,
  addGraphqlLocalizationAction,
  createSanitizer,
  createCreateLocalizationHandler
});
const { isRelationalAttribute, getVisibleAttributes, isTypedAttribute, getScalarAttributes } = contentTypes$3;
const { ApplicationError: ApplicationError$2 } = errors;
const hasLocalizedOption = (modelOrAttribute) => {
  return prop("pluginOptions.i18n.localized", modelOrAttribute) === true;
};
const getValidLocale = async (locale2) => {
  const localesService = getService("locales");
  if (isNil(locale2)) {
    return localesService.getDefaultLocale();
  }
  const foundLocale = await localesService.findByCode(locale2);
  if (!foundLocale) {
    throw new ApplicationError$2("Locale not found");
  }
  return locale2;
};
const getNewLocalizationsFrom = async (relatedEntity) => {
  if (relatedEntity) {
    return [relatedEntity.id, ...relatedEntity.localizations.map(prop("id"))];
  }
  return [];
};
const getAndValidateRelatedEntity = async (relatedEntityId, model, locale2) => {
  const { kind } = strapi.getModel(model);
  let relatedEntity;
  if (kind === "singleType") {
    relatedEntity = await strapi.query(model).findOne({ populate: ["localizations"] });
  } else if (relatedEntityId) {
    relatedEntity = await strapi.query(model).findOne({ where: { id: relatedEntityId }, populate: ["localizations"] });
  }
  if (relatedEntityId && !relatedEntity) {
    throw new ApplicationError$2("The related entity doesn't exist");
  }
  if (relatedEntity && (relatedEntity.locale === locale2 || relatedEntity.localizations.map(prop("locale")).includes(locale2))) {
    throw new ApplicationError$2("The entity already exists in this locale");
  }
  return relatedEntity;
};
const isLocalizedAttribute = (attribute) => {
  return hasLocalizedOption(attribute) || isRelationalAttribute(attribute) || isTypedAttribute(attribute, "uid");
};
const isLocalizedContentType = (model) => {
  return hasLocalizedOption(model);
};
const getNonLocalizedAttributes = (model) => {
  return getVisibleAttributes(model).filter(
    (attrName) => !isLocalizedAttribute(model.attributes[attrName])
  );
};
const removeId = (value) => {
  if (typeof value === "object" && has("id", value)) {
    delete value.id;
  }
};
const removeIds = (model) => (entry) => removeIdsMut(model, cloneDeep(entry));
const removeIdsMut = (model, entry) => {
  if (isNil(entry)) {
    return entry;
  }
  removeId(entry);
  _.forEach(model.attributes, (attr, attrName) => {
    const value = entry[attrName];
    if (attr.type === "dynamiczone" && isArray(value)) {
      value.forEach((compo) => {
        if (has("__component", compo)) {
          const model2 = strapi.components[compo.__component];
          removeIdsMut(model2, compo);
        }
      });
    } else if (attr.type === "component") {
      const model2 = strapi.components[attr.component];
      if (isArray(value)) {
        value.forEach((compo) => removeIdsMut(model2, compo));
      } else {
        removeIdsMut(model2, value);
      }
    }
  });
  return entry;
};
const copyNonLocalizedAttributes = (model, entry) => {
  const nonLocalizedAttributes = getNonLocalizedAttributes(model);
  return pipe(pick(nonLocalizedAttributes), removeIds(model))(entry);
};
const getLocalizedAttributes = (model) => {
  return getVisibleAttributes(model).filter(
    (attrName) => isLocalizedAttribute(model.attributes[attrName])
  );
};
const fillNonLocalizedAttributes = (entry, relatedEntry, { model }) => {
  if (isNil(relatedEntry)) {
    return;
  }
  const modelDef = strapi.getModel(model);
  const relatedEntryCopy = copyNonLocalizedAttributes(modelDef, relatedEntry);
  _.forEach(relatedEntryCopy, (value, field) => {
    if (isNil(entry[field])) {
      entry[field] = value;
    }
  });
};
const getNestedPopulateOfNonLocalizedAttributes = (modelUID) => {
  const schema2 = strapi.getModel(modelUID);
  const scalarAttributes = getScalarAttributes(schema2);
  const nonLocalizedAttributes = getNonLocalizedAttributes(schema2);
  const currentAttributesToPopulate = difference(nonLocalizedAttributes, scalarAttributes);
  const attributesToPopulate = [...currentAttributesToPopulate];
  for (const attrName of currentAttributesToPopulate) {
    const attr = schema2.attributes[attrName];
    if (attr.type === "component") {
      const nestedPopulate = getNestedPopulateOfNonLocalizedAttributes(attr.component).map(
        (nestedAttr) => `${attrName}.${nestedAttr}`
      );
      attributesToPopulate.push(...nestedPopulate);
    } else if (attr.type === "dynamiczone") {
      attr.components.forEach((componentName) => {
        const nestedPopulate = getNestedPopulateOfNonLocalizedAttributes(componentName).map(
          (nestedAttr) => `${attrName}.${nestedAttr}`
        );
        attributesToPopulate.push(...nestedPopulate);
      });
    }
  }
  return attributesToPopulate;
};
const contentTypes = () => ({
  isLocalizedContentType,
  getValidLocale,
  getNewLocalizationsFrom,
  getLocalizedAttributes,
  getNonLocalizedAttributes,
  copyNonLocalizedAttributes,
  getAndValidateRelatedEntity,
  fillNonLocalizedAttributes,
  getNestedPopulateOfNonLocalizedAttributes
});
const services = {
  permissions,
  metrics,
  localizations,
  locales,
  "iso-locales": isoLocalesService,
  "entity-service-decorator": entityServiceDecorator,
  "core-api": coreApi,
  "content-types": contentTypes
};
const admin = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/iso-locales",
      handler: "iso-locales.listIsoLocales",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::i18n.locale.read"] }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/locales",
      handler: "locales.listLocales",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    },
    {
      method: "POST",
      path: "/locales",
      handler: "locales.createLocale",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::i18n.locale.create"] }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/locales/:id",
      handler: "locales.updateLocale",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::i18n.locale.update"] }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/locales/:id",
      handler: "locales.deleteLocale",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "plugin::content-manager.hasPermissions",
            config: { actions: ["plugin::i18n.locale.delete"] }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/content-manager/actions/get-non-localized-fields",
      handler: "content-types.getNonLocalizedAttributes",
      config: {
        policies: ["admin::isAuthenticatedAdmin"]
      }
    }
  ]
};
const contentApi = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/locales",
      handler: "locales.listLocales"
    }
  ]
};
const routes = {
  admin,
  "content-api": contentApi
};
const allowedLocaleCodes = isoLocales.map(prop("code"));
const createLocaleSchema = yup.object().shape({
  name: yup.string().max(50).nullable(),
  code: yup.string().oneOf(allowedLocaleCodes).required(),
  isDefault: yup.boolean().required()
}).noUnknown();
const updateLocaleSchema = yup.object().shape({
  name: yup.string().min(1).max(50).nullable(),
  isDefault: yup.boolean()
}).noUnknown();
const validateCreateLocaleInput = validateYupSchema(createLocaleSchema);
const validateUpdateLocaleInput = validateYupSchema(updateLocaleSchema);
const formatLocale = (locale2) => {
  return {
    ...locale2,
    name: locale2.name || null
  };
};
const { setCreatorFields, sanitize } = utils;
const { ApplicationError: ApplicationError$1 } = utils.errors;
const sanitizeLocale = (locale2) => {
  const model = strapi.getModel("plugin::i18n.locale");
  return sanitize.contentAPI.output(locale2, model);
};
const controller$2 = {
  async listLocales(ctx) {
    const localesService = getService("locales");
    const locales2 = await localesService.find();
    const sanitizedLocales = await sanitizeLocale(locales2);
    ctx.body = await localesService.setIsDefault(sanitizedLocales);
  },
  async createLocale(ctx) {
    const { user } = ctx.state;
    const { body } = ctx.request;
    const { isDefault, ...localeToCreate } = body;
    await validateCreateLocaleInput(body);
    const localesService = getService("locales");
    const existingLocale = await localesService.findByCode(body.code);
    if (existingLocale) {
      throw new ApplicationError$1("This locale already exists");
    }
    const localeToPersist = setCreatorFields({ user })(formatLocale(localeToCreate));
    const locale2 = await localesService.create(localeToPersist);
    if (isDefault) {
      await localesService.setDefaultLocale(locale2);
    }
    const sanitizedLocale = await sanitizeLocale(locale2);
    ctx.body = await localesService.setIsDefault(sanitizedLocale);
  },
  async updateLocale(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    const { body } = ctx.request;
    const { isDefault, ...updates } = body;
    await validateUpdateLocaleInput(body);
    const localesService = getService("locales");
    const existingLocale = await localesService.findById(id);
    if (!existingLocale) {
      return ctx.notFound("locale.notFound");
    }
    const allowedParams = ["name"];
    const cleanUpdates = setCreatorFields({ user, isEdition: true })(pick(allowedParams, updates));
    const updatedLocale = await localesService.update({ id }, cleanUpdates);
    if (isDefault) {
      await localesService.setDefaultLocale(updatedLocale);
    }
    const sanitizedLocale = await sanitizeLocale(updatedLocale);
    ctx.body = await localesService.setIsDefault(sanitizedLocale);
  },
  async deleteLocale(ctx) {
    const { id } = ctx.params;
    const localesService = getService("locales");
    const existingLocale = await localesService.findById(id);
    if (!existingLocale) {
      return ctx.notFound("locale.notFound");
    }
    const defaultLocaleCode = await localesService.getDefaultLocale();
    if (existingLocale.code === defaultLocaleCode) {
      throw new ApplicationError$1("Cannot delete the default locale");
    }
    await localesService.delete({ id });
    const sanitizedLocale = await sanitizeLocale(existingLocale);
    ctx.body = await localesService.setIsDefault(sanitizedLocale);
  }
};
const validateGetNonLocalizedAttributesSchema = yup.object().shape({
  model: yup.string().required(),
  id: yup.mixed().when("model", {
    is: (model) => get("kind", strapi.contentType(model)) === "singleType",
    then: yup.strapiID().nullable(),
    otherwise: yup.strapiID().required()
  }),
  locale: yup.string().required()
}).noUnknown().required();
const validateGetNonLocalizedAttributesInput = validateYupSchema(
  validateGetNonLocalizedAttributesSchema
);
const { ApplicationError } = errors;
const { PUBLISHED_AT_ATTRIBUTE } = contentTypes$3.constants;
const getLocalesProperty = getOr([], "properties.locales");
const getFieldsProperty = prop("properties.fields");
const getFirstLevelPath = map((path) => path.split(".")[0]);
const controller$1 = {
  async getNonLocalizedAttributes(ctx) {
    const { user } = ctx.state;
    const { model, id, locale: locale2 } = ctx.request.body;
    await validateGetNonLocalizedAttributesInput({ model, id, locale: locale2 });
    const {
      copyNonLocalizedAttributes: copyNonLocalizedAttributes2,
      isLocalizedContentType: isLocalizedContentType2,
      getNestedPopulateOfNonLocalizedAttributes: getNestedPopulateOfNonLocalizedAttributes2
    } = getService("content-types");
    const {
      default: { READ_ACTION, CREATE_ACTION }
    } = strapi.admin.services.constants;
    const modelDef = strapi.contentType(model);
    const attributesToPopulate = getNestedPopulateOfNonLocalizedAttributes2(model);
    if (!isLocalizedContentType2(modelDef)) {
      throw new ApplicationError("model.not.localized");
    }
    const params = modelDef.kind === "singleType" ? {} : { id };
    const entity = await strapi.query(model).findOne({ where: params, populate: [...attributesToPopulate, "localizations"] });
    if (!entity) {
      return ctx.notFound();
    }
    const permissions2 = await strapi.admin.services.permission.findMany({
      where: {
        action: [READ_ACTION, CREATE_ACTION],
        subject: model,
        role: {
          id: user.roles.map(prop("id"))
        }
      }
    });
    const localePermissions = permissions2.filter((perm) => getLocalesProperty(perm).includes(locale2)).map(getFieldsProperty);
    const permittedFields = pipe(flatten, getFirstLevelPath, uniq)(localePermissions);
    const nonLocalizedFields = copyNonLocalizedAttributes2(modelDef, entity);
    const sanitizedNonLocalizedFields = pick(permittedFields, nonLocalizedFields);
    ctx.body = {
      nonLocalizedFields: sanitizedNonLocalizedFields,
      localizations: entity.localizations.concat(
        pick(["id", "locale", PUBLISHED_AT_ATTRIBUTE], entity)
      )
    };
  }
};
const controller = {
  listIsoLocales(ctx) {
    const isoLocalesService2 = getService("iso-locales");
    ctx.body = isoLocalesService2.getIsoLocales();
  }
};
const controllers = {
  locales: controller$2,
  "iso-locales": controller,
  "content-types": controller$1
};
const index = () => ({
  register,
  bootstrap,
  routes,
  controllers,
  contentTypes: contentTypes$2,
  services
});
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
