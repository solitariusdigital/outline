import Process from "@/models/Process";
import dbConnect from "@/services/dbConnect";

export default async function processHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newProcess = await Process.create(body);
        return res.status(200).json(newProcess);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        let process = null;
        if (req.query.id) {
          process = await Process.findById(req.query.id);
        } else {
          process = await Process.find();
        }
        return res.status(200).json(process);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateProcess = await Process.findByIdAndUpdate(
          body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          },
        );
        if (!updateProcess) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateProcess);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
