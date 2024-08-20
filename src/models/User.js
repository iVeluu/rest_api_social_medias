import mongoose, { Schema, Model } from 'mongoose'

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
  },
  bio: {
    type: String,
  },
  nick: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "role_user",
  },
  image: {
    type: String,
    default: "default.png",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);
export default User