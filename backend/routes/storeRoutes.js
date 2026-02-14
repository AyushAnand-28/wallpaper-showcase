import express from "express";
import {
  createStore,
  getStores,
  getStoreById,
  getMyStores,
  updateStore,
} from "../controllers/storeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStores);                                          // Public
router.get("/my", protect, authorize("STORE_OWNER"), getMyStores);  // Store owner's stores
router.get("/:id", getStoreById);                                    // Public
router.post("/", protect, authorize("STORE_OWNER"), createStore);    // Create store
router.put("/:id", protect, authorize("STORE_OWNER"), updateStore);  // Update store

export default router;
