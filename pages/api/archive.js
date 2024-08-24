import Archive from "@/models/Archive";
import dbConnect from "@/services/dbConnect";

export default async function archiveHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const archive = await Archive.findById(req.query.id);
        return res.status(200).json(archive);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
