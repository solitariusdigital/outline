import User from "@/models/User";
import dbConnect from "@/services/dbConnect";

export default async function usersHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newUser = await User.create(body);
        return res.status(200).json(newUser);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const users = await User.find();
        return res.status(200).json(users);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateUser = await User.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateUser) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateUser);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
