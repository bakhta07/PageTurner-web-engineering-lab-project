```javascript
// BookContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

const BookContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${ API_URL }/books`);
const data = await res.json();

      } catch (error) {
  console.error("Error fetching books:", error);
  setLoading(false);
}
    };
fetchBooks();
  }, []);

const addBook = async (bookData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const res = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    if (res.ok) {
      const newBook = await res.json();
      setBooks([...books, newBook]);
      return { success: true };
    }
  } catch (error) {
    console.error("Error adding book:", error);
    return { success: false };
  }
};

return (
  <BooksContext.Provider value={{ books, loading, addBook }}>
    {children}
  </BooksContext.Provider>
);
};

export const useBooks = () => useContext(BooksContext);
