import Doctor from "@/models/Doctor";
import dbConnect from "@/services/dbConnect";

export default async function doctorHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const doctor = await Doctor.findById(req.query.id);
        return res.status(200).json(doctor);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
