import { useContext, Fragment, useEffect, useState, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./about.module.scss";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Image from "next/legacy/image";

export default function About() {
  const { language, setLanguage } = useContext(StateContext);

  const targetBox = useRef(null);

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            src="https://bucket.outlinecommunity.com/resources/wave.jpg"
            blurDataURL="https://bucket.outlinecommunity.com/resources/wave.jpg"
            placeholder="blur"
            alt="About"
            layout="fill"
            objectFit="cover"
            as="image"
            priority
          />
          <h1 onClick={() => scrollToDivBox()}>
            {language ? "داستان ما" : "WHO WE ARE"}
          </h1>
          <div className={classes.scrollDown}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 40, color: "white" }}
              onClick={() => scrollToDivBox()}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.content} ref={targetBox}>
          <h3 className={classes.text}>
            {language
              ? "در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن ایجاد تعادل و هماهنگی طبیعی در صورت است. ما باور داریم که هر چهره داستان خاص خود را دارد و با کمک به روزترین مقالات علمی در زمینه کازمتیک، این داستان را به بهترین شکل روایت می‌کنیم."
              : "In the Natural Outline Method, we look at the art of creating beauty with precision and sensitivity. This method is a combination of modern science and classical art, aimed at creating natural balance and harmony in the face. We believe that every face has its own unique story, and with the help of the most up-to-date scientific articles in the field of cosmetics, we tell this story in the best possible way."}
          </h3>
          <h3 className={classes.text}>
            {language
              ? "با الهام از آثار بزرگانی چون داوینچی، پیکاسو و میکل‌آنژ، ما به دنبال خلق زیبایی‌ای هستیم که در آن جزئیات کوچک با دقت و ظرافت اصلاح شوند تا به یک کلیت زیبا و هماهنگ برسیم. این متد، نوعی طراحی مینیمال است که در آن هر نقص صورت به طبیعی‌ترین شکل ممکن اصلاح می‌شود. هدف ما از متد نچرال اوت‌لاین، جوانسازی چهره و به تعویق انداختن پیری است. ما به زیبایی طبیعی و بدون اغراق معتقدیم و به کمک این متد، به دنبال آن هستیم که نه تنها چهره را جوان‌تر کنیم، بلکه آن را به شکلی طبیعی و متعادل‌تر به نمایش بگذاریم."
              : "Inspired by the works of great masters such as Da Vinci, Picasso, and Michelangelo, we seek to create a beauty in which small details are corrected with precision and delicacy to achieve a beautiful and harmonious whole. This method is a kind of minimal design in which every facial flaw is corrected in the most natural way possible. Our goal with the Natural Outline Method is facial rejuvenation and delaying aging. We believe in natural, non-exaggerated beauty, and through this method, we seek not only to make the face look younger, but also to present it in a more natural and balanced way."}
          </h3>
          <h3 className={classes.text}>
            {language
              ? "ما به شما این اطمینان را می‌دهیم که در متد نچرال اوت‌لاین، هر قدم از فرآیند با استفاده از بهترین مواد و تجهیزات به‌روز و تحت نظارت متخصصین با تجربه انجام می‌شود. این روش برای کسانی طراحی شده که می‌خواهند به شکلی طبیعی و با کمترین تغییرات ممکن، زیبایی و جوانی خود را بازیابند. ما در متد نچرال اوت‌لاین به هر بیمار به عنوان یک فرد منحصر به فرد نگاه می‌کنیم و معتقدیم که زیبایی هر فرد نیز منحصر به فرد است. به همین دلیل، هر برنامه تزریقی با دقت بر اساس ویژگی‌های چهره‌ی فرد و نیازهای او طراحی می‌شود."
              : "We assure you that in the Natural Outline Method, every step of the process is carried out using the best and most up-to-date materials and equipment, under the supervision of experienced specialists. This method is designed for those who want to restore their beauty and youth naturally, with the fewest possible changes. In the Natural Outline Method, we view every patient as a unique individual, and we believe that each person's beauty is unique as well. For this reason, every injection plan is carefully designed based on the individual's facial features and needs."}
          </h3>
          <h3 className={classes.text}>
            {language
              ? "این تجربه‌ی شخصی‌سازی شده، باعث می‌شود هر فرد با اطمینان از اینکه بهترین نسخه از خود را تجربه می‌کند، به ما مراجعه کند. این فلسفه برند، تعهد ما به دقت، ظرافت، هنر و اعتماد را نشان می‌دهد و بیانگر این است که هر فرد شایسته است تا با حفظ شخصیت و ویژگی‌های منحصربه‌فرد خود، زیباترین نسخه از خود را ببیند. ما با افتخار در خدمت شما هستیم تا این زیبایی طبیعی را به شما هدیه دهیم."
              : "This personalized experience gives each person confidence that they are experiencing the best version of themselves when they come to us. This brand philosophy reflects our commitment to precision, delicacy, art, and trust, and expresses the belief that every person deserves to see the most beautiful version of themselves while preserving their unique personality and features. We are proud to serve you in offering this natural beauty as a gift."}
          </h3>
        </div>
      </section>
    </Fragment>
  );
}
