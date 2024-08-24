import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Menu.module.scss";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";

export default function Menu() {
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      if (
        !window.matchMedia("(display-mode: standalone)").matches &&
        navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)/i)
      ) {
        setDesktop(true);
      }
    };
    checkDeviceType();
  }, [setDesktop]);

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

  return (
    <div className={classes.container}>
      {screenSize === "desktop" && (
        <div className={classes.largeMenu}>
          <Image
            className={classes.logo}
            width={70}
            height={70}
            src={logo}
            alt="logo"
            onClick={() => window.location.assign("/")}
            priority
          />
          <div className={classes.largeNavigation}>
            {navigationTopBar
              .map((nav, index) => (
                <Fragment key={index}>
                  <div
                    className={!nav.active ? classes.nav : classes.navActive}
                    onClick={() => activateNav(nav.link, index)}
                  >
                    <p>{nav.title}</p>
                  </div>
                </Fragment>
              ))
              .reverse()}
          </div>
        </div>
      )}
      {screenSize !== "desktop" && (
        <div className={classes.smallMenu}>
          <div className={classes.topBar}>
            <Image
              className={classes.logo}
              width={70}
              height={70}
              src={logo}
              alt="logo"
              onClick={() => window.location.assign("/")}
              priority
            />
            {menuMobile ? (
              <CloseIcon
                className={classes.menuIcon}
                onClick={() => setMenuMobile(!menuMobile)}
                sx={{ fontSize: 30 }}
              />
            ) : (
              <MenuIcon
                className={classes.menuIcon}
                onClick={() => setMenuMobile(!menuMobile)}
                sx={{ fontSize: 30 }}
              />
            )}
          </div>
          {menuMobile && (
            <Fragment>
              <div
                className={`${classes.menuMobile} animate__animated animate__slideInDown`}
              >
                <div>
                  {navigationTopBar.map((nav, index) => (
                    <Fragment key={index}>
                      <div
                        className={
                          !nav.active ? classes.nav : classes.navActive
                        }
                        onClick={() => activateNav(nav.link, index)}
                      >
                        <p>{nav.title}</p>
                      </div>
                    </Fragment>
                  ))}
                  {desktop && (
                    <div className={classes.nav}>
                      <p
                        onClick={() => {
                          Router.push("/download");
                          setMenuMobile(false);
                        }}
                      >
                        راهنمای نصب
                      </p>
                    </div>
                  )}
                </div>
                <div className={classes.buttons}>
                  <button
                    onClick={() => {
                      Router.push("/doctors");
                      setMenuMobile(false);
                    }}
                  >
                    رزرو مراجعه حضوری
                  </button>
                  <button
                    onClick={() => {
                      Router.push("/assessment");
                      setMenuMobile(false);
                    }}
                  >
                    مشاوره آنلاین رایگان
                  </button>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
}
