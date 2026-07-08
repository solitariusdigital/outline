import { useContext } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Cover.module.scss";
import GridBox from "@/components/GridBox";

export default function Cover() {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);

  const images = [
    {
      src: "https://bucket.eshareh.com/team/usr452668/img2814.jpg",
      alt: "Mountain landscape",
    },
    {
      src: "https://bucket.eshareh.com/team/usr323364/img5231.jpg",
      alt: "Ocean sunset",
    },
    {
      src: "https://bucket.eshareh.com/team/usr125640/img6465.jpg",
      alt: "Forest path",
    },
    {
      src: "https://bucket.eshareh.com/team/usr970670/img8076.jpg",
      alt: "City skyline",
    },
    {
      src: "https://bucket.eshareh.com/team/usr187950/img5846.jpg",
      alt: "Desert dunes",
    },
    {
      src: "https://bucket.eshareh.com/team/usr452668/img2814.jpg",
      alt: "Mountain landscape",
    },
    {
      src: "https://bucket.eshareh.com/team/usr549643/img4268.jpg",
      alt: "Ocean sunset",
    },
    {
      src: "https://bucket.eshareh.com/team/usr399542/img4821.jpg",
      alt: "Forest path",
    },
    {
      src: "https://bucket.eshareh.com/team/usr938232/img9905.jpg",
      alt: "City skyline",
    },
    {
      src: "https://bucket.eshareh.com/team/usr357488/img8276.jpg",
      alt: "Desert dunes",
    },
    {
      src: "https://bucket.eshareh.com/team/usr409362/img9633.jpg",
      alt: "City skyline",
    },
    {
      src: "https://bucket.eshareh.com/team/usr406827/img4026.jpg",
      alt: "Desert dunes",
    },
  ];

  return (
    <div className={language ? classes.container : classes.containerReverse}>
      <div className={classes.imageBox}>
        <GridBox images={images} />
      </div>
      <div
        className={classes.infoBox}
        style={{
          fontFamily: language ? "Yekan-Regular" : "Titillium-Regular",
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
            ? "در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه  می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن ایجاد تعادل و هماهنگی طبیعی در صورت است."
            : "In the Natural Outline method, we view the creation of beauty with precision and sensitivity. This method combines modern science with classical art, aiming to establish natural balance and harmony in the face."}
        </h2>
      </div>
    </div>
  );
}
