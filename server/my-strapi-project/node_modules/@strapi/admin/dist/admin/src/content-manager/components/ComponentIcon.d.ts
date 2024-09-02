import type { Schema } from '@strapi/types';
interface ComponentIconProps {
    showBackground?: boolean;
    icon?: Schema.ContentTypeInfo['icon'];
}
declare const ComponentIcon: ({ showBackground, icon }: ComponentIconProps) => import("react/jsx-runtime").JSX.Element;
export { ComponentIcon };
export type { ComponentIconProps };
