import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";
import classes from "./Menu.module.scss";
import Image from "next/legacy/image";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import secureLocalStorage from "react-secure-storage";

export default function Menu() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const [menuMobile, setMenuMobile] = useState(false);

  const router = useRouter();
  let pathname = router.pathname;

  const isHome = pathname === "/";
  const fullSizeScreen = screenSize !== "mobile";
  const colorCode = isHome ? "white" : "black";

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

  const logout = async () => {
    try {
      await signOut(auth);
      secureLocalStorage.removeItem("currentUser");
      setCurrentUser(null);
      Router.push("/");
    } catch (error) {
      console.error("Logout error - " + (error.message || "Unknown error"));
    }
  };

  return (
    <div
      className={classes.container}
      style={{
        fontFamily: "OpenSansRegular",
      }}
    >
      <div className={classes.logo}>
        {/* <Link href="/" passHref>
          <Image
            src={isHome ? logoWhite : logoBlack}
            layout="fill"
            objectFit="contain"
            alt="logo"
            as="image"
            priority
          />
        </Link> */}
      </div>
      {currentUser && (
        <div className={classes.portal}>
          <Tooltip title="Logout">
            <LogoutIcon
              className="icon"
              sx={{ fontSize: 18, color: colorCode }}
              onClick={() => logout()}
            />
          </Tooltip>
          <Tooltip title="Portal">
            <SpaceDashboardIcon
              className="icon"
              sx={{ fontSize: 18, color: colorCode }}
              onClick={() => {
                Router.push("/portal");
              }}
            />
          </Tooltip>
        </div>
      )}
      {fullSizeScreen ? (
        <nav
          className={classes.fullSizeNavigation}
          style={{
            color: colorCode,
          }}
        >
          {navigationTopBar.map((nav, index) => (
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
          ))}
        </nav>
      ) : (
        <nav>
          {menuMobile ? (
            <Tooltip title="Close">
              <CloseIcon
                className="icon"
                onClick={() => setMenuMobile(!menuMobile)}
                sx={{ fontSize: 30, color: colorCode }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Menu">
              <MenuIcon
                className="icon"
                onClick={() => setMenuMobile(!menuMobile)}
                sx={{ fontSize: 30, color: colorCode }}
              />
            </Tooltip>
          )}
          {menuMobile && (
            <nav
              className={`${classes.mobileNavigation} animate__animated animate__slideInLeft`}
            >
              {navigationTopBar.map((nav, index) => (
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
              ))}
            </nav>
          )}
        </nav>
      )}
    </div>
  );
}
