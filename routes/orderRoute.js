const express = require("express");
const Order = require("../models/order");
const Book = require("../models/book");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

/* PLACE ORDER - CUSTOMER */
router.post("/", protect, async (req, res) => {
  try {
    const { books } = req.body;

    let totalAmount = 0;

    for (let item of books) {
      const book = await Book.findById(item.book);
      if (!book || book.stock < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      totalAmount += book.price * item.quantity;
    }

    // reduce stock
    for (let item of books) {
      const book = await Book.findById(item.book);
      book.stock -= item.quantity;
      await book.save();
    }

    const order = await Order.create({
      user: req.user._id,
      books,
      totalAmount
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* CUSTOMER: MY ORDERS */
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("books.book", "title price")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* ADMIN: ALL ORDERS */
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email")
    .populate("books.book", "title");

  res.json(orders);
});

/* ADMIN: UPDATE STATUS */
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = req.body.status;
  await order.save();
  res.json(order);
});

module.exports = router;
