import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Home() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);

  const locationLink = "https://maps.app.goo.gl/YcgjcmkzrKNbEdCF8";

  return (
    <Fragment>
      <NextSeo
        title="اوت لاین"
        description="کلینیک زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
        }}
      />
      <section className={classes.container}>
        <div className={classes.logo}>
          <Image width={200} height={140} src={logo} alt="logo" priority />
          <h2>طراح چهره</h2>
        </div>
        <section className={classes.navigation}>
          <div
            className={classes.doctor}
            onClick={() => {
              Router.push(currentUser ? "/booking" : "/portal");
              setSelectDoctor("دکتر فراهانی");
            }}
          >
            دکتر فراهانی
          </div>
          <div
            className={classes.doctor}
            onClick={() => {
              Router.push(currentUser ? "/booking" : "/portal");
              setSelectDoctor("دکتر گنجه");
            }}
          >
            دکتر گنجه
          </div>
          {currentUser && (
            <div
              className={classes.nav}
              onClick={() =>
                Router.push({
                  pathname: `/portal/${currentUser.permission}`,
                  query: { id: currentUser["_id"], p: currentUser.permission },
                })
              }
            >
              پورتال
            </div>
          )}
          <div
            className={classes.nav}
            onClick={() => window.open(locationLink)}
          >
            آدرس کلینیک
          </div>
          <div
            className={classes.nav}
            onClick={() => window.open("tel:+989106100914", "_self")}
          >
            تماس با ما
          </div>
        </section>
        <div>
          <InstagramIcon
            className="icon"
            sx={{ color: "#2d2b7f" }}
            onClick={() =>
              window.open(
                "https://www.instagram.com/dr.farahani.outline",
                "_ self"
              )
            }
          />
        </div>
      </section>
    </Fragment>
  );
}
