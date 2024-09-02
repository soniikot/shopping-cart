import { IntlFormatters } from 'react-intl';
import { PartialWorkflow } from '../reducer';
export declare function validateWorkflow({ values, formatMessage, }: {
    values: PartialWorkflow;
} & Pick<IntlFormatters, 'formatMessage'>): Promise<{}>;
