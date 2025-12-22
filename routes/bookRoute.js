const express = require("express");
const Book = require("../models/book");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

/* PUBLIC */
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

/* ADMIN ONLY */
router.post("/", protect, adminOnly, async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

module.exports = router;
