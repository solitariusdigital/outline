import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import DatePicker from "@/components/DatePicker";
import classes from "./booking.module.scss";
import Router from "next/router";
import { NextSeo } from "next-seo";
import Register from "@/components/Register";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

export default function Booking() {
  const { currentUser, setCurrentUser } = useContext(StateContext);

  return (
    <Fragment>
      <NextSeo
        title="رزرو نوبت آنلاین"
        description="رزرو نوبت آنلاین پزشک زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outline.com",
          siteName: "Outline",
        }}
      />
      {!currentUser ? (
        <div className="register">
          <Register></Register>
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>
            <SwitchAccountIcon
              className="icon"
              onClick={() => Router.push("/portal")}
              sx={{ color: "#2d2b7f" }}
            />
          </div>
          <DatePicker />
        </div>
      )}
    </Fragment>
  );
}
