import type { SanitizedAdminUser } from '../../../../shared/contracts/shared';
import type { IntlShape } from 'react-intl';
/**
 * Retrieves the display name of an admin panel user
 */
declare const getDisplayName: ({ firstname, lastname, username, email, }: Pick<SanitizedAdminUser, 'firstname' | 'lastname' | 'username' | 'email'>, formatMessage: IntlShape['formatMessage']) => string | undefined;
export { getDisplayName };
