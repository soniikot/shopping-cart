import * as React from 'react';
import { Login } from '../../../shared/contracts/authentication';
import { useLoginMutation } from '../services/auth';
import type { SanitizedAdminUser } from '../../../shared/contracts/shared';
interface AuthContextValue {
    login: (body: Login.Request['body'] & {
        rememberMe: boolean;
    }) => Promise<Awaited<ReturnType<ReturnType<typeof useLoginMutation>[0]>>>;
    logout: () => Promise<void>;
    setToken: (token: string | null) => void;
    token: string | null;
    user?: SanitizedAdminUser;
}
declare const useAuth: (consumerName: string) => AuthContextValue;
interface AuthProviderProps {
    children: React.ReactNode;
}
declare const AuthProvider: ({ children }: AuthProviderProps) => import("react/jsx-runtime").JSX.Element;
export { AuthProvider, useAuth };
