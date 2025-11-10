import express from "express";
import { protect } from '../middleware/authMiddleware.js';
import {getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect ,createProduct);      // you can later wrap with admin middleware
router.put("/:id", protect ,updateProduct);
router.delete("/:id", protect ,deleteProduct);

export default router;
