import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import { RevealText } from "@/components/RevealText";
import Menu from "@/components/Menu";
// import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Fragment>
      <NextSeo
        title="اوت‌لاین"
        description="کلینیک زیبایی"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "اوت‌لاین",
          description: "کلینیک زیبایی",
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
      <section className={classes.container}>
        <Menu />

        <h1>HOME PAGE</h1>
        <RevealText direction="up">
          <h2>This heading fades in from below</h2>
        </RevealText>
        <RevealText direction="up" delay={150}>
          <p>This paragraph follows 150ms later.</p>
        </RevealText>
        <RevealText direction="up" delay={300}>
          <p>This one slides in from the right.</p>
        </RevealText>
      </section>
    </Fragment>
  );
}
