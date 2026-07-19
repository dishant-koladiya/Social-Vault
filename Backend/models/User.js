import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  earned: { type: Number, default: 0 },
  withdrawn: { type: Number, default: 0 },
}, { timestamps: true });

// Virtuals for relations (populate when needed)
userSchema.virtual('listings', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'owner',
});
userSchema.virtual('ownerChats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'ownerUser',
});
userSchema.virtual('chatUserChats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'chatUser',
});
userSchema.virtual('withdrawals', {
  ref: 'Withdrawal',
  localField: '_id',
  foreignField: 'user',
});

export default mongoose.model('User', userSchema);
