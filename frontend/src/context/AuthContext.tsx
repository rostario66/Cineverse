import { createContext, useContext, useState, } from "react";
import type { ReactNode } from "react"; 
import type { AuthResponse } from "../types";

interface AuthContextType {
    token: string | null,
    userName: string | null,
    isAuthenticated: boolean,
    login: (data: AuthResponse) => void,
    logout: () => void
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    
    const [userName, setUserName] = useState<string | null>(
        localStorage.getItem("userName")
    );

    const login = (data: AuthResponse) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.userName);
        setToken(data.token);
        setUserName(data.userName);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setToken(null);
        setUserName(null);
    };

    return (
        <AuthContext.Provider value={{
            token,
            userName,
            isAuthenticated: !!token,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};