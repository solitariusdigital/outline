import { Schema, model, models } from "mongoose";

const FollowSchema = new Schema(
  {
    name: String,
    phone: String,
    title: String,
    userId: String,
    doctor: String,
    time: String,
    date: Date,
    branch: String,
    completed: Boolean,
    canceled: Boolean,
  },
  { timestamps: true },
);

const Follow = models.Follow || model("Follow", FollowSchema);
export default Follow;
