// src/context/OrderContext.js
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const placeOrder = async (cartItems, total) => {
    if (!user) return { success: false, message: "Please login to checkout" };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          orderItems: cartItems,
          totalPrice: total
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrders([...orders, data]);
        return { success: true };
      } else {
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
