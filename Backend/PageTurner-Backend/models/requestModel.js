const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Request", requestSchema);
