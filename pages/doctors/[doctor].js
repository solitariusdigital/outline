import dbConnect from "@/services/dbConnect";
import doctorModel from "@/models/Doctor";
import Image from "next/legacy/image";
import classes from "./doctors.module.scss";
import Router from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { NextSeo } from "next-seo";

export default function Doctor({ doctor }) {
  const doctorDefault =
    "https://belleclass.storage.iran.liara.space/doctors/belleclass.png";

  return (
    <div className={classes.profile}>
      <NextSeo
        title={doctor.name}
        description={doctor.title}
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      <div className={classes.information}>
        <div>
          <div className={classes.arrow}>
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => Router.push("/doctors")}
            />
          </div>
          <Image
            className={classes.image}
            src={doctor.image ? doctor.image : doctorDefault}
            placeholder="blur"
            blurDataURL={doctor.image ? doctor.image : doctorDefault}
            alt="image"
            loading="eager"
            width={150}
            height={200}
            objectFit="cover"
            priority
          />
          <h2 className={classes.name}>{doctor.name}</h2>
          <h3>{doctor.title}</h3>
          <button
            onClick={() =>
              Router.push({
                pathname: "/booking",
                query: { id: doctor["_id"] },
              })
            }
          >
            نوبت دهی
          </button>
        </div>
        <div className={classes.tags}>
          {doctor.tags.map((tag, index) => (
            <p key={index}>{tag}</p>
          ))}
        </div>
        <p className={classes.info}>{doctor.bio}</p>
      </div>
    </div>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let id = context.params.doctor;
    const doctor = await doctorModel.findById(id);

    return {
      props: {
        doctor: JSON.parse(JSON.stringify(doctor)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
