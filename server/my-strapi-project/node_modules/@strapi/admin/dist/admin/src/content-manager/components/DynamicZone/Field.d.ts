import * as React from 'react';
import PropTypes from 'prop-types';
import type { EditLayoutRow } from '../../utils/layouts';
import type { Attribute } from '@strapi/types';
interface DynamicZoneProps extends Pick<EditLayoutRow, 'metadatas'> {
    name: string;
    fieldSchema?: Attribute.DynamicZone;
    labelAction?: React.ReactNode;
}
declare const DynamicZone: {
    ({ name, labelAction, fieldSchema, metadatas }: DynamicZoneProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        fieldSchema: {};
        labelAction: null;
    };
    propTypes: {
        fieldSchema: PropTypes.Requireable<PropTypes.InferProps<{
            components: PropTypes.Requireable<any[]>;
            max: PropTypes.Requireable<number>;
            min: PropTypes.Requireable<number>;
            required: PropTypes.Requireable<boolean>;
        }>>;
        labelAction: PropTypes.Requireable<PropTypes.ReactElementLike>;
        metadatas: PropTypes.Validator<NonNullable<PropTypes.InferProps<{
            description: PropTypes.Requireable<string>;
            label: PropTypes.Requireable<string>;
        }>>>;
        name: PropTypes.Validator<string>;
    };
};
export { DynamicZone };
export type { DynamicZoneProps };
