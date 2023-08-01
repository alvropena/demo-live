"use client"
import React, { ReactNode, createContext, useContext, useState } from "react";

interface ThemeContextType {
    dark: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [dark, setDark] = useState<boolean>(false);

    const toggleTheme = () => {
        setDark(!dark);
    };

    return (
        <ThemeContext.Provider
            value={{ dark, toggleTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export { ThemeProvider, useTheme };
