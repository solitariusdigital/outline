import { useContext, Fragment, useEffect, useState, useRef } from "react";
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
      fa: "ما معتقدیم هر چهره، ترکیبی منحصربه‌فرد از آناتومی، نور، سایه، حجم، کیفیت پوست و حالات چهره است. به همین دلیل، هیچ نسخه یکسانی برای همه افراد وجود ندارد. هر صورت، داستان خود را دارد و وظیفه ما، بازطراحی آن بر اساس همان ویژگی‌های منحصربه‌فرد است؛ نه تغییر هویت آن.",
      en: "We believe that every face is a unique composition of anatomy, light, shadow, volume, skin quality, and facial expression. No two faces age the same way, and no two treatment plans should ever be identical. Every face tells its own story, and our role is not to change that story, but to refine and reveal its most balanced, natural version.",
    },
    {
      fa: "متد Outline حاصل تلفیق علم روز پزشکی زیبایی، شناخت دقیق آناتومی و نگاه هنرمندانه به تناسبات چهره است. این متد به‌طور مداوم بر پایه جدیدترین مقالات علمی، تکنیک‌های نوین و تجربه بالینی به‌روزرسانی می‌شود تا درمان‌ها همواره دقیق‌تر، ایمن‌تر و طبیعی‌تر باشند.",
      en: "Outline is built on the integration of advanced aesthetic medicine, anatomical precision, and artistic vision. Our approach evolves continuously through the latest scientific research, modern aesthetic techniques, and clinical experience, ensuring that every treatment remains evidence-based, safe, and naturally elegant.",
    },
    {
      fa: "الهام ما از هنر کلاسیک است؛ از هنرمندانی مانند لئوناردو داوینچی، میکل‌آنژ و پیکاسو که زیبایی را در تناسب، هارمونی و جزئیات می‌دیدند. همان‌گونه که یک اثر هنری با اصلاح هوشمندانه جزئیات کامل می‌شود، در Outline نیز تغییرات کوچک اما دقیق، می‌توانند چهره‌ای متعادل‌تر، جوان‌تر و طبیعی‌تر خلق کنند.",
      en: "Our philosophy is inspired by the timeless principles of classical art. Masters such as Leonardo da Vinci, Michelangelo, and Pablo Picasso understood that true beauty lies in harmony, proportion, and thoughtful attention to detail. In the same way, Outline focuses on subtle, intentional refinements that collectively create a more youthful, balanced, and authentic appearance.",
    },
    {
      fa: "در فلسفه Outline، پیری تنها به معنای از دست رفتن حجم نیست. با افزایش سن، جایگاه بافت‌ها تغییر می‌کند، فت‌پدها تحلیل می‌روند، لیگامان‌ها ضعیف می‌شوند، کیفیت پوست کاهش پیدا می‌کند و الگوی انعکاس نور روی صورت تغییر می‌کند. به همین دلیل، جوانسازی واقعی باید همه این لایه‌ها را در کنار هم درمان کند.",
      en: "We do not see facial aging as a simple loss of volume. Aging is a dynamic process involving the descent of facial tissues, fat pad atrophy, ligament laxity, declining skin quality, and changes in the way light interacts with the face. For this reason, genuine facial rejuvenation requires a comprehensive understanding of every layer contributing to the aging process.",
    },
    {
      fa: "ما ابتدا ساختار و مسیرهای لیفت را طراحی می‌کنیم، سپس کمبود حجم‌ها را به‌صورت هدفمند اصلاح می‌کنیم و در ادامه، با کمک بایواستیمولاتورها، اسکین‌بوسترها و لیزر، کیفیت پوست را بازسازی می‌کنیم. این رویکرد، همان چیزی است که ما آن را جوانسازی لایه‌لایه می‌نامیم.",
      en: "Our treatments begin by restoring structural support and redefining facial lifting vectors. Volume is then replaced only where it has been anatomically lost. Finally, regenerative therapies, biostimulators, skin boosters, and advanced laser technologies are used to improve skin quality and complete the rejuvenation process. We refer to this philosophy as layer-by-layer rejuvenation.",
    },
    {
      fa: "یکی از اصول اساسی Outline، مینیمالیسم است. ما باور داریم زیبایی با حجم بیشتر ایجاد نمی‌شود؛ بلکه با شناخت صحیح آناتومی، هدایت نور و سایه، و حفظ هویت چهره شکل می‌گیرد. هدف ما این نیست که دیگران متوجه تزریق شوند؛ هدف این است که بگویند: «چقدر شاداب‌تر و زیباتر شده‌ای.»",
      en: "Minimalism is one of the defining principles of Outline. We believe beauty is never achieved through excessive volume, but through precise anatomical planning, intelligent facial contouring, and the careful orchestration of light and shadow. The goal is never for people to notice the treatment itself; the goal is for them to notice that you simply look healthier, more refreshed, and naturally beautiful.",
    },
    {
      fa: "در Outline، هر برنامه درمانی کاملاً شخصی‌سازی می‌شود. آنالیز سه‌بعدی چهره، کیفیت پوست، الگوی پیری، نسبت‌های صورت و اهداف هر فرد، مسیر درمان را مشخص می‌کنند. به همین دلیل، هیچ دو طراحی چهره‌ای در Outline شبیه یکدیگر نیست.",
      en: "Every treatment at Outline is fully personalized. Facial anatomy, aging patterns, skin quality, proportions, and each patient's aesthetic goals are carefully analyzed before a treatment plan is designed. No two faces are alike, and neither are our results.",
    },
    {
      fa: "‏Outline فقط یک تکنیک نیست؛ یک فلسفه است.",
      en: "Outline is more than a technique, it is a philosophy.",
    },
    {
      fa: "‏فلسفه‌ای که باور دارد زیبایی، حاصل هماهنگی میان آناتومی، ساختار، کیفیت پوست، علم و هنر است؛ و هر انسان، شایسته آن است که بدون از دست دادن هویت خود، بهترین نسخه از چهره‌اش را داشته باشد.‏‏‏‏",
      en: "A philosophy that believes true beauty is created through the harmony of anatomy, structure, skin quality, science, and art. Every individual deserves to become the finest version of themselves while preserving the unique identity that makes them who they are.",
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
        <div className={classes.box} ref={targetBox}>
          <div className={classes.content}>
            {texts
              .map((text, index) => (
                <p
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
                ></p>
              ))
              .slice(0, 4)}
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
                <p
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
                ></p>
              ))
              .slice(4, 9)}
          </div>
        </div>
      </section>
    </Fragment>
  );
}
