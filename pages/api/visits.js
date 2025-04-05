import Visit from "@/models/Visit";
import dbConnect from "@/services/dbConnect";
import { getCurrentDateFarsi } from "@/services/utility";

export default async function visitsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newVisit = await Visit.create(body);
        return res.status(200).json(newVisit);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        let visits = null;
        if (req.query.id) {
          visits = await Visit.findById(req.query.id);
        } else {
          const [year] = getCurrentDateFarsi().split("/");
          visits = await Visit.find({ time: { $regex: `^${year}` } });
        }
        return res.status(200).json(visits);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateVisit = await Visit.findByIdAndUpdate(body["_id"], body, {
          new: true,
          runValidators: true,
        });
        if (!updateVisit) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateVisit);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
