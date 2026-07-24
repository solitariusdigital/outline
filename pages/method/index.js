import { useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./method.module.scss";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/legacy/image";

export default function Method() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);

  return (
    <Fragment>
      <NextSeo
        title={language ? "متد اوت‌لاین" : "Method"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/method"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/method",
          title: language ? "متد اوت‌لاین" : "Method",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
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
      <section
        className={classes.container}
        style={{
          fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
          direction: language ? "rtl" : "ltr",
        }}
      >
        <div className={classes.imageBox}>
          <div className="fadeOverlayTop"></div>
          <Image
            src="https://bucket.outlinecommunity.com/resources/smoke.jpg"
            blurDataURL="https://bucket.outlinecommunity.com/resources/smoke.jpg"
            placeholder="blur"
            alt="About"
            layout="fill"
            objectFit="cover"
            as="image"
            priority
          />
          <div className={classes.title}>
            <h1>
              {language ? (
                <>
                  فلسفه متد{" "}
                  <span style={{ fontFamily: "Titillium-Light" }}>Outline</span>
                </>
              ) : (
                "The Philosophy Behind Outline"
              )}
            </h1>
            <h3
              style={{
                marginTop: language ? "0px" : "16px",
              }}
            >
              {language ? (
                <>
                  در{" "}
                  <span style={{ fontFamily: "Titillium-Light" }}>Outline</span>
                  ، زیبایی از طریق تزریق ساخته نمی‌شود بلکه از طریق طراحی خلق
                  می‌شود.
                </>
              ) : (
                "At Outline, beauty is not created through injections, it is created through design."
              )}
            </h3>
          </div>
          <div className={classes.scrollDown}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
              onClick={() => scrollToDivBox()}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
      </section>
    </Fragment>
  );
}
