import dbConnect from "@/services/dbConnect";
import Reminder from "@/models/Reminder";
import { convertDate } from "@/services/utility";
import Kavenegar from "kavenegar";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dueReminders = await Reminder.find({
      reminderDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      reminderSent: false,
    });

    const api = Kavenegar.KavenegarApi({
      apikey: process.env.NEXT_PUBLIC_KAVENEGAR_KEY,
    });

    for (const item of dueReminders) {
      try {
        await new Promise((resolve, reject) => {
          api.VerifyLookup(
            {
              receptor: item.phone,
              token: item.category,
              token2: convertDate(item.reminderDate),
              template: "reminderOutline",
            },
            (response, status) => {
              if (status === 200) resolve(response);
              else reject(response);
            },
          );
        });

        await Reminder.updateOne(
          { _id: item._id },
          { $set: { reminderSent: true } },
        );
      } catch (err) {
        console.error(err);
      }
    }

    res.status(200).json({
      success: true,
      processed: dueReminders.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
