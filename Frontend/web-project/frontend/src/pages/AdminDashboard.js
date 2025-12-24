import React, { useState, useEffect } from "react";

import { FaBook, FaBox, FaEnvelope, FaPlus, FaTimes, FaSignOutAlt, FaBars, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_BASE_URL, { API_URL } from "../config";

const AdminDashboard = () => {
  // Use Separate Admin Session
  const [user] = useState(() => {
    return JSON.parse(localStorage.getItem("adminUser")) || null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/admin-panel");
  }, [user, navigate]);

  const logout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-panel");
  };
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);

  // UI States
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState(null);

  // Add Book Form State
  const [bookForm, setBookForm] = useState({
    title: "", author: "", description: "", category: [], price: "",
    stock: "", rating: "", numReviews: "", imageURL: ""
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchOrders();
    fetchRequests();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // -- API Calls --
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) { console.error(err); }
  };
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12;

  // -- API Calls --
  const fetchBooks = async (searchTerm = "") => {
    try {
      let query = `?page=${page}&limit=${LIMIT}`;
      if (searchTerm) query += `&keyword=${searchTerm}`;

      const res = await fetch(`${API_URL}/books${query}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotalPages(data.pages || 1);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]); // Re-fetch on page change

  // Reset page when switching tabs or needs refresh
  const handleTabChange = (id) => {
    setActiveTab(id);
    if (id === "books") {
      setPage(1);
      fetchBooks();
    }
  };


  // ... inside render ...

  {/* BOOKS TAB */ }
  {
    activeTab === "books" && (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Library Overview</h2>
          <div style={{ position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#BDC3C7" }} />
            <input
              type="text"
              placeholder="Search library..."
              style={{ padding: "10px 10px 10px 36px", borderRadius: "12px", border: "1px solid #BDC3C7", outline: "none", minWidth: "300px" }}
              onChange={(e) => {
                const term = e.target.value;
                setPage(1); // Reset page on search
                fetchBooks(term);
              }}
            />
          </div>
        </div>
        <div style={styles.grid}>
          {books.map(book => (
            <div key={book._id} style={styles.card}>
              <div style={{ position: "relative" }}>
                <img src={book.imageURL} alt={book.title} style={styles.cardImg} />
                <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "white", padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                  ⭐ {book.rating}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditClick(book); }}
                  style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: colors.primary, color: colors.sidebar, border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  title="Edit Book"
                >
                  <FaEdit size={14} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteBook(book._id); }}
                  style={{ position: "absolute", top: "50px", left: "10px", backgroundColor: "#EF4444", color: "white", border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
                  title="Delete Book"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: "700", color: colors.text }}>{book.title}</h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: colors.textLight }}>{book.author}</p>
              <div style={{ marginTop: "auto", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: colors.primary }}>${book.price}</span>
                <span style={{ fontSize: "0.875rem", color: book.stock > 0 ? "#166534" : "#EF4444", backgroundColor: book.stock > 0 ? "#DCFCE7" : "#FEE2E2", padding: "4px 10px", borderRadius: "99px", fontWeight: "600" }}>
                  {book.stock} left
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION CONTROLS FOR ADMIN */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "40px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "8px 16px", backgroundColor: page === 1 ? "#ccc" : colors.sidebar, color: "white", border: "none", borderRadius: "8px", cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: "bold"
              }}
            >
              Previous
            </button>
            <span style={{ fontWeight: "bold", fontSize: "1rem" }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "8px 16px", backgroundColor: page === totalPages ? "#ccc" : colors.sidebar, color: "white", border: "none", borderRadius: "8px", cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: "bold"
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    )
  }
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) { console.error(err); }
  };
  const fetchRequests = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) setRequests(await res.json());
    } catch (err) { console.error(err); }
  };

  // -- Handlers --
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === "create_new") { setShowCreateCat(true); return; }
    if (val && !bookForm.category.includes(val)) {
      setBookForm({ ...bookForm, category: [...bookForm.category, val] });
    }
  };
  const removeCategory = (id) => {
    setBookForm({ ...bookForm, category: bookForm.category.filter(c => c !== id) });
  };
  const createCategory = async () => {
    if (!newCatName) return;
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name: newCatName, description: "Custom Category" })
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setBookForm({ ...bookForm, category: [...bookForm.category, newCat._id] });
        setNewCatName("");
        setShowCreateCat(false);
        toast.success("Category Created");
      }
    } catch (err) { toast.error("Failed"); }
  };

  const handleEditClick = (book) => {
    setEditingId(book._id);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      category: (Array.isArray(book.category) ? book.category : (book.category ? [book.category] : [])).map(c => typeof c === 'object' ? c._id : c),
      price: book.price,
      stock: book.stock,
      rating: book.rating,
      numReviews: book.numReviews,
      imageURL: book.imageURL
    });
    setActiveTab("edit-book");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!user) return;

    const url = editingId
      ? `${API_URL}/books/${editingId}`
      : `${API_URL}/books`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(bookForm)
      });
      if (res.ok) {
        toast.success(editingId ? "Book Updated Successfully" : "Book Added Successfully");
        setBookForm({ title: "", author: "", description: "", category: [], price: "", stock: "", rating: "", numReviews: "", imageURL: "" });
        setEditingId(null);
        fetchBooks();
        setActiveTab("books");
      } else { toast.error("Operation Failed"); }
    } catch (err) { console.error(err); }
  };

  const handleDeleteBook = (id) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>Are you sure you want to delete this book?</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`${API_URL}/books/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${user.token}` }
                });
                if (res.ok) {
                  toast.success((u) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>Book moved to trash</span>
                      <button
                        onClick={async () => {
                          toast.dismiss(u.id);
                          try {
                            await fetch(`${API_URL}/books/${id}/restore`, {
                              method: "PUT",
                              headers: { Authorization: `Bearer ${user.token}` }
                            });
                            toast.success("Restored!");
                            fetchBooks();
                          } catch (err) { toast.error("Restore failed"); }
                        }}
                        style={{ backgroundColor: "#3B82F6", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}
                      >
                        UNDO
                      </button>
                    </div>
                  ), { duration: 5000 });
                  fetchBooks();
                } else {
                  toast.error("Failed to delete");
                }
              } catch (err) { console.error(err); }
            }}
            style={{ backgroundColor: "#EF4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.80rem", fontWeight: "bold" }}
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ backgroundColor: "#E5E7EB", color: "#374151", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.80rem", fontWeight: "bold" }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, icon: "⚠️" });
  };

  const toggleOrderStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
    try {
      await fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
      toast.success("Order Updated");
    } catch (err) { toast.error("Update failed"); }
  };

  // -- STYLES --
  const colors = {
    bg: "#ECF0F1", // Light Grey (Clouds)
    sidebar: "#2C3E50", // Midnight Blue
    sidebarHover: "#34495E", // Wet Asphalt
    primary: "#F1C40F", // Gold / Sunflower
    accent: "#E67E22", // Carrot Orange
    text: "#2C3E50", // Midnight Blue
    textLight: "#7F8C8D", // Concrete
    white: "#FFFFFF",
    border: "#BDC3C7", // Silver
  };

  const fonts = {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  const styles = {
    container: { display: "flex", width: "100vw", height: "100vh", fontFamily: fonts.body, backgroundColor: colors.bg, color: colors.text, overflow: "hidden" },

    // Sidebar: Full Height, Left Side
    sidebar: {
      width: "260px",
      backgroundColor: colors.sidebar,
      color: colors.white,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100%",
      transition: "margin-left 0.3s ease",
      // Mobile handling: absolute overlay
      position: window.innerWidth < 768 ? "absolute" : "relative",
      zIndex: 1000,
      marginLeft: isSidebarOpen ? "0" : "-260px", // Hide by negative margin on desktop/mobile
      boxShadow: "4px 0 24px rgba(0,0,0,0.1)"
    },

    // Main Wrapper: Right Side (Header + Content)
    mainWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      position: "relative"
    },

    header: {
      padding: "16px 24px",
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "64px",
      flexShrink: 0
    },

    content: {
      flex: 1,
      padding: "32px",
      overflowY: "auto",
      backgroundColor: colors.bg
    },

    // ... (rest same)
    sectionTitle: { fontSize: "1.875rem", fontWeight: "700", marginBottom: "24px", color: colors.text },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" },
    card: { backgroundColor: colors.white, borderRadius: "16px", padding: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", transition: "transform 0.2s", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column" },
    cardImg: { width: "100%", height: "240px", objectFit: "cover", borderRadius: "12px", marginBottom: "16px" },
    formContainer: { maxWidth: "700px", margin: "0 auto", backgroundColor: colors.white, padding: "40px", borderRadius: "24px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" },
    label: { fontWeight: "600", fontSize: "0.875rem", color: colors.textLight },
    input: { padding: "12px 16px", borderRadius: "12px", border: `1px solid ${colors.border}`, fontSize: "1rem", outline: "none", transition: "border-color 0.2s" },
    button: { padding: "14px 24px", backgroundColor: colors.primary, color: colors.sidebar, border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", transition: "0.2s", fontSize: "1rem", width: "100%" },
    tableContainer: { backgroundColor: colors.white, borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", border: `1px solid ${colors.border}` },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { backgroundColor: colors.bg, padding: "16px 24px", textAlign: "left", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: colors.textLight },
    td: { padding: "16px 24px", borderBottom: `1px solid ${colors.border}` },
    badge: (status) => ({
      padding: "6px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700",
      backgroundColor: status === "Completed" || status === "Approved" ? "#DCFCE7" : "#FEF3C7", // Green : Amber
      color: status === "Completed" || status === "Approved" ? "#166534" : "#92400E"
    })
  };

  const SidebarItem = ({ id, icon, label, count, onClick }) => (
    <div
      onClick={() => {
        if (onClick) onClick();
        setActiveTab(id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }}
      style={{
        padding: "12px 16px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
        backgroundColor: activeTab === id ? colors.primary : "transparent",
        color: activeTab === id ? colors.sidebar : "#BDC3C7",
        fontWeight: activeTab === id ? "600" : "500",
        transition: "all 0.2s"
      }}
    >
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "99px" }}>{count}</span>}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Full Height Sidebar */}
      <aside style={styles.sidebar}>
        {/* Brand in Sidebar */}
        <div style={{ padding: "24px", fontSize: "1.5rem", fontWeight: "700", color: colors.white, display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "16px" }}>
          <FaBook /> PageTurner
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 16px" }}>
          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", padding: "12px 16px 8px" }}>Menu</div>
          <SidebarItem id="books" icon={<FaBook />} label="Library" />
          <SidebarItem
            id="add-book"
            icon={<FaPlus />}
            label="Add Book"
            onClick={() => {
              setEditingId(null);
              setBookForm({ title: "", author: "", description: "", category: [], price: "", stock: "", rating: "", numReviews: "", imageURL: "" });
            }}
          />

          <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", padding: "12px 16px 8px" }}>Management</div>
          <SidebarItem id="orders" icon={<FaBox />} label="Orders" count={orders.length} />
          <SidebarItem id="requests" icon={<FaEnvelope />} label="Requests" count={requests.length} />
        </div>

        <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div onClick={() => { logout(); navigate("/login"); }} style={{ padding: "12px 16px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", color: "#EF4444", fontWeight: "600", backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            <FaSignOutAlt /> Logout
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div style={styles.mainWrapper}>
        {/* Header */}
        <header style={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <FaBars size={20} style={{ cursor: "pointer", color: colors.text }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            <h2 style={{ margin: 0, fontSize: "1.25rem", color: colors.text }}>Dashboard</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: colors.sidebar, color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.875rem", fontWeight: "bold" }}>
              A
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: "600", color: colors.text }}>Admin User</span>
          </div>
        </header>

        {/* Content Content */}
        <main style={styles.content}>
          {/* BOOKS TAB */}
          {activeTab === "books" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>Library Overview</h2>
                <div style={{ position: "relative" }}>
                  <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#BDC3C7" }} />
                  <input
                    type="text"
                    placeholder="Search library..."
                    style={{ padding: "10px 10px 10px 36px", borderRadius: "12px", border: "1px solid #BDC3C7", outline: "none", minWidth: "300px" }}
                    onChange={async (e) => {
                      const term = e.target.value;
                      const query = term ? `?keyword=${term}` : "?limit=100";
                      const res = await fetch(`${API_URL}/books${query}`);
                      const data = await res.json();
                      setBooks(data.books || []);
                    }}
                  />
                </div>
              </div>
              <div style={styles.grid}>
                {books.map(book => (
                  <div key={book._id} style={styles.card}>
                    <div style={{ position: "relative" }}>
                      <img src={book.imageURL} alt={book.title} style={styles.cardImg} />
                      <div style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "white", padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        ⭐ {book.rating}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditClick(book); }}
                        style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: colors.primary, color: colors.sidebar, border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Edit Book"
                      >
                        <FaEdit size={14} />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteBook(book._id); }}
                        style={{ position: "absolute", top: "50px", left: "10px", backgroundColor: "#EF4444", color: "white", border: "none", padding: "8px", borderRadius: "50%", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
                        title="Delete Book"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", fontWeight: "700", color: colors.text }}>{book.title}</h4>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: colors.textLight }}>{book.author}</p>
                    <div style={{ marginTop: "auto", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1.25rem", fontWeight: "700", color: colors.primary }}>${book.price}</span>
                      <span style={{ fontSize: "0.875rem", color: book.stock > 0 ? "#166534" : "#EF4444", backgroundColor: book.stock > 0 ? "#DCFCE7" : "#FEE2E2", padding: "4px 10px", borderRadius: "99px", fontWeight: "600" }}>
                        {book.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD / EDIT BOOK TAB */}
          {(activeTab === "add-book" || activeTab === "edit-book") && (
            <div style={styles.formContainer}>
              <h2 style={{ ...styles.sectionTitle, textAlign: "center", marginBottom: "40px" }}>{editingId ? "Edit Book" : "Add New Book"}</h2>
              <form onSubmit={handleAddBook}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Book Title</label>
                    <input style={styles.input} placeholder="e.g. The Great Gatsby" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Author</label>
                    <input style={styles.input} placeholder="e.g. F. Scott Fitzgerald" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea style={{ ...styles.input, height: "120px", resize: "none" }} placeholder="Synopsis..." value={bookForm.description} onChange={e => setBookForm({ ...bookForm, description: e.target.value })} required />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Categories</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px", minHeight: "30px" }}>
                    {bookForm.category.map(catId => {
                      const catName = categories.find(c => c._id === catId)?.name || "Unknown";
                      return (
                        <span key={catId} style={{ backgroundColor: "#EFF6FF", color: colors.primary, padding: "4px 12px", borderRadius: "99px", fontSize: "0.875rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", border: "1px solid #DBEAFE" }}>
                          {catName}
                          <FaTimes style={{ cursor: "pointer" }} onClick={() => removeCategory(catId)} />
                        </span>
                      );
                    })}
                  </div>
                  {showCreateCat ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input style={{ ...styles.input, flex: 1 }} placeholder="New Category Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus />
                      <button type="button" onClick={createCategory} style={{ ...styles.button, width: "auto" }}>Create</button>
                      <button type="button" onClick={() => setShowCreateCat(false)} style={{ ...styles.button, width: "auto", backgroundColor: "#EF4444" }}>Cancel</button>
                    </div>
                  ) : (
                    <select style={styles.input} onChange={handleCategoryChange} value="">
                      <option value="">+ Add...</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                      <option value="create_new" style={{ fontWeight: "bold" }}>+ Create New</option>
                    </select>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div style={styles.inputGroup}><label style={styles.label}>Price ($)</label><input style={styles.input} type="number" value={bookForm.price} onChange={e => setBookForm({ ...bookForm, price: e.target.value })} required /></div>
                  <div style={styles.inputGroup}><label style={styles.label}>Stock</label><input style={styles.input} type="number" value={bookForm.stock} onChange={e => setBookForm({ ...bookForm, stock: e.target.value })} required /></div>
                  <div style={styles.inputGroup}><label style={styles.label}>Rating (0-5)</label>
                    <input
                      style={styles.input}
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={bookForm.rating}
                      onChange={e => {
                        let val = parseFloat(e.target.value);
                        if (val > 5) val = 5;
                        if (val < 0) val = 0;
                        setBookForm({ ...bookForm, rating: val });
                      }}
                    /></div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Cover Image</label>
                  <div
                    style={{
                      border: "2px dashed #BDC3C7",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: bookForm.imageURL ? "#F0FFF4" : "#F9FAFB",
                      transition: "0.2s"
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#F1C40F"; }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = "#BDC3C7"; }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "#BDC3C7";
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append("image", file);
                        try {
                          const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
                          const data = await res.json();
                          if (res.ok) {
                            setBookForm({ ...bookForm, imageURL: API_BASE_URL + data.filePath });
                            toast.success("Image Uploaded!");
                          } else {
                            toast.error(data.message || "Upload Failed");
                          }
                        } catch (err) { toast.error("Upload Error"); }
                      }
                    }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("image", file);
                          try {
                            const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
                            const data = await res.json();
                            if (res.ok) {
                              setBookForm({ ...bookForm, imageURL: API_BASE_URL + data.filePath });
                              toast.success("Image Uploaded!");
                            } else { toast.error("Upload Failed"); }
                          } catch (err) { toast.error("Upload Error"); }
                        }
                      }}
                    />
                    {bookForm.imageURL ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexDirection: "column" }}>
                        <img src={bookForm.imageURL} alt="Preview" style={{ height: "100px", borderRadius: "8px", objectFit: "cover" }} />
                        <span style={{ color: "#27AE60", fontWeight: "bold" }}>Image Uploaded! Click to replace.</span>
                      </div>
                    ) : (
                      <span style={{ color: "#7F8C8D" }}>Drag & Drop image here or <span style={{ color: "#F1C40F", fontWeight: "bold" }}>Browse</span></span>
                    )}
                  </div>
                </div>

                <button type="submit" style={styles.button}>Add Book</button>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div>
              <h2 style={styles.sectionTitle}>Order Management</h2>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={styles.td}><span style={{ fontFamily: "monospace", color: colors.textLight }}>#{order._id.slice(-6)}</span></td>
                        <td style={{ ...styles.td, fontWeight: "600" }}>{order.user ? order.user.email : "Guest"}</td>
                        <td style={styles.td}>${order.totalAmount}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(order.status)}>{order.status}</span>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => toggleOrderStatus(order._id, order.status)} style={{ cursor: "pointer", border: "none", background: "none", color: colors.primary, fontWeight: "600", fontSize: "0.875rem" }}>
                            {order.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div>
              <h2 style={styles.sectionTitle}>Book Requests</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {requests.length === 0 ? <p style={{ color: colors.textLight, fontStyle: "italic" }}>No pending requests.</p> : requests.map(req => (
                  <div key={req._id} style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem" }}>{req.title}</h4>
                      <p style={{ margin: 0, color: colors.textLight }}> by {req.author}</p>
                      <div style={{ marginTop: "8px", fontSize: "0.80rem", color: colors.textLight, display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: colors.border, display: "flex", justifyContent: "center", alignItems: "center" }}>👤</div>
                        {req.user?.email}
                      </div>
                    </div>
                    <span style={styles.badge(req.status)}>{req.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;
