import { Schema, model, models } from "mongoose";

const VisitSchema = new Schema(
  {
    title: String,
    userId: String,
    doctor: String,
    time: String,
    date: Date,
    completed: Boolean,
    canceled: Boolean,
  },
  { timestamps: true }
);

const Visit = models.Visit || model("Visit", VisitSchema);
export default Visit;
