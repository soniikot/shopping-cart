import { BoxProps, FlexProps } from '@strapi/design-system';
import { States } from './constants';
interface NumberProps extends FlexProps {
    children: number;
    state: States;
}
declare const Number: ({ children, state, ...props }: NumberProps) => import("react/jsx-runtime").JSX.Element;
interface VerticalDividerProps extends BoxProps {
    state: States;
}
declare const VerticalDivider: ({ state, ...props }: VerticalDividerProps) => import("react/jsx-runtime").JSX.Element;
export { Number, VerticalDivider };
export type { NumberProps, VerticalDividerProps };
