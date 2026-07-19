import mongoose from "mongoose";
import { Platform, Niche, Status } from "./enums.js";

const { Schema } = mongoose;

const chatSchema = new Schema({
  chatUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  platformMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "PlatformMessage" }],
  active: { type: Boolean, default: true },
  lastMessage: { type: String, default: "" },
  isLastMessageRead: { type: Boolean, default: true },
  lastMessageSenderId: { type: String, default: "" },
  isTokenAmountPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
