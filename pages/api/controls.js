import Control from "@/models/Control";
import dbConnect from "@/services/dbConnect";

export default async function controlsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newControl = await Control.create(body);
        return res.status(200).json(newControl);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const controls = await Control.find();
        return res.status(200).json(controls);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateControl = await Control.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateControl) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateControl);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    default:
      return res.status(405).json({ msg: "Method Not Allowed" });
  }
}
