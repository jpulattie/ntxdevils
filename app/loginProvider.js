'use client';

import { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export function LoginProvider({ children }) {
    const [login, setLogin] = useState(false);

    return (
        <LoginContext.Provider value={{ login, setLogin }}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin() {
    return useContext(LoginContext);
}