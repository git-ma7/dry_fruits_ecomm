import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

dotenv.config();
const app = express();

// --- Environment variables ---
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const allowedOrigins = ["http://localhost:5173", FRONTEND_ORIGIN];

// --- CORS CONFIGURATION (must come before routes) ---
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- Parse JSON body ---
app.use(express.json());

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
app.use("/api/addresses", addressRoutes);

// --- Health check route ---
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// --- Fallback for unmatched routes ---
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// --- Server Start ---
app.listen(PORT, "0.0.0.0" , () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  console.log(`✅ Allowed origins: [${FRONTEND_ORIGIN}]`);
});
