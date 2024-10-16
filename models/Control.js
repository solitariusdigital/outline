import { Schema, model, models } from "mongoose";

const ControlSchema = new Schema(
  {
    disableDates: {},
    reminderDates: {},
    admins: {},
  },
  { timestamps: true }
);

const Control = models.Control || model("Control", ControlSchema);
export default Control;

// "admins": {
//   "6657301b8743ed8f2080e69c": {
//     "2023-10-01": {
//       "checkIn": "2023-10-01T05:30:00.000Z",
//       "checkOut": "2023-10-01T14:30:00.000Z"
//     },
//     "2023-10-02": {
//       "checkIn": "2023-10-02T05:45:00.000Z",
//       "checkOut": "2023-10-02T15:00:00.000Z"
//     }
//   },
//   "6657301b8743e68f2080e69c": {
//     "2023-10-01": {
//       "checkIn": "2023-10-01T05:30:00.000Z",
//       "checkOut": "2023-10-01T14:30:00.000Z"
//     },
//     "2023-10-02": {
//       "checkIn": "2023-10-02T05:45:00.000Z",
//       "checkOut": "2023-10-02T15:00:00.000Z"
//     }
//   }
// },
