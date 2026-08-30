
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                {
                    email,
                    password
                }
            );

            const { token, user } = response.data;

            // Save login information
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            alert(`Login successful! Welcome ${user.name}`);

            // Temporary redirect
            if (user.role === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/student";
            }

        } catch (error) {
            console.error("Login Error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please check your email and password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1>Hostel Management System</h1>
                <h2>Login</h2>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
    },

    card: {
        width: "400px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        textAlign: "center"
    },

    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        boxSizing: "border-box",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px"
    },

    button: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "5px",
        background: "#2563eb",
        color: "white",
        fontSize: "16px",
        cursor: "pointer"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px"
    }
};

export default Login;