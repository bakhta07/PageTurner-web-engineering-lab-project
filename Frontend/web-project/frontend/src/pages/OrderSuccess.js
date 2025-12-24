import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const OrderSuccess = () => {
    const styles = {
        container: {
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFF8E7",
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            textAlign: "center",
            padding: "20px",
        },
        card: {
            backgroundColor: "#FFFFFF",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
        },
        icon: {
            color: "#27AE60",
            fontSize: "4rem",
            marginBottom: "20px",
        },
        title: {
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#2C3E50",
            marginBottom: "10px",
        },
        message: {
            fontSize: "1.1rem",
            color: "#7F8C8D",
            marginBottom: "30px",
            lineHeight: "1.5",
        },
        buttonGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
        },
        primaryBtn: {
            backgroundColor: "#F1C40F",
            color: "#2C3E50",
            padding: "15px 20px",
            borderRadius: "10px",
            border: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            textDecoration: "none",
            transition: "transform 0.2s",
        },
        secondaryBtn: {
            backgroundColor: "transparent",
            color: "#5D4037",
            padding: "15px 20px",
            borderRadius: "10px",
            border: "2px solid #5D4037",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            textDecoration: "none",
            transition: "background 0.2s",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <FaCheckCircle style={styles.icon} />
                <h1 style={styles.title}>Thank You!</h1>
                <p style={styles.message}>
                    Your order has been confirmed. <br />
                    We are preparing your books for shipment.
                </p>

                <div style={styles.buttonGroup}>
                    <Link to="/" style={styles.primaryBtn}>
                        <FaShoppingBag /> Continue Shopping
                    </Link>
                    <Link to="/orders" style={styles.secondaryBtn}>
                        View My Orders <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
