import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import background from "@/assets/background.jpg";
import Expertise from "@/components/Expertise";
import doctorModel from "@/models/Doctor";
import dbConnect from "@/services/dbConnect";
import Router from "next/router";
import { NextSeo } from "next-seo";

export default function Home({ doctors }) {
  const { expertiseAreas, setExpertiseAreas } = useContext(StateContext);
  const doctorDefault =
    "https://belleclass.storage.iran.liara.space/doctors/belleclass.png";

  useEffect(() => {
    expertiseAreas.map((nav) => {
      nav.active = false;
    });
    setExpertiseAreas([...expertiseAreas]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="کلینیک تخصصی زیبایی بل کلاس"
        description="نگهبان زندگی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      <section className={classes.heroHeader}>
        <Image
          className={classes.heroImage}
          src={background}
          placeholder="blur"
          alt="image"
          layout="fill"
          objectFit="cover"
          loading="eager"
        />
        <div className={classes.header}>
          <h1>نگهبان زندگی</h1>
          <h2>The Gaurdian of Life</h2>
          <button onClick={() => Router.push("/doctors")}>
            رزرو مراجعه حضوری
          </button>
          <button onClick={() => Router.push("/assessment")}>
            مشاوره آنلاین رایگان
          </button>
        </div>
      </section>
      <section className={classes.bannerContainer}>
        <div className={classes.banner}></div>
        <div className={classes.banner}></div>
        <div className={classes.banner}></div>
        <div className={classes.banner}></div>
      </section>
      <section className={classes.expertise}>
        <h2>خدمات کلینیک</h2>
        <Expertise></Expertise>
      </section>
      <section className={classes.doctorsContainer}>
        {doctors.map((doctor, index) => (
          <div
            className={classes.items}
            key={index}
            onClick={() => Router.push(`/doctors/${doctor["_id"]}`)}
          >
            <div className={classes.row}>
              <Image
                className={classes.image}
                src={doctor.image ? doctor.image : doctorDefault}
                placeholder="blur"
                blurDataURL={doctor.image ? doctor.image : doctorDefault}
                alt="image"
                width={70}
                height={70}
                objectFit="cover"
                loading="eager"
              />
              <div className={classes.info}>
                <p className={classes.name}>{doctor.name}</p>
                <p>{doctor.title}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className={classes.lifeStyleContainer}>
        <div className={classes.lifeStyle}>
          <p>
            فیلرهای پوستی مواد ژل مانندی هستند که برای بازگرداندن حجم از دست
            رفته، ایجاد خطوط صاف و نرم کردن چین و چروکها به زیر پوست تزریق
            میشوند. مدت زمان ماندگاری اثر فیلر های پوستی به محصول، ناحیه درمان و
            بیمار بستگی دارد. یکی از رایج ترین فیلرها، فیلرهای اسید هیالورونیک
            است. اسید هیالورونیک HA, یک ماده طبیعی است که در پوست یافت میشود و
            به صاف و هیدراته شدن پوست کمک می کند. فیلرهای HAمعمولا نرم و ژل
            مانند هستند و اثر آنها معمولا ۶ تا ۱۲ ماه باقی می ماند
          </p>
          <Image
            className={classes.image}
            src={background}
            placeholder="blur"
            alt="image"
            loading="eager"
            priority
          />
        </div>
        <div className={classes.lifeStyle}>
          <Image
            className={classes.image}
            src={background}
            placeholder="blur"
            alt="image"
            loading="eager"
          />
          <p>
            فیلرهای پوستی مواد ژل مانندی هستند که برای بازگرداندن حجم از دست
            رفته، ایجاد خطوط صاف و نرم کردن چین و چروکها به زیر پوست تزریق
            میشوند. مدت زمان ماندگاری اثر فیلر های پوستی به محصول، ناحیه درمان و
            بیمار بستگی دارد. یکی از رایج ترین فیلرها، فیلرهای اسید هیالورونیک
            است. اسید هیالورونیک HA, یک ماده طبیعی است که در پوست یافت میشود و
            به صاف و هیدراته شدن پوست کمک می کند. فیلرهای HAمعمولا نرم و ژل
            مانند هستند و اثر آنها معمولا ۶ تا ۱۲ ماه باقی می ماند
          </p>
        </div>
      </section>
      <section className={classes.videoContainer}>
        <div className={classes.boxContainer}>
          <div className={classes.box}>
            <video
              className={classes.video}
              preload="metadata"
              controls
              src="https://belleclass.com/uploads/1cceeb6f0d5e4042927d1c1d05368f52.MOV#t=0.1"
            />
          </div>
          <button onClick={() => Router.push("/doctors")}>
            رزرو مراجعه حضوری
          </button>
          <p>
            فیلرهای پوستی مواد ژل مانندی هستند که برای بازگرداندن حجم از دست
            رفته، ایجاد خطوط صاف و نرم کردن چین و چروکها به زیر پوست تزریق
            میشوند. مدت زمان ماندگاری اثر فیلر های پوستی به محصول، ناحیه درمان و
            بیمار بستگی دارد. یکی از رایج ترین فیلرها، فیلرهای اسید هیالورونیک
            ناحیه درمان و بیمار بستگی دارد. یکی از رایج ترین فیلرها، فیلرهای
            اسید هیالورونیک است ناحیه درمان و بیمار بستگی دارد. یکی از رایج ترین
            فیلرها، فیلرهای اسید هیالورونیک است
          </p>
        </div>
        <div className={classes.boxContainer}>
          <div className={classes.box}>
            <video
              className={classes.video}
              preload="metadata"
              controls
              src="https://belleclass.com/uploads/e7750b4101324885a8e2e55ad4a6a5ab.MOV#t=0.1"
            />
          </div>
          <button onClick={() => Router.push("/assessment")}>
            مشاوره آنلاین رایگان
          </button>
          <p>
            فیلرهای پوستی مواد ژل مانندی هستند که برای بازگرداندن حجم از دست
            رفته، ایجاد خطوط صاف و نرم کردن چین و چروکها به زیر پوست تزریق
            میشوند. مدت زمان ماندگاری اثر فیلر های پوستی به محصول
          </p>
        </div>
      </section>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const doctors = await doctorModel.find();
    return {
      props: {
        doctors: JSON.parse(JSON.stringify(doctors.slice(0, 4))),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
