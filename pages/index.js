import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";

export default function Home() {
  const { currentUser, setCurrentUser } = useContext(StateContext);

  const locationLink =
    "https://www.google.com/maps/place/Eshareh+Advertising+Agency/@35.7743132,51.3941519,17z/data=!4m6!3m5!1s0x3f8e0651f88334cf:0xbf2b6076f1e9fc52!8m2!3d35.7746884!4d51.3941131!16s%2Fg%2F1tg6j0hh?entry=ttu";

  return (
    <Fragment>
      <NextSeo
        title="کلینیک تخصصی زیبایی اوت لاین"
        description="نگهبان زندگی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outline.com",
          siteName: "Outline",
        }}
      />
      <section className={classes.container}>
        <div>
          <Image width={150} height={150} src={logo} alt="logo" priority />
        </div>
        <section className={classes.navigation}>
          <div
            className={classes.nav}
            onClick={() => Router.push(currentUser ? "/booking" : "/portal")}
          >
            رزرو نوبت آنلاین
          </div>
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
              پورتال
            </div>
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
      </section>
    </Fragment>
  );
}
