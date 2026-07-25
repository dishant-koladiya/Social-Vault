import express from "express";
import {
	createOrder,
	verifyPayment,
	getCurrentPlan,
	downgradePlan,
} from "../controllers/planController.js";
import { protect } from "../middlewares/authMiddleware.js";

const planRouter = express.Router();

planRouter.post("/create-order", protect, createOrder);
planRouter.post("/verify-payment", protect, verifyPayment);
planRouter.get("/current", protect, getCurrentPlan);
planRouter.post("/downgrade", protect, downgradePlan);

export default planRouter;
