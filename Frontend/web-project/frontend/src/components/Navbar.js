import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaBook, FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaBars } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const styles = {
    nav: {
      backgroundColor: "#2C3E50", // Midnight Blue
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      color: "white"
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      color: "#F1C40F", // Gold Accent
      textDecoration: "none"
    },
    menu: {
      display: "flex",
      gap: "25px",
      alignItems: "center",
      // Mobile handling would go here with media queries or JS
    },
    mobileMenu: {
      display: isMenuOpen ? "flex" : "none",
      flexDirection: "column",
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      backgroundColor: "#2C3E50",
      padding: "20px",
      gap: "15px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    },
    link: {
      color: "#ECF0F1", // Cloud White
      textDecoration: "none",
      fontSize: "1rem",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "color 0.2s"
    },
    badge: {
      backgroundColor: "#E74C3C", // Red
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "0.75rem",
      marginLeft: "5px",
      verticalAlign: "top"
    },
    hamburger: {
      display: window.innerWidth < 768 ? "block" : "none",
      cursor: "pointer",
      fontSize: "1.5rem"
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <FaBook /> PageTurner
      </Link>

      <div style={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FaBars />
      </div>

      {/* Desktop Menu */}
      <div style={{ ...styles.menu, display: window.innerWidth < 768 ? "none" : "flex" }}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/catalog" style={styles.link}>Catalog</Link>

        <Link to="/cart" style={styles.link}>
          <FaShoppingCart /> Cart
          {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>

        {user ? (
          <>

            <span style={{ color: "#bdc3c7" }}>|</span>
            <div style={styles.link}><FaUser /> {user.name}</div>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #E74C3C",
                color: "#E74C3C",
                padding: "5px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ ...styles.link, color: "#F1C40F" }}>
            <FaSignInAlt /> Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && window.innerWidth < 768 && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.link} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/catalog" style={styles.link} onClick={() => setIsMenuOpen(false)}>Catalog</Link>
          <Link to="/cart" style={styles.link} onClick={() => setIsMenuOpen(false)}>Cart ({totalItems})</Link>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" style={{ ...styles.link, color: "#F1C40F" }} onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} style={{ ...styles.link, background: "none", border: "none", cursor: "pointer", color: "#E74C3C" }}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={{ ...styles.link, color: "#F1C40F" }} onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
