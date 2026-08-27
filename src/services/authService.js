import API from "./api";

export async function login(credentials) {
    const response = await API.post("/auth/login", credentials);
    return response.data;
}

export async function getCurrentUser() {
    const response = await API.get("/auth/me");
    return response.data;
}
