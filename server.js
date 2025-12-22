const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); 

// ROUTES
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/books", require("./routes/bookRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));

app.use("/api/orders", require("./routes/orderRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
