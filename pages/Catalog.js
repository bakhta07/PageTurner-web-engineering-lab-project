import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Catalog = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const books = [
    // Freida McFadden
    {
      title: "The Housemaid",
      author: "Freida McFadden",
      genre: "Drama",
      price: 15,
      image:
        "https://online.fliphtml5.com/tyfxm/ncmu/files/large/1f108c2d27b378a4180f1eacb18e699c.webp?1735473688",
    },
    {
      title: "The Locked Door",
      author: "Freida McFadden",
      genre: "Thriller",
      price: 18,
      image:
        "https://static.wixstatic.com/media/f67928_57c942e2d5cb420faba870e39921b1ec~mv2.jpg/v1/fill/w_438,h_700,al_c,lg_1,q_80,enc_avif,quality_auto/f67928_57c942e2d5cb420faba870e39921b1ec~mv2.jpg",
    },
    // Good Girls Guide to Murder
    {
      title: "A Good Girl's Guide to Murder",
      author: "Holly Jackson",
      genre: "Mystery/Thriller",
      price: 20,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbHmJbWmwW3y264y5uGxapjSxJ81smwBfiKw&s",
    },
    {
      title: "Good Girl, Bad Blood",
      author: "Holly Jackson",
      genre: "Mystery/Thriller",
      price: 22,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmwzJhK2b0BcKI5RcHufR68C9r8H31j9ng0A&s",
    },
  ];

 

  // ✅ Recommendation logic: show books of the same genre as each book
  const recommendedBooks = books.filter((book, index, self) =>
    self.some((b, i) => i !== index && b.genre === book.genre)
  );



  const handleAddToCart = (book) => {
    addToCart(book);      // Add book to cart context
    navigate("/cart");    // Redirect to cart page
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Book Catalog</h2>

      {/* All books */}
      <div style={styles.grid}>
        {books.map((book, idx) => (
          <div
            key={idx}
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <img src={book.image} alt={book.title} style={styles.image} />
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
        ))}
      </div>

      {/* Recommended Section */}
      <h3 style={styles.recommendedTitle}>Recommended Books</h3>
      <div style={styles.grid}>
        {recommendedBooks.length === 0 ? (
          <p style={{ textAlign: "center" }}>No recommendations available.</p>
        ) : (
          recommendedBooks.map((book, idx) => (
            <div key={idx} style={styles.card}>
              <img src={book.image} alt={book.title} style={styles.image} />
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
