import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import Register from "@/components/Register";
import { NextSeo } from "next-seo";

export default function Index() {
  const { currentUser, setCurrentUser } = useContext(StateContext);

  return (
    <Fragment>
      <NextSeo
        title="خدمات آنلاین اوت لاین"
        description="رزرو نوبت آنلاین"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outline.com",
          siteName: "Outline",
        }}
      />
      {!currentUser && (
        <div className="register">
          <Register></Register>
        </div>
      )}
    </Fragment>
  );
}
