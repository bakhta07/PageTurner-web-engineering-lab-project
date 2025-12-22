import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import rbac from "../config/rbac.json";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // <-- add this

  const handleLogout = () => {
    logout();           // clear user
    navigate("/login"); // redirect to login page
  };

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#5D4037",
      color: "#FFD700",
      fontFamily: "Georgia, serif",
    },
    brand: { fontSize: "1.8rem", fontWeight: "bold", textDecoration: "none", color: "#FFD700" },
    links: { display: "flex", gap: "20px", alignItems: "center" },
    link: { color: "#FFD700", textDecoration: "none", fontWeight: "bold", transition: "0.3s" },
    logoutBtn: {
      backgroundColor: "#FFD700",
      color: "#5D4037",
      border: "none",
      padding: "6px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
  };

  const allowedLinks = user && rbac[user.role]?.allowedRoutes ? rbac[user.role].allowedRoutes : [];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        PageTurner
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {!user && <Link to="/login" style={styles.link}>Login</Link>}

        {user &&
          allowedLinks.map((route, idx) => (
            <Link key={idx} to={route} style={styles.link}>
              {route === "/admin" && "Admin"}
              {route === "/catalog" && "Catalog"}
              {route === "/cart" && "Cart"}
            </Link>
          ))}

        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
