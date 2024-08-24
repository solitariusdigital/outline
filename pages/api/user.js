import User from "@/models/User";
import dbConnect from "@/services/dbConnect";

export default async function userHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await User.findById(req.query.id);
        return res.status(200).json(user);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
