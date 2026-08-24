// =========================
// IMPORTS
// =========================

import axios from "axios";

// =========================
// INSTANCIA AXIOS
// =========================

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    headers: {

        Accept: "application/json"

    }

});

// =========================
// EXPORT
// =========================

export default API;