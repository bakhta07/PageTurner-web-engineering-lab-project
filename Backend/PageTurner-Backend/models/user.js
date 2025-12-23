const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      // required: true, // ⚠️ REMOVED for OAuth support
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
