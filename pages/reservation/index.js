import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import Link from "next/link";
import classes from "./reservation.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import { updateControlApi, getControlsApi } from "@/services/api";
import { getCurrentDateFarsi, getCurrentTimeFarsi } from "@/services/utility";

export default function Reservation({ activeVisits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { selectBranch, setSelectBranch } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const [hideBooking, setHideBooking] = useState(true);
  const [checkType, setCheckType] = useState("checkin" || "checkout");
  const [checkDatesComplete, setCheckDatesComplete] = useState(false);
  const [displayReception, setDisplayReception] = useState(false);

  const router = useRouter();

  const isUserAuthorized =
    currentUser?.permission === "admin" || currentUser?.permission === "staff";
  const pourGholiText = ["نوبت دکتر پورقلی", "متخصص پوست"];
  const kishText = ["شعبه کیش", "به‌زودی برمیگردیم"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setMenuDisplay(false);
    setFooterDisplay(false);
    setMenuMobile(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % pourGholiText.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUserVisits = async () => {
      if (!currentUser) {
        setHideBooking(false);
        return;
      }
      const { permission, _id } = currentUser;
      if (permission === "doctor") {
        setHideBooking(true);
        return;
      }
      if (permission === "patient" || permission === "staff") {
        const hasActiveVisit = activeVisits.some(
          (visit) =>
            visit.userId === _id && !visit.completed && !visit.canceled,
        );
        setHideBooking(hasActiveVisit);
      } else {
        setHideBooking(false);
      }
    };
    handleUserVisits();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const handleUserVisits = async () => {
      // Fetch control data from the API
      const controlData = await getControlsApi();
      setDisplayReception(controlData[0].reception);
      const currentDate = getCurrentDateFarsi();
      const currentUserId = currentUser["_id"];
      // Retrieve timesheets for the current user
      const userTimesheets = getTimesheets(controlData, currentUserId);
      // Check if check-in and check-out for today are complete
      const todayTimesheet = userTimesheets[currentUserId]?.find(
        (entry) => entry.date === currentDate,
      );
      if (todayTimesheet) {
        const isCheckDatesComplete = Object.values(
          todayTimesheet.timesheet,
        ).every((value) => value !== null);
        setCheckDatesComplete(isCheckDatesComplete);
      }
      // Determine if there's an existing entry for the current user
      const existingEntryIndex = findExistingEntry(
        userTimesheets,
        currentUserId,
      );
      const checkType = existingEntryIndex === -1 ? "checkin" : "checkout";
      setCheckType(checkType);
    };
    if (
      currentUser.permission === "admin" ||
      currentUser.permission === "staff"
    ) {
      handleUserVisits();
    }
  }, []);

  const getTimesheets = (controlData, userId) => {
    let timesheets = controlData[0].timesheets || {};
    if (!timesheets[userId]) {
      timesheets[userId] = [];
    }
    return timesheets;
  };

  const findExistingEntry = (timesheets, userId) => {
    return timesheets[userId].findIndex(
      (entry) => entry.date === getCurrentDateFarsi(),
    );
  };

  const getCurrentDateTime = async () => {
    setCheckDatesComplete(true);
    const currentDate = getCurrentDateFarsi();
    const currentTime = getCurrentTimeFarsi();
    const controlData = await getControlsApi();
    const currentUserId = currentUser["_id"];
    const timesheets = getTimesheets(controlData, currentUserId);
    const existingEntryIndex = findExistingEntry(timesheets, currentUserId);

    if (existingEntryIndex === -1) {
      await handleCheckIn(currentDate, currentTime, timesheets, currentUserId);
    } else {
      await handleCheckOut(
        currentTime,
        timesheets,
        currentUserId,
        existingEntryIndex,
      );
    }

    await updateControlData(controlData, timesheets);
    router.replace(router.asPath);
  };

  const handleCheckIn = async (
    currentDate,
    currentTime,
    timesheets,
    userId,
  ) => {
    const confirm = window.confirm("ثبت ساعت ورود؟");
    if (!confirm) {
      setCheckDatesComplete(false);
      return;
    }

    const address = await getUserLocation();
    const newTimesheet = createNewTimesheet(currentDate, currentTime, address);
    timesheets[userId].push(newTimesheet);
    setCheckType("checkout");
    setCheckDatesComplete(false);
    window.alert("ساعت ورود ثبت شد");
  };

  const handleCheckOut = async (
    currentTime,
    timesheets,
    userId,
    entryIndex,
  ) => {
    const confirm = window.confirm("ثبت ساعت اضافه کار؟");
    if (!confirm) {
      setCheckDatesComplete(false);
      return;
    }

    const address = await getUserLocation();
    updateExistingTimesheet(
      timesheets,
      userId,
      entryIndex,
      currentTime,
      address,
    );
    setCheckDatesComplete(true);
    window.alert("ساعت اضافه کار ثبت شد");
  };

  const getUserLocation = async () => {
    const apiAddress = await getLocation();
    return apiAddress
      ? `${apiAddress.neighbourhood} ${apiAddress.road}`
      : "مکان ثبت نشده";
  };

  const createNewTimesheet = (date, time, address) => ({
    date,
    timesheet: {
      checkIn: time,
      checkOut: null,
    },
    address: {
      checkIn: address,
      checkOut: null,
    },
  });

  const updateExistingTimesheet = (
    timesheets,
    userId,
    entryIndex,
    currentTime,
    address,
  ) => {
    timesheets[userId][entryIndex].timesheet.checkOut = currentTime;
    timesheets[userId][entryIndex].address.checkOut = address;
  };

  const updateControlData = async (controlData, timesheets) => {
    const controlObject = {
      ...controlData[0],
      timesheets: {
        ...timesheets,
      },
    };
    await updateControlApi(controlObject);
  };

  const navigatorOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000,
  };
  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        window.alert("موقعیت جغرافیایی توسط مرورگر شما پشتیبانی نمی شود");
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const address = await success(pos);
            resolve(address);
          } catch (error) {
            resolve(null);
          }
        },
        (err) => {
          errorHandler(err);
          resolve(null);
        },
        navigatorOptions,
      );
    });
  };

  const success = async (pos) => {
    const crd = pos.coords;
    const getAddress = await getAddressApi(crd.latitude, crd.longitude);
    return getAddress;
  };

  const errorHandler = (err) => {
    let errorMessage;
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = "کاربر درخواست موقعیت جغرافیایی را رد کرد";
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = "اطلاعات مکان در دسترس نیست";
        break;
      case err.TIMEOUT:
        errorMessage =
          "زمان درخواست برای دریافت موقعیت مکانی کاربر به پایان رسیده است";
        break;
      case err.UNKNOWN_ERROR:
        errorMessage = "یک خطای ناشناخته رخ داد";
        break;
      default:
        errorMessage = "هنگام بازیابی مکان خطایی رخ داد";
    }
    window.alert(errorMessage);
  };

  const getAddressApi = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        return {
          neighbourhood: data.address.neighbourhood
            ? data.address.neighbourhood
            : "-",
          road: data.address.road ? data.address.road : "-",
        };
      } else {
        window.alert("خطا در بازیابی داده");
      }
    } catch (error) {
      window.alert("خطای شبکه");
    }
  };

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
              <div className={classes.row}>
                <div
                  className={classes.fillNav}
                  style={{
                    width: "49%",
                  }}
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
                  style={{
                    width: "49%",
                  }}
                  onClick={() => {
                    Router.push(currentUser ? "/booking" : "/portal");
                    setSelectDoctor("دکتر گنجه");
                    setSelectBranch("tehran");
                  }}
                >
                  نوبت دکتر گنجه
                </div>
              </div>
              <div className={classes.row}>
                <div
                  className={classes.fillNav}
                  style={{
                    width: "49%",
                  }}
                  onClick={() => {
                    Router.push(currentUser ? "/booking" : "/portal");
                    setSelectDoctor("دکتر پورقلی");
                    setSelectBranch("tehran");
                  }}
                >
                  {pourGholiText[index]}
                </div>
                <div
                  className={classes.nav}
                  style={{
                    width: "49%",
                  }}
                  // onClick={() => {
                  //   Router.push(currentUser ? "/booking" : "/portal");
                  //   setSelectDoctor("دکتر فراهانی");
                  //   setSelectBranch("kish");
                  // }}
                >
                  {kishText[index]}
                </div>
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
          {!checkDatesComplete && !currentUser?.super && isUserAuthorized && (
            <div
              className={classes.checkType}
              onClick={() => getCurrentDateTime()}
              style={{
                background: checkType === "checkin" ? "#15b392" : "#d40d12",
              }}
            >
              {checkType === "checkin" ? "ثبت ساعت ورود" : "ثبت ساعت اضافه کار"}
            </div>
          )}
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
