import Record from "@/models/Record";
import dbConnect from "@/services/dbConnect";

export default async function recordHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const record = await Record.findById(req.query.id);
        return res.status(200).json(record);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
