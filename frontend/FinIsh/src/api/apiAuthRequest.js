// apiAuth.js
const BASE_URL = "http://127.0.0.1:5000";

/**
 * General API request function for authentication-related actions.
 * Uses credentials: "include" to ensure JWT authentication via cookies.
 */
export default async function apiAuthRequest(endpoint, method = "POST", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // Ensures cookies (JWT) are sent
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("API Auth Error:", error.message);
        throw error;
    }
}