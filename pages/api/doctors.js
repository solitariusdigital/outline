import Doctor from "@/models/Doctor";
import dbConnect from "@/services/dbConnect";

export default async function doctorsHandler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=10");
  const { method, body } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const newDoctor = await Doctor.create(body);
        return res.status(200).json(newDoctor);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "GET":
      try {
        const doctors = await Doctor.find();
        return res.status(200).json(doctors);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
    case "PUT":
      try {
        const updateDoctor = await Doctor.findByIdAndUpdate(
          body.id || body["_id"],
          body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updateDoctor) {
          return res.status(400).json({ msg: err.message });
        }
        return res.status(200).json(updateDoctor);
      } catch (err) {
        return res.status(400).json({ msg: err.message });
      }
  }
}
