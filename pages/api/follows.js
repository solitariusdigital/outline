import Follow from "@/models/Follow";
import dbConnect from "@/services/dbConnect";
import { getCurrentDateFarsi } from "@/services/utility";

export default async function followsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newFollow = await Follow.create(body);
        return res.status(200).json(newFollow);
      } catch (err) {
        console.log(err.message);
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        let follows = null;
        if (req.query.id) {
          follows = await Follow.findById(req.query.id);
        } else {
          const [year] = getCurrentDateFarsi().split("/");
          follows = await Follow.find({ time: { $regex: `^${year}` } });
        }
        return res.status(200).json(follows);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateFollows = await Follow.findByIdAndUpdate(
          body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          },
        );
        if (!updateFollows) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateFollows);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
