import { Schema, model, models } from "mongoose";

const ArchiveSchema = new Schema(
  {
    title: String,
    images: {
      one: String,
      two: String,
    },
    description: String,
    tags: [String],
  },
  { timestamps: true }
);

const Archive = models.Archive || model("Archive", ArchiveSchema);
export default Archive;
