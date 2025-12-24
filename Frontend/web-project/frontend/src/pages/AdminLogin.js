import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../config";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();



        // Custom admin login logic (Separate from Customer AuthContext)
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                // Check if user is actually admin
                if (data.role === "admin") {
                    localStorage.setItem("adminUser", JSON.stringify(data));
                    toast.success("Welcome, Administrator.");
                    navigate("/admin"); // Dashboard
                } else {
                    toast.error("Access Denied: You are not an administrator.");
                }
            } else {
                toast.error(data.message || "Authentication Failed");
            }
        } catch (err) {
            toast.error("Login Error");
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
