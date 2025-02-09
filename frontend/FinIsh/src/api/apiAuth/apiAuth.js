import apiRequest from "../apiRequest";

/**
 * Register a new user
 * @param {string} fullName - User's full name
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<Object>} Response message
 */
async function registerUser(fullName, username, email, password) {
    try {
        const response = await apiRequest("/register", "POST", {
            full_name: fullName,
            username,
            email,
            password
        });
        return response;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

/**
 * Login user
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response message including access token
 */
async function loginUser(username, password) {
    try {
        const response = await apiRequest("/auth/login", "POST", {
            username,
            password
        });
        return response;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

/**
 * Logout user (removes JWT from cookies)
 * @returns {Promise<Object>} Response message
 */
async function logoutUser() {
    try {
        const response = await apiRequest("/auth/logout", "GET");
        return response;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

/**
 * Validate JWT token
 * @returns {Promise<Object>} Response message including identity data
 */
async function validateToken() {
    try {
        const response = await apiRequest("/auth/validate-token", "GET");
        return response;
    } catch (error) {
        console.error("Error validating token:", error);
        throw error;
    }
}

// Export functions for use in other files
export { registerUser, loginUser, logoutUser, validateToken };
