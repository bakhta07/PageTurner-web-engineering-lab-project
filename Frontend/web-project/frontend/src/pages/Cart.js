import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingBag } from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, clearCart, decreaseQuantity, addToCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const styles = {
    container: {
      backgroundColor: "#F5F5DC",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
      color: "#5D4037",
      padding: "30px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      gap: "40px",
      flexWrap: "wrap",
    },
    leftCol: {
      flex: 2,
      minWidth: "300px",
    },
    rightCol: {
      flex: 1,
      minWidth: "300px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "30px",
      borderBottom: "2px solid #D3D3D3",
      paddingBottom: "15px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      margin: 0,
    },
    cartItem: {
      backgroundColor: "#FFF8E7",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      display: "flex",
      gap: "20px",
      alignItems: "center",
      transition: "0.2s",
    },
    image: {
      width: "80px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "5px",
    },
    itemInfo: {
      flex: 1,
    },
    itemTitle: {
      fontSize: "1.2rem",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    itemAuthor: {
      fontSize: "0.95rem",
      color: "#8D6E63",
      marginBottom: "5px",
    },
    itemPrice: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#5D4037",
    },
    removeBtn: {
      backgroundColor: "transparent",
      color: "#D32F2F",
      border: "1px solid #D32F2F",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontWeight: "bold",
      transition: "0.3s",
    },
    summaryCard: {
      backgroundColor: "#FFF8E7",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      position: "sticky",
      top: "100px",
    },
    summaryTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
      borderBottom: "1px solid #D3D3D3",
      paddingBottom: "10px",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      fontSize: "1.1rem",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      fontSize: "1.4rem",
      fontWeight: "bold",
      color: "#5D4037",
    },
    checkoutBtn: {
      backgroundColor: "#5D4037",
      color: "#FFD700",
      width: "100%",
      padding: "15px",
      border: "none",
      borderRadius: "8px",
      fontSize: "1.1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "25px",
      transition: "0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    clearBtn: {
      backgroundColor: "transparent",
      color: "#795548",
      border: "none",
      textDecoration: "underline",
      marginTop: "15px",
      cursor: "pointer",
      width: "100%",
    },
    emptyState: {
      textAlign: "center",
      padding: "50px",
      fontSize: "1.2rem",
    },
    continueBtn: {
      display: "inline-block",
      backgroundColor: "#FFD700",
      color: "#5D4037",
      padding: "12px 24px",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "bold",
      marginTop: "20px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.leftCol}>
          <div style={styles.header}>
            <FaShoppingBag size={30} />
            <h2 style={styles.title}>Your Cart ({cart.length} items)</h2>
          </div>

          {cart.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Your cart feels a bit light. Time to fill it with stories!</p>
              <Link to="/catalog" style={styles.continueBtn}>
                <FaArrowLeft style={{ marginRight: "8px" }} />
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} style={styles.cartItem}>
                  <img
                    src={item.imageURL || item.book?.imageURL || "https://via.placeholder.com/80x120?text=No+Img"}
                    alt={item.title || item.book?.title}
                    style={styles.image}
                  />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemTitle}>{item.title || item.book?.title}</div>
                    <div style={styles.itemAuthor}>{item.author || item.book?.author}</div>
                    <div style={styles.itemPrice}>${(item.price || item.book?.price || 0).toFixed(2)}</div>
                  </div>

                  {/* Restaurant Style Quantity Controls */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    backgroundColor: "#fff",
                    padding: "5px 15px",
                    borderRadius: "20px",
                    border: "1px solid #ddd"
                  }}>
                    {/* Minus or Trash Button */}
                    <button
                      onClick={() => decreaseQuantity(item)}
                      style={{
                        background: "none",
                        border: "none",
                        color: (item.quantity || 1) === 1 ? "#D32F2F" : "#5D4037",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {(item.quantity || 1) === 1 ? <FaTrash size={16} /> : "-"}
                    </button>

                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", minWidth: "20px", textAlign: "center" }}>
                      {item.quantity || 1}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#2E7D32",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        fontWeight: "bold"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Column: Summary */}
        {cart.length > 0 && (
          <div style={styles.rightCol}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryTitle}>Order Summary</div>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div style={styles.totalRow}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                style={styles.checkoutBtn}
                onClick={() => navigate("/checkout")}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                Proceed to Checkout
              </button>

              <button style={styles.clearBtn} onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
