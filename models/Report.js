import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterSocket: String,
    reportedSocket: String,
    reason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
