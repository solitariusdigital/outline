import { useContext, Fragment, useEffect, useRef, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { NextSeo } from "next-seo";
import classes from "./method.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getProcessApi, deleteProcessApi } from "@/services/api";

const processTypes = [
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
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const [displayType, setDisplayType] = useState("all");
  const [displayProcess, setDisplayProcess] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const fullSizeScreen = screenSize === "desktop";

  const targetBox = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let process = await getProcessApi();
        console.log(process);
        setDisplayProcess(process);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    let confirmationMessage = "حذف مطمئنی؟";
    let confirm = window.confirm(confirmationMessage);
    if (confirm) {
      await deleteProcessApi(id);
      setRefresh((prev) => prev + 1);
    }
  };

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleType = (index) => {
    setDisplayType(processTypes[index].item.en);
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
          direction: "ltr",
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
          {processTypes
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
        <div className={classes.categorySecond}>
          {processTypes
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
          {displayProcess
            .filter(
              (pair) => displayType === "all" || pair.category === displayType,
            )
            .map((pair, index) => (
              <div
                key={index}
                className={classes.pair}
                onMouseEnter={() => setHoveredId(pair._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {currentUser?.super && (
                  <div className={classes.control}>
                    <Tooltip title="Delete">
                      <DeleteOutlineIcon
                        className="icon"
                        sx={{ fontSize: 20, color: "white" }}
                        onClick={() => handleDelete(pair._id)}
                      />
                    </Tooltip>
                  </div>
                )}
                <div className={classes.imageBoxBefore}>
                  <Image
                    src={pair.media[1].link}
                    blurDataURL={pair.media[1].link}
                    placeholder="blur"
                    alt={pair.category}
                    layout="fill"
                    objectFit="cover"
                    as="image"
                  />
                </div>
                <div className={classes.imageBoxAfter}>
                  <Image
                    src={pair.media[0].link}
                    blurDataURL={pair.media[0].link}
                    placeholder="blur"
                    alt={pair.category}
                    layout="fill"
                    objectFit="cover"
                    as="image"
                  />
                </div>
                {(pair.title || pair.description) && (
                  <>
                    {fullSizeScreen && hoveredId === pair._id && (
                      <div
                        className={classes.overlay}
                        style={{
                          fontFamily: "Yekan-Regular",
                        }}
                      >
                        <h2>{pair.title}</h2>
                        <p>{pair.description}</p>
                      </div>
                    )}
                    {!fullSizeScreen && (
                      <div
                        className={classes.overlay}
                        style={{
                          fontFamily: "Yekan-Regular",
                        }}
                      >
                        <h2>{pair.title}</h2>
                        <p>{pair.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      </section>
    </Fragment>
  );
}
