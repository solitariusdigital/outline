import { useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import DatePicker from "@/components/DatePicker";
import classes from "./booking.module.scss";
import Router from "next/router";
import { NextSeo } from "next-seo";
import Register from "@/components/Register";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import HomeIcon from "@mui/icons-material/Home";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import logo from "@/assets/logo.png";
import { getCurrentDateFarsi } from "@/services/utility";

export default function Booking({ visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);

  useEffect(() => {
    const handleUserAccess = async () => {
      if (!currentUser) return;
      const { permission, _id } = currentUser;
      if (permission === "doctor") {
        Router.push("/");
        return;
      }
      if (permission === "patient" || permission === "staff") {
        const hasActiveVisit = visits.some(
          (visit) => visit.userId === _id && !visit.completed && !visit.canceled
        );
        if (hasActiveVisit) {
          Router.push("/");
        }
      }
    };
    handleUserAccess();
  }, [currentUser, visits]);

  return (
    <Fragment>
      <NextSeo
        title="ثبت نوبت آنلاین"
        description="ثبت نوبت آنلاین"
        canonical="https://outlinecommunity.com/booking"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/booking",
          title: "ثبت نوبت آنلاین",
          description: "ثبت نوبت آنلاین",
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
      {currentUser ? (
        <div className={classes.container}>
          <div className={classes.header}>
            <HomeIcon
              className="icon"
              onClick={() => Router.push("/")}
              sx={{ color: "#2d2b7f" }}
            />
            {selectDoctor && <h3>{selectDoctor}</h3>}
            <SwitchAccountIcon
              className="icon"
              onClick={() =>
                Router.push({
                  pathname: `/portal/${currentUser.permission}`,
                  query: { id: currentUser["_id"], p: currentUser.permission },
                })
              }
              sx={{ color: "#2d2b7f" }}
            />
          </div>
          <DatePicker visits={visits} />
        </div>
      ) : (
        <div className="register">
          <Register></Register>
        </div>
      )}
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    const [year] = getCurrentDateFarsi().split("/");
    let visits = await visitModel.find({ time: { $regex: `^${year}` } });
    let activeVisits = visits.filter(
      (visit) => !visit.completed && !visit.canceled
    );

    return {
      props: {
        visits: JSON.parse(JSON.stringify(activeVisits)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
