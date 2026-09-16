import { useContext, Fragment, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./about.module.scss";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/legacy/image";
import { applyFontToEnglishWords } from "@/services/utility";

export default function About() {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);

  const targetBox = useRef(null);

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const texts = [
    {
      fa: "در متد Outline، هدف از تزریق تغییر چهره نیست؛ هدف، درک ساختار چهره و بازگرداندن تناسب میان اجزای آن است.",
      en: "In the Outline method, the goal of the injection is not to change the face; the goal is to understand the structure of the face and restore proportion among its features.",
    },
    {
      fa: "هر چهره معماری منحصربه‌فرد خود را دارد. فرم استخوان‌ها، توزیع بافت نرم، لیگامان‌ها، نسبت اجزای صورت و حتی نحوه حرکت عضلات، در شکل‌گیری هویت ظاهری یک فرد نقش دارند. به همین دلیل، در Outline یک الگوی ثابت برای تمام چهره‌ها وجود ندارد.",
      en: "Every face has its own unique architecture. The shape of the bones, the distribution of soft tissue, the ligaments, the proportions of facial features, and even the way the muscles move all play a role in shaping a person's outward identity. For this reason, there is no fixed template for all faces in Outline.",
    },
    {
      fa: "ما صورت را مجموعه‌ای از نواحی جداگانه نمی‌بینیم. شقیقه، میدفیس، لب، چانه و خط فک بخش‌هایی از یک ساختار سه‌بعدی و به‌هم‌پیوسته‌اند؛ تغییری کوچک در یک ناحیه می‌تواند بر درک ما از تناسب کل چهره تأثیر بگذارد.",
      en: "We do not view the face as a collection of separate regions. The temple, midface, lips, chin, and jawline are parts of a single three-dimensional, interconnected structure; a small change in one area can affect our perception of the proportion of the entire face.",
    },
    {
      fa: "به همین دلیل، پیش از هر تزریق این سؤال مطرح می‌شود:",
      en: "For this reason, before any injection, this question arises:",
    },
    {
      fa: "چهره واقعاً به چه تغییری نیاز دارد؟",
      en: "What change does the face truly need?",
    },
    {
      fa: "گاهی پاسخ اضافه کردن حجم است، گاهی ایجاد ساپورت، گاهی بازتعریف یک کانتور و گاهی بهترین تصمیم، تزریق نکردن یک ناحیه است.",
      en: "Sometimes the answer is adding volume, sometimes creating support, sometimes redefining a contour, and sometimes the best decision is not injecting an area at all.",
    },
    {
      fa: "هدف نهایی Outline ساختن یک چهره جدید نیست؛ بلکه رسیدن به نسخه‌ای متعادل‌تر، جوان‌تر و همچنان قابل‌شناسایی از همان چهره است.",
      en: "The ultimate goal of Outline is not to create a new face; rather, it is to achieve a more balanced, younger, and still recognizable version of the same face.",
    },
  ];

  return (
    <Fragment>
      <NextSeo
        title={language ? "درباره ما" : "About Us"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/about"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/about",
          title: language ? "درباره ما" : "About Us",
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
            src="https://bucket.outlinecommunity.com/resources/atomic.jpg"
            blurDataURL="https://bucket.outlinecommunity.com/resources/atomic.jpg"
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
                "The philosophy of the Outline method"
              )}
            </h1>
          </div>
          <div className={classes.scrollDown} onClick={() => scrollToDivBox()}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.box} ref={targetBox}>
          <div className={classes.content}>
            {texts
              .map((text, index) => (
                <h3
                  className={classes.text}
                  key={index}
                  style={{
                    fontFamily: language ? "Yekan-Light" : "Titillium-Thin",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: applyFontToEnglishWords(
                      text[languageType],
                      "Titillium-Thin",
                      languageType,
                    ),
                  }}
                ></h3>
              ))
              .slice(0, 3)}
          </div>
          <div className={classes.imageBox}>
            <div className="fadeOverlayTop"></div>
            <Image
              src="https://bucket.outlinecommunity.com/resources/stone.jpg"
              blurDataURL="https://bucket.outlinecommunity.com/resources/stone.jpg"
              placeholder="blur"
              alt="About"
              layout="fill"
              objectFit="cover"
              as="image"
              priority
            />
            <div className="fadeOverlayBottom"></div>
          </div>
        </div>
        <div className={classes.box}>
          <div className={classes.imageBox}>
            <div className="fadeOverlayTop"></div>
            <Image
              src="https://bucket.outlinecommunity.com/resources/atom.jpg"
              blurDataURL="https://bucket.outlinecommunity.com/resources/atom.jpg"
              placeholder="blur"
              alt="About"
              layout="fill"
              objectFit="cover"
              as="image"
              priority
            />
            <div className="fadeOverlayBottom"></div>
          </div>
          <div className={classes.content}>
            {texts
              .map((text, index) => (
                <h3
                  className={classes.text}
                  key={index}
                  style={{
                    fontFamily: language ? "Yekan-Light" : "Titillium-Thin",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: applyFontToEnglishWords(
                      text[languageType],
                      "Titillium-Thin",
                      languageType,
                    ),
                  }}
                ></h3>
              ))
              .slice(3, 7)}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
