import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
// import dbConnect from "@/services/dbConnect";
import Router from "next/router";
import { NextSeo } from "next-seo";

export default function Home({ doctors }) {
  return (
    <Fragment>
      <NextSeo
        title="کلینیک تخصصی زیبایی بل کلاس"
        description="نگهبان زندگی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outline.com",
          siteName: "Outline",
        }}
      />
      <p>Home</p>
    </Fragment>
  );
}

// initial connection to db
// export async function getServerSideProps(context) {
//   try {
//     await dbConnect();
//     const doctors = await doctorModel.find();
//     return {
//       props: {
//         doctors: JSON.parse(JSON.stringify(doctors.slice(0, 4))),
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       notFound: true,
//     };
//   }
// }
