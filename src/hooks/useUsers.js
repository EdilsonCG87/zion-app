import { useCallback, useState } from "react";

import {
    getRoles,
    getUsers,
    createUser,
    setUserEnabled,
    changeUserPassword,
    deleteUser
} from "../services/userService";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roleName, setRoleName] = useState("USER");

    /**
     * Carga usuarios y roles.
     *
     * useCallback evita que la referencia de la función
     * cambie en cada render del componente.
     */
    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);

            setUsers(Array.isArray(usersData) ? usersData : []);
            setRoles(Array.isArray(rolesData) ? rolesData : []);

            // Si el rol seleccionado ya no existe,
            // seleccionamos automáticamente el primero disponible.
            if (
                Array.isArray(rolesData) &&
                rolesData.length > 0 &&
                !rolesData.some((role) => role.name === roleName)
            ) {
                setRoleName(rolesData[0].name);
            }
        } catch (requestError) {
            console.error("Error al cargar usuarios y roles:", requestError);

            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "No fue posible cargar usuarios y roles."
            );
        } finally {
            setLoading(false);
        }
    }, [roleName]);

    /**
     * Crea un nuevo usuario.
     */
    const saveUser = useCallback(
        async (event) => {
            event.preventDefault();

            if (
                !username.trim() ||
                !password.trim() ||
                !roleName
            ) {
                setError("Completa todos los campos.");
                return false;
            }

            try {
                setLoading(true);
                setError("");

                await createUser({
                    username: username.trim(),
                    password,
                    role: {
                        name: roleName
                    }
                });

                setUsername("");
                setPassword("");
                setRoleName("USER");

                await loadData();

                return true;
            } catch (requestError) {
                console.error("Error al crear usuario:", requestError);

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "No fue posible crear el usuario."
                );

                return false;
            } finally {
                setLoading(false);
            }
        },
        [username, password, roleName, loadData]
    );

    /**
     * Activa o desactiva un usuario.
     */
    const toggleUserEnabled = useCallback(
        async (user) => {
            try {
                setLoading(true);
                setError("");

                await setUserEnabled(
                    user.id,
                    !user.enabled
                );

                await loadData();
            } catch (requestError) {
                console.error(
                    "Error al actualizar estado del usuario:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "No fue posible actualizar el usuario."
                );
            } finally {
                setLoading(false);
            }
        },
        [loadData]
    );

    /**
     * Cambia la contraseña de un usuario.
     */
    const updatePassword = useCallback(
        async (user, newPassword) => {
            if (!newPassword?.trim()) {
                setError("La contraseña no puede estar vacía.");
                return false;
            }

            try {
                setLoading(true);
                setError("");

                await changeUserPassword(
                    user.id,
                    newPassword
                );

                return true;
            } catch (requestError) {
                console.error(
                    "Error al cambiar contraseña:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "No fue posible cambiar la contraseña."
                );

                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Elimina un usuario.
     */
    const removeUser = useCallback(
        async (user) => {
            try {
                setLoading(true);
                setError("");

                await deleteUser(user.id);

                await loadData();

                return true;
            } catch (requestError) {
                console.error(
                    "Error al eliminar usuario:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "No fue posible eliminar el usuario."
                );

                return false;
            } finally {
                setLoading(false);
            }
        },
        [loadData]
    );

    return {
        users,
        roles,
        loading,
        error,

        username,
        setUsername,

        password,
        setPassword,

        roleName,
        setRoleName,

        loadData,
        saveUser,
        toggleUserEnabled,
        updatePassword,
        removeUser
    };
}