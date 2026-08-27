const API_URL = "http://localhost:8080";


// =========================
// ROLES
// =========================

export const getRoles = async () => {

    const response =
        await fetch(
            `${API_URL}/roles`
        );

    if (!response.ok) {

        throw new Error(
            "Error al obtener los roles"
        );
    }

    return response.json();
};


// =========================
// USUARIOS
// =========================

export const getUsers = async () => {

    const response =
        await fetch(
            `${API_URL}/users`
        );

    if (!response.ok) {

        throw new Error(
            "Error al obtener los usuarios"
        );
    }

    return response.json();
};


// =========================
// CREAR USUARIO
// =========================

export const createUser = async (
    user
) => {

    const response =
        await fetch(
            `${API_URL}/users`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(
                    user
                )
            }
        );

    if (!response.ok) {

        throw new Error(
            "Error al crear el usuario"
        );
    }

    return response.json();
};


// =========================
// ACTIVAR / DESACTIVAR
// =========================

export const setUserEnabled = async (
    id,
    enabled
) => {

    const response =
        await fetch(
            `${API_URL}/users/${id}/enabled?enabled=${enabled}`,
            {
                method: "PUT"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Error al actualizar el usuario"
        );
    }

    return response.json();
};


// =========================
// CAMBIAR CONTRASEÑA
// =========================

export const changeUserPassword =
    async (
        id,
        password
    ) => {

        const response =
            await fetch(
                `${API_URL}/users/${id}/password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        password
                    })
                }
            );

        if (!response.ok) {

            throw new Error(
                "Error al cambiar la contraseña"
            );
        }

        return response.json();
    };


// =========================
// ELIMINAR USUARIO
// =========================

export const deleteUser = async (
    id
) => {

    const response =
        await fetch(
            `${API_URL}/users/${id}`,
            {
                method: "DELETE"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Error al eliminar el usuario"
        );
    }
};