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
    const getCurrentUserVisits = async () => {
      if (currentUser && currentUser.permission === "patient") {
        let activeVisitExist = activeVisits.some(
          (visit) =>
            visit.userId === currentUser["_id"] &&
            !visit.completed &&
            !visit.canceled
        );
        if (!activeVisitExist) {
          setHideBooking(false);
        }
      } else {
        setHideBooking(false);
      }
    };
    getCurrentUserVisits();
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="اوت لاین"
        description="کلینیک زیبایی"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "اوت لاین",
          description: "کلینیک زیبایی",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت لاین",
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
          <h2>طراح چهره</h2>
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
                دکتر فراهانی
              </div>
              <div
                className={classes.doctor}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر گنجه");
                }}
              >
                دکتر گنجه
              </div>
            </Fragment>
          )}
          <div
            className={classes.nav}
            onClick={() => window.open(locationLink)}
          >
            آدرس کلینیک
          </div>
          <div
            className={classes.nav}
            onClick={() => window.open("tel:+989106100914", "_self")}
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

// initial connection to db
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
