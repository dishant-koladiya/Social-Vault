import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI not defined in .env");
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => console.error("MongoDB connection error:", err));

db.once("open", () => console.log("✅ MongoDB connected"));

export default db;
