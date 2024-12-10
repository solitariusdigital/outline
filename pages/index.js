import { useContext, Fragment, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./home.module.scss";
import Image from "next/legacy/image";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import { updateControlApi, getControlsApi } from "@/services/api";

export default function Home({ activeVisits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const [hideBooking, setHideBooking] = useState(true);
  const [checkType, setCheckType] = useState("checkin" || "checkout");
  const [checkDatesComplete, setCheckDatesComplete] = useState(false);

  const locationLink =
    "https://www.google.com/maps/place/35%C2%B047'47.0%22N+51%C2%B025'32.1%22E/@35.7963889,51.4249382,19z/data=!3m1!4b1!4m4!3m3!8m2!3d35.7963889!4d51.4255833?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D";
  const router = useRouter();

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
          (visit) => visit.userId === _id && !visit.completed && !visit.canceled
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
      const currentDate = getCurrentDate();
      const currentUserId = currentUser["_id"];
      // Retrieve timesheets for the current user
      const userTimesheets = getTimesheets(controlData, currentUserId);
      // Check if check-in and check-out for today are complete
      const todayTimesheet = userTimesheets[currentUserId]?.find(
        (entry) => entry.date === currentDate
      );
      if (todayTimesheet) {
        const isCheckDatesComplete = Object.values(
          todayTimesheet.timesheet
        ).every((value) => value !== null);
        setCheckDatesComplete(isCheckDatesComplete);
      }
      // Determine if there's an existing entry for the current user
      const existingEntryIndex = findExistingEntry(
        userTimesheets,
        currentUserId
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
      (entry) => entry.date === getCurrentDate()
    );
  };

  const getCurrentDateTime = async () => {
    setCheckDatesComplete(true);
    const currentDate = getCurrentDate();
    const currentTime = getCurrentTime();
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
        existingEntryIndex
      );
    }

    await updateControlData(controlData, timesheets);
    router.replace(router.asPath);
  };

  const handleCheckIn = async (
    currentDate,
    currentTime,
    timesheets,
    userId
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
    entryIndex
  ) => {
    const confirm = window.confirm("ثبت ساعت خروج؟");
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
      address
    );
    setCheckDatesComplete(true);
    window.alert("ساعت خروج ثبت شد");
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
    address
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

  const getCurrentDate = () => {
    const now = new Date();
    const date = now.toLocaleDateString("fa-IR", {
      timeZone: "Asia/Tehran",
    });
    return date;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("fa-IR", {
      timeZone: "Asia/Tehran",
      hour12: false,
    });
    return time;
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
        navigatorOptions
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
      <section className={classes.container}>
        <div className={classes.logo}>
          <Image width={200} height={140} src={logo} alt="logo" priority />
          <h2>طراحی چهره</h2>
        </div>
        <section className={classes.navigation}>
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
              پورتال نوبت‌ها
            </div>
          )}
          {!hideBooking && (
            <Fragment>
              <div
                className={classes.fillNav}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر فراهانی");
                }}
              >
                نوبت دکتر فراهانی
              </div>
              <div
                className={classes.fillNav}
                onClick={() => {
                  Router.push(currentUser ? "/booking" : "/portal");
                  setSelectDoctor("دکتر گنجه");
                }}
              >
                نوبت دکتر گنجه
              </div>
            </Fragment>
          )}
          <div className={classes.nav} onClick={() => Router.push("/about")}>
            فلسفه متد اوت‌لاین
          </div>
          <div
            className={classes.nav}
            onClick={() => window.open(locationLink)}
          >
            آدرس کلینیک
          </div>
          <div
            className={classes.nav}
            onClick={() =>
              window.open("https://wa.me/message/XPZYUKX6KF7LD1", "_ self")
            }
          >
            تماس با ما
          </div>
          {(currentUser?.super || currentUser?.access) && (
            <div
              className={classes.fillNav}
              onClick={() => Router.push("/manager")}
            >
              مدیریت
            </div>
          )}
          {!checkDatesComplete &&
            (currentUser?.permission === "admin" ||
              currentUser?.permission === "staff") && (
              <div
                className={classes.checkType}
                onClick={() => getCurrentDateTime()}
                style={{
                  background: checkType === "checkin" ? "#15b392" : "#d40d12",
                }}
              >
                {checkType === "checkin" ? "ثبت ساعت ورود" : "ثبت ساعت خروج"}
              </div>
            )}
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

export async function getServerSideProps(context) {
  try {
    await dbConnect();

    let visits = await visitModel.find();
    let activeVisits = visits.filter(
      (visit) => !visit.completed && !visit.canceled
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
