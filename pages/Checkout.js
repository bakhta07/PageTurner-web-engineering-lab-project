import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext"; // for user info
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    // Create order object
    const newOrder = {
      id: Date.now(),
      customerName: user.name || "Guest",
      items: [...cart],
      total,
      status: "Pending",
      paymentMethod,
    };

    // Add order
    addOrder(newOrder);

    // Clear cart
    clearCart();

    alert("Order placed successfully!");
    navigate("/home");
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Georgia, serif", color: "#5D4037" },
    title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    cartItem: { backgroundColor: "#FFF8E7", padding: "10px", marginBottom: "10px", borderRadius: "8px" },
    button: { backgroundColor: "#FFD700", padding: "10px 15px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" },
    payment: { margin: "20px 0" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <h3>Order Summary:</h3>
          {cart.map((item, idx) => (
            <div key={idx} style={styles.cartItem}>
              <strong>{item.title}</strong> - ${item.price}
            </div>
          ))}

          <h3>Total: ${total}</h3>

          <div style={styles.payment}>
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery (COD)
            </label>
          </div>

          <button style={styles.button} onClick={handleCheckout}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
