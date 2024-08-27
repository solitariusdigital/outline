import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import DatePicker from "@/components/DatePicker";
import classes from "./booking.module.scss";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Router from "next/router";
import { NextSeo } from "next-seo";
import Register from "@/components/Register";

export default function Booking() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);

  const router = useRouter();

  return (
    <Fragment>
      <NextSeo
        title="رزرو مراجعه حضوری"
        description="رزرو مراجعه حضوری پزشک زیبایی"
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
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => Router.push("/portal")}
            />
          </div>
          <DatePicker />
        </div>
      )}
    </Fragment>
  );
}
