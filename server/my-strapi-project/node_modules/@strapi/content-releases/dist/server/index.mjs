import { contentTypes as contentTypes$1, mapAsync, setCreatorFields, errors, validateYupSchema, yup as yup$1 } from "@strapi/utils";
import isEqual from "lodash/isEqual";
import { difference, keys } from "lodash";
import _ from "lodash/fp";
import EE from "@strapi/strapi/dist/utils/ee";
import { scheduleJob } from "node-schedule";
import * as yup from "yup";
const RELEASE_MODEL_UID = "plugin::content-releases.release";
const RELEASE_ACTION_MODEL_UID = "plugin::content-releases.release-action";
const ACTIONS = [
  {
    section: "plugins",
    displayName: "Read",
    uid: "read",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Create",
    uid: "create",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Edit",
    uid: "update",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Delete",
    uid: "delete",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Publish",
    uid: "publish",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Remove an entry from a release",
    uid: "delete-action",
    pluginName: "content-releases"
  },
  {
    section: "plugins",
    displayName: "Add an entry to a release",
    uid: "create-action",
    pluginName: "content-releases"
  }
];
const ALLOWED_WEBHOOK_EVENTS = {
  RELEASES_PUBLISH: "releases.publish"
};
const getService = (name, { strapi: strapi2 } = { strapi: global.strapi }) => {
  return strapi2.plugin("content-releases").service(name);
};
const getPopulatedEntry = async (contentTypeUid, entryId, { strapi: strapi2 } = { strapi: global.strapi }) => {
  const populateBuilderService = strapi2.plugin("content-manager").service("populate-builder");
  const populate = await populateBuilderService(contentTypeUid).populateDeep(Infinity).build();
  const entry = await strapi2.entityService.findOne(contentTypeUid, entryId, { populate });
  return entry;
};
const getEntryValidStatus = async (contentTypeUid, entry, { strapi: strapi2 } = { strapi: global.strapi }) => {
  try {
    await strapi2.entityValidator.validateEntityCreation(
      strapi2.getModel(contentTypeUid),
      entry,
      void 0,
      // @ts-expect-error - FIXME: entity here is unnecessary
      entry
    );
    return true;
  } catch {
    return false;
  }
};
async function deleteActionsOnDisableDraftAndPublish({
  oldContentTypes,
  contentTypes: contentTypes2
}) {
  if (!oldContentTypes) {
    return;
  }
  for (const uid in contentTypes2) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes2[uid];
    if (contentTypes$1.hasDraftAndPublish(oldContentType) && !contentTypes$1.hasDraftAndPublish(contentType)) {
      await strapi.db?.queryBuilder(RELEASE_ACTION_MODEL_UID).delete().where({ contentType: uid }).execute();
    }
  }
}
async function deleteActionsOnDeleteContentType({ oldContentTypes, contentTypes: contentTypes2 }) {
  const deletedContentTypes = difference(keys(oldContentTypes), keys(contentTypes2)) ?? [];
  if (deletedContentTypes.length) {
    await mapAsync(deletedContentTypes, async (deletedContentTypeUID) => {
      return strapi.db?.queryBuilder(RELEASE_ACTION_MODEL_UID).delete().where({ contentType: deletedContentTypeUID }).execute();
    });
  }
}
async function migrateIsValidAndStatusReleases() {
  const releasesWithoutStatus = await strapi.db.query(RELEASE_MODEL_UID).findMany({
    where: {
      status: null,
      releasedAt: null
    },
    populate: {
      actions: {
        populate: {
          entry: true
        }
      }
    }
  });
  mapAsync(releasesWithoutStatus, async (release2) => {
    const actions = release2.actions;
    const notValidatedActions = actions.filter((action) => action.isEntryValid === null);
    for (const action of notValidatedActions) {
      if (action.entry) {
        const populatedEntry = await getPopulatedEntry(action.contentType, action.entry.id, {
          strapi
        });
        if (populatedEntry) {
          const isEntryValid = getEntryValidStatus(action.contentType, populatedEntry, { strapi });
          await strapi.db.query(RELEASE_ACTION_MODEL_UID).update({
            where: {
              id: action.id
            },
            data: {
              isEntryValid
            }
          });
        }
      }
    }
    return getService("release", { strapi }).updateReleaseStatus(release2.id);
  });
  const publishedReleases = await strapi.db.query(RELEASE_MODEL_UID).findMany({
    where: {
      status: null,
      releasedAt: {
        $notNull: true
      }
    }
  });
  mapAsync(publishedReleases, async (release2) => {
    return strapi.db.query(RELEASE_MODEL_UID).update({
      where: {
        id: release2.id
      },
      data: {
        status: "done"
      }
    });
  });
}
async function revalidateChangedContentTypes({ oldContentTypes, contentTypes: contentTypes2 }) {
  if (oldContentTypes !== void 0 && contentTypes2 !== void 0) {
    const contentTypesWithDraftAndPublish = Object.keys(oldContentTypes).filter(
      (uid) => oldContentTypes[uid]?.options?.draftAndPublish
    );
    const releasesAffected = /* @__PURE__ */ new Set();
    mapAsync(contentTypesWithDraftAndPublish, async (contentTypeUID) => {
      const oldContentType = oldContentTypes[contentTypeUID];
      const contentType = contentTypes2[contentTypeUID];
      if (!isEqual(oldContentType?.attributes, contentType?.attributes)) {
        const actions = await strapi.db.query(RELEASE_ACTION_MODEL_UID).findMany({
          where: {
            contentType: contentTypeUID
          },
          populate: {
            entry: true,
            release: true
          }
        });
        await mapAsync(actions, async (action) => {
          if (action.entry && action.release) {
            const populatedEntry = await getPopulatedEntry(contentTypeUID, action.entry.id, {
              strapi
            });
            if (populatedEntry) {
              const isEntryValid = await getEntryValidStatus(contentTypeUID, populatedEntry, {
                strapi
              });
              releasesAffected.add(action.release.id);
              await strapi.db.query(RELEASE_ACTION_MODEL_UID).update({
                where: {
                  id: action.id
                },
                data: {
                  isEntryValid
                }
              });
            }
          }
        });
      }
    }).then(() => {
      mapAsync(releasesAffected, async (releaseId) => {
        return getService("release", { strapi }).updateReleaseStatus(releaseId);
      });
    });
  }
}
async function disableContentTypeLocalized({ oldContentTypes, contentTypes: contentTypes2 }) {
  if (!oldContentTypes) {
    return;
  }
  const i18nPlugin = strapi.plugin("i18n");
  if (!i18nPlugin) {
    return;
  }
  for (const uid in contentTypes2) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes2[uid];
    const { isLocalizedContentType } = i18nPlugin.service("content-types");
    if (isLocalizedContentType(oldContentType) && !isLocalizedContentType(contentType)) {
      await strapi.db.queryBuilder(RELEASE_ACTION_MODEL_UID).update({
        locale: null
      }).where({ contentType: uid }).execute();
    }
  }
}
async function enableContentTypeLocalized({ oldContentTypes, contentTypes: contentTypes2 }) {
  if (!oldContentTypes) {
    return;
  }
  const i18nPlugin = strapi.plugin("i18n");
  if (!i18nPlugin) {
    return;
  }
  for (const uid in contentTypes2) {
    if (!oldContentTypes[uid]) {
      continue;
    }
    const oldContentType = oldContentTypes[uid];
    const contentType = contentTypes2[uid];
    const { isLocalizedContentType } = i18nPlugin.service("content-types");
    const { getDefaultLocale } = i18nPlugin.service("locales");
    if (!isLocalizedContentType(oldContentType) && isLocalizedContentType(contentType)) {
      const defaultLocale = await getDefaultLocale();
      await strapi.db.queryBuilder(RELEASE_ACTION_MODEL_UID).update({
        locale: defaultLocale
      }).where({ contentType: uid }).execute();
    }
  }
}
const { features: features$2 } = require("@strapi/strapi/dist/utils/ee");
const register = async ({ strapi: strapi2 }) => {
  if (features$2.isEnabled("cms-content-releases")) {
    await strapi2.admin.services.permission.actionProvider.registerMany(ACTIONS);
    strapi2.hook("strapi::content-types.beforeSync").register(deleteActionsOnDisableDraftAndPublish).register(disableContentTypeLocalized);
    strapi2.hook("strapi::content-types.afterSync").register(deleteActionsOnDeleteContentType).register(enableContentTypeLocalized).register(revalidateChangedContentTypes).register(migrateIsValidAndStatusReleases);
  }
  if (strapi2.plugin("graphql")) {
    const graphqlExtensionService = strapi2.plugin("graphql").service("extension");
    graphqlExtensionService.shadowCRUD(RELEASE_MODEL_UID).disable();
    graphqlExtensionService.shadowCRUD(RELEASE_ACTION_MODEL_UID).disable();
  }
};
const { features: features$1 } = require("@strapi/strapi/dist/utils/ee");
const bootstrap = async ({ strapi: strapi2 }) => {
  if (features$1.isEnabled("cms-content-releases")) {
    const contentTypesWithDraftAndPublish = Object.keys(strapi2.contentTypes).filter(
      (uid) => strapi2.contentTypes[uid]?.options?.draftAndPublish
    );
    strapi2.db.lifecycles.subscribe({
      models: contentTypesWithDraftAndPublish,
      async afterDelete(event) {
        try {
          const { model, result } = event;
          if (model.kind === "collectionType" && model.options?.draftAndPublish) {
            const { id } = result;
            const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
              where: {
                actions: {
                  target_type: model.uid,
                  target_id: id
                }
              }
            });
            await strapi2.db.query(RELEASE_ACTION_MODEL_UID).deleteMany({
              where: {
                target_type: model.uid,
                target_id: id
              }
            });
            for (const release2 of releases) {
              getService("release", { strapi: strapi2 }).updateReleaseStatus(release2.id);
            }
          }
        } catch (error) {
          strapi2.log.error("Error while deleting release actions after entry delete", { error });
        }
      },
      /**
       * deleteMany hook doesn't return the deleted entries ids
       * so we need to fetch them before deleting the entries to save the ids on our state
       */
      async beforeDeleteMany(event) {
        const { model, params } = event;
        if (model.kind === "collectionType" && model.options?.draftAndPublish) {
          const { where } = params;
          const entriesToDelete = await strapi2.db.query(model.uid).findMany({ select: ["id"], where });
          event.state.entriesToDelete = entriesToDelete;
        }
      },
      /**
       * We delete the release actions related to deleted entries
       * We make this only after deleteMany is succesfully executed to avoid errors
       */
      async afterDeleteMany(event) {
        try {
          const { model, state } = event;
          const entriesToDelete = state.entriesToDelete;
          if (entriesToDelete) {
            const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
              where: {
                actions: {
                  target_type: model.uid,
                  target_id: {
                    $in: entriesToDelete.map(
                      (entry) => entry.id
                    )
                  }
                }
              }
            });
            await strapi2.db.query(RELEASE_ACTION_MODEL_UID).deleteMany({
              where: {
                target_type: model.uid,
                target_id: {
                  $in: entriesToDelete.map((entry) => entry.id)
                }
              }
            });
            for (const release2 of releases) {
              getService("release", { strapi: strapi2 }).updateReleaseStatus(release2.id);
            }
          }
        } catch (error) {
          strapi2.log.error("Error while deleting release actions after entry deleteMany", {
            error
          });
        }
      },
      async afterUpdate(event) {
        try {
          const { model, result } = event;
          if (model.kind === "collectionType" && model.options?.draftAndPublish) {
            const isEntryValid = await getEntryValidStatus(
              model.uid,
              result,
              {
                strapi: strapi2
              }
            );
            await strapi2.db.query(RELEASE_ACTION_MODEL_UID).update({
              where: {
                target_type: model.uid,
                target_id: result.id
              },
              data: {
                isEntryValid
              }
            });
            const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
              where: {
                actions: {
                  target_type: model.uid,
                  target_id: result.id
                }
              }
            });
            for (const release2 of releases) {
              getService("release", { strapi: strapi2 }).updateReleaseStatus(release2.id);
            }
          }
        } catch (error) {
          strapi2.log.error("Error while updating release actions after entry update", { error });
        }
      }
    });
    getService("scheduling", { strapi: strapi2 }).syncFromDatabase().catch((err) => {
      strapi2.log.error(
        "Error while syncing scheduled jobs from the database in the content-releases plugin. This could lead to errors in the releases scheduling."
      );
      throw err;
    });
    Object.entries(ALLOWED_WEBHOOK_EVENTS).forEach(([key, value]) => {
      strapi2.webhookStore.addAllowedEvent(key, value);
    });
  }
};
const destroy = async ({ strapi: strapi2 }) => {
  const scheduledJobs = getService("scheduling", {
    strapi: strapi2
  }).getAll();
  for (const [, job] of scheduledJobs) {
    job.cancel();
  }
};
const schema$1 = {
  collectionName: "strapi_releases",
  info: {
    singularName: "release",
    pluralName: "releases",
    displayName: "Release"
  },
  options: {
    draftAndPublish: false
  },
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    name: {
      type: "string",
      required: true
    },
    releasedAt: {
      type: "datetime"
    },
    scheduledAt: {
      type: "datetime"
    },
    timezone: {
      type: "string"
    },
    status: {
      type: "enumeration",
      enum: ["ready", "blocked", "failed", "done", "empty"],
      required: true
    },
    actions: {
      type: "relation",
      relation: "oneToMany",
      target: RELEASE_ACTION_MODEL_UID,
      mappedBy: "release"
    }
  }
};
const release$1 = {
  schema: schema$1
};
const schema = {
  collectionName: "strapi_release_actions",
  info: {
    singularName: "release-action",
    pluralName: "release-actions",
    displayName: "Release Action"
  },
  options: {
    draftAndPublish: false
  },
  pluginOptions: {
    "content-manager": {
      visible: false
    },
    "content-type-builder": {
      visible: false
    }
  },
  attributes: {
    type: {
      type: "enumeration",
      enum: ["publish", "unpublish"],
      required: true
    },
    entry: {
      type: "relation",
      relation: "morphToOne",
      configurable: false
    },
    contentType: {
      type: "string",
      required: true
    },
    locale: {
      type: "string"
    },
    release: {
      type: "relation",
      relation: "manyToOne",
      target: RELEASE_MODEL_UID,
      inversedBy: "actions"
    },
    isEntryValid: {
      type: "boolean"
    }
  }
};
const releaseAction$1 = {
  schema
};
const contentTypes = {
  release: release$1,
  "release-action": releaseAction$1
};
const getGroupName = (queryValue) => {
  switch (queryValue) {
    case "contentType":
      return "contentType.displayName";
    case "action":
      return "type";
    case "locale":
      return _.getOr("No locale", "locale.name");
    default:
      return "contentType.displayName";
  }
};
const createReleaseService = ({ strapi: strapi2 }) => {
  const dispatchWebhook = (event, { isPublished, release: release2, error }) => {
    strapi2.eventHub.emit(event, {
      isPublished,
      error,
      release: release2
    });
  };
  const publishSingleTypeAction = async (uid, actionType, entryId) => {
    const entityManagerService = strapi2.plugin("content-manager").service("entity-manager");
    const populateBuilderService = strapi2.plugin("content-manager").service("populate-builder");
    const populate = await populateBuilderService(uid).populateDeep(Infinity).build();
    const entry = await strapi2.entityService.findOne(uid, entryId, { populate });
    try {
      if (actionType === "publish") {
        await entityManagerService.publish(entry, uid);
      } else {
        await entityManagerService.unpublish(entry, uid);
      }
    } catch (error) {
      if (error instanceof errors.ApplicationError && (error.message === "already.published" || error.message === "already.draft"))
        ;
      else {
        throw error;
      }
    }
  };
  const publishCollectionTypeAction = async (uid, entriesToPublishIds, entriestoUnpublishIds) => {
    const entityManagerService = strapi2.plugin("content-manager").service("entity-manager");
    const populateBuilderService = strapi2.plugin("content-manager").service("populate-builder");
    const populate = await populateBuilderService(uid).populateDeep(Infinity).build();
    const entriesToPublish = await strapi2.entityService.findMany(uid, {
      filters: {
        id: {
          $in: entriesToPublishIds
        }
      },
      populate
    });
    const entriesToUnpublish = await strapi2.entityService.findMany(uid, {
      filters: {
        id: {
          $in: entriestoUnpublishIds
        }
      },
      populate
    });
    if (entriesToPublish.length > 0) {
      await entityManagerService.publishMany(entriesToPublish, uid);
    }
    if (entriesToUnpublish.length > 0) {
      await entityManagerService.unpublishMany(entriesToUnpublish, uid);
    }
  };
  const getFormattedActions = async (releaseId) => {
    const actions = await strapi2.db.query(RELEASE_ACTION_MODEL_UID).findMany({
      where: {
        release: {
          id: releaseId
        }
      },
      populate: {
        entry: {
          fields: ["id"]
        }
      }
    });
    if (actions.length === 0) {
      throw new errors.ValidationError("No entries to publish");
    }
    const collectionTypeActions = {};
    const singleTypeActions = [];
    for (const action of actions) {
      const contentTypeUid = action.contentType;
      if (strapi2.contentTypes[contentTypeUid].kind === "collectionType") {
        if (!collectionTypeActions[contentTypeUid]) {
          collectionTypeActions[contentTypeUid] = {
            entriesToPublishIds: [],
            entriesToUnpublishIds: []
          };
        }
        if (action.type === "publish") {
          collectionTypeActions[contentTypeUid].entriesToPublishIds.push(action.entry.id);
        } else {
          collectionTypeActions[contentTypeUid].entriesToUnpublishIds.push(action.entry.id);
        }
      } else {
        singleTypeActions.push({
          uid: contentTypeUid,
          action: action.type,
          id: action.entry.id
        });
      }
    }
    return { collectionTypeActions, singleTypeActions };
  };
  return {
    async create(releaseData, { user }) {
      const releaseWithCreatorFields = await setCreatorFields({ user })(releaseData);
      const {
        validatePendingReleasesLimit,
        validateUniqueNameForPendingRelease,
        validateScheduledAtIsLaterThanNow
      } = getService("release-validation", { strapi: strapi2 });
      await Promise.all([
        validatePendingReleasesLimit(),
        validateUniqueNameForPendingRelease(releaseWithCreatorFields.name),
        validateScheduledAtIsLaterThanNow(releaseWithCreatorFields.scheduledAt)
      ]);
      const release2 = await strapi2.entityService.create(RELEASE_MODEL_UID, {
        data: {
          ...releaseWithCreatorFields,
          status: "empty"
        }
      });
      if (releaseWithCreatorFields.scheduledAt) {
        const schedulingService = getService("scheduling", { strapi: strapi2 });
        await schedulingService.set(release2.id, release2.scheduledAt);
      }
      strapi2.telemetry.send("didCreateContentRelease");
      return release2;
    },
    async findOne(id, query = {}) {
      const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, id, {
        ...query
      });
      return release2;
    },
    findPage(query) {
      return strapi2.entityService.findPage(RELEASE_MODEL_UID, {
        ...query,
        populate: {
          actions: {
            // @ts-expect-error Ignore missing properties
            count: true
          }
        }
      });
    },
    async findManyWithContentTypeEntryAttached(contentTypeUid, entriesIds) {
      let entries = entriesIds;
      if (!Array.isArray(entriesIds)) {
        entries = [entriesIds];
      }
      const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
        where: {
          actions: {
            target_type: contentTypeUid,
            target_id: {
              $in: entries
            }
          },
          releasedAt: {
            $null: true
          }
        },
        populate: {
          // Filter the action to get only the content type entry
          actions: {
            where: {
              target_type: contentTypeUid,
              target_id: {
                $in: entries
              }
            },
            populate: {
              entry: {
                select: ["id"]
              }
            }
          }
        }
      });
      return releases.map((release2) => {
        if (release2.actions?.length) {
          const actionsForEntry = release2.actions;
          delete release2.actions;
          return {
            ...release2,
            actions: actionsForEntry
          };
        }
        return release2;
      });
    },
    async findManyWithoutContentTypeEntryAttached(contentTypeUid, entryId) {
      const releasesRelated = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
        where: {
          releasedAt: {
            $null: true
          },
          actions: {
            target_type: contentTypeUid,
            target_id: entryId
          }
        }
      });
      const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
        where: {
          $or: [
            {
              id: {
                $notIn: releasesRelated.map((release2) => release2.id)
              }
            },
            {
              actions: null
            }
          ],
          releasedAt: {
            $null: true
          }
        }
      });
      return releases.map((release2) => {
        if (release2.actions?.length) {
          const [actionForEntry] = release2.actions;
          delete release2.actions;
          return {
            ...release2,
            action: actionForEntry
          };
        }
        return release2;
      });
    },
    async update(id, releaseData, { user }) {
      const releaseWithCreatorFields = await setCreatorFields({ user, isEdition: true })(
        releaseData
      );
      const { validateUniqueNameForPendingRelease, validateScheduledAtIsLaterThanNow } = getService(
        "release-validation",
        { strapi: strapi2 }
      );
      await Promise.all([
        validateUniqueNameForPendingRelease(releaseWithCreatorFields.name, id),
        validateScheduledAtIsLaterThanNow(releaseWithCreatorFields.scheduledAt)
      ]);
      const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, id);
      if (!release2) {
        throw new errors.NotFoundError(`No release found for id ${id}`);
      }
      if (release2.releasedAt) {
        throw new errors.ValidationError("Release already published");
      }
      const updatedRelease = await strapi2.entityService.update(RELEASE_MODEL_UID, id, {
        /*
         * The type returned from the entity service: Partial<Input<"plugin::content-releases.release">>
         * is not compatible with the type we are passing here: UpdateRelease.Request['body']
         */
        // @ts-expect-error see above
        data: releaseWithCreatorFields
      });
      const schedulingService = getService("scheduling", { strapi: strapi2 });
      if (releaseData.scheduledAt) {
        await schedulingService.set(id, releaseData.scheduledAt);
      } else if (release2.scheduledAt) {
        schedulingService.cancel(id);
      }
      this.updateReleaseStatus(id);
      strapi2.telemetry.send("didUpdateContentRelease");
      return updatedRelease;
    },
    async createAction(releaseId, action) {
      const { validateEntryContentType, validateUniqueEntry } = getService("release-validation", {
        strapi: strapi2
      });
      await Promise.all([
        validateEntryContentType(action.entry.contentType),
        validateUniqueEntry(releaseId, action)
      ]);
      const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, releaseId);
      if (!release2) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }
      if (release2.releasedAt) {
        throw new errors.ValidationError("Release already published");
      }
      const { entry, type } = action;
      const populatedEntry = await getPopulatedEntry(entry.contentType, entry.id, { strapi: strapi2 });
      const isEntryValid = await getEntryValidStatus(entry.contentType, populatedEntry, { strapi: strapi2 });
      const releaseAction2 = await strapi2.entityService.create(RELEASE_ACTION_MODEL_UID, {
        data: {
          type,
          contentType: entry.contentType,
          locale: entry.locale,
          isEntryValid,
          entry: {
            id: entry.id,
            __type: entry.contentType,
            __pivot: { field: "entry" }
          },
          release: releaseId
        },
        populate: { release: { fields: ["id"] }, entry: { fields: ["id"] } }
      });
      this.updateReleaseStatus(releaseId);
      return releaseAction2;
    },
    async findActions(releaseId, query) {
      const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, releaseId, {
        fields: ["id"]
      });
      if (!release2) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }
      return strapi2.entityService.findPage(RELEASE_ACTION_MODEL_UID, {
        ...query,
        populate: {
          entry: {
            populate: "*"
          }
        },
        filters: {
          release: releaseId
        }
      });
    },
    async countActions(query) {
      return strapi2.entityService.count(RELEASE_ACTION_MODEL_UID, query);
    },
    async groupActions(actions, groupBy) {
      const contentTypeUids = actions.reduce((acc, action) => {
        if (!acc.includes(action.contentType)) {
          acc.push(action.contentType);
        }
        return acc;
      }, []);
      const allReleaseContentTypesDictionary = await this.getContentTypesDataForActions(
        contentTypeUids
      );
      const allLocalesDictionary = await this.getLocalesDataForActions();
      const formattedData = actions.map((action) => {
        const { mainField, displayName } = allReleaseContentTypesDictionary[action.contentType];
        return {
          ...action,
          locale: action.locale ? allLocalesDictionary[action.locale] : null,
          contentType: {
            displayName,
            mainFieldValue: action.entry[mainField],
            uid: action.contentType
          }
        };
      });
      const groupName = getGroupName(groupBy);
      return _.groupBy(groupName)(formattedData);
    },
    async getLocalesDataForActions() {
      if (!strapi2.plugin("i18n")) {
        return {};
      }
      const allLocales = await strapi2.plugin("i18n").service("locales").find() || [];
      return allLocales.reduce((acc, locale) => {
        acc[locale.code] = { name: locale.name, code: locale.code };
        return acc;
      }, {});
    },
    async getContentTypesDataForActions(contentTypesUids) {
      const contentManagerContentTypeService = strapi2.plugin("content-manager").service("content-types");
      const contentTypesData = {};
      for (const contentTypeUid of contentTypesUids) {
        const contentTypeConfig = await contentManagerContentTypeService.findConfiguration({
          uid: contentTypeUid
        });
        contentTypesData[contentTypeUid] = {
          mainField: contentTypeConfig.settings.mainField,
          displayName: strapi2.getModel(contentTypeUid).info.displayName
        };
      }
      return contentTypesData;
    },
    getContentTypeModelsFromActions(actions) {
      const contentTypeUids = actions.reduce((acc, action) => {
        if (!acc.includes(action.contentType)) {
          acc.push(action.contentType);
        }
        return acc;
      }, []);
      const contentTypeModelsMap = contentTypeUids.reduce(
        (acc, contentTypeUid) => {
          acc[contentTypeUid] = strapi2.getModel(contentTypeUid);
          return acc;
        },
        {}
      );
      return contentTypeModelsMap;
    },
    async getAllComponents() {
      const contentManagerComponentsService = strapi2.plugin("content-manager").service("components");
      const components = await contentManagerComponentsService.findAllComponents();
      const componentsMap = components.reduce(
        (acc, component) => {
          acc[component.uid] = component;
          return acc;
        },
        {}
      );
      return componentsMap;
    },
    async delete(releaseId) {
      const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, releaseId, {
        populate: {
          actions: {
            fields: ["id"]
          }
        }
      });
      if (!release2) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }
      if (release2.releasedAt) {
        throw new errors.ValidationError("Release already published");
      }
      await strapi2.db.transaction(async () => {
        await strapi2.db.query(RELEASE_ACTION_MODEL_UID).deleteMany({
          where: {
            id: {
              $in: release2.actions.map((action) => action.id)
            }
          }
        });
        await strapi2.entityService.delete(RELEASE_MODEL_UID, releaseId);
      });
      if (release2.scheduledAt) {
        const schedulingService = getService("scheduling", { strapi: strapi2 });
        await schedulingService.cancel(release2.id);
      }
      strapi2.telemetry.send("didDeleteContentRelease");
      return release2;
    },
    async publish(releaseId) {
      const {
        release: release2,
        error
      } = await strapi2.db.transaction(async ({ trx }) => {
        const lockedRelease = await strapi2.db?.queryBuilder(RELEASE_MODEL_UID).where({ id: releaseId }).select(["id", "name", "releasedAt", "status"]).first().transacting(trx).forUpdate().execute();
        if (!lockedRelease) {
          throw new errors.NotFoundError(`No release found for id ${releaseId}`);
        }
        if (lockedRelease.releasedAt) {
          throw new errors.ValidationError("Release already published");
        }
        if (lockedRelease.status === "failed") {
          throw new errors.ValidationError("Release failed to publish");
        }
        try {
          strapi2.log.info(`[Content Releases] Starting to publish release ${lockedRelease.name}`);
          const { collectionTypeActions, singleTypeActions } = await getFormattedActions(
            releaseId
          );
          await strapi2.db.transaction(async () => {
            for (const { uid, action, id } of singleTypeActions) {
              await publishSingleTypeAction(uid, action, id);
            }
            for (const contentTypeUid of Object.keys(collectionTypeActions)) {
              const uid = contentTypeUid;
              await publishCollectionTypeAction(
                uid,
                collectionTypeActions[uid].entriesToPublishIds,
                collectionTypeActions[uid].entriesToUnpublishIds
              );
            }
          });
          const release22 = await strapi2.db.query(RELEASE_MODEL_UID).update({
            where: {
              id: releaseId
            },
            data: {
              status: "done",
              releasedAt: /* @__PURE__ */ new Date()
            }
          });
          dispatchWebhook(ALLOWED_WEBHOOK_EVENTS.RELEASES_PUBLISH, {
            isPublished: true,
            release: release22
          });
          strapi2.telemetry.send("didPublishContentRelease");
          return { release: release22, error: null };
        } catch (error2) {
          dispatchWebhook(ALLOWED_WEBHOOK_EVENTS.RELEASES_PUBLISH, {
            isPublished: false,
            error: error2
          });
          await strapi2.db?.queryBuilder(RELEASE_MODEL_UID).where({ id: releaseId }).update({
            status: "failed"
          }).transacting(trx).execute();
          return {
            release: null,
            error: error2
          };
        }
      });
      if (error) {
        throw error;
      }
      return release2;
    },
    async updateAction(actionId, releaseId, update) {
      const updatedAction = await strapi2.db.query(RELEASE_ACTION_MODEL_UID).update({
        where: {
          id: actionId,
          release: {
            id: releaseId,
            releasedAt: {
              $null: true
            }
          }
        },
        data: update
      });
      if (!updatedAction) {
        throw new errors.NotFoundError(
          `Action with id ${actionId} not found in release with id ${releaseId} or it is already published`
        );
      }
      return updatedAction;
    },
    async deleteAction(actionId, releaseId) {
      const deletedAction = await strapi2.db.query(RELEASE_ACTION_MODEL_UID).delete({
        where: {
          id: actionId,
          release: {
            id: releaseId,
            releasedAt: {
              $null: true
            }
          }
        }
      });
      if (!deletedAction) {
        throw new errors.NotFoundError(
          `Action with id ${actionId} not found in release with id ${releaseId} or it is already published`
        );
      }
      this.updateReleaseStatus(releaseId);
      return deletedAction;
    },
    async updateReleaseStatus(releaseId) {
      const [totalActions, invalidActions] = await Promise.all([
        this.countActions({
          filters: {
            release: releaseId
          }
        }),
        this.countActions({
          filters: {
            release: releaseId,
            isEntryValid: false
          }
        })
      ]);
      if (totalActions > 0) {
        if (invalidActions > 0) {
          return strapi2.db.query(RELEASE_MODEL_UID).update({
            where: {
              id: releaseId
            },
            data: {
              status: "blocked"
            }
          });
        }
        return strapi2.db.query(RELEASE_MODEL_UID).update({
          where: {
            id: releaseId
          },
          data: {
            status: "ready"
          }
        });
      }
      return strapi2.db.query(RELEASE_MODEL_UID).update({
        where: {
          id: releaseId
        },
        data: {
          status: "empty"
        }
      });
    }
  };
};
class AlreadyOnReleaseError extends errors.ApplicationError {
  constructor(message) {
    super(message);
    this.name = "AlreadyOnReleaseError";
  }
}
const createReleaseValidationService = ({ strapi: strapi2 }) => ({
  async validateUniqueEntry(releaseId, releaseActionArgs) {
    const release2 = await strapi2.entityService.findOne(RELEASE_MODEL_UID, releaseId, {
      populate: { actions: { populate: { entry: { fields: ["id"] } } } }
    });
    if (!release2) {
      throw new errors.NotFoundError(`No release found for id ${releaseId}`);
    }
    const isEntryInRelease = release2.actions.some(
      (action) => Number(action.entry.id) === Number(releaseActionArgs.entry.id) && action.contentType === releaseActionArgs.entry.contentType
    );
    if (isEntryInRelease) {
      throw new AlreadyOnReleaseError(
        `Entry with id ${releaseActionArgs.entry.id} and contentType ${releaseActionArgs.entry.contentType} already exists in release with id ${releaseId}`
      );
    }
  },
  validateEntryContentType(contentTypeUid) {
    const contentType = strapi2.contentType(contentTypeUid);
    if (!contentType) {
      throw new errors.NotFoundError(`No content type found for uid ${contentTypeUid}`);
    }
    if (!contentType.options?.draftAndPublish) {
      throw new errors.ValidationError(
        `Content type with uid ${contentTypeUid} does not have draftAndPublish enabled`
      );
    }
  },
  async validatePendingReleasesLimit() {
    const maximumPendingReleases = (
      // @ts-expect-error - options is not typed into features
      EE.features.get("cms-content-releases")?.options?.maximumReleases || 3
    );
    const [, pendingReleasesCount] = await strapi2.db.query(RELEASE_MODEL_UID).findWithCount({
      filters: {
        releasedAt: {
          $null: true
        }
      }
    });
    if (pendingReleasesCount >= maximumPendingReleases) {
      throw new errors.ValidationError("You have reached the maximum number of pending releases");
    }
  },
  async validateUniqueNameForPendingRelease(name, id) {
    const pendingReleases = await strapi2.entityService.findMany(RELEASE_MODEL_UID, {
      filters: {
        releasedAt: {
          $null: true
        },
        name,
        ...id && { id: { $ne: id } }
      }
    });
    const isNameUnique = pendingReleases.length === 0;
    if (!isNameUnique) {
      throw new errors.ValidationError(`Release with name ${name} already exists`);
    }
  },
  async validateScheduledAtIsLaterThanNow(scheduledAt) {
    if (scheduledAt && new Date(scheduledAt) <= /* @__PURE__ */ new Date()) {
      throw new errors.ValidationError("Scheduled at must be later than now");
    }
  }
});
const createSchedulingService = ({ strapi: strapi2 }) => {
  const scheduledJobs = /* @__PURE__ */ new Map();
  return {
    async set(releaseId, scheduleDate) {
      const release2 = await strapi2.db.query(RELEASE_MODEL_UID).findOne({ where: { id: releaseId, releasedAt: null } });
      if (!release2) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }
      const job = scheduleJob(scheduleDate, async () => {
        try {
          await getService("release").publish(releaseId);
        } catch (error) {
        }
        this.cancel(releaseId);
      });
      if (scheduledJobs.has(releaseId)) {
        this.cancel(releaseId);
      }
      scheduledJobs.set(releaseId, job);
      return scheduledJobs;
    },
    cancel(releaseId) {
      if (scheduledJobs.has(releaseId)) {
        scheduledJobs.get(releaseId).cancel();
        scheduledJobs.delete(releaseId);
      }
      return scheduledJobs;
    },
    getAll() {
      return scheduledJobs;
    },
    /**
     * On bootstrap, we can use this function to make sure to sync the scheduled jobs from the database that are not yet released
     * This is useful in case the server was restarted and the scheduled jobs were lost
     * This also could be used to sync different Strapi instances in case of a cluster
     */
    async syncFromDatabase() {
      const releases = await strapi2.db.query(RELEASE_MODEL_UID).findMany({
        where: {
          scheduledAt: {
            $gte: /* @__PURE__ */ new Date()
          },
          releasedAt: null
        }
      });
      for (const release2 of releases) {
        this.set(release2.id, release2.scheduledAt);
      }
      return scheduledJobs;
    }
  };
};
const services = {
  release: createReleaseService,
  "release-validation": createReleaseValidationService,
  scheduling: createSchedulingService
};
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
const validateRelease = validateYupSchema(RELEASE_SCHEMA);
const releaseController = {
  async findMany(ctx) {
    const permissionsManager = strapi.admin.services.permission.createPermissionsManager({
      ability: ctx.state.userAbility,
      model: RELEASE_MODEL_UID
    });
    await permissionsManager.validateQuery(ctx.query);
    const releaseService = getService("release", { strapi });
    const isFindManyForContentTypeEntry = Boolean(ctx.query?.contentTypeUid && ctx.query?.entryId);
    if (isFindManyForContentTypeEntry) {
      const query = await permissionsManager.sanitizeQuery(ctx.query);
      const contentTypeUid = query.contentTypeUid;
      const entryId = query.entryId;
      const hasEntryAttached = typeof query.hasEntryAttached === "string" ? JSON.parse(query.hasEntryAttached) : false;
      const data = hasEntryAttached ? await releaseService.findManyWithContentTypeEntryAttached(contentTypeUid, entryId) : await releaseService.findManyWithoutContentTypeEntryAttached(contentTypeUid, entryId);
      ctx.body = { data };
    } else {
      const query = await permissionsManager.sanitizeQuery(ctx.query);
      const { results, pagination } = await releaseService.findPage(query);
      const data = results.map((release2) => {
        const { actions, ...releaseData } = release2;
        return {
          ...releaseData,
          actions: {
            meta: {
              count: actions.count
            }
          }
        };
      });
      const pendingReleasesCount = await strapi.query(RELEASE_MODEL_UID).count({
        where: {
          releasedAt: null
        }
      });
      ctx.body = { data, meta: { pagination, pendingReleasesCount } };
    }
  },
  async findOne(ctx) {
    const id = ctx.params.id;
    const releaseService = getService("release", { strapi });
    const release2 = await releaseService.findOne(id, { populate: ["createdBy"] });
    if (!release2) {
      throw new errors.NotFoundError(`Release not found for id: ${id}`);
    }
    const count = await releaseService.countActions({
      filters: {
        release: id
      }
    });
    const sanitizedRelease = {
      ...release2,
      createdBy: release2.createdBy ? strapi.admin.services.user.sanitizeUser(release2.createdBy) : null
    };
    const data = {
      ...sanitizedRelease,
      actions: {
        meta: {
          count
        }
      }
    };
    ctx.body = { data };
  },
  async mapEntriesToReleases(ctx) {
    const { contentTypeUid, entriesIds } = ctx.query;
    if (!contentTypeUid || !entriesIds) {
      throw new errors.ValidationError("Missing required query parameters");
    }
    const releaseService = getService("release", { strapi });
    const releasesWithActions = await releaseService.findManyWithContentTypeEntryAttached(
      contentTypeUid,
      entriesIds
    );
    const mappedEntriesInReleases = releasesWithActions.reduce(
      (acc, release2) => {
        release2.actions.forEach((action) => {
          if (!acc[action.entry.id]) {
            acc[action.entry.id] = [{ id: release2.id, name: release2.name }];
          } else {
            acc[action.entry.id].push({ id: release2.id, name: release2.name });
          }
        });
        return acc;
      },
      {}
    );
    ctx.body = {
      data: mappedEntriesInReleases
    };
  },
  async create(ctx) {
    const user = ctx.state.user;
    const releaseArgs = ctx.request.body;
    await validateRelease(releaseArgs);
    const releaseService = getService("release", { strapi });
    const release2 = await releaseService.create(releaseArgs, { user });
    const permissionsManager = strapi.admin.services.permission.createPermissionsManager({
      ability: ctx.state.userAbility,
      model: RELEASE_MODEL_UID
    });
    ctx.body = {
      data: await permissionsManager.sanitizeOutput(release2)
    };
  },
  async update(ctx) {
    const user = ctx.state.user;
    const releaseArgs = ctx.request.body;
    const id = ctx.params.id;
    await validateRelease(releaseArgs);
    const releaseService = getService("release", { strapi });
    const release2 = await releaseService.update(id, releaseArgs, { user });
    const permissionsManager = strapi.admin.services.permission.createPermissionsManager({
      ability: ctx.state.userAbility,
      model: RELEASE_MODEL_UID
    });
    ctx.body = {
      data: await permissionsManager.sanitizeOutput(release2)
    };
  },
  async delete(ctx) {
    const id = ctx.params.id;
    const releaseService = getService("release", { strapi });
    const release2 = await releaseService.delete(id);
    ctx.body = {
      data: release2
    };
  },
  async publish(ctx) {
    const user = ctx.state.user;
    const id = ctx.params.id;
    const releaseService = getService("release", { strapi });
    const release2 = await releaseService.publish(id, { user });
    const [countPublishActions, countUnpublishActions] = await Promise.all([
      releaseService.countActions({
        filters: {
          release: id,
          type: "publish"
        }
      }),
      releaseService.countActions({
        filters: {
          release: id,
          type: "unpublish"
        }
      })
    ]);
    ctx.body = {
      data: release2,
      meta: {
        totalEntries: countPublishActions + countUnpublishActions,
        totalPublishedEntries: countPublishActions,
        totalUnpublishedEntries: countUnpublishActions
      }
    };
  }
};
const RELEASE_ACTION_SCHEMA = yup$1.object().shape({
  entry: yup$1.object().shape({
    id: yup$1.strapiID().required(),
    contentType: yup$1.string().required()
  }).required(),
  type: yup$1.string().oneOf(["publish", "unpublish"]).required()
});
const RELEASE_ACTION_UPDATE_SCHEMA = yup$1.object().shape({
  type: yup$1.string().oneOf(["publish", "unpublish"]).required()
});
const validateReleaseAction = validateYupSchema(RELEASE_ACTION_SCHEMA);
const validateReleaseActionUpdateSchema = validateYupSchema(RELEASE_ACTION_UPDATE_SCHEMA);
const releaseActionController = {
  async create(ctx) {
    const releaseId = ctx.params.releaseId;
    const releaseActionArgs = ctx.request.body;
    await validateReleaseAction(releaseActionArgs);
    const releaseService = getService("release", { strapi });
    const releaseAction2 = await releaseService.createAction(releaseId, releaseActionArgs);
    ctx.body = {
      data: releaseAction2
    };
  },
  async createMany(ctx) {
    const releaseId = ctx.params.releaseId;
    const releaseActionsArgs = ctx.request.body;
    await Promise.all(
      releaseActionsArgs.map((releaseActionArgs) => validateReleaseAction(releaseActionArgs))
    );
    const releaseService = getService("release", { strapi });
    const releaseActions = await strapi.db.transaction(async () => {
      const releaseActions2 = await Promise.all(
        releaseActionsArgs.map(async (releaseActionArgs) => {
          try {
            const action = await releaseService.createAction(releaseId, releaseActionArgs);
            return action;
          } catch (error) {
            if (error instanceof AlreadyOnReleaseError) {
              return null;
            }
            throw error;
          }
        })
      );
      return releaseActions2;
    });
    const newReleaseActions = releaseActions.filter((action) => action !== null);
    ctx.body = {
      data: newReleaseActions,
      meta: {
        entriesAlreadyInRelease: releaseActions.length - newReleaseActions.length,
        totalEntries: releaseActions.length
      }
    };
  },
  async findMany(ctx) {
    const releaseId = ctx.params.releaseId;
    const permissionsManager = strapi.admin.services.permission.createPermissionsManager({
      ability: ctx.state.userAbility,
      model: RELEASE_ACTION_MODEL_UID
    });
    const query = await permissionsManager.sanitizeQuery(ctx.query);
    const releaseService = getService("release", { strapi });
    const { results, pagination } = await releaseService.findActions(releaseId, {
      sort: query.groupBy === "action" ? "type" : query.groupBy,
      ...query
    });
    const contentTypeOutputSanitizers = results.reduce((acc, action) => {
      if (acc[action.contentType]) {
        return acc;
      }
      const contentTypePermissionsManager = strapi.admin.services.permission.createPermissionsManager({
        ability: ctx.state.userAbility,
        model: action.contentType
      });
      acc[action.contentType] = contentTypePermissionsManager.sanitizeOutput;
      return acc;
    }, {});
    const sanitizedResults = await mapAsync(results, async (action) => ({
      ...action,
      entry: await contentTypeOutputSanitizers[action.contentType](action.entry)
    }));
    const groupedData = await releaseService.groupActions(sanitizedResults, query.groupBy);
    const contentTypes2 = releaseService.getContentTypeModelsFromActions(results);
    const components = await releaseService.getAllComponents();
    ctx.body = {
      data: groupedData,
      meta: {
        pagination,
        contentTypes: contentTypes2,
        components
      }
    };
  },
  async update(ctx) {
    const actionId = ctx.params.actionId;
    const releaseId = ctx.params.releaseId;
    const releaseActionUpdateArgs = ctx.request.body;
    await validateReleaseActionUpdateSchema(releaseActionUpdateArgs);
    const releaseService = getService("release", { strapi });
    const updatedAction = await releaseService.updateAction(
      actionId,
      releaseId,
      releaseActionUpdateArgs
    );
    ctx.body = {
      data: updatedAction
    };
  },
  async delete(ctx) {
    const actionId = ctx.params.actionId;
    const releaseId = ctx.params.releaseId;
    const releaseService = getService("release", { strapi });
    const deletedReleaseAction = await releaseService.deleteAction(actionId, releaseId);
    ctx.body = {
      data: deletedReleaseAction
    };
  }
};
const controllers = { release: releaseController, "release-action": releaseActionController };
const release = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/mapEntriesToReleases",
      handler: "release.mapEntriesToReleases",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.read"]
            }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/",
      handler: "release.create",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.create"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/",
      handler: "release.findMany",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.read"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/:id",
      handler: "release.findOne",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.read"]
            }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/:id",
      handler: "release.update",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.update"]
            }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/:id",
      handler: "release.delete",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.delete"]
            }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/:id/publish",
      handler: "release.publish",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.publish"]
            }
          }
        ]
      }
    }
  ]
};
const releaseAction = {
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/:releaseId/actions",
      handler: "release-action.create",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.create-action"]
            }
          }
        ]
      }
    },
    {
      method: "POST",
      path: "/:releaseId/actions/bulk",
      handler: "release-action.createMany",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.create-action"]
            }
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/:releaseId/actions",
      handler: "release-action.findMany",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.read"]
            }
          }
        ]
      }
    },
    {
      method: "PUT",
      path: "/:releaseId/actions/:actionId",
      handler: "release-action.update",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.update"]
            }
          }
        ]
      }
    },
    {
      method: "DELETE",
      path: "/:releaseId/actions/:actionId",
      handler: "release-action.delete",
      config: {
        policies: [
          "admin::isAuthenticatedAdmin",
          {
            name: "admin::hasPermissions",
            config: {
              actions: ["plugin::content-releases.delete-action"]
            }
          }
        ]
      }
    }
  ]
};
const routes = {
  release,
  "release-action": releaseAction
};
const { features } = require("@strapi/strapi/dist/utils/ee");
const getPlugin = () => {
  if (features.isEnabled("cms-content-releases")) {
    return {
      register,
      bootstrap,
      destroy,
      contentTypes,
      services,
      controllers,
      routes
    };
  }
  return {
    // Always return register, it handles its own feature check
    register,
    // Always return contentTypes to avoid losing data when the feature is disabled
    contentTypes
  };
};
const index = getPlugin();
export {
  index as default
};
//# sourceMappingURL=index.mjs.map
