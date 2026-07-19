import mongoose from "mongoose";
import { Platform, Niche, Status } from "./enums.js";

const { Schema } = mongoose;

const listingSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  platform: { type: String, enum: Platform, required: true },
  username: { type: String },
  followers_count: { type: Number, required: true },
  engagement_rate: { type: Number },
  monthly_views: { type: Number },
  niche: { type: String, enum: Niche, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  verified: { type: Boolean, default: false },
  monetized: { type: Boolean, default: false },
  country: { type: String },
  age_range: { type: String, required: true },
  status: { type: String, enum: Status, default: "active" },
  featured: { type: Boolean, default: false },
  images: [{ type: String }],
  platformAssured: { type: Boolean, default: false },
  isCredentialSubmitted: { type: Boolean, default: false },
  isCredentialVerified: { type: Boolean, default: false },
  isCredentialChanged: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);
