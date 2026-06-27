import React from "react";
import classes from "./Cover.module.scss";
import GridBox from "@/components/GridBox";

export default function Cover() {
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
    <div className={classes.container}>
      <div className={classes.imageBox}>
        <GridBox images={images} />
      </div>
      <div className={classes.infoBox}>
        <h1>به سوی تعالی زیبایی‌شناسی</h1>
        <h2>
          در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه
          می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن ایجاد
          تعادل و هماهنگی طبیعی در صورت است.
        </h2>
      </div>
    </div>
  );
}
