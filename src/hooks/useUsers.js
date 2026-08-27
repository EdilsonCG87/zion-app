import {
    getRoles,
    getUsers,
    createUser,
    setUserEnabled,
    changeUserPassword,
    deleteUser
} from "../services/userService";

import Swal from "sweetalert2";

import { useState } from "react";


function useUsers() {

    // =========================
    // ESTADOS
    // =========================

    const [users, setUsers] =
        useState([]);

    const [roles, setRoles] =
        useState([]);

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [roleName, setRoleName] =
        useState("USER");


    // =========================
    // CARGAR ROLES
    // =========================

    const loadRoles = async () => {

        try {

            const data =
                await getRoles();

            setRoles(data);

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No fue posible cargar los roles",
                "error"
            );
        }
    };


    // =========================
    // CARGAR USUARIOS
    // =========================

    const loadUsers = async () => {

        try {

            const data =
                await getUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No fue posible cargar los usuarios",
                "error"
            );
        }
    };


    // =========================
    // CREAR USUARIO
    // =========================

    const saveUser = async (
        event
    ) => {

        event.preventDefault();

        if (
            !username.trim()
            ||
            !password.trim()
            ||
            !roleName
        ) {

            Swal.fire(
                "Información incompleta",
                "Completa todos los campos",
                "warning"
            );

            return;
        }

        try {

            await createUser({
                username:
                    username.trim(),

                password,

                role: {
                    name:
                        roleName
                }
            });

            Swal.fire(
                "Usuario creado",
                "El usuario fue creado correctamente",
                "success"
            );

            setUsername("");
            setPassword("");
            setRoleName("USER");

            loadUsers();

        } catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "No fue posible crear el usuario",
                "error"
            );
        }
    };


    // =========================
    // ACTIVAR / DESACTIVAR
    // =========================

    const toggleUserEnabled =
        async (
            user
        ) => {

            try {

                await setUserEnabled(
                    user.id,
                    !user.enabled
                );

                await loadUsers();

            } catch (error) {

                console.error(error);

                Swal.fire(
                    "Error",
                    "No fue posible actualizar el usuario",
                    "error"
                );
            }
        };


    // =========================
    // CAMBIAR CONTRASEÑA
    // =========================

    const updatePassword =
        async (
            user
        ) => {

            const result =
                await Swal.fire({

                    title:
                        `Cambiar contraseña de ${user.username}`,

                    input:
                        "password",

                    inputPlaceholder:
                        "Nueva contraseña",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Actualizar",

                    cancelButtonText:
                        "Cancelar"
                });

            if (
                !result.isConfirmed
            ) {

                return;
            }

            if (
                !result.value
            ) {

                return;
            }

            try {

                await changeUserPassword(
                    user.id,
                    result.value
                );

                Swal.fire(
                    "Contraseña actualizada",
                    "La contraseña fue cambiada correctamente",
                    "success"
                );

            } catch (error) {

                console.error(error);

                Swal.fire(
                    "Error",
                    "No fue posible cambiar la contraseña",
                    "error"
                );
            }
        };


    // =========================
    // ELIMINAR USUARIO
    // =========================

    const confirmDeleteUser =
        async (
            user
        ) => {

            const result =
                await Swal.fire({

                    title:
                        "¿Eliminar usuario?",

                    text:
                        `Se eliminará el usuario "${user.username}"`,

                    icon:
                        "warning",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Sí, eliminar",

                    cancelButtonText:
                        "Cancelar"
                });

            if (
                !result.isConfirmed
            ) {

                return;
            }

            try {

                await deleteUser(
                    user.id
                );

                await loadUsers();

                Swal.fire(
                    "Eliminado",
                    "El usuario fue eliminado correctamente",
                    "success"
                );

            } catch (error) {

                console.error(error);

                Swal.fire(
                    "Error",
                    "No fue posible eliminar el usuario",
                    "error"
                );
            }
        };


    // =========================
    // RETORNAR
    // =========================

    return {

        users,
        roles,

        username,
        setUsername,

        password,
        setPassword,

        roleName,
        setRoleName,

        loadUsers,
        loadRoles,

        saveUser,
        toggleUserEnabled,
        updatePassword,
        confirmDeleteUser
    };
}


export default useUsers;