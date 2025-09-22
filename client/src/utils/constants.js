// utils/constants.js

// API base URL (change according to your backend)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API endpoints
export const API_ENDPOINTS = {
  CASES: {
    CREATE: `${API_BASE_URL}/cases/create`,
    MY_CASES: `${API_BASE_URL}/cases/my`,
  },
  BOOKINGS: {
    CREATE: `${API_BASE_URL}/bookings/create`,
    MY_BOOKINGS: `${API_BASE_URL}/bookings/my`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
};

// Available booking slots (example)
export const BOOKING_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  ADVOCATE: "advocate",
};
