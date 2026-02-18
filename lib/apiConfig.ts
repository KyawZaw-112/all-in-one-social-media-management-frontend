
/**
 * Centralized API configuration for the frontend.
 * This ensures we use the correct backend URL in both development and production.
 */

// Priority:
// 1. NEXT_PUBLIC_API_URL (Primary env var)
// 2. NEXT_PUBLIC_BACKEND_URL (Secondary/Legacy env var)
// 3. Fallback to localhost during development
export const getApiUrl = () => {
    // If running in the browser, we can check the environment
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (envApiUrl) {
        // Trim trailing slash for consistency
        return envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
    }

    // Default fallback
    return "http://localhost:4000";
};

export const API_URL = getApiUrl();
