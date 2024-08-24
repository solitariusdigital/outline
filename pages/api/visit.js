import Visit from "@/models/Visit";
import dbConnect from "@/services/dbConnect";

export default async function visitHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const visit = await Visit.findById(req.query.id);
        return res.status(200).json(visit);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
