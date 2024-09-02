import { ButtonProps } from '@strapi/design-system';
interface ConditionsButtonProps extends Pick<ButtonProps, 'className' | 'onClick' | 'variant'> {
    hasConditions?: boolean;
}
/**
 * We reference the component directly in other styled-components
 * and as such we need it to have a className already assigned.
 * Therefore we wrapped the implementation in a styled function.
 */
declare const ConditionsButton: import("styled-components").StyledComponent<({ onClick, className, hasConditions, variant, }: ConditionsButtonProps) => import("react/jsx-runtime").JSX.Element, import("styled-components").DefaultTheme, {}, never>;
export { ConditionsButton };
export type { ConditionsButtonProps };
