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

export default function Booking({ visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);

  const margin = {
    marginRight: "12px",
  };

  useEffect(() => {
    const getCurrentUserVisits = async () => {
      if (currentUser && currentUser.permission === "patient") {
        let activeVisitExist = visits.some(
          (visit) =>
            visit.userId === currentUser["_id"] &&
            !visit.completed &&
            !visit.canceled
        );
        if (activeVisitExist) {
          Router.push("/");
        }
      }
    };
    getCurrentUserVisits();
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="ثبت نوبت آنلاین"
        description="ثبت نوبت آنلاین"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
        }}
      />
      {currentUser ? (
        <div className={classes.container}>
          <div className={classes.header}>
            <HomeIcon
              className="icon"
              style={margin}
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
