import express from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", protect, me);
authRouter.post("/logout", logout);

export default authRouter;