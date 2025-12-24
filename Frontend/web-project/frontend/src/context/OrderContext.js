import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [user]);

  const placeOrder = async (cartItems) => {
    if (!user) return { success: false, message: "Please login to checkout" };

    try {
      // Backend expects 'books' array with { book: bookId, quantity: number }
      const payloadItems = cartItems.map(item => ({
        book: item.book?._id || item._id, // Handle both populated and unpopulated/mixed structures
        quantity: item.quantity || 1
      }));

      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          books: payloadItems
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => [...prev, data]);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Order failed" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error" };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <OrderContext.Provider value={{ orders, placeOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
