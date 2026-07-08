import { useEffect, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import Router from "next/router";
import Link from "next/link";
import classes from "./Menu.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logoWhite.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";

export default function Menu() {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);

  const fullSizeScreen =
    screenSize !== "mobile" && screenSize !== "tablet-portrait";

  const displayNav = fullSizeScreen
    ? navigationTopBar
    : [...navigationTopBar].reverse();

  useEffect(() => {
    if (menuMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuMobile]);

  const activateNav = (link, index) => {
    setMenuMobile(false);
    navigationTopBar.map((nav, i) => {
      if (i === index) {
        Router.push(link);
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
  };

  const toggleLanguage = () => {
    setLanguage(!language);
    setLanguageType(!language ? "fa" : "en");
    secureLocalStorage.setItem("languageBrowser", language);
  };

  return (
    <div
      className={classes.container}
      style={{
        fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
      }}
    >
      {fullSizeScreen && (
        <nav className={classes.fullSizeNavigation}>
          <div className={classes.bar}>
            <p
              className={classes.toggleLanguage}
              onClick={() => toggleLanguage()}
              style={{
                fontFamily: !language ? "Yekan-Regular" : "Titillium-Light",
              }}
            >
              {!language ? "فارسی" : "English"}
            </p>
            {displayNav
              .map((nav, index) => (
                <Fragment key={index}>
                  <Link
                    className={!nav.active ? classes.nav : classes.navActive}
                    onClick={() => activateNav(nav.link, index)}
                    href={nav.link}
                    passHref
                  >
                    {nav.title[languageType]}
                  </Link>
                </Fragment>
              ))
              .slice(0, 2)}
          </div>
        </nav>
      )}
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
      {fullSizeScreen && (
        <nav
          className={classes.fullSizeNavigation}
          style={{
            flexDirection: "row-reverse",
          }}
        >
          <div className={classes.bar}>
            {displayNav
              .map((nav, index) => (
                <Fragment key={index}>
                  <Link
                    className={!nav.active ? classes.nav : classes.navActive}
                    onClick={() => activateNav(nav.link, index)}
                    href={nav.link}
                    passHref
                  >
                    {nav.title[languageType]}
                  </Link>
                </Fragment>
              ))
              .slice(2, 5)}
          </div>
        </nav>
      )}
      {!fullSizeScreen && (
        <nav>
          {menuMobile ? (
            <CloseIcon
              className="iconSite"
              onClick={() => setMenuMobile(!menuMobile)}
              sx={{ fontSize: 30 }}
            />
          ) : (
            <MenuIcon
              className="iconSite"
              onClick={() => setMenuMobile(!menuMobile)}
              sx={{ fontSize: 30 }}
            />
          )}
          {menuMobile && (
            <nav
              className={classes.mobileNavigation}
              style={{
                fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
              }}
            >
              {displayNav.map((nav, index) => (
                <Link
                  key={nav.link}
                  href={nav.link}
                  className={nav.active ? classes.navActive : classes.nav}
                  style={{
                    animationDelay: `${index * 180}ms`,
                  }}
                  onClick={() => activateNav(nav.link, index)}
                >
                  {nav.title[languageType]}
                </Link>
              ))}
              <p
                className={classes.nav}
                style={{
                  animationDelay: `${displayNav.length * 180}ms`,
                  fontFamily: !language ? "Yekan-Regular" : "Titillium-Light",
                  fontSize: "large",
                }}
                onClick={() => toggleLanguage()}
              >
                {!language ? "فارسی" : "English"}
              </p>
            </nav>
          )}
        </nav>
      )}
    </div>
  );
}
