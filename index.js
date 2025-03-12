const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// Handle Preflight Requests
app.options("*", cors());

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", userRoutes);

connectDb()
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
  })
  .catch((error) => console.log("Error occurred while connecting DB:", error));

app.get("/", (req, res) => res.send("This is home page"));
