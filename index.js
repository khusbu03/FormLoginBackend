require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/database");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Allowed origins
const allowedOrigins = [
  "https://591e-182-77-63-188.ngrok-free.app",
  FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// Handle Preflight Requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", userRoutes);

connectDb()
  .then(() => {
    console.log("DB connected successfully!");
    app.listen(PORT, () => console.log(`App is running on PORT ${PORT}`));
  })
  .catch((error) => console.log("Error occurred while connecting DB:", error));

app.get("/", (req, res) => res.send("This is home page"));
/*  https://8699-182-77-63-188.ngrok-free.app */
