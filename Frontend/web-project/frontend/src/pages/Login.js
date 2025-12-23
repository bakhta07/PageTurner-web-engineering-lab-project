import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AUTH_URL } from "../config";

import { Link } from "react-router-dom"; // Add Link import

import toast from "react-hot-toast";

const Login = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back!");

      // Let's just hard redirect to home or catalog for now, or check local storage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") {
        // Deny Admin Access on Public Portal (Security by Obscurity)
        logout();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Generic error so nobody knows an admin portal exists
        toast.error("Invalid email or password");
      } else {
        navigate("/catalog");
      }
    } else {
      toast.error(result.message);
    }
  };

  const styles = {
    container: {
      backgroundColor: "#F5F5DC", // beige
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Georgia, serif",
      color: "#5D4037"
    },
    card: {
      backgroundColor: "#FFF8E7", // cream
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
    subtitle: {
      fontSize: "1rem",
      marginBottom: "30px"
    },
    button: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "1rem",
      transition: "0.3s"
    },
    adminBtn: {
      backgroundColor: "#5D4037",
      color: "#FFD700"
    },
    customerBtn: {
      backgroundColor: "#FFD700",
      color: "#5D4037"
    },
    buttonHover: {
      opacity: 0.8
    },
    link: {
      textDecoration: "none",
      color: "#5D4037",
      fontWeight: "bold",
    },
    googleBtn: {
      display: "block",
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      backgroundColor: "white",
      color: "#555",
      fontWeight: "bold",
      textDecoration: "none",
      fontSize: "1rem",
      transition: "0.3s"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to PageTurner</h2>
        <p style={styles.subtitle}>Login to continue and explore our collection</p>



        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
            required
          />

          <button
            type="submit"
            style={{ ...styles.button, ...styles.adminBtn }}
            onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
            onMouseLeave={(e) => (e.target.style.opacity = 1)}
          >
            Login
          </button>
        </form>


        <div style={{ margin: "20px 0", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
          <a href={`${AUTH_URL}/google`} style={styles.googleBtn}>
            Sign in with Google
          </a>
        </div>

        <p style={{ marginTop: "15px", fontSize: "0.9rem" }}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
