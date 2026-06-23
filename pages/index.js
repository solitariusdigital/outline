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
      <div className={classes.container}>
        <Menu />
        <section className={classes.content}>
          <RevealText direction="up" delay={100}>
            <h1>هنر خلق زیبایی</h1>
          </RevealText>
          <RevealText direction="up" delay={150}>
            <h2>
              در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه
              می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن
              ایجاد تعادل و هماهنگی طبیعی در صورت است.
            </h2>
          </RevealText>
          <RevealText direction="up" delay={300}>
            <h1>هنر خلق زیبایی</h1>
          </RevealText>
        </section>
      </div>
    </Fragment>
  );
}
