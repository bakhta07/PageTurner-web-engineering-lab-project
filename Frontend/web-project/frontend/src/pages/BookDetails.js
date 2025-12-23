import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookContext } from "../context/BookContext"; // We might need to export useBookContext or just fetch directly
import { useCart } from "../context/CartContext"; // For Add to Cart
import toast from "react-hot-toast";
import { FaStar, FaShoppingCart, FaArrowLeft } from "react-icons/fa";

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/books/${id}`);
                const data = await res.json();
                setBook(data);
            } catch (e) { console.error(e); }
        };
        fetchBook();
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to write a review");
            return;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/books/${id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Review Submitted!");
                // Reload book to see review
                window.location.reload();
            } else {
                toast.error(data.message || "Error submitting review");
            }
        } catch (e) { console.error(e); }
    };

    if (!book) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

    return (
        <div style={{ padding: "40px", backgroundColor: "#F5F5DC", minHeight: "100vh", fontFamily: "Georgia, serif", color: "#5D4037" }}>
            <Link to="/catalog" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#5D4037", marginBottom: "20px", fontWeight: "bold" }}>
                <FaArrowLeft style={{ marginRight: "5px" }} /> Back to Catalog
            </Link>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", backgroundColor: "#FFF8E7", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                {/* Image */}
                <div style={{ flex: "0 0 300px" }}>
                    <img
                        src={book.imageURL || "https://via.placeholder.com/300x450"}
                        alt={book.title}
                        style={{ width: "100%", borderRadius: "5px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }}
                    />
                </div>

                {/* Info */}
                <div style={{ flex: "1" }}>
                    <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>{book.title}</h1>
                    <h3 style={{ fontSize: "1.2rem", color: "#777", marginBottom: "20px" }}>By {book.author}</h3>

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < (book.rating || 0) ? "#FFD700" : "#e4e5e9"} size={20} />
                        ))}
                        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>{book.rating?.toFixed(1) || 0} ({book.numReviews || 0} reviews)</span>
                    </div>

                    <h2 style={{ fontSize: "2rem", color: "#2E7D32", marginBottom: "20px" }}>
                        ${book.price}
                        {book.stock > 0 ? (
                            <span style={{ fontSize: "1rem", marginLeft: "15px", color: "#2E7D32", backgroundColor: "#E8F5E9", padding: "5px 10px", borderRadius: "15px" }}>In Stock</span>
                        ) : (
                            <span style={{ fontSize: "1rem", marginLeft: "15px", color: "#C62828", backgroundColor: "#FFEBEE", padding: "5px 10px", borderRadius: "15px" }}>Out of Stock</span>
                        )}
                    </h2>

                    <p style={{ lineHeight: "1.6", fontSize: "1.1rem", marginBottom: "30px" }}>
                        {book.description}
                    </p>

                    <button
                        disabled={!book.stock || book.stock <= 0}
                        onClick={() => {
                            if (book.stock > 0) {
                                addToCart(book);
                                toast.custom((t) => (
                                    <div style={{
                                        backgroundColor: "#FFF8E7", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        border: "1px solid #FFD700", fontFamily: "Georgia, serif", color: "#5D4037", display: "flex", flexDirection: "column", gap: "10px", minWidth: "250px"
                                    }}>
                                        <div style={{ fontWeight: "bold", fontSize: "1.05rem" }}>✅ Added to Cart</div>
                                        <div style={{ fontSize: "0.9rem" }}>{book.title}</div>
                                        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                                            <button onClick={() => { toast.dismiss(t.id); window.location.href = "/cart"; }} style={{ flex: 1, backgroundColor: "#5D4037", color: "#FFD700", border: "none", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Checkout</button>
                                            <button onClick={() => toast.dismiss(t.id)} style={{ flex: 1, backgroundColor: "transparent", color: "#5D4037", border: "1px solid #5D4037", padding: "8px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>Continue</button>
                                        </div>
                                    </div>
                                ), { duration: 5000 });
                            }
                        }}
                        style={{
                            backgroundColor: book.stock > 0 ? "#FFD700" : "#E0E0E0",
                            color: book.stock > 0 ? "#5D4037" : "#9E9E9E",
                            border: "none", padding: "15px 30px",
                            fontSize: "1.2rem", fontWeight: "bold", borderRadius: "5px",
                            cursor: book.stock > 0 ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", gap: "10px"
                        }}
                    >
                        {book.stock > 0 ? <><FaShoppingCart /> Add to Cart</> : "Sold Out"}
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: "50px" }}>
                <h2 style={{ borderBottom: "2px solid #D3D3D3", paddingBottom: "10px", marginBottom: "20px" }}>Reviews</h2>

                {(!book.reviews || book.reviews.length === 0) && <p>No reviews yet. Be the first!</p>}

                {book.reviews && book.reviews.map((rev, idx) => (
                    <div key={idx} style={{ backgroundColor: "#FFF", padding: "15px", marginBottom: "15px", borderRadius: "8px", borderLeft: "5px solid #FFD700" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <strong>{rev.name}</strong>
                            <div style={{ display: "flex" }}>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < rev.rating ? "#FFD700" : "#e4e5e9"} size={15} />
                                ))}
                            </div>
                        </div>
                        <p>{rev.comment}</p>
                        <small style={{ color: "#999" }}>{rev.createdAt?.substring(0, 10)}</small>
                    </div>
                ))}

                {/* Add Review Form */}
                {user ? (
                    <form onSubmit={submitReview} style={{ marginTop: "30px", backgroundColor: "#FFF8E7", padding: "20px", borderRadius: "10px" }}>
                        <h3>Write a Customer Review</h3>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Rating</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100px" }}
                            >
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows="3"
                                style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontFamily: "inherit" }}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" style={{ backgroundColor: "#5D4037", color: "#FFD700", border: "none", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}>
                            Submit Review
                        </button>
                    </form>
                ) : (
                    <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#e0e0e0", borderRadius: "8px" }}>
                        Please <Link to="/login" style={{ fontWeight: "bold", color: "#5D4037" }}>Login</Link> to write a review.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetails;
