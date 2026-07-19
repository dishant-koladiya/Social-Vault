import mongoose from "mongoose";

const platformMessageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  message: { type: String, required: true },
  sender_id: { type: String, default: "platform" },
}, { timestamps: true });

export default mongoose.model("PlatformMessage", platformMessageSchema);
