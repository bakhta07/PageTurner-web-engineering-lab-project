import React, { useState } from "react";
import { useBooks } from "../context/BookContext";
import { useOrders } from "../context/OrderContext";

const AdminDashboard = () => {
  const { books, addBook } = useBooks();
  const { orders, updateOrderStatus } = useOrders();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre || !form.price || !form.image) {
      alert("Please fill all fields");
      return;
    }
    addBook({ ...form, price: Number(form.price) });
    setForm({ title: "", author: "", genre: "", price: "", image: "" });
  };

  const styles = {
    container: { backgroundColor: "#F5F5DC", minHeight: "100vh", padding: "20px", fontFamily: "Georgia, serif", color: "#5D4037" },
    title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
    form: { display: "flex", flexDirection: "column", maxWidth: "400px", margin: "0 auto 40px", gap: "10px", backgroundColor: "#FFF8E7", padding: "20px", borderRadius: "10px", boxShadow: "0 6px 10px rgba(0,0,0,0.1)" },
    input: { padding: "8px 12px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem" },
    button: { backgroundColor: "#FFD700", color: "#5D4037", border: "none", padding: "10px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" },
    sectionTitle: { fontSize: "1.5rem", fontWeight: "bold", marginTop: "30px", marginBottom: "15px", textAlign: "center" },
    bookList: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" },
    card: { backgroundColor: "#FFF8E7", width: "180px", borderRadius: "12px", padding: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center" },
    image: { width: "100%", height: "220px", objectFit: "cover", borderRadius: "8px" },
    bookTitle: { fontWeight: "bold", fontSize: "1rem", margin: "5px 0" },
    bookAuthor: { fontSize: "0.85rem", marginBottom: "5px" },
    bookGenre: { fontSize: "0.8rem", fontStyle: "italic", color: "#5D4037", marginBottom: "5px" },
    orderCard: { backgroundColor: "#FFF8E7", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: "15px" },
    orderButton: { backgroundColor: "#FFD700", border: "none", padding: "6px 10px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", marginTop: "5px" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>

      {/* Add Book Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" name="title" value={form.title} onChange={handleChange} style={styles.input} />
        <input type="text" placeholder="Author" name="author" value={form.author} onChange={handleChange} style={styles.input} />
        <input type="text" placeholder="Genre" name="genre" value={form.genre} onChange={handleChange} style={styles.input} />
        <input type="number" placeholder="Price" name="price" value={form.price} onChange={handleChange} style={styles.input} />
        <input type="text" placeholder="Image URL" name="image" value={form.image} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Add Book</button>
      </form>

      {/* Current Books */}
      <h3 style={styles.sectionTitle}>Current Books</h3>
      <div style={styles.bookList}>
        {books.length === 0 ? <p>No books available.</p> :
          books.map((book, idx) => (
            <div key={idx} style={styles.card}>
              <img src={book.image} alt={book.title} style={styles.image} />
              <div style={styles.bookTitle}>{book.title}</div>
              <div style={styles.bookAuthor}>{book.author}</div>
              <div style={styles.bookGenre}>{book.genre}</div>
              <div>${book.price}</div>
            </div>
          ))
        }
      </div>

      {/* Orders Section */}
      <h3 style={styles.sectionTitle}>Orders</h3>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No orders yet.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} style={styles.orderCard}>
            <div><strong>Order #{order.id}</strong></div>
            <div>Customer: {order.customerName}</div>
            <div>Total: ${order.total}</div>
            <div>Status: {order.status}</div>
            <button
              style={styles.orderButton}
              onClick={() =>
                updateOrderStatus(order.id, order.status === "Pending" ? "Completed" : "Pending")
              }
            >
              Toggle Status
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
