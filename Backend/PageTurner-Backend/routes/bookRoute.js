const express = require("express");
const Book = require("../models/book");
const Order = require("../models/order");
const { protect, adminOnly } = require("../middleware/auth");
const { bookValidation } = require("../middleware/validate");

const router = express.Router();

/* RECOMMENDATIONS */
router.get("/recommendations", protect, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get User Orders & Purchased Books
    const orders = await Order.find({ user: userId }).populate("books.book");

    let purchasedCategoryIds = [];
    let purchasedBookIds = [];

    orders.forEach(order => {
      order.books.forEach(item => {
        if (item.book) {
          purchasedBookIds.push(item.book._id);
          if (item.book.category && Array.isArray(item.book.category)) {
            purchasedCategoryIds.push(...item.book.category);
          } else if (item.book.category) {
            purchasedCategoryIds.push(item.book.category);
          }
        }
      });
    });

    // Unique Categories
    purchasedCategoryIds = [...new Set(purchasedCategoryIds)];

    // 2. Find Books in those Categories (exclude purchased)
    let recommendations = [];

    if (purchasedCategoryIds.length > 0) {
      recommendations = await Book.find({
        category: { $in: purchasedCategoryIds },
        _id: { $nin: purchasedBookIds },
        deletedAt: null
      }).limit(4);
    }

    // 3. Fallback if no history or not enough recs
    if (recommendations.length < 4) {
      const fallback = await Book.find({
        _id: { $nin: [...purchasedBookIds, ...recommendations.map(r => r._id)] },
        deletedAt: null
      }).limit(4 - recommendations.length);
      recommendations = [...recommendations, ...fallback];
    }

    res.json(recommendations);
  } catch (err) { next(err); }
});

/* PUBLIC */
router.get("/", async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    // Filter out deleted books
    const query = { ...keyword, deletedAt: null };

    const count = await Book.countDocuments(query);
    const books = await Book.find(query)
      .limit(limit)
      .skip(skip);

    res.json({
      books,
      page,
      pages: Math.ceil(count / limit),
      count
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, deletedAt: null });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) { next(err); }
});

/* ADMIN ONLY */
router.post("/", protect, adminOnly, bookValidation, async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
});

/* RESTORE BOOK */
router.put("/:id/restore", protect, adminOnly, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, { deletedAt: null }, { new: true });
  res.json({ message: "Book and its validation restored", book });
});

/* SOFT DELETE BOOK */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, { deletedAt: new Date() }, { new: true });
  res.json({ message: "Book moved to trash" });
});

/* REVIEWS (Private) */
router.post("/:id/reviews", protect, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);

    if (book) {
      // Check if user already reviewed
      const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
      };

      book.reviews.push(review);
      book.numReviews = book.reviews.length;

      // Calc Average
      book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

      await book.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Book not found");
    }
  } catch (err) { next(err); }
});

module.exports = router;
