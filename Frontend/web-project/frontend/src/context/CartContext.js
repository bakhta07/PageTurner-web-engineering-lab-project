import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Load cart from localStorage (initial)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Failed to parse cart from local storage", err);
      return [];
    }
  });

  // Sync with DB when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (user && user.token) {
        try {
          // 1. If we have local items, add them to DB first
          // Note: Backend increments by 1 per call. We must loop if quantity > 1.
          if (cart.length > 0) {
            for (const item of cart) {
              const qty = item.quantity || 1;
              for (let i = 0; i < qty; i++) {
                await fetch(`${API_URL}/cart`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    bookId: item._id || item.bookId,
                    title: item.title,
                    price: item.price,
                    author: item.author,
                    imageURL: item.imageURL
                  })
                });
              }
            }
            localStorage.removeItem("cart");
          }

          // 2. Fetch the consolidated cart from DB
          const res = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const serverCart = await res.json();
            // Map server simplified items to our structure
            // Server returns: { book: {..}, quantity: N, ... }
            const processedCart = serverCart.map(item => {
              const bookData = item.book || {};
              return {
                ...item,
                _id: bookData._id || item.book, // Ensure we use Book ID
                title: bookData.title || item.title,
                author: bookData.author || item.author,
                price: bookData.price || item.price,
                imageURL: bookData.imageURL || item.imageURL,
                quantity: item.quantity,
                book: bookData
              };
            });
            setCart(processedCart);
          }
        } catch (err) { console.error(err); }
      }
    };
    syncCart();
    // eslint-disable-next-line
  }, [user]);

  // Save to localStorage (only if NOT logged in, or as backup)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (item) => {
    // Optimistic UI update
    setCart((prev) => {
      const existingIdx = prev.findIndex(p => p._id === item._id);
      if (existingIdx > -1) {
        const newCart = [...prev];
        newCart[existingIdx] = {
          ...newCart[existingIdx],
          quantity: (newCart[existingIdx].quantity || 1) + 1
        };
        return newCart;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    if (user && user.token) {
      try {
        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            bookId: item._id,
            title: item.title,
            price: item.price,
            author: item.author,
            imageURL: item.imageURL
          })
        });
      } catch (error) {
        console.error("Failed to sync cart", error);
      }
    }
  };

  const removeFromCart = async (index) => {
    const itemToRemove = cart[index];
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);

    if (user && user.token && itemToRemove) {
      try {
        // Handle logic for removal by ID if book object exists, or fallback to bookId
        const idToRemove = itemToRemove.book?._id || itemToRemove._id || itemToRemove.bookId;
        await fetch(`${API_URL}/cart/${idToRemove}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (e) { console.error(e); }
    }
  };

  const decreaseQuantity = async (item) => {
    // Optimistic Update
    setCart((prev) => {
      const existingIdx = prev.findIndex(p => p._id === item._id);
      if (existingIdx > -1) {
        const newCart = [...prev];
        if (newCart[existingIdx].quantity > 1) {
          newCart[existingIdx] = { ...newCart[existingIdx], quantity: newCart[existingIdx].quantity - 1 };
          return newCart;
        } else {
          // Remove item
          return newCart.filter((_, i) => i !== existingIdx);
        }
      }
      return prev;
    });

    if (user && user.token) {
      try {
        await fetch(`${API_URL}/cart/decrease`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ bookId: item._id })
        });
      } catch (err) { console.error(err); }
    }
  };

  const clearCart = async () => {
    setCart([]);
    if (user && user.token) {
      await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` }
      });
    } else {
      localStorage.removeItem("cart");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
