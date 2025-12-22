// BookContext.js
import { createContext, useContext, useState } from "react";

const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([
    {
      title: "The Housemaid",
      author: "Freida McFadden",
      genre: "Drama",
      price: 15,
      image: "https://online.fliphtml5.com/tyfxm/ncmu/files/large/1f108c2d27b378a4180f1eacb18e699c.webp",
    },
    {
      title: "The Locked Door",
      author: "Freida McFadden",
      genre: "Thriller",
      price: 18,
      image: "https://static.wixstatic.com/media/f67928_57c942e2d5cb420faba870e39921b1ec~mv2.jpg",
    },
  ]);

  const addBook = (book) => setBooks([...books, book]);

  return <BooksContext.Provider value={{ books, addBook }}>{children}</BooksContext.Provider>;
};

export const useBooks = () => useContext(BooksContext);
