// =========================
// IMPORTS
// =========================

import axios from "axios";

// =========================
// INSTANCIA AXIOS
// =========================

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",

    headers: {

        Accept: "application/json"

    }

});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("zion_auth_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("zion_auth_token");
            localStorage.removeItem("zion_auth_user");
            window.dispatchEvent(new Event("zion:session-expired"));
        }

        return Promise.reject(error);
    }
);

// =========================
// EXPORT
// =========================

export default API;
