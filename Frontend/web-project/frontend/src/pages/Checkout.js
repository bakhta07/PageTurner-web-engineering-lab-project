import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext"; // for user info
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { placeOrder } = useOrders(); // FIX: Use placeOrder, not addOrder
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Total must account for quantity
  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Call placeOrder from Context
    const result = await placeOrder(cart, total);

    if (result.success) {
      clearCart();
      navigate("/order-success");
    } else {
      alert("Order failed: " + (result.message || "Unknown error"));
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Georgia, serif", color: "#5D4037", maxWidth: "800px", margin: "0 auto" },
    title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    cartItem: { backgroundColor: "#FFF8E7", padding: "15px", marginBottom: "10px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    button: {
      backgroundColor: isSubmitting ? "#ccc" : "#FFD700",
      color: "#5D4037",
      padding: "15px 30px",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: isSubmitting ? "not-allowed" : "pointer",
      width: "100%",
      fontSize: "1.1rem"
    },
    payment: { margin: "20px 0", padding: "20px", backgroundColor: "#fff", borderRadius: "8px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Checkout</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your cart is empty.</p>
      ) : (
        <>
          <h3>Order Summary:</h3>
          {cart.map((item, idx) => (
            <div key={idx} style={styles.cartItem}>
              <div>
                <strong>{item.title}</strong>
                <div style={{ fontSize: "0.9rem", color: "#777" }}>x {item.quantity || 1}</div>
              </div>
              <div style={{ fontWeight: "bold" }}>${(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}

          <div style={{ textAlign: "right", fontSize: "1.5rem", fontWeight: "bold", margin: "20px 0" }}>
            Total: ${total.toFixed(2)}
          </div>

          <div style={styles.payment}>
            <h3>Payment Method</h3>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
          </div>

          <button style={styles.button} onClick={handleCheckout} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
