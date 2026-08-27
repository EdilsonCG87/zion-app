import { useEffect, useState } from "react";

function UsersPage({ usersHook }) {
    const {
        users = [],
        roles = [],
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
    } = usersHook;

    const [passwordUser, setPasswordUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateUser = async (event) => {
        const created = await saveUser(event);

        if (created) {
            setMessage("Usuario creado correctamente.");
        }
    };

    const handlePasswordUpdate = async (event) => {
        event.preventDefault();

        const updated = await updatePassword(passwordUser, newPassword);

        if (updated) {
            setMessage("Contraseña actualizada correctamente.");
            setPasswordUser(null);
            setNewPassword("");
        }
    };

    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `¿Deseas eliminar al usuario "${user.username}"?`
        );

        if (!confirmed) {
            return;
        }

        const deleted = await removeUser(user);

        if (deleted) {
            setMessage("Usuario eliminado correctamente.");
        }
    };

    return (
        <main className="users-admin">
            <section className="users-hero">
                <div>
                    <p className="users-eyebrow">ADMINISTRACIÓN</p>
                    <h2>Usuarios y permisos</h2>
                    <p className="users-subtitle">
                        Gestiona las cuentas que pueden acceder a ZION.
                    </p>
                </div>

                <button
                    type="button"
                    className="users-refresh-button"
                    onClick={loadData}
                    disabled={loading}
                >
                    ↻ Actualizar
                </button>
            </section>

            {error && (
                <div className="users-alert users-alert-error">
                    <span>⚠</span>
                    {error}
                </div>
            )}

            {message && (
                <div className="users-alert users-alert-success">
                    <span>✓</span>
                    {message}

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Cerrar mensaje"
                    >
                        ×
                    </button>
                </div>
            )}

            <section className="users-create-card">
                <div className="users-card-heading">
                    <div className="users-heading-icon">+</div>

                    <div>
                        <h3>Crear usuario</h3>
                        <p>Asigna un nombre, contraseña y nivel de acceso.</p>
                    </div>
                </div>

                <form className="users-form" onSubmit={handleCreateUser}>
                    <label>
                        <span>Nombre de usuario</span>

                        <input
                            type="text"
                            placeholder="Ejemplo: maria.garcia"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <span>Contraseña</span>

                        <input
                            type="password"
                            placeholder="Escribe una contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <span>Rol</span>

                        <select
                            value={roleName}
                            onChange={(event) => setRoleName(event.target.value)}
                            disabled={loading || roles.length === 0}
                        >
                            {roles.length === 0 ? (
                                <option value="">No hay roles disponibles</option>
                            ) : (
                                roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="users-create-button"
                        disabled={loading || roles.length === 0}
                    >
                        {loading ? "Guardando..." : "Crear usuario"}
                    </button>
                </form>
            </section>

            <section className="users-list-card">
                <div className="users-list-heading">
                    <div>
                        <h3>Usuarios registrados</h3>
                        <p>
                            {users.length}{" "}
                            {users.length === 1 ? "usuario" : "usuarios"} en
                            el sistema
                        </p>
                    </div>

                    <span className="users-count">{users.length}</span>
                </div>

                {loading && (
                    <p className="users-loading">Cargando información...</p>
                )}

                {!loading && users.length === 0 && (
                    <div className="users-empty">
                        <div>👥</div>
                        <h4>Aún no hay usuarios</h4>
                        <p>Crea la primera cuenta utilizando el formulario.</p>
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="users-table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th className="users-actions-header">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="users-person">
                                                <span>
                                                    {user.username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>

                                                <strong>{user.username}</strong>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="users-role-badge">
                                                {user.role?.name ||
                                                    user.role ||
                                                    "Sin rol"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    user.enabled
                                                        ? "users-status users-status-active"
                                                        : "users-status users-status-inactive"
                                                }
                                            >
                                                {user.enabled
                                                    ? "Activo"
                                                    : "Inactivo"}
                                            </span>
                                        </td>

                                        <td className="users-actions">
                                            <button
                                                type="button"
                                                className="users-action-button"
                                                onClick={() =>
                                                    toggleUserEnabled(user)
                                                }
                                                disabled={loading}
                                            >
                                                {user.enabled
                                                    ? "Desactivar"
                                                    : "Activar"}
                                            </button>

                                            <button
                                                type="button"
                                                className="users-action-button"
                                                onClick={() => {
                                                    setPasswordUser(user);
                                                    setNewPassword("");
                                                }}
                                                disabled={loading}
                                            >
                                                Clave
                                            </button>

                                            <button
                                                type="button"
                                                className="users-delete-button"
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                disabled={loading}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {passwordUser && (
                <div className="users-modal-overlay">
                    <form
                        className="users-password-modal"
                        onSubmit={handlePasswordUpdate}
                    >
                        <button
                            type="button"
                            className="users-modal-close"
                            onClick={() => {
                                setPasswordUser(null);
                                setNewPassword("");
                            }}
                        >
                            ×
                        </button>

                        <p className="users-eyebrow">SEGURIDAD</p>
                        <h3>Cambiar contraseña</h3>
                        <p>
                            Nueva contraseña para{" "}
                            <strong>{passwordUser.username}</strong>.
                        </p>

                        <label>
                            <span>Nueva contraseña</span>

                            <input
                                type="password"
                                placeholder="Escribe la nueva contraseña"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                                autoFocus
                            />
                        </label>

                        <div className="users-modal-actions">
                            <button
                                type="button"
                                className="users-cancel-button"
                                onClick={() => {
                                    setPasswordUser(null);
                                    setNewPassword("");
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="users-create-button"
                                disabled={loading}
                            >
                                Guardar cambio
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

export default UsersPage;