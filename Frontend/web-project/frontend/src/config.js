// Centralized API Configuration
// This enables easy switching between Localhost and Vercel Deployment

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_URL = `${API_BASE_URL}/api/auth`; // For Google Auth links

export default API_BASE_URL;
