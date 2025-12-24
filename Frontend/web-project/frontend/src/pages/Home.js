import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books?limit=4`);
        const data = await res.json();
        setFeaturedBooks(data.books || []);
      } catch (err) {
        console.error("Failed to fetch featured books", err);
      }
    };
    fetchBooks();
  }, []);

  const styles = {
    container: {
      backgroundColor: "#F5F5DC",
      // minHeight handled by App layout
      fontFamily: "Georgia, serif",
      color: "#5D4037",
      padding: "0 0 40px 0" // Add bottom padding for breathing room
    },
    hero: {
      textAlign: "center",
      padding: "50px 20px",
      backgroundColor: "#FFF8E7",
      marginBottom: "30px",
      borderBottom: "2px solid #D3D3D3"
    },
    heroTitle: {
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "20px"
    },
    heroSubtitle: {
      fontSize: "1.2rem",
      marginBottom: "20px"
    },
    browseBtn: {
      backgroundColor: "#FFD700",
      color: "#5D4037",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      textDecoration: "none"
    },
    featured: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      padding: "0 20px"
    },
    card: {
      backgroundColor: "#FFF8E7",
      width: "200px",
      borderRadius: "10px",
      padding: "15px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      textAlign: "center"
    },
    bookTitle: {
      fontWeight: "bold",
      fontSize: "1.1rem",
      margin: "10px 0",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    bookAuthor: {
      fontSize: "0.9rem",
      color: "#5D4037",
      marginBottom: "10px"
    },
    addBtn: {
      backgroundColor: "#FFD700",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    footer: {
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#5D4037",
      color: "#FFF8E7",
      marginTop: "40px"
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to PageTurner</h1>
        <p style={styles.heroSubtitle}>
          Discover your next favorite book online. Browse, select, and enjoy!
        </p>
        <Link to="/catalog" style={styles.browseBtn}>
          Browse Catalog
        </Link>
      </div>

      {/* Featured Books */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>Featured Books</h2>
      </div>
      <div style={styles.featured}>
        {featuredBooks.length === 0 ? <p>Loading...</p> : featuredBooks.map((book, idx) => (
          <div key={idx} style={styles.card}>
            <img
              src={book.imageURL || "https://via.placeholder.com/150"}
              alt={book.title}
              style={{ width: "100%", height: "250px", objectFit: "cover", marginBottom: "10px", borderRadius: "5px" }}
            />
            <div style={styles.bookTitle} title={book.title}>{book.title}</div>
            <div style={styles.bookAuthor}>{book.author}</div>
            <Link to={`/product/${book._id}`}>
              <button style={styles.addBtn}>View Details</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
