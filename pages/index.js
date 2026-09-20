import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import { RevealText } from "@/components/RevealText";
import Cover from "@/components/Cover";

export default function Home() {
  const { language, setLanguage } = useContext(StateContext);

  return (
    <Fragment>
      <NextSeo
        title={language ? "اوت‌لاین" : "Outline"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: language ? "اوت‌لاین" : "Outline",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: language ? "اوت‌لاین" : "Outline",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      <div
        className={classes.container}
        style={{
          fontFamily: "Yekan-Regular",
        }}
      >
        <section>
          <Cover />
        </section>
        <section
          className={classes.contentBox}
          style={{
            fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
            direction: language ? "rtl" : "ltr",
          }}
        >
          <div className={classes.content}>
            <RevealText direction="up" delay={300}>
              <h1>
                {language ? (
                  <>
                    فلسفه متد{" "}
                    <span style={{ fontFamily: "Titillium-Light" }}>
                      Outline
                    </span>
                  </>
                ) : (
                  "The Philosophy Of The Outline Method"
                )}
              </h1>
            </RevealText>
            <RevealText direction="up" delay={500}>
              <h2>
                {language
                  ? "متد اوت‌لاین حاصل تلفیق علم روز پزشکی زیبایی، شناخت دقیق آناتومی و نگاه هنرمندانه به تناسبات چهره است. این متد به‌طور مداوم بر پایه جدیدترین مقالات علمی، تکنیک‌های نوین و تجربه بالینی به‌روزرسانی می‌شود تا درمان‌ها همواره دقیق‌تر، ایمن‌تر و طبیعی‌تر باشند."
                  : "Outline is built on the integration of advanced aesthetic medicine, anatomical precision, and artistic vision. Our approach evolves continuously through the latest scientific research, modern aesthetic techniques, and clinical experience, ensuring that every treatment remains evidence-based, safe, and naturally elegant."}
              </h2>
            </RevealText>
          </div>
        </section>
        <section>
          <div className={classes.imageBox}>
            <div className="fadeOverlayTop"></div>
            <Image
              src="https://bucket.outlinecommunity.com/resources/magnetic.jpg"
              blurDataURL="https://bucket.outlinecommunity.com/resources/magnetic.jpg"
              placeholder="blur"
              alt="Home"
              layout="fill"
              objectFit="cover"
              as="image"
              priority
            />
            <div
              className={classes.action}
              style={{
                fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
              }}
              onClick={() => Router.push("/reservation")}
            >
              <RevealText direction="up" delay={300}>
                <h2>
                  {language
                    ? "امروز نوبت خود را بگیرید"
                    : "Get Your Appointment Today"}
                </h2>
              </RevealText>
            </div>
            <div className="fadeOverlayBottom"></div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
