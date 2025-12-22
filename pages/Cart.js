import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const styles = {
    container: { padding: "20px", fontFamily: "Georgia, serif", color: "#5D4037" },
    title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    cartItem: { backgroundColor: "#FFF8E7", padding: "10px", marginBottom: "10px", borderRadius: "8px" },
    button: { backgroundColor: "#FFD700", padding: "10px 15px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginRight: "10px" },
    checkoutButton: { backgroundColor: "#5D4037", color: "#FFD700", padding: "10px 15px", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} style={styles.cartItem}>
              <strong>{item.title}</strong> - ${item.price}
              <button style={styles.button} onClick={() => removeFromCart(item.title)}>
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ${total}</h3>

          <button style={styles.checkoutButton} onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>

          <button style={styles.button} onClick={clearCart}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
