function UsersPage({

    users,
    roles,

    username,
    setUsername,

    password,
    setPassword,

    roleName,
    setRoleName,

    saveUser,
    toggleUserEnabled,
    updatePassword,
    confirmDeleteUser
}) {

    return (

        <div className="users-page">


            {/* =========================
                ENCABEZADO
            ========================= */}

            <div className="page-header">

                <div>

                    <h2>
                        👥 Usuarios
                    </h2>

                    <p>
                        Administración de usuarios
                        y permisos de ZION.
                    </p>

                </div>

            </div>


            {/* =========================
                FORMULARIO
            ========================= */}

            <div className="user-form-card">

                <h3>
                    ➕ Crear usuario
                </h3>


                <form
                    onSubmit={saveUser}
                >

                    <div className="user-form-grid">


                        <div className="form-group">

                            <label>
                                Usuario
                            </label>

                            <input
                                type="text"
                                value={username}

                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }

                                placeholder="Nombre de usuario"

                                autoComplete="username"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}

                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }

                                placeholder="Contraseña"

                                autoComplete="new-password"
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Rol
                            </label>

                            <select
                                value={roleName}

                                onChange={(event) =>
                                    setRoleName(
                                        event.target.value
                                    )
                                }
                            >

                                {roles.map(
                                    (role) => (

                                        <option
                                            key={role.id}

                                            value={
                                                role.name
                                            }
                                        >

                                            {role.name}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                    </div>


                    <button
                        type="submit"
                        className="save-user-btn"
                    >

                        Crear usuario

                    </button>

                </form>

            </div>


            {/* =========================
                TABLA DE USUARIOS
            ========================= */}

            <div className="users-table-card">

                <h3>
                    📋 Usuarios registrados
                </h3>


                <div className="users-table-container">

                    <table className="users-table">


                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Usuario
                                </th>

                                <th>
                                    Rol
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th>
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-users"
                                    >

                                        No hay usuarios registrados.

                                    </td>

                                </tr>

                            ) : (

                                users.map(
                                    (user) => (

                                        <tr
                                            key={user.id}
                                        >

                                            <td>
                                                {user.id}
                                            </td>

                                            <td>
                                                👤 {user.username}
                                            </td>

                                            <td>

                                                <span
                                                    className="role-badge"
                                                >

                                                    {user.role?.name
                                                        || "-"
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        user.enabled
                                                            ? "user-status enabled"
                                                            : "user-status disabled"
                                                    }
                                                >

                                                    {user.enabled
                                                        ? "Activo"
                                                        : "Inactivo"
                                                    }

                                                </span>

                                            </td>

                                            <td
                                                className="user-actions"
                                            >

                                                <button
                                                    className={
                                                        user.enabled
                                                            ? "disable-user-btn"
                                                            : "enable-user-btn"
                                                    }

                                                    onClick={() =>
                                                        toggleUserEnabled(
                                                            user
                                                        )
                                                    }
                                                >

                                                    {user.enabled
                                                        ? "Desactivar"
                                                        : "Activar"
                                                    }

                                                </button>


                                                <button
                                                    className="password-user-btn"

                                                    onClick={() =>
                                                        updatePassword(
                                                            user
                                                        )
                                                    }
                                                >

                                                    Contraseña

                                                </button>


                                                <button
                                                    className="delete-user-btn"

                                                    onClick={() =>
                                                        confirmDeleteUser(
                                                            user
                                                        )
                                                    }
                                                >

                                                    Eliminar

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );
}


export default UsersPage;