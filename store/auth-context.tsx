
import { createContext, useState } from 'react';

export const AuthContext = createContext({
    token: null as string | null,
    isAuthenticated: false,
    authenticate: (token: string) => {},
    logout: () => {},
});

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [authToken, setAuthToken] = useState<string | null>(null);

    function authenticate(token: string) {
        setAuthToken(token);
    }

    function logout() {
        setAuthToken(null);
    }

    const value = {
        token: authToken,
        isAuthenticated: !!authToken,
        authenticate,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
