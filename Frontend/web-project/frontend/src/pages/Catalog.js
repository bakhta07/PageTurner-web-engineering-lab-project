import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

const Catalog = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books?limit=100`);
        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) { console.error(err); }
    };
    fetchBooks();
  }, []);

  const { user } = useAuth();
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    // 1. Fetch Dynamic Recommendations if Logged In
    if (user) {
      fetch(`${API_URL}/books/recommendations`, {
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
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "30px",
      marginTop: "20px"
    },
    card: {
      backgroundColor: "#FFFFFF",
      borderRadius: "15px",
      padding: "15px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      textAlign: "center",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      border: "1px solid #EAEAEA"
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

  /* PAGINATION STATE */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        let query = `?page=${page}&limit=${LIMIT}`;
        if (searchTerm) query += `&keyword=${searchTerm}`;

        const res = await fetch(`${API_URL}/books${query}`);
        const data = await res.json();
        setBooks(data.books || []);
        setTotalPages(data.pages || 1);
      } catch (err) { console.error(err); }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ... (rest logic)

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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <Link to={`/product/${book._id}`} style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
              <img src={book.imageURL || "https://via.placeholder.com/150"} alt={book.title} style={styles.image} />
              <div style={styles.bookTitle}>{book.title}</div>
            </Link>
            <div style={styles.bookAuthor}>{book.author}</div>
            <div style={styles.bookGenre}>{book.category?.name || book.genre || "General"}</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#F1C40F", margin: "10px 0" }}>${book.price}</div>
            <button
              style={styles.addBtn}
              onClick={() => handleAddToCart(book)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#D4AC0D"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F1C40F"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "40px" }}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{
              padding: "10px 20px", backgroundColor: page === 1 ? "#ccc" : "#5D4037", color: "white", border: "none", borderRadius: "8px", cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: "bold"
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: "10px 20px", backgroundColor: page === totalPages ? "#ccc" : "#5D4037", color: "white", border: "none", borderRadius: "8px", cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: "bold"
            }}
          >
            Next
          </button>
        </div>
      )}

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
              <div style={styles.bookGenre}>{book.category?.name || book.genre || "General"}</div>
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
