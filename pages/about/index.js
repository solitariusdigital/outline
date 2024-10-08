import { Fragment } from "react";
import classes from "./about.module.scss";
import logo from "@/assets/logo.png";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";

export default function About() {
  return (
    <Fragment>
      <NextSeo
        title="اوت‌لاین"
        description="فلسفه متد اوت‌لاین"
        canonical="https://outlinecommunity.com/about"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/about",
          title: "اوت‌لاین",
          description: "فلسفه متد اوت‌لاین",
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
      <div className={classes.container}>
        <HomeIcon onClick={() => Router.push("/")} className="icon" />
        <p className={classes.text}>
          در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت نگاه
          می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف آن ایجاد
          تعادل و هماهنگی طبیعی در صورت است. ما باور داریم که هر چهره داستان خاص
          خود را دارد و با کمک به روزترین مقالات علمی در زمینه کازمتیک، این
          داستان را به بهترین شکل روایت می‌کنیم.
        </p>
        <p className={classes.text}>
          با الهام از آثار بزرگانی چون داوینچی، پیکاسو و میکل‌آنژ، ما به دنبال
          خلق زیبایی‌ای هستیم که در آن جزئیات کوچک با دقت و ظرافت اصلاح شوند تا
          به یک کلیت زیبا و هماهنگ برسیم. این متد، نوعی طراحی مینیمال است که در
          آن هر نقص صورت به طبیعی‌ترین شکل ممکن اصلاح می‌شود. هدف ما از متد
          نچرال اوت‌لاین، جوانسازی چهره و به تعویق انداختن پیری است. ما به
          زیبایی طبیعی و بدون اغراق معتقدیم و به کمک این متد، به دنبال آن هستیم
          که نه تنها چهره را جوان‌تر کنیم، بلکه آن را به شکلی طبیعی و متعادل‌تر
          به نمایش بگذاریم.
        </p>
        <div className={classes.logo}>
          <Image width={200} height={140} src={logo} alt="logo" priority />
        </div>
        <p>
          ما به شما این اطمینان را می‌دهیم که در متد نچرال اوت‌لاین، هر قدم از
          فرآیند با استفاده از بهترین مواد و تجهیزات به‌روز و تحت نظارت متخصصین
          با تجربه انجام می‌شود. این روش برای کسانی طراحی شده که می‌خواهند به
          شکلی طبیعی و با کمترین تغییرات ممکن، زیبایی و جوانی خود را بازیابند.
          ما در متد نچرال اوت‌لاین به هر پیشنت به عنوان یک فرد منحصر به فرد نگاه
          می‌کنیم و معتقدیم که زیبایی هر فرد نیز منحصر به فرد است. به همین دلیل،
          هر برنامه تزریقی با دقت بر اساس ویژگی‌های چهره‌ی فرد و نیازهای او
          طراحی می‌شود.
        </p>
        <p className={classes.text}>
          این تجربه‌ی شخصی‌سازی شده، باعث می‌شود هر فرد با اطمینان از اینکه
          بهترین نسخه از خود را تجربه می‌کند، به ما مراجعه کند. این فلسفه برند،
          تعهد ما به دقت، ظرافت، هنر و اعتماد را نشان می‌دهد و بیانگر این است که
          هر فرد شایسته است تا با حفظ شخصیت و ویژگی‌های منحصربه‌فرد خود،
          زیباترین نسخه از خود را ببیند. ما با افتخار در خدمت شما هستیم تا این
          زیبایی طبیعی را به شما هدیه دهیم.
        </p>
      </div>
    </Fragment>
  );
}
