import { Schema, model, models } from "mongoose";

const RecordSchema = new Schema(
  {
    name: String,
    birthDate: String,
    age: String,
    idMeli: {
      type: String,
      required: true,
      unique: true,
    },
    userId: String,
    recordId: String,
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    tel: String,
    address: String,
    occupation: String,
    referral: String,
    date: String,
    sharePermission: Boolean,
    confirmation: Boolean,
    medicalDescription: String,
    medicalFamilyDescription: String,
    medicineDescription: String,
    medical: [],
    medicalFamily: [],
    habits: [],
    records: [],
  },
  { timestamps: true }
);

const Record = models.Record || model("Record", RecordSchema);
export default Record;
