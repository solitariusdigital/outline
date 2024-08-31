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
        title="اوت لاین"
        description="خدمات آنلاین"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
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
