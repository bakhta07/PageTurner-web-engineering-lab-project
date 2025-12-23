// src/context/OrderContext.js
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Place Order
  const placeOrder = async (orderData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]);
        toast.success("Order placed successfully!");
        return { success: true };
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to place order");
        return { success: false, message: error.message };
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Server error. Please try again.");
      return { success: false, message: "Server error" };
    }
  };

  // Fetch My Orders
  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) return;

      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const { user } = useAuth();

  // Fetch when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
