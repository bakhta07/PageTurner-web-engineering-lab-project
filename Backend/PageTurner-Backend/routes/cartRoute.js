const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const { protect } = require("../middleware/auth");
const Book = require("../models/book"); // Ensure Book model is registered

// GET /api/cart - Get user's cart
router.get("/", protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("items.book");
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching cart" });
    }
});

// POST /api/cart - Add item to cart
router.post("/", protect, async (req, res) => {
    const { bookId, title, author, price, imageURL } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Check if item exists (compare ObjectId)
        const itemIndex = cart.items.findIndex((item) => item.book && item.book.toString() === bookId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            // Push new item with ref
            cart.items.push({ book: bookId, title, author, price, imageURL, quantity: 1 });
        }

        await cart.save();
        // Return populated items for immediate UI update
        const populatedCart = await Cart.findById(cart._id).populate("items.book");
        res.json(populatedCart.items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding to cart" });
    }
});

// DELETE /api/cart/:bookId - Remove item
router.delete("/:bookId", protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            // Filter using book ref
            cart.items = cart.items.filter(item => item.book && item.book.toString() !== req.params.bookId);
            await cart.save();
            const populatedCart = await Cart.findById(cart._id).populate("items.book");
            res.json(populatedCart.items);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error removing item" });
    }
});

// DELETE /api/cart - Clear cart
router.delete("/", protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart" });
    }
});

module.exports = router;
