import { useEffect, useContext, Fragment, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { NextSeo } from "next-seo";
import Router from "next/router";
import Link from "next/link";
import classes from "./contact.module.scss";
import logo from "@/assets/logo.png";
import Image from "next/legacy/image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Contact() {
  const { language, setLanguage } = useContext(StateContext);

  const targetBox = useRef(null);

  const tehranLocation =
    "https://www.google.com/maps/place/%D8%AF%DA%A9%D8%AA%D8%B1+%D9%81%D8%B1%D8%A7%D9%87%D8%A7%D9%86%DB%8C+%D8%A7%D9%88%D8%AA+%D9%84%D8%A7%DB%8C%D9%86%E2%80%AD/@35.7966147,51.425542,20.39z/data=!4m6!3m5!1s0x3f8e070074e7f933:0x1b60689649d061a8!8m2!3d35.7966208!4d51.4254661!16s%2Fg%2F11wv3h85d_?entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D";
  const kishLocation =
    "https://www.google.com/maps/place/%D8%A7%D9%88%D8%AA%E2%80%8C%D9%84%D8%A7%DB%8C%D9%86+%DA%A9%DB%8C%D8%B4%E2%80%AD/@26.5527385,54.0211711,17z/data=!4m14!1m7!3m6!1s0x3e50ab003291c53d:0x81c83549d1a6e13!2z2KfZiNiq4oCM2YTYp9uM2YYg2qnbjNi0!8m2!3d26.5527385!4d54.0211711!16s%2Fg%2F11yhhlzkdn!3m5!1s0x3e50ab003291c53d:0x81c83549d1a6e13!8m2!3d26.5527385!4d54.0211711!16s%2Fg%2F11yhhlzkdn?entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D";

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <NextSeo
        title={language ? "تماس با ما" : "Contact Us"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/contact"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/contact",
          title: language ? "تماس با ما" : "Contact Us",
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
            src="https://bucket.outlinecommunity.com/resources/atom.jpg"
            blurDataURL="https://bucket.outlinecommunity.com/resources/atom.jpg"
            placeholder="blur"
            alt="Contact"
            layout="fill"
            objectFit="cover"
            as="image"
            priority
          />
          <h1>{language ? "تماس بگیرید" : "GET IN TOUCH"}</h1>
          <div className={classes.scrollDown}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
              onClick={() => scrollToDivBox()}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.info} ref={targetBox}>
          <div className={classes.row}>
            <h3>{language ? "شعبه تهران" : "Tehran Branch"}</h3>
            <h4
              className={classes.action}
              onClick={() => window.open(tehranLocation)}
            >
              {language ? "دریافت مسیر" : "Get direction"}
            </h4>
          </div>
          <div className={classes.row}>
            <h3>{language ? "شعبه کیش" : "Kish Branch"}</h3>
            <h4
              className={classes.action}
              onClick={() => window.open(kishLocation)}
            >
              {language ? "دریافت مسیر" : "Get direction"}
            </h4>
          </div>
          <div className={classes.row}>
            <h3>{language ? "تماس" : "Phone"}</h3>
            <h4
              className={classes.action}
              style={{
                fontFamily: "Titillium-Light",
                direction: "ltr",
              }}
              onClick={() => window.open(`tel:++989333363411`, "_self")}
            >
              +98 933 336 3411
            </h4>
          </div>
          <div className={classes.row}>
            <h3>{language ? "ایمیل" : "Email"}</h3>
            <h4
              style={{
                fontFamily: "Titillium-Light",
                direction: "ltr",
              }}
            >
              info@outlinecommunity.com
            </h4>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
