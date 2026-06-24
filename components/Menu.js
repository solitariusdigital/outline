import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import Link from "next/link";
import Router from "next/router";
import classes from "./Menu.module.scss";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Menu() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const [menuMobile, setMenuMobile] = useState(false);

  const fullSizeScreen =
    screenSize !== "mobile" && screenSize !== "tablet-portrait";

  const displayNav = fullSizeScreen
    ? navigationTopBar
    : [...navigationTopBar].reverse();

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
      {fullSizeScreen && (
        <nav className={classes.fullSizeNavigation}>
          <div className={classes.barLeft}>
            {displayNav
              .map((nav, index) => (
                <Fragment key={index}>
                  <Link
                    className={!nav.active ? classes.nav : classes.navActive}
                    onClick={() => activateNav(nav.link, index)}
                    href={nav.link}
                    passHref
                  >
                    {nav.title}
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
          <div className={classes.barRight}>
            {displayNav
              .map((nav, index) => (
                <Fragment key={index}>
                  <Link
                    className={!nav.active ? classes.nav : classes.navActive}
                    onClick={() => activateNav(nav.link, index)}
                    href={nav.link}
                    passHref
                  >
                    {nav.title}
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
            <nav className={classes.mobileNavigation}>
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
                  {nav.title}
                </Link>
              ))}
            </nav>
          )}
        </nav>
      )}
    </div>
  );
}
