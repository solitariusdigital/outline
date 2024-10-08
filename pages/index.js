import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";

export default function Home({ activeVisits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const [hideBooking, setHideBooking] = useState(true);

  const locationLink =
    "https://www.google.com/maps/place/35%C2%B047'47.0%22N+51%C2%B025'32.1%22E/@35.7963889,51.4249382,19z/data=!3m1!4b1!4m4!3m3!8m2!3d35.7963889!4d51.4255833?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D";

  useEffect(() => {
    const handleUserVisits = async () => {
      if (!currentUser) {
        setHideBooking(false);
        return;
      }
      const { permission, _id } = currentUser;
      if (permission === "doctor") {
        setHideBooking(true);
        return;
      }
      if (permission === "patient") {
        const hasActiveVisit = activeVisits.some(
          (visit) => visit.userId === _id && !visit.completed && !visit.canceled
        );
        setHideBooking(hasActiveVisit);
      } else {
        setHideBooking(false);
      }
    };
    handleUserVisits();
  }, [currentUser, activeVisits]);

  return (
    <Fragment>
      <NextSeo
        title="اوت‌لاین"
        description="کلینیک زیبایی"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "اوت‌لاین",
          description: "کلینیک زیبایی",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت‌لاین",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      <section className={classes.container}>
        <div className={classes.logo}>
          <Image width={200} height={140} src={logo} alt="logo" priority />
          <h2>طراحی چهره</h2>
        </div>
        <section className={classes.navigation}>
          {currentUser && (
            <div
              className={classes.nav}
              onClick={() =>
                Router.push({
                  pathname: `/portal/${currentUser.permission}`,
                  query: { id: currentUser["_id"], p: currentUser.permission },
                })
              }
            >
              پورتال نوبت‌ها
            </div>
          )}
          {!hideBooking && (
            <Fragment>
              <div
                className={classes.doctor}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر فراهانی");
                }}
              >
                نوبت دکتر فراهانی
              </div>
              <div
                className={classes.doctor}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر گنجه");
                }}
              >
                نوبت دکتر گنجه
              </div>
            </Fragment>
          )}
          <div className={classes.nav} onClick={() => Router.push("/about")}>
            فلسفه متد اوت‌لاین
          </div>
          <div
            className={classes.nav}
            onClick={() => window.open(locationLink)}
          >
            آدرس کلینیک
          </div>
          <div
            className={classes.nav}
            onClick={() =>
              window.open("https://wa.me/message/XPZYUKX6KF7LD1", "_ self")
            }
          >
            تماس با ما
          </div>
        </section>
        <div>
          <InstagramIcon
            className="icon"
            sx={{ color: "#2d2b7f" }}
            onClick={() =>
              window.open(
                "https://www.instagram.com/dr.farahani.outline",
                "_ self"
              )
            }
          />
        </div>
      </section>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();

    let visits = await visitModel.find();
    let activeVisits = visits.filter(
      (visit) => !visit.completed && !visit.canceled
    );

    return {
      props: {
        activeVisits: JSON.parse(JSON.stringify(activeVisits)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
