import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { API_URL } from "../config";

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
    }
        };
fetchOrders();
    }, [user]);

if (!user) return <div style={{ padding: "20px" }}>Please Login</div>;
if (loading) return <div style={{ padding: "20px" }}>Loading Orders...</div>;

const styles = {
    container: { backgroundColor: "#F5F5DC", minHeight: "100vh", padding: "40px", fontFamily: "Georgia, serif", color: "#5D4037" },
    header: { fontSize: "2rem", marginBottom: "30px", borderBottom: "2px solid #D3D3D3", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "10px" },
    card: { backgroundColor: "#FFF8E7", marginBottom: "20px", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
    row: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
    badge: { padding: "5px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" },
    item: { marginLeft: "20px", fontSize: "0.95rem", color: "#666" }
};

const getStatusColor = (status) => {
    if (status === "Paid") return "#4CAF50"; // Green
    if (status === "Pending") return "#FF9800"; // Orange
    return "#9E9E9E";
};

return (
    <div style={styles.container}>
        <h1 style={styles.header}><FaClipboardList /> My Order History</h1>

        {orders.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <FaBoxOpen size={50} color="#ccc" />
                <p>No orders found. <Link to="/catalog">Start Shopping!</Link></p>
            </div>
        ) : (
            orders.map(order => (
                <div key={order._id} style={styles.card}>
                    <div style={styles.row}>
                        <div>
                            <strong>Order ID:</strong> {order._id} <br />
                            <small style={{ color: "#888" }}>{new Date(order.createdAt).toLocaleDateString()}</small>
                        </div>
                        <div>
                            <span style={{ ...styles.badge, backgroundColor: getStatusColor(order.isPaid ? "Paid" : "Pending"), color: "white" }}>
                                {order.isPaid ? "Paid" : "Pending Payment"}
                            </span>
                        </div>
                    </div>
                    <hr style={{ border: "0", borderTop: "1px dashed #ccc", margin: "10px 0" }} />
                    <div>
                        {order.orderItems.map((item, i) => (
                            <div key={i} style={styles.row}>
                                <span style={styles.item}>{item.qty} x {item.title || "Book"}</span>
                                <span>${item.price}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold", fontSize: "1.1rem" }}>
                        Total: ${order.totalPrice}
                    </div>
                </div>
            ))
        )}
    </div>
);
};

export default MyOrders;
