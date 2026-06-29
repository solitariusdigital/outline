import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Footer.module.scss";
import Link from "next/link";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "@/assets/logo.png";
import Image from "next/legacy/image";

export default function Footer() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { selectBranch, setSelectBranch } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);

  const fullSizeScreen = screenSize !== "mobile";

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
    <div
      className={classes.container}
      style={{
        fontFamily: "Yekan-Regular",
      }}
    >
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
        <h4>ما را در شبکه‌های اجتماعی دنبال کنید</h4>
        <InstagramIcon
          className={classes.icon}
          sx={{ fontSize: 32 }}
          onClick={() =>
            window.open(
              "https://www.instagram.com/dr.farahani.outline",
              "_ self",
            )
          }
        />
      </div>
      <div className={classes.bookingContainer}>
        <nav className={classes.booking}>
          <div className={classes.link}>
            <Link
              href={currentUser ? "/booking" : "/portal"}
              onClick={() => {
                setSelectDoctor("دکتر فراهانی");
                setSelectBranch("tehran");
              }}
            >
              نوبت دکتر فراهانی
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
              نوبت دکتر گنجه
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
              نوبت دکتر پورقلی
            </Link>
          </div>
        </nav>
        <nav className={classes.booking}>
          {navigationTopBar
            .map((nav, index) => (
              <div key={index} className={classes.link}>
                <Link
                  className={!nav.active ? classes.nav : classes.navActive}
                  onClick={() => activateNav(nav.link, index)}
                  href={nav.link}
                  passHref
                >
                  {nav.title}
                </Link>
              </div>
            ))
            .slice(0, 2)
            .reverse()}
        </nav>
        <nav className={classes.booking}>
          {navigationTopBar
            .map((nav, index) => (
              <div key={index} className={classes.link}>
                <Link
                  className={!nav.active ? classes.nav : classes.navActive}
                  onClick={() => activateNav(nav.link, index)}
                  href={nav.link}
                  passHref
                >
                  {nav.title}
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
