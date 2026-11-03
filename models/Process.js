import { Schema, model, models } from "mongoose";

const ProcessSchema = new Schema(
  {
    type: Number,
    description: String,
    media: [],
  },
  { timestamps: true },
);

const Process = models.Process || model("Process", ProcessSchema);
export default Process;
