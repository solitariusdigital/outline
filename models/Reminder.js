import { Schema, model, models } from "mongoose";

const ReminderSchema = new Schema(
  {
    name: String,
    userId: String,
    recordId: String,
    phone: {
      type: String,
      required: true,
    },
    category: String,
    injection: String,
    originalDate: String,
    reminderDate: {
      type: Date,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ReminderSchema.index({ reminderDate: 1, reminderSent: 1 });
const Reminder = models.Reminder || model("Reminder", ReminderSchema);
export default Reminder;
