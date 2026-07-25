import { useContext, Fragment, useEffect, useRef, useState } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./method.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const defaultInjections = [
  {
    item: {
      fa: "همه",
      en: "all",
    },
  },
  {
    item: {
      fa: "فیلر",
      en: "fillers",
    },
  },
  {
    item: {
      fa: "بوتاکس",
      en: "botox",
    },
  },
  {
    item: {
      fa: "مزوتراپی",
      en: "mesotherapy",
    },
  },
  {
    item: {
      fa: "جوانساز",
      en: "skin rejuvenation",
    },
  },
  {
    item: {
      fa: "پی آر پی",
      en: "PRP",
    },
  },
  {
    item: {
      fa: "آنزیم",
      en: "enzyme",
    },
  },
  {
    item: {
      fa: "سونوگرافی",
      en: "ultrasound",
    },
  },
  {
    item: {
      fa: "لیزر سرجیکال",
      en: "surgical laser",
    },
  },
  {
    item: {
      fa: "لیزر فرکشنال",
      en: "fractional laser",
    },
  },
];

export default function Method() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const [displayType, setDisplayType] = useState("all");

  const targetBox = useRef(null);

  const imagePairs = [
    {
      before: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_01.jpg",
        alt: "image",
      },
      after: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_02.jpg",
        alt: "image",
      },
      type: "botox",
    },
    {
      before: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_03.jpg",
        alt: "image",
      },
      after: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_04.jpg",
        alt: "image",
      },
      type: "fillers",
    },
    {
      before: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_01.jpg",
        alt: "image",
      },
      after: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_02.jpg",
        alt: "image",
      },
      type: "enzyme",
    },
    {
      before: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_03.jpg",
        alt: "image",
      },
      after: {
        src: "https://bucket.outlinecommunity.com/landing/IMG_04.jpg",
        alt: "image",
      },
      type: "PRP",
    },
  ];

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleType = (index) => {
    setDisplayType(defaultInjections[index].item.en);
  };

  return (
    <Fragment>
      <NextSeo
        title={language ? "متد اوت‌لاین" : "Outline Method"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/method"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/method",
          title: language ? "متد اوت‌لاین" : "Outline Method",
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
          {defaultInjections
            .map((item, index) => (
              <div
                key={index}
                className={
                  item.item.en === displayType
                    ? classes.itemActive
                    : classes.item
                }
                onClick={() => toggleType(index)}
              >
                <h4>{item.item[languageType]}</h4>
              </div>
            ))
            .slice(0, 6)}
        </div>
        <div className={classes.categorySecond} ref={targetBox}>
          {defaultInjections
            .map((item, index) => (
              <div
                key={index}
                className={
                  item.item.en === displayType
                    ? classes.itemActive
                    : classes.item
                }
                onClick={() => toggleType(index)}
              >
                <h4>{item.item[languageType]}</h4>
              </div>
            ))
            .slice(6, 11)}
        </div>
        <div className={classes.gallery}>
          {imagePairs
            .filter(
              (pair) => displayType === "all" || pair.type === displayType,
            )
            .map((pair, index) => (
              <div key={index} className={classes.pair}>
                <div className={classes.imageBox}>
                  <Image
                    src={pair.before.src}
                    blurDataURL={pair.before.src}
                    placeholder="blur"
                    alt={pair.before.alt}
                    layout="fill"
                    objectFit="cover"
                    as="image"
                  />
                </div>
                <div className={classes.imageBox}>
                  <Image
                    src={pair.after.src}
                    blurDataURL={pair.after.src}
                    placeholder="blur"
                    alt={pair.after.alt}
                    layout="fill"
                    objectFit="cover"
                    as="image"
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </Fragment>
  );
}
