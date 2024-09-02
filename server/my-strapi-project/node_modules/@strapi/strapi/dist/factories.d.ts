import type { Strapi, Common, CoreApi, Utils } from '@strapi/types';
type WithStrapiCallback<T> = T | (<S extends {
    strapi: Strapi;
}>(params: S) => T);
declare const createCoreController: <TUID extends Common.UID.ContentType, TController extends CoreApi.Controller.Extendable<TUID>>(uid: TUID, cfg?: WithStrapiCallback<Utils.PartialWithThis<Partial<Utils.Expression.If<Common.UID.IsCollectionType<TUID>, CoreApi.Controller.CollectionType, Utils.Expression.If<Common.UID.IsSingleType<TUID>, CoreApi.Controller.SingleType, CoreApi.Controller.Base>>> & CoreApi.Controller.Generic & TController>> | undefined) => ({ strapi }: {
    strapi: Strapi;
}) => TController & Utils.Expression.If<Common.UID.IsCollectionType<TUID>, CoreApi.Controller.CollectionType, Utils.Expression.If<Common.UID.IsSingleType<TUID>, CoreApi.Controller.SingleType, CoreApi.Controller.Base>>;
declare function createCoreService<TUID extends Common.UID.ContentType, TService extends CoreApi.Service.Extendable<TUID>>(uid: TUID, cfg?: WithStrapiCallback<Utils.PartialWithThis<CoreApi.Service.Extendable<TUID> & TService>>): ({ strapi }: {
    strapi: Strapi;
}) => TService & CoreApi.Service.ContentType<TUID>;
declare function createCoreRouter<T extends Common.UID.ContentType>(uid: T, cfg?: CoreApi.Router.RouterConfig<T>): CoreApi.Router.Router;
declare const isCustomController: <T extends Common.Controller>(controller: T) => boolean;
export { createCoreController, createCoreService, createCoreRouter, isCustomController };
//# sourceMappingURL=factories.d.ts.map