// =========================
// IMPORTS
// =========================

import API from "./api";


// =========================
// ROLES
// =========================

export const getRoles = async () => {

    const response =
        await API.get("/roles");

    return response.data;
};


// =========================
// USUARIOS
// =========================

export const getUsers = async () => {

    const response =
        await API.get("/users");

    return response.data;
};


// =========================
// CREAR USUARIO
// =========================

export const createUser = async (
    user
) => {

    const response =
        await API.post(
            "/users",
            user
        );

    return response.data;
};


// =========================
// ACTIVAR / DESACTIVAR
// =========================

export const setUserEnabled = async (
    id,
    enabled
) => {

    const response =
        await API.put(
            `/users/${id}/enabled`,
            null,
            {
                params: {
                    enabled: enabled
                }
            }
        );

    return response.data;
};


// =========================
// CAMBIAR CONTRASEÑA
// =========================

export const changeUserPassword = async (
    id,
    password
) => {

    const response =
        await API.put(
            `/users/${id}/password`,
            {
                password: password
            }
        );

    return response.data;
};


// =========================
// ELIMINAR USUARIO
// =========================

export const deleteUser = async (
    id
) => {

    await API.delete(
        `/users/${id}`
    );
};