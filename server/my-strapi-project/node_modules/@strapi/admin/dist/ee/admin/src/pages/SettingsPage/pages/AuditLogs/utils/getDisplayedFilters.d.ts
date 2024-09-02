import { FilterData } from '@strapi/helper-plugin';
import { IntlShape } from 'react-intl';
import { SanitizedAdminUser } from '../../../../../../../../shared/contracts/shared';
export declare const getDisplayedFilters: ({ formatMessage, users, canReadUsers, }: {
    formatMessage: IntlShape['formatMessage'];
    users: SanitizedAdminUser[];
    canReadUsers: boolean;
}) => FilterData[];
