import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import DatePicker from "@/components/DatePicker";
import classes from "./booking.module.scss";
import Router from "next/router";
import { NextSeo } from "next-seo";
import Register from "@/components/Register";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import HomeIcon from "@mui/icons-material/Home";

export default function Booking() {
  const { currentUser, setCurrentUser } = useContext(StateContext);

  const margin = {
    marginRight: "12px",
  };

  return (
    <Fragment>
      <NextSeo
        title="رزرو نوبت آنلاین"
        description="رزرو نوبت آنلاین پزشک زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
        }}
      />
      {currentUser ? (
        <div className={classes.container}>
          <HomeIcon
            className="icon"
            style={margin}
            onClick={() => Router.push("/")}
            sx={{ color: "#2d2b7f" }}
          />
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
          <DatePicker />
        </div>
      ) : (
        <div className="register">
          <Register></Register>
        </div>
      )}
    </Fragment>
  );
}
