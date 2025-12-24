import React from "react";

const Footer = () => {
    const styles = {
        footer: {
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#2C3E50", // Matching Navbar Midnight Blue
            color: "#ECF0F1",
            marginTop: "auto", // Keeps it at bottom if using flex
        }
    };

    return (
        <footer style={styles.footer}>
            © 2025 PageTurner Online Bookstore
        </footer>
    );
};

export default Footer;
