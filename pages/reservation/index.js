import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import Link from "next/link";
import classes from "./reservation.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import Timesheet from "@/components/Timesheet";
import { getControlsApi } from "@/services/api";

export default function Reservation({ activeVisits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { selectBranch, setSelectBranch } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const [hideBooking, setHideBooking] = useState(true);
  const [displayReception, setDisplayReception] = useState(false);

  const isUserAuthorized =
    currentUser?.permission === "admin" || currentUser?.permission === "staff";

  useEffect(() => {
    setMenuMobile(true);
    setTimeout(() => {
      setMenuDisplay(false);
      setFooterDisplay(false);
    }, 100);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const handleUserVisits = async () => {
      if (!currentUser) {
        setHideBooking(false);
        return;
      }

      const { permission, _id } = currentUser;

      switch (permission) {
        case "admin": {
          setHideBooking(false);
          try {
            const controlData = await getControlsApi();
            if (isCurrent && controlData?.[0]) {
              setDisplayReception(controlData[0].reception);
            }
          } catch (err) {
            console.error("Failed to fetch controls:", err);
          }
          break;
        }
        case "doctor": {
          setHideBooking(true);
          break;
        }
        case "patient":
        case "staff": {
          const hasActiveVisit = activeVisits.some(
            (visit) =>
              visit.userId === _id && !visit.completed && !visit.canceled,
          );
          setHideBooking(hasActiveVisit);
          break;
        }
        default:
          setHideBooking(false);
      }
    };
    handleUserVisits();

    return () => {
      isCurrent = false;
    };
  }, [currentUser, activeVisits]);

  // useEffect(() => {
  //   const handleCronReminder = async () => {
  //     try {
  //       const now = new Date();
  //       if (now.getUTCHours() < 8) return;

  //       const alreadySent = await checkReminderFutureSent();
  //       if (alreadySent) return;

  //       const res = await fetch("/api/cron/reminder");
  //       if (res.ok) {
  //         const controlData = await getControlsApi();
  //         const currentDate = getCurrentDateFarsi();
  //         const controlObject = {
  //           ...controlData[0],
  //           reminderFuture: {
  //             ...controlData[0].reminderFuture,
  //             [currentDate]: true,
  //           },
  //         };
  //         await updateControlApi(controlObject);
  //       } else {
  //         console.error("Cron reminder endpoint failed:", res.status);
  //       }
  //     } catch (err) {
  //       console.error("handleCronReminder failed:", err);
  //     }
  //   };
  //   if (isUserAuthorized) {
  //     handleCronReminder();
  //   }
  // }, []);

  // const checkReminderFutureSent = async () => {
  //   try {
  //     const controlData = await getControlsApi();
  //     const currentDate = getCurrentDateFarsi();
  //     return controlData?.[0]?.reminderFuture?.[currentDate] === true;
  //   } catch (err) {
  //     console.error("checkReminderFutureSent failed:", err);
  //     return true;
  //   }
  // };

  return (
    <Fragment>
      <NextSeo
        title={language ? "پورتال" : "Portal"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/reservation"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/reservation",
          title: language ? "پورتال" : "Portal",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
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
      <section className={classes.container}>
        <div className={classes.logo}>
          <Link href="/" passHref>
            <Image width={200} height={140} src={logo} alt="logo" priority />
          </Link>
        </div>
        <div className={classes.navigation}>
          {currentUser && currentUser?.permission !== "reception" && (
            <div
              className={classes.nav}
              onClick={() =>
                Router.push({
                  pathname: `/portal/${currentUser.permission}`,
                  query: { id: currentUser["_id"], p: currentUser.permission },
                })
              }
            >
              پورتال نوبت‌
            </div>
          )}
          {(currentUser?.permission === "admin" ||
            currentUser?.permission === "doctor") && (
            <div className={classes.row}>
              <div
                className={classes.nav}
                style={{
                  width: "49%",
                }}
                onClick={() => Router.push("/portal/reception")}
              >
                پورتال پذیرش
              </div>
              {currentUser?.super ? (
                <div
                  className={classes.fillNav}
                  style={{
                    width: "49%",
                  }}
                  onClick={() => Router.push("/manager")}
                >
                  مدیریت
                </div>
              ) : (
                <div
                  className={classes.fillNav}
                  style={{
                    width: "49%",
                  }}
                  onClick={() => Router.push("/manager")}
                >
                  پرونده بیمار
                </div>
              )}
            </div>
          )}
          {currentUser?.permission === "admin" && (
            <div
              className={classes.nav}
              onClick={() => Router.push("/followup")}
            >
              Follow Up نوبت
            </div>
          )}
          {!hideBooking && currentUser?.permission !== "reception" && (
            <Fragment>
              <div
                className={classes.fillNav}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر فراهانی");
                  setSelectBranch("tehran");
                }}
              >
                نوبت دکتر فراهانی
              </div>
              <div
                className={classes.fillNav}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر گنجه");
                  setSelectBranch("tehran");
                }}
              >
                نوبت دکتر گنجه
              </div>
              <div
                className={classes.fillNav}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر پورقلی");
                  setSelectBranch("tehran");
                }}
              >
                نوبت دکتر پورقلی - متخصص پوست
              </div>
            </Fragment>
          )}
          {(displayReception || currentUser?.permission === "reception") && (
            <div
              className={classes.fillNav}
              onClick={() => Router.push("/reception")}
            >
              پذیرش
            </div>
          )}
          <div
            className={classes.nav}
            onClick={() =>
              window.open("https://wa.me/message/XPZYUKX6KF7LD1", "_ self")
            }
          >
            تماس
          </div>
          {/* {!currentUser?.super && isUserAuthorized && <Timesheet />} */}
        </div>
      </section>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();

    let visits = await visitModel.find();
    let activeVisits = visits.filter(
      (visit) => !visit.completed && !visit.canceled,
    );

    return {
      props: {
        activeVisits: JSON.parse(JSON.stringify(activeVisits)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
