import Record from "@/models/Record";
import dbConnect from "@/services/dbConnect";

export default async function recordsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newRecord = await Record.create(body);
        return res.status(200).json(newRecord);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const records = await Record.find();
        return res.status(200).json(records);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateRecord = await Record.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateRecord) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateRecord);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
