const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();
connectDB();

const app = express();

// 1) Security Headers
app.use(helmet());

app.use(cors());

// 2) Body Parser
app.use(express.json());

// const mongoSanitize = require("express-mongo-sanitize"); // Removed
// 3) Data Sanitization
const mongoSanitize = require("./middleware/sanitize");
app.use(mongoSanitize);


// 4) Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// PASSPORT CONFIG
require("./config/passport");

// ROUTES
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/books", require("./routes/bookRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));

app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/requests", require("./routes/requestRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));

const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(require("./middleware/errorMiddleware").errorHandler);

const Book = require("./models/book");

setInterval(async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await Book.deleteMany({ deletedAt: { $lt: fiveMinutesAgo } });
    // Optional: console.log("Cleanup ran");
  } catch (err) {
    console.error("Cleanup Error:", err);
  }
}, 60 * 1000); // Run every minute

const PORT = process.env.PORT || 5000;

// Export for Vercel
module.exports = app;

// Only listen if run directly (locally)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} `);
  });
}
