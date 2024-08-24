import { useState, useContext, useRef, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./doctors.module.scss";
import Image from "next/legacy/image";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import doctorModel from "@/models/Doctor";
import Form from "@/components/Form";
import { NextSeo } from "next-seo";

export default function Doctors({ doctors }) {
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [displayForm, setDisplayForm] = useState(false);

  const router = useRouter();
  let pathname = router.pathname;

  const doctorDefault =
    "https://belleclass.storage.iran.liara.space/doctors/belleclass.png";

  useEffect(() => {
    setDisplayForm(false);
    navigationTopBar.map((nav) => {
      if (nav.link === "/") {
        navigationTopBar[0].active = true;
      } else if (pathname.includes(nav.link)) {
        navigationTopBar[0].active = false;
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <NextSeo
        title="پزشکان بل کلاس"
        description="لیست پزشکان زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      {currentUser && currentUser.permission === "admin" && (
        <div className={classes.button}>
          <button onClick={() => setDisplayForm(!displayForm)}>
            {!displayForm ? "بارگذاری" : "برگشت"}
          </button>
        </div>
      )}
      {displayForm && (
        <div className={classes.form}>
          <Form />
        </div>
      )}
      {!displayForm && (
        <div className={classes.list}>
          {doctors.map((doctor, index) => (
            <div className={classes.information} key={index}>
              <div className={classes.row}>
                <Image
                  className={classes.image}
                  src={doctor.image ? doctor.image : doctorDefault}
                  placeholder="blur"
                  blurDataURL={doctor.image ? doctor.image : doctorDefault}
                  alt="image"
                  loading="eager"
                  width={70}
                  height={70}
                  objectFit="cover"
                  priority
                />
                <div className={classes.info}>
                  <h2 className={classes.name}>{doctor.name}</h2>
                  <h3>{doctor.title}</h3>
                </div>
              </div>
              <div className={classes.tags}>
                {doctor.tags.map((tag, index) => (
                  <p
                    key={index}
                    onClick={() => Router.push(`/doctors/${doctor["_id"]}`)}
                  >
                    {tag}
                  </p>
                ))}
              </div>
              <p className={classes.bio}>
                {doctor.bio.slice(0, 130)} ...{" "}
                <span onClick={() => Router.push(`/doctors/${doctor["_id"]}`)}>
                  بیشتر
                </span>
              </p>
              <div className={classes.button}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const doctors = await doctorModel.find();
    return {
      props: {
        doctors: JSON.parse(JSON.stringify(doctors)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
