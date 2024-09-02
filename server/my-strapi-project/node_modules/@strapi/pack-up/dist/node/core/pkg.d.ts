import * as yup from 'yup';
import { Logger } from './logger';
/**
 * The schema for the package.json that we expect,
 * currently pretty loose.
 */
declare const packageJsonSchema: import("yup/lib/object").OptionalObjectSchema<{
    name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    version: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    description: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    author: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        email: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        email: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>, any>;
    keywords: yup.ArraySchema<yup.StringSchema<string | undefined, Record<string, any>, string | undefined>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, (string | undefined)[] | undefined>;
    type: any;
    license: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    repository: import("yup/lib/object").OptionalObjectSchema<{
        type: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        type: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }>>;
    bugs: import("yup/lib/object").OptionalObjectSchema<{
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }>>;
    homepage: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    bin: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    browser: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    main: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    module: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    source: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    types: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    exports: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string> | yup.ObjectSchema<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>, import("yup/lib/object").AssertsShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string> | yup.ObjectSchema<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>, import("yup/lib/object").AssertsShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>>>>>, any>;
    files: yup.ArraySchema<yup.StringSchema<string | undefined, Record<string, any>, string | undefined>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, (string | undefined)[] | undefined>;
    scripts: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    dependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    devDependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    peerDependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    engines: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    browserslist: yup.ArraySchema<import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, string[] | undefined>;
}, Record<string, any>, import("yup/lib/object").TypeOfShape<{
    name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    version: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    description: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    author: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<{
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        email: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        email: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>, any>;
    keywords: yup.ArraySchema<yup.StringSchema<string | undefined, Record<string, any>, string | undefined>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, (string | undefined)[] | undefined>;
    type: any;
    license: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    repository: import("yup/lib/object").OptionalObjectSchema<{
        type: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        type: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }>>;
    bugs: import("yup/lib/object").OptionalObjectSchema<{
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }, Record<string, any>, import("yup/lib/object").TypeOfShape<{
        url: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    }>>;
    homepage: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    bin: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    browser: import("yup/lib/Lazy").default<yup.StringSchema<string | undefined, Record<string, any>, string | undefined> | import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    main: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    module: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    source: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    types: yup.StringSchema<string | undefined, Record<string, any>, string | undefined>;
    exports: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string> | yup.ObjectSchema<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>, import("yup/lib/object").AssertsShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string> | yup.ObjectSchema<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>, import("yup/lib/object").AssertsShape<{
        types: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        source: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
        browser: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source: string;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        node: yup.BaseSchema<import("yup/lib/types").Maybe<{
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>, import("yup/lib/object").AnyObject, {
            source?: string | undefined;
            module?: string | undefined;
            import?: string | undefined;
            require?: string | undefined;
        } | undefined>;
        module: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        import: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        require: yup.BaseSchema<import("yup/lib/types").Maybe<string | undefined>, import("yup/lib/object").AnyObject, string | undefined>;
        default: yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>;
    }>>>>>, any>;
    files: yup.ArraySchema<yup.StringSchema<string | undefined, Record<string, any>, string | undefined>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, (string | undefined)[] | undefined>;
    scripts: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    dependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    devDependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    peerDependencies: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    engines: import("yup/lib/Lazy").default<import("yup/lib/object").OptionalObjectSchema<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, yup.BaseSchema<import("yup/lib/types").Maybe<string>, import("yup/lib/object").AnyObject, string>>>>, any>;
    browserslist: yup.ArraySchema<import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>, import("yup/lib/types").AnyObject, (string | undefined)[] | undefined, string[] | undefined>;
}>>;
/**
 * @description being a task to load the package.json starting from the current working directory
 * using a shallow find for the package.json  and `fs` to read the file. If no package.json is found,
 * the process will throw with an appropriate error message.
 */
declare const loadPkg: ({ cwd, logger }: {
    cwd: string;
    logger: Logger;
}) => Promise<object>;
interface PackageJson extends Omit<yup.Asserts<typeof packageJsonSchema>, 'type'> {
    type?: 'commonjs' | 'module';
}
/**
 * @description validate the package.json against a standardised schema using `yup`.
 * If the validation fails, the process will throw with an appropriate error message.
 */
declare const validatePkg: ({ pkg }: {
    pkg: object;
}) => Promise<PackageJson>;
export { loadPkg, validatePkg };
export type { PackageJson };
//# sourceMappingURL=pkg.d.ts.map