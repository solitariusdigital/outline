import { Schema, model, models } from "mongoose";

const ProcessSchema = new Schema(
  {
    title: String,
    description: String,
    category: String,
    media: [],
  },
  { timestamps: true },
);

const Process = models.Process || model("Process", ProcessSchema);
export default Process;
