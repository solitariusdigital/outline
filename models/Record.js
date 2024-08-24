import { Schema, model, models } from "mongoose";

const RecordSchema = new Schema(
  {
    title: String,
    image: String,
    userId: String,
    doctorId: String,
    example: String,
    comments: [String],
    assessment: {},
    completed: Boolean,
  },
  { timestamps: true }
);

const Record = models.Record || model("Record", RecordSchema);
export default Record;
