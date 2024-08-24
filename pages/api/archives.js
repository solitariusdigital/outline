import Archive from "@/models/Archive";
import dbConnect from "@/services/dbConnect";

export default async function archivesHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newArchive = await Archive.create(body);
        return res.status(200).json(newArchive);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const archives = await Archive.find();
        return res.status(200).json(archives);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateArchive = await Archive.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateArchive) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateArchive);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
