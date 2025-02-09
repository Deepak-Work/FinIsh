import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser, validateToken } from "../api/apiAuth/apiAuth.js"

export const AuthOptions = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data (user_id, username, etc.)
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication status

    const handleLogin = async (username, password) => {
        try {
            const response = await loginUser(username, password);
            setUser(response.identity);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            throw new Error(error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
            setIsAuthenticated(false);
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await validateToken();
            setUser(response.identity);
            setIsAuthenticated(true);
            console.log('Token validated:', response.identity.username);
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            console.error('Token validation failed:', error.message);
        }
    };

    // const refreshAuth = async () => {
    //     try {
    //         const message = await refreshToken();
    //         console.log(message);
    //     } catch (error) {
    //         console.error(error.message);
    //     }
    // };

    useEffect(() => {
        checkAuth();
        // setInterval(refreshAuth, 600_000);  // Refresh Auth Token every 10 minutes
    }, []);

    return (
        <AuthOptions.Provider value={{ user, isAuthenticated, login: handleLogin, logout: handleLogout }}>
            {children}
        </AuthOptions.Provider>
    );
};