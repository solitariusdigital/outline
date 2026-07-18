import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Footer.module.scss";
import Link from "next/link";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "@/assets/logoWhite.png";
import Image from "next/legacy/image";

export default function Footer() {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { selectBranch, setSelectBranch } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);

  const activateNav = (link, index) => {
    setMenuMobile(false);
    navigationTopBar.map((nav, i) => {
      if (link === nav.link) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
  };

  return (
    <div
      className={classes.container}
      style={{
        fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
      }}
    >
      <div className={classes.logoContainer}>
        <div className={classes.logo}>
          <Link href="/" passHref>
            <Image
              src={logo}
              layout="fill"
              objectFit="contain"
              alt="logo"
              as="image"
              priority
            />
          </Link>
        </div>
        <div className={classes.social}>
          <InstagramIcon
            className={classes.icon}
            sx={{ fontSize: 24 }}
            onClick={() =>
              window.open(
                "https://www.instagram.com/dr.farahani.outline",
                "_ self",
              )
            }
          />
          <h4>{language ? "ما را دنبال کنید" : "Follow us"}</h4>
        </div>
      </div>
      <div className={classes.bookingContainer}>
        <nav
          className={classes.booking}
          style={{
            direction: language ? "rtl" : "ltr",
          }}
        >
          <div className={classes.link}>
            <Link
              href={currentUser ? "/booking" : "/portal"}
              onClick={() => {
                setSelectDoctor("دکتر فراهانی");
                setSelectBranch("tehran");
              }}
            >
              {language ? "نوبت دکتر فراهانی" : "Dr. Farahani's Appointment"}
            </Link>
          </div>
          <div className={classes.link}>
            <Link
              href={currentUser ? "/booking" : "/portal"}
              passHref
              onClick={() => {
                setSelectDoctor("دکتر گنجه");
                setSelectBranch("tehran");
              }}
            >
              {language ? "نوبت دکتر گنجه" : "Dr. Ganjeh's Appointment"}
            </Link>
          </div>
          <div className={classes.link}>
            <Link
              href={currentUser ? "/booking" : "/portal"}
              onClick={() => {
                setSelectDoctor("دکتر پورقلی");
                setSelectBranch("tehran");
              }}
            >
              {language ? "نوبت دکتر پورقلی" : "Dr. Pourgholi's Appointment"}
            </Link>
          </div>
        </nav>
        <nav
          className={classes.booking}
          style={{
            direction: language ? "rtl" : "ltr",
          }}
        >
          {navigationTopBar
            .map((nav, index) => (
              <div key={index} className={classes.link}>
                <Link
                  className={!nav.active ? classes.nav : classes.navActive}
                  onClick={() => activateNav(nav.link, index)}
                  href={nav.link}
                  passHref
                >
                  {nav.title[languageType]}
                </Link>
              </div>
            ))
            .slice(0, 2)
            .reverse()}
        </nav>
        <nav
          className={classes.booking}
          style={{
            direction: language ? "rtl" : "ltr",
          }}
        >
          {navigationTopBar
            .map((nav, index) => (
              <div key={index} className={classes.link}>
                <Link
                  className={!nav.active ? classes.nav : classes.navActive}
                  onClick={() => activateNav(nav.link, index)}
                  href={nav.link}
                  passHref
                >
                  {nav.title[languageType]}
                </Link>
              </div>
            ))
            .slice(2, 5)
            .reverse()}
        </nav>
      </div>
    </div>
  );
}
