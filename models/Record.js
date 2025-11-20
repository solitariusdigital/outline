import { Schema, model, models } from "mongoose";

const RecordSchema = new Schema(
  {
    name: String,
    birthDate: String,
    age: String,
    idMeli: {
      type: String,
      required: true,
    },
    userId: String,
    recordId: String,
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: String,
    occupation: String,
    referral: String,
    date: String,
    visitId: String,
    time: String,
    confirmation: Boolean,
    sharePermission: Boolean,
    records: [],
    checkup: Boolean,
    completed: Boolean,
    status: String,
  },
  { timestamps: true }
);

const Record = models.Record || model("Record", RecordSchema);
export default Record;
