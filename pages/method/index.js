import { useContext, Fragment, useEffect, useRef, useState } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./method.module.scss";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/legacy/image";

const defaultInjections = [
  {
    item: {
      fa: "همه",
      en: "All",
    },
    active: false,
  },
  {
    item: {
      fa: "فیلر",
      en: "Fillers",
    },
    active: false,
  },
  {
    item: {
      fa: "بوتاکس",
      en: "Botox",
    },
    active: false,
  },
  {
    item: {
      fa: "مزوتراپی",
      en: "Mesotherapy",
    },
    active: false,
  },
  {
    item: {
      fa: "جوانساز",
      en: "Skin Rejuvenation",
    },
    active: false,
  },
  {
    item: {
      fa: "فیلر",
      en: "filler",
    },
    active: false,
  },
  {
    item: {
      fa: "پی آر پی",
      en: "PRP",
    },
    active: false,
  },
  {
    item: {
      fa: "آنزیم",
      en: "Enzyme",
    },
    active: false,
  },
  {
    item: {
      fa: "سونوگرافی",
      en: "Ultrasound",
    },
    active: false,
  },
  {
    item: {
      fa: "لیزر سرجیکال",
      en: "Surgical Laser",
    },
    active: false,
  },
  {
    item: {
      fa: "لیزر فرکشنال",
      en: "Fractional Laser",
    },
    active: false,
  },
];

export default function Method() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const [injections, setInjections] = useState(defaultInjections);

  const targetBox = useRef(null);

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleType = (index) => {
    setInjections((prev) =>
      prev.map((item, i) => ({
        ...item,
        active: i === index,
      })),
    );
  };

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
            <h1>{language ? "زیبایی" : "Method"}</h1>
            <h2
              style={{
                marginTop: language ? "0px" : "16px",
              }}
            >
              {language ? "زیبایی" : "Method"}
            </h2>
          </div>
          <div className={classes.scrollDown} onClick={() => scrollToDivBox()}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.category} ref={targetBox}>
          {injections
            .map((item, index) => (
              <div
                key={index}
                className={item.active ? classes.itemActive : classes.item}
                onClick={() => toggleType(index)}
              >
                <h3>{item.item[languageType]}</h3>
              </div>
            ))
            .slice(0, 6)}
        </div>
        <div className={classes.categorySecond} ref={targetBox}>
          {injections
            .map((item, index) => (
              <div
                key={index}
                className={item.active ? classes.itemActive : classes.item}
                onClick={() => toggleType(index)}
              >
                <h3>{item.item[languageType]}</h3>
              </div>
            ))
            .slice(6, 11)}
        </div>
      </section>
    </Fragment>
  );
}
