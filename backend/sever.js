require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10kb" }));


app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Auth API is running" });
});

app.use("/auth", authRouter);

// Local development ke liye
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

// Vercel ke liye
module.exports = app;
