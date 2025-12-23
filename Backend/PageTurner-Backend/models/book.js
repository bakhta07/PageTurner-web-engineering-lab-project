const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }],

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    imageURL: {
      type: String,
    },

    // Pro Features
    description: {
      type: String,
      default: "Experience a journey through pages with this captivating title. Perfect for your collection."
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    releaseDate: {
      type: Date,
      default: Date.now
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
