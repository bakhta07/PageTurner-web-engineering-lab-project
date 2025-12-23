import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const RequestBook = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to request a book");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ title, author })
            });

            if (res.ok) {
                toast.success("Request submitted successfully!");
                setTitle("");
                setAuthor("");
            } else {
                toast.error("Failed to submit request");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#F5F5DC", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Georgia, serif" }}>
            <div style={{ backgroundColor: "#FFF8E7", padding: "40px", borderRadius: "10px", boxShadow: "0 6px 10px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%", textAlign: "center" }}>
                <h2 style={{ color: "#5D4037", marginBottom: "10px" }}>Request a Book</h2>
                <p style={{ marginBottom: "30px", color: "#777" }}>Can't find what you're looking for? Let us know!</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Author Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
                        required
                    />
                    <button type="submit" style={{ backgroundColor: "#FFD700", color: "#5D4037", padding: "12px 20px", borderRadius: "5px", border: "none", fontWeight: "bold", cursor: "pointer", width: "100%" }}>
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestBook;
