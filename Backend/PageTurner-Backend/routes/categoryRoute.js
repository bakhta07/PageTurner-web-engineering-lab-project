const express = require("express");
const Category = require("../models/category");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

/* PUBLIC */
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

/* ADMIN ONLY */
router.post("/", protect, adminOnly, async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

module.exports = router;
