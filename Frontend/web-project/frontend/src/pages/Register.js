import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import toast from "react-hot-toast";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate Name (Letters only)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            toast.error("Name should contain letters only.");
            return;
        }

        // 2. Validate Password (Strong)
        // Min 8, 1 Letter, 1 Number, 1 Symbol
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error("Password must be 8+ chars, have numbers & symbols.");
            return;
        }

        const result = await register(name, email, password);
        if (result.success) {
            toast.success("Account created successfully!");
            navigate("/catalog");
        } else {
            // Already handles "User already exists" from backend 400
            toast.error(result.message);
        }
    };

    const styles = {
        container: {
            backgroundColor: "#F5F5DC",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Georgia, serif",
            color: "#5D4037"
        },
        card: {
            backgroundColor: "#FFF8E7",
            padding: "40px 30px",
            borderRadius: "12px",
            boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
            textAlign: "center",
            width: "350px"
        },
        title: {
            fontSize: "2rem",
            marginBottom: "10px",
            fontWeight: "bold"
        },
        input: {
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem"
        },
        button: {
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            marginBottom: "15px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            backgroundColor: "#5D4037",
            color: "#FFD700",
            transition: "0.3s"
        },
        link: {
            textDecoration: "none",
            color: "#5D4037",
            fontWeight: "bold"
        },
        error: {
            color: "red",
            marginBottom: "10px",
            fontSize: "0.9rem"
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={{ marginBottom: "20px" }}>Join PageTurner today</p>



                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>

                <p style={{ fontSize: "0.9rem" }}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
