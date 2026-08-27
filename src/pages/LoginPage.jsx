import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login({ username: username.trim(), password });
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "No fue posible iniciar sesión. Verifica tus datos."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">
                <img src={logo} alt="ZION" className="login-logo" />
                <p className="login-kicker">ZION PLAYLIST</p>
                <h1>Bienvenido</h1>
                <p className="login-description">Ingresa con tu cuenta para administrar las alabanzas.</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Usuario
                        <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            autoFocus
                            required
                        />
                    </label>
                    <label>
                        Contraseña
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    {error && <p className="login-error" role="alert">{error}</p>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;
