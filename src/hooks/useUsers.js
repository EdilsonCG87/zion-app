import { useState } from "react";

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

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);

            setUsers(usersData || []);
            setRoles(rolesData || []);

            if (
                rolesData &&
                rolesData.length > 0 &&
                !rolesData.some((role) => role.name === roleName)
            ) {
                setRoleName(rolesData[0].name);
            }
        } catch (requestError) {
            setError(
                requestError.message ||
                    "No fue posible cargar usuarios y roles."
            );
        } finally {
            setLoading(false);
        }
    };

    const saveUser = async (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim() || !roleName) {
            setError("Completa todos los campos.");
            return false;
        }

        try {
            setLoading(true);
            setError("");

            await createUser({
                username: username.trim(),
                password: password,
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
            setError(
                requestError.message ||
                    "No fue posible crear el usuario."
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    const toggleUserEnabled = async (user) => {
        try {
            setLoading(true);
            setError("");

            await setUserEnabled(user.id, !user.enabled);
            await loadData();
        } catch (requestError) {
            setError(
                requestError.message ||
                    "No fue posible actualizar el usuario."
            );
        } finally {
            setLoading(false);
        }
    };

    const updatePassword = async (user, newPassword) => {
        if (!newPassword.trim()) {
            setError("La contraseña no puede estar vacía.");
            return false;
        }

        try {
            setLoading(true);
            setError("");

            await changeUserPassword(user.id, newPassword);

            return true;
        } catch (requestError) {
            setError(
                requestError.message ||
                    "No fue posible cambiar la contraseña."
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    const removeUser = async (user) => {
        try {
            setLoading(true);
            setError("");

            await deleteUser(user.id);
            await loadData();

            return true;
        } catch (requestError) {
            setError(
                requestError.message ||
                    "No fue posible eliminar el usuario."
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

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