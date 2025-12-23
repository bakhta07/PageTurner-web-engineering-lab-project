import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaUserShield, FaClipboardList, FaSignOutAlt } from "react-icons/fa";


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

  // const allowedLinks removed in favor of direct checks

  // Check if admin route - DISABLED DEBUG
  // const location = useLocation();
  // if (location.pathname.startsWith("/admin")) return null;

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        PageTurner
      </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        {/* PUBLIC: Visible to everyone */}
        <Link to="/catalog" style={styles.link}>
          Catalog
        </Link>

        {/* PUBLIC/CUSTOMER: Cart (Guests & Customers) */}
        {(!user || user.role !== "admin") && (
          <Link to="/cart" style={styles.link}>
            <FaShoppingCart size={20} title="Cart" />
          </Link>
        )}

        {/* GUEST ONLY */}
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={{ ...styles.link, border: "1px solid #FFD700", padding: "5px 10px", borderRadius: "5px" }}>Sign Up</Link>
          </>
        )}

        {/* ADMIN ONLY */}
        {user && user.role === "admin" && (
          <Link to="/admin" style={styles.link}>
            <FaUserShield size={20} title="Admin Dashboard" />
          </Link>
        )}

        {/* CUSTOMER ONLY */}
        {user && user.role === "customer" && (
          <Link to="/my-orders" style={styles.link}>
            <FaClipboardList size={20} title="My Orders" />
          </Link>
        )}

        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt size={20} title="Logout" />
          </button>
        )}

        <Link to="/request-book" style={{ ...styles.link, fontSize: "0.8rem", marginLeft: "10px", fontStyle: "italic" }}>
          Request a Book
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
