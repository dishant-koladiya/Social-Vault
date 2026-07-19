import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  message: { type: String, required: true },
  sender_id: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
