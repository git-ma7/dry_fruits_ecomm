import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ must exist

const router = express.Router();

router.route("/")
  .get(protect, getAddresses)
  .post(protect, addAddress);

router
  .route("/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.patch("/:id/default", protect, setDefaultAddress);

export default router;
