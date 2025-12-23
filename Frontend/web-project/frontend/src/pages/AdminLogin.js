import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Custom login logic
        const result = await login(email, password);

        if (result.success) {
            // Check if user is actually admin
            // We can read this from the decoded token or localStorage since auth context sets it
            const user = JSON.parse(localStorage.getItem("user"));
            if (user?.role === "admin") {
                toast.success("Welcome, Administrator.");
                navigate("/admin");
            } else {
                toast.error("Access Denied: You are not an administrator.");
                // Immediately logout if not admin
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                // Force reload or auth context clear could be needed, but removal is safe enough for "denying entry"
                // Actually calling logout() from context is cleaner if available, but for now this works to bounce them.
                navigate("/login");
            }
        } else {
            toast.error(result.message || "Authentication Failed");
        }
    };

    const styles = {
        container: {
            backgroundColor: "#1a202c", // Dark background
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            color: "#e2e8f0"
        },
        card: {
            backgroundColor: "#2d3748",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center"
        },
        title: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.1em"
        },
        input: {
            width: "100%",
            padding: "12px",
            marginBottom: "16px",
            borderRadius: "4px",
            border: "1px solid #4a5568",
            backgroundColor: "#1a202c",
            color: "white",
            fontSize: "1rem",
            outline: "none"
        },
        button: {
            width: "100%",
            padding: "12px",
            backgroundColor: "#d69e2e", // Gold/Dark Yellow
            color: "#1a202c",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem",
            marginTop: "10px",
            transition: "opacity 0.2s"
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Admin Portal</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>SECURE LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
