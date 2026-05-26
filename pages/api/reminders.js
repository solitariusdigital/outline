import Reminder from "@/models/Reminder";
import dbConnect from "@/services/dbConnect";

export default async function remindersHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newReminder = await Reminder.create(body);
        return res.status(200).json(newReminder);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        let reminders = null;
        if (req.query.id) {
          reminders = await Reminder.findById(req.query.id);
        } else {
          reminders = await Reminder.find();
        }
        return res.status(200).json(reminders);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateReminder = await Reminder.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          },
        );
        if (!updateReminder) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateReminder);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
