const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [
            {
                book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, // Made optional for legacy compatibility
                bookId: { type: String }, // Restored for legacy
                quantity: { type: Number, default: 1 },
                price: { type: Number, required: true },
                title: { type: String },
                author: { type: String },
                imageURL: { type: String }
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Cart", cartSchema);
