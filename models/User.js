import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    emailHash: {
      type: String,
      unique: true,
      index: true,
    },
    username: String,
    banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
