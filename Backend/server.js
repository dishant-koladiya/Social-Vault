import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import planRouter from "./routes/planRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.get("/", (req, res) => res.send("Server is live!"));

app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);
app.use("/api/plan", planRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});