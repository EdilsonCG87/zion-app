import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest } from "../services/authService";

const AuthContext = createContext(null);
const TOKEN_KEY = "zion_auth_token";
const USER_KEY = "zion_auth_user";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY));
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

    const clearSession = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            setLoading(false);
            return undefined;
        }

        getCurrentUser()
            .then((currentUser) => {
                localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
                setUser(currentUser);
            })
            .catch(clearSession)
            .finally(() => setLoading(false));

        window.addEventListener("zion:session-expired", clearSession);
        return () => window.removeEventListener("zion:session-expired", clearSession);
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        isAdmin: user?.role === "ADMIN",
        login: async (credentials) => {
            const session = await loginRequest(credentials);
            localStorage.setItem(TOKEN_KEY, session.token);
            localStorage.setItem(USER_KEY, JSON.stringify(session.user));
            setUser(session.user);
            return session.user;
        },
        logout: clearSession
    }), [user, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }

    return context;
}
