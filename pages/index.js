import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import { NextSeo } from "next-seo";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import { RevealText } from "@/components/RevealText";
import Cover from "@/components/Cover";

export default function Home() {
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);

  useEffect(() => {
    setMenuDisplay(true);
    setFooterDisplay(true);
    setMenuMobile(false);
  }, []);

  useEffect(() => {
    navigationTopBar.map((nav) => {
      nav.active = false;
    });
    setNavigationTopBar([...navigationTopBar]);
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="اوت‌لاین"
        description="کلینیک زیبایی"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "اوت‌لاین",
          description: "کلینیک زیبایی",
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
      <div
        className={classes.container}
        style={{
          fontFamily: "Yekan-Regular",
        }}
      >
        <section>
          <Cover />
        </section>
        <section className={classes.contentBox}>
          <div className={classes.content}>
            <RevealText direction="up" delay={300}>
              <h1>مسیر شما به سوی تعالی زیبایی‌شناسی</h1>
            </RevealText>
            <RevealText direction="up" delay={500}>
              <h2>
                در متد نچرال اوت‌لاین، ما به هنر خلق زیبایی با دقت و حساسیّت
                نگاه می‌کنیم. این متد، ترکیبی از علم روز و هنر کلاسیک است که هدف
                آن ایجاد تعادل و هماهنگی طبیعی در صورت است.
              </h2>
            </RevealText>
          </div>
        </section>
        <section>
          <div className={classes.imageBox}>
            <Image
              src="https://bucket.eshareh.com/team/usr452668/img2814.jpg"
              blurDataURL="https://bucket.eshareh.com/team/usr452668/img2814.jpg"
              placeholder="blur"
              alt="image"
              layout="fill"
              objectFit="cover"
              as="image"
              priority
            />
          </div>
        </section>
      </div>
    </Fragment>
  );
}
