import { ComboboxProps } from '@strapi/design-system';
import { ISOLocale } from '../../../shared/contracts/iso-locales';
interface LocaleSelectProps extends Pick<ComboboxProps, 'onClear' | 'error' | 'value'> {
    onLocaleChange: (locale: ISOLocale) => void;
}
/**
 * The component is memoized and needs a useCallback over the onLocaleChange and
 * onClear props to prevent the Select from re-rendering N times when typing on a specific
 * key in a formik form
 */
declare const LocaleSelect: ({ value, onClear, onLocaleChange, error }: LocaleSelectProps) => import("react/jsx-runtime").JSX.Element;
export { LocaleSelect };
export type { LocaleSelectProps };
