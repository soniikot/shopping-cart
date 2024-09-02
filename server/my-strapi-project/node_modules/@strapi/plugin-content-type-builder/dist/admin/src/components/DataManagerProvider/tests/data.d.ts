export declare const data: {
    components: {
        'default.closingperiod': {
            uid: string;
            category: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required?: undefined;
                    multiple?: undefined;
                    component?: undefined;
                } | {
                    name: string;
                    type: string;
                    required: boolean;
                    multiple?: undefined;
                    component?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    component?: undefined;
                } | {
                    name: string;
                    component: string;
                    type: string;
                    required?: undefined;
                    multiple?: undefined;
                })[];
            };
        };
        'default.dish': {
            uid: string;
            category: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    default: string;
                    multiple?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    type: string;
                    required?: undefined;
                    default?: undefined;
                    multiple?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    type: string;
                    required?: undefined;
                    default?: undefined;
                    multiple?: undefined;
                })[];
            };
        };
        'default.openingtimes': {
            uid: string;
            category: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    default: string;
                } | {
                    name: string;
                    type: string;
                    required?: undefined;
                    default?: undefined;
                })[];
            };
        };
        'default.restaurantservice': {
            uid: string;
            category: string;
            schema: {
                icon: string;
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    default: string;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    default?: undefined;
                } | {
                    name: string;
                    type: string;
                    required: boolean;
                    default: boolean;
                    multiple?: undefined;
                })[];
            };
        };
    };
    contentTypes: {
        'plugin::myplugin.test': {
            uid: string;
            plugin: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: {
                    name: string;
                    type: string;
                    required: boolean;
                    unique: boolean;
                    configurable: boolean;
                }[];
            };
        };
        'plugin::users-permissions.role': {
            uid: string;
            plugin: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    minLength: number;
                    required: boolean;
                    configurable: boolean;
                    unique?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                } | {
                    type: string;
                    configurable: boolean;
                    name: string;
                    minLength?: undefined;
                    required?: undefined;
                    unique?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    type: string;
                    unique: boolean;
                    configurable: boolean;
                    minLength?: undefined;
                    required?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    plugin: string;
                    targetAttribute: string;
                    configurable: boolean;
                    type: string;
                    minLength?: undefined;
                    required?: undefined;
                    unique?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    plugin: string;
                    type: string;
                    targetAttribute: string;
                    minLength?: undefined;
                    required?: undefined;
                    configurable?: undefined;
                    unique?: undefined;
                })[];
            };
        };
        'api::address.address': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    required?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    type: string;
                    required?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                })[];
            };
        };
        'api::menusection.menusection': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    minLength: number;
                    component?: undefined;
                    repeatable?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    component: string;
                    type: string;
                    repeatable: boolean;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: string;
                    type: string;
                    required?: undefined;
                    minLength?: undefined;
                    component?: undefined;
                    repeatable?: undefined;
                })[];
            };
        };
        'api::country.country': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    minLength: number;
                    maxLength?: undefined;
                    unique?: undefined;
                } | {
                    name: string;
                    type: string;
                    maxLength: number;
                    unique: boolean;
                    minLength: number;
                    required?: undefined;
                })[];
            };
        };
        'plugin::users-permissions.user': {
            uid: string;
            plugin: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    minLength: number;
                    unique: boolean;
                    configurable: boolean;
                    required: boolean;
                    private?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    minLength: number;
                    configurable: boolean;
                    required: boolean;
                    unique?: undefined;
                    private?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    configurable: boolean;
                    minLength?: undefined;
                    unique?: undefined;
                    required?: undefined;
                    private?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    minLength: number;
                    configurable: boolean;
                    private: boolean;
                    unique?: undefined;
                    required?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    configurable: boolean;
                    private: boolean;
                    minLength?: undefined;
                    unique?: undefined;
                    required?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    default: boolean;
                    configurable: boolean;
                    minLength?: undefined;
                    unique?: undefined;
                    required?: undefined;
                    private?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    plugin: string;
                    targetAttribute: string;
                    type: string;
                    minLength?: undefined;
                    unique?: undefined;
                    configurable?: undefined;
                    required?: undefined;
                    private?: undefined;
                    default?: undefined;
                    multiple?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    minLength?: undefined;
                    unique?: undefined;
                    configurable?: undefined;
                    private?: undefined;
                    default?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                })[];
            };
        };
        'api::review.review': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    min?: undefined;
                    max?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    plugin?: undefined;
                } | {
                    name: string;
                    type: string;
                    required: boolean;
                    min: number;
                    max: number;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    plugin?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: string;
                    type: string;
                    required?: undefined;
                    min?: undefined;
                    max?: undefined;
                    plugin?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    plugin: string;
                    type: string;
                    required?: undefined;
                    min?: undefined;
                    max?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    type: string;
                    required?: undefined;
                    min?: undefined;
                    max?: undefined;
                    plugin?: undefined;
                })[];
            };
        };
        'api::like.like': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    plugin: string;
                    type: string;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: string;
                    type: string;
                    plugin?: undefined;
                })[];
            };
        };
        'api::category.category': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: {
                    name: string;
                    type: string;
                }[];
            };
        };
        'plugin::users-permissions.permission': {
            uid: string;
            plugin: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    required: boolean;
                    configurable: boolean;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    type: string;
                    configurable: boolean;
                    required?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    plugin?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    plugin: string;
                    targetAttribute: string;
                    type: string;
                    required?: undefined;
                    configurable?: undefined;
                })[];
            };
        };
        'api::menu.menu': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    type: string;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: string;
                    type: string;
                })[];
            };
        };
        'api::restaurant.restaurant': {
            uid: string;
            schema: {
                name: string;
                description: string;
                connection: string;
                collectionName: string;
                attributes: ({
                    name: string;
                    enum: string[];
                    type: string;
                    component?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    component: string;
                    type: string;
                    enum?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    maxLength: number;
                    required: boolean;
                    minLength: number;
                    type: string;
                    enum?: undefined;
                    component?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    relation: string;
                    target: string;
                    targetAttribute: null;
                    type: string;
                    enum?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    type: string;
                    multiple: boolean;
                    required: boolean;
                    enum?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    type: string;
                    enum?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    type: string;
                    required: boolean;
                    enum?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    component: string;
                    repeatable: boolean;
                    type: string;
                    enum?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    nature: string;
                    target: string;
                    dominant: boolean;
                    targetAttribute: string;
                    unique: boolean;
                    enum?: undefined;
                    type?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    min?: undefined;
                    max?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    component: string;
                    type: string;
                    repeatable: boolean;
                    min: number;
                    max: number;
                    enum?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    components?: undefined;
                } | {
                    name: string;
                    type: string;
                    components: string[];
                    enum?: undefined;
                    component?: undefined;
                    maxLength?: undefined;
                    required?: undefined;
                    minLength?: undefined;
                    relation?: undefined;
                    target?: undefined;
                    targetAttribute?: undefined;
                    multiple?: undefined;
                    repeatable?: undefined;
                    nature?: undefined;
                    dominant?: undefined;
                    unique?: undefined;
                    min?: undefined;
                    max?: undefined;
                })[];
            };
        };
        'api::homepage.homepage': {
            uid: string;
            schema: {
                name: string;
                attributes: ({
                    name: string;
                    type: string;
                    targetField?: undefined;
                } | {
                    name: string;
                    type: string;
                    targetField: string;
                })[];
            };
        };
    };
};
