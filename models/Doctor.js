import { Schema, model, models } from "mongoose";

const DoctorSchema = new Schema(
  {
    name: String,
    bio: String,
    title: String,
    userId: String,
    image: String,
    tags: [String],
    users: [String],
    visits: [String],
    records: [String],
  },
  { timestamps: true }
);

const Doctor = models.Doctor || model("Doctor", DoctorSchema);
export default Doctor;
