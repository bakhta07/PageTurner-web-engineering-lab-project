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
          // 1. If we have local items, add them to DB first (Merge Strategy)
          if (cart.length > 0) {
            for (const item of cart) {
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
            localStorage.removeItem("cart");
          }

          // 2. Fetch the consolidated cart from DB
          const res = await fetch(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const serverCart = await res.json();
            const flatCart = [];
            serverCart.forEach(item => {
              // Handle populated book object
              const bookData = item.book || {};
              for (let i = 0; i < item.quantity; i++) {
                flatCart.push({
                  ...item,
                  _id: bookData._id, // Restore Book ID as main ID
                  title: bookData.title || item.title,
                  author: bookData.author || item.author,
                  price: bookData.price || item.price,
                  imageURL: bookData.imageURL || item.imageURL,
                  book: bookData // Keep full ref just in case
                });
              }
            });
            setCart(flatCart);
          }
        } catch (err) { console.error(err); }
      }
    };
    syncCart();
    // We only want this to run when 'user' changes (logs in). 
    // If we included 'cart' in deps, it would loop forever.
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
    setCart((prev) => [...prev, item]);

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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
