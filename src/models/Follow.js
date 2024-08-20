import mongoose, { Schema, Types } from "mongoose";

const followSchema = Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  followed: {
    type: Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  }
});

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
