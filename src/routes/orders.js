import { Router } from "express";
import { 
  getUserOrders, 
  createOrder, 
  getOrderById, 
  cancelOrder 
} from "../controllers/orders.js";
import requireAuth from "../middleware/auth.js";

const router = Router();

// Get all orders for the logged-in user
router.get("/", requireAuth, getUserOrders);

// Create a new order
router.post("/", requireAuth, createOrder);

// Get a specific order by ID
router.get("/:id", requireAuth, getOrderById);

// Cancel an order
router.delete("/:id", requireAuth, cancelOrder);

export default router; 