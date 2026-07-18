import { useContext, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Cover.module.scss";
import GridBox from "@/components/GridBox";

export default function Cover() {
  const { language, setLanguage } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);

  const images = [
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_01.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_02.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_03.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_04.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_05.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_06.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_07.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_08.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_09.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_10.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_12.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_13.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_14.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_15.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_16.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_17.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_18.jpg",
      alt: "image",
    },
    {
      src: "https://bucket.outlinecommunity.com/landing/IMG_19.jpg",
      alt: "image",
    },
  ];

  useEffect(() => {}, [screenSize]);

  return (
    <div className={language ? classes.container : classes.containerReverse}>
      <div className={classes.imageBox}>
        <div className="fadeOverlayTop"></div>
        <GridBox images={images} screenSize={screenSize} />
        <div className="fadeOverlayBottom"></div>
      </div>
      <div
        className={classes.infoBox}
        style={{
          fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
          direction: language ? "rtl" : "ltr",
        }}
      >
        <h1>
          {language
            ? "به سوی تعالی زیبایی‌شناسی"
            : "Towards Aesthetic Transcendence"}
        </h1>
        <h2>
          {language
            ? "در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه  می‌کنیم."
            : "In the natural Outline method, we view the creation of beauty with precision and sensitivity."}
        </h2>
      </div>
    </div>
  );
}
