import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Catalog = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books?limit=100");
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchBooks();
  }, []);

  const { user } = useAuth();
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    // 1. Fetch Dynamic Recommendations if Logged In
    if (user) {
      fetch("http://localhost:5000/api/books/recommendations", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setRecommendedBooks(data))
        .catch(err => console.error("Rec Error", err));
    } else if (books.length > 0) {
      // 2. Fallback: Reverse Slice
      setRecommendedBooks(books.slice(0, 4).reverse());
    }
  }, [user, books]);

  const handleAddToCart = (book) => {
    addToCart(book);

    // Custom Toast with Options
    toast.custom((t) => (
      <div style={{
        backgroundColor: "#FFF8E7",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #FFD700",
        fontFamily: "Georgia, serif",
        color: "#5D4037",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "250px"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
          ✅ Added to Cart
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          {book.title}
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button
            onClick={() => { toast.dismiss(t.id); navigate("/cart"); }}
            style={{
              flex: 1, backgroundColor: "#5D4037", color: "#FFD700",
              border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
            }}
          >
            Checkout
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              flex: 1, backgroundColor: "transparent", color: "#5D4037",
              border: "1px solid #5D4037", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold"
            }}
          >
            Continue
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const styles = {
    container: {
      backgroundColor: "#F5F5DC",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
      color: "#5D4037",
      padding: "20px",
    },
    title: {
      textAlign: "center",
      fontSize: "2.2rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    grid: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
    },
    card: {
      backgroundColor: "#FFF8E7",
      width: "200px",
      borderRadius: "12px",
      padding: "15px",
      boxShadow: "0 6px 10px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "0.3s",
      cursor: "pointer",
    },
    image: {
      width: "100%",
      height: "250px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    bookTitle: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      margin: "10px 0 5px",
    },
    bookAuthor: {
      fontSize: "0.9rem",
      marginBottom: "5px",
    },
    bookGenre: {
      fontSize: "0.8rem",
      fontStyle: "italic",
      color: "#5D4037",
      marginBottom: "10px",
    },
    addBtn: {
      backgroundColor: "#FFD700",
      color: "#5D4037",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    recommendedTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginTop: "40px",
      marginBottom: "15px",
      textAlign: "center",
    },
  };

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const query = searchTerm ? `?keyword=${searchTerm}` : "?limit=100";
        const res = await fetch(`http://localhost:5000/api/books${query}`);
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // ... simple rec ...

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ ...styles.title, marginBottom: 0 }}>Book Catalog</h2>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px 15px", borderRadius: "20px", border: "1px solid #D4C4A8", backgroundColor: "#FFF8E7", fontFamily: "inherit" }}
        />
      </div>

      {/* All books */}
      <div style={styles.grid}>
        {books.map((book, idx) => (
          <div
            key={idx}
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Link to={`/product/${book._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <img src={book.imageURL || "https://via.placeholder.com/150"} alt={book.title} style={styles.image} />
              <div style={styles.bookTitle}>{book.title}</div>
            </Link>
            <div style={styles.bookAuthor}>{book.author}</div>
            <div style={styles.bookGenre}>{book.genre}</div>
            <div>${book.price}</div>
            <button
              style={styles.addBtn}
              onClick={() => handleAddToCart(book)}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Recommended Section */}
      <h3 style={styles.recommendedTitle}>Recommended Books</h3>
      <div style={styles.grid}>
        {(!recommendedBooks || !Array.isArray(recommendedBooks) || recommendedBooks.length === 0) ? (
          <p style={{ textAlign: "center" }}>No recommendations available.</p>
        ) : (
          recommendedBooks.map((book, idx) => (
            <div key={idx} style={styles.card}>
              <img src={book.imageURL || "https://via.placeholder.com/150"} alt={book.title} style={styles.image} />
              <div style={styles.bookTitle}>{book.title}</div>
              <div style={styles.bookAuthor}>{book.author}</div>
              <div style={styles.bookGenre}>{book.genre}</div>
              <div>${book.price}</div>
              <button
                style={styles.addBtn}
                onClick={() => handleAddToCart(book)}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Catalog;
