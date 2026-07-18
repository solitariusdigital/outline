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
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);

  useEffect(() => {
    setMenuMobile(false);
    setMenuDisplay(true);
    setFooterDisplay(true);
  }, []);

  useEffect(() => {
    navigationTopBar.map((nav) => {
      nav.active = false;
    });
    setNavigationTopBar([...navigationTopBar]);
  }, []);

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
                {language
                  ? "به سوی تعالی زیبایی‌شناسی"
                  : "Towards Aesthetic Transcendence"}
              </h1>
            </RevealText>
            <RevealText direction="up" delay={500}>
              <h2>
                {language
                  ? "در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه  می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن ایجاد تعادل و هماهنگی طبیعی در صورت است."
                  : "In the natural Outline method, we view the creation of beauty with precision and sensitivity. This method combines modern science with classical art, aiming to establish natural balance and harmony in the face."}
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
            <div className={classes.action}>
              <button
                style={{
                  fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
                }}
                onClick={() =>
                  Router.push(currentUser ? "/booking" : "/portal")
                }
              >
                <span>
                  {language
                    ? "امروز نوبت خود را بگیرید"
                    : "Get Your Appointment Today"}
                </span>
              </button>
            </div>
            <div className="fadeOverlayBottom"></div>
          </div>
        </section>
      </div>
    </Fragment>
  );
}
