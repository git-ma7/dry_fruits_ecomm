import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(express.json());

// --- CORS CONFIGURATION ---
app.use(
  cors({
    origin: [
      "http://localhost:5173/",   // Vite dev server
      "http://localhost:3000/",   // CRA dev server
      "https://yourfrontenddomain.com/", // future deployed frontend,
      "http://10.24.81.97:5173/" // VS Code Live Share
    ],
    credentials: true,
  })
);

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// --- Health check route ---
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// --- Fallback for unmatched routes ---
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// --- Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
);
