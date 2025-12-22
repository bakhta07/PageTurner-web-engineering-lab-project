import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);

    // Redirect based on role
    if (role === "admin") navigate("/admin");
    else if (role === "customer") navigate("/catalog");
    else navigate("/");
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome to PageTurner</h2>
        <p style={styles.subtitle}>Login to continue and explore our collection</p>

        <button
          style={{ ...styles.button, ...styles.adminBtn }}
          onClick={() => handleLogin("admin")}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Login as Admin
        </button>

        <button
          style={{ ...styles.button, ...styles.customerBtn }}
          onClick={() => handleLogin("customer")}
          onMouseEnter={(e) => (e.target.style.opacity = 0.8)}
          onMouseLeave={(e) => (e.target.style.opacity = 1)}
        >
          Login as Customer
        </button>
      </div>
    </div>
  );
};

export default Login;
