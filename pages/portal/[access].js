import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./portal.module.scss";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import RefreshIcon from "@mui/icons-material/Refresh";
import Router from "next/router";
import ModeIcon from "@mui/icons-material/Mode";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import { NextSeo } from "next-seo";
import { getSingleVisitApi, updateVisitApi } from "@/services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Kavenegar from "kavenegar";
import logo from "@/assets/logo.png";
import {
  convertDate,
  filterVisitsByDate,
  toEnglishNumber,
  isEnglishNumber,
  getCurrentDate,
} from "@/services/utility";

export default function Access({
  visits,
  activeVisits,
  users,
  visitsData,
  activeCount,
  completeCount,
  cancelCount,
  todayCount,
  tomorrowCount,
  afterTomorrowCount,
}) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { notification, setNotification } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const { adminColorCode, setAdminColorCode } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);
  const [filterVisits, setFilterVisits] = useState([]);
  const [phone, setPhone] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [reqNumber, setReqNumber] = useState(50);
  const [visitTypes, setVisitTypes] = useState(
    "active" ||
      "all" ||
      "today" ||
      "tomorrow" ||
      "afterTomorrow" ||
      "complete" ||
      "cancel"
  );

  const router = useRouter();
  const targetDivRef = useRef(null);

  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    } else {
      setDisplayVisits(visitsData);
      setFilterVisits(
        visitsData.filter((visit) => !visit.completed && !visit.canceled)
      );
    }
  }, [currentUser, visits]);

  useEffect(() => {
    setNotification(checkAllVisitsForPast(activeVisits));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
  });

  const margin = {
    marginBottom: "8px",
  };
  const canceleStyle = {
    border: "1px solid #d40d12",
    borderRadius: "12px",
  };

  const loadMore = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.scrollingElement.scrollHeight
    ) {
      setReqNumber(reqNumber + 50);
    }
  };

  const scrollToDiv = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const actionVisit = async (id, phone, time, type) => {
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    const message = `${
      type === "complete" ? "تکمیل نوبت، مطمئنی؟" : "لغو نوبت، مطمئنی؟"
    }`;
    const template = `${
      type === "complete" ? "completeOutline" : "cancelOutline"
    }`;
    const confirm = window.confirm(message);
    if (confirm) {
      let visitData = await getSingleVisitApi(id);
      switch (type) {
        case "complete":
          visitData.completed = true;
          break;
        case "cancel":
          visitData.canceled = true;
          break;
      }
      api.VerifyLookup(
        {
          receptor: phone,
          token: time.split(" - ")[0].trim(),
          template: template,
        },
        function (response, status) {}
      );
      await updateVisitApi(visitData);
      router.replace(router.asPath);
    }
  };

  const sendAfterTomorrowReminder = () => {
    const confirmationMessage = "ارسال پیامک گروهی، مطمئنی؟";
    const confirm = window.confirm(confirmationMessage);
    const afterTomorrowVisits = filterVisitsByDate(displayVisits, 2);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    if (confirm) {
      afterTomorrowVisits.forEach((visit, index) => {
        api.VerifyLookup(
          {
            receptor: visit.user.phone,
            token: visit.time.split(" - ")[0].trim(),
            token2: visit.time.split(" - ")[1].trim(),
            template: "reminderOutline",
          },
          (response, status) => {
            if (index === afterTomorrowVisits.length - 1) {
              if (status === 200) {
                window.alert("پیامک گروهی ارسال شد");
              } else {
                window.alert("خطا در ارسال پیامک");
              }
            }
          }
        );
      });
    }
  };

  const logOut = () => {
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const expandInformation = (id) => {
    setExpandedItem(id);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  const filterDoctorsVisits = (doctor) => {
    switch (visitTypes) {
      case "active":
        setFilterVisits(
          displayVisits.filter(
            (visit) =>
              visit.doctor === doctor && !visit.completed && !visit.canceled
          )
        );
        break;
      case "today":
        setFilterVisits(
          filterVisitsByDate(displayVisits).filter(
            (visit) => visit.doctor === doctor
          )
        );
        break;
      case "tomorrow":
        setFilterVisits(
          filterVisitsByDate(displayVisits, 1).filter(
            (visit) => visit.doctor === doctor
          )
        );
        break;
      case "afterTomorrow":
        setFilterVisits(
          filterVisitsByDate(displayVisits, 2).filter(
            (visit) => visit.doctor === doctor
          )
        );
        break;
    }
  };

  const filterDisplayVisits = (type) => {
    setVisitTypes(type);
    scrollToDiv();
    switch (type) {
      case "all":
        setFilterVisits(displayVisits);
        break;
      case "active":
        setFilterVisits(
          displayVisits.filter((visit) => !visit.completed && !visit.canceled)
        );
        break;
      case "today":
        setFilterVisits(filterVisitsByDate(displayVisits));
        break;
      case "tomorrow":
        setFilterVisits(filterVisitsByDate(displayVisits, 1));
        break;
      case "afterTomorrow":
        setFilterVisits(filterVisitsByDate(displayVisits, 2));
        break;
      case "complete":
        setFilterVisits(displayVisits.filter((visit) => visit.completed));
        break;
      case "cancel":
        setFilterVisits(displayVisits.filter((visit) => visit.canceled));
        break;
    }
  };

  const checkAllVisitsForPast = (activeVisits) => {
    let currentDate = getCurrentDate();
    return activeVisits.some((visit) => {
      const visitDate = new Date(visit.date);
      // Set the visit date to midnight for comparison
      visitDate.setHours(0, 0, 0, 0);
      // Check if the visit date is older than today and not completed or canceled
      return visitDate < currentDate;
    });
  };

  const checkEachVisitForPast = (index) => {
    let currentDate = getCurrentDate();
    const visit = filterVisits[index];
    const visitDate = new Date(visit.date);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate < currentDate;
  };

  const cancelAllPastVisits = () => {
    setDisableButton(true);
    let currentDate = getCurrentDate();
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    const confirmationMessage = " لغو نوبت‌های گذشته، مطمئنی؟";
    const confirm = window.confirm(confirmationMessage);
    if (confirm) {
      displayVisits
        .filter((visit) => !visit.completed && !visit.canceled)
        .forEach(async (visit) => {
          const visitDate = new Date(visit.date);
          if (visitDate < currentDate) {
            visit.canceled = true;
            api.VerifyLookup({
              receptor: visit.user.phone,
              token: visit.time.split(" - ")[0].trim(),
              template: "cancelOutline",
            });
            await updateVisitApi(visit);
          }
        });
      router.reload();
    } else {
      setDisableButton(false);
    }
  };

  return (
    <Fragment>
      <NextSeo
        title="پورتال بیمار"
        description="پورتال بیمار"
        canonical="https://outlinecommunity.com"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          title: "پورتال بیمار",
          description: "پورتال بیمار",
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
      {currentUser && (
        <div className={classes.container}>
          {currentUser.permission === "admin" && notification && (
            <div className={classes.notification}>
              <button
                disabled={disableButton}
                onClick={() => cancelAllPastVisits()}
              >
                نوبت روز قبل فعال
              </button>
            </div>
          )}
          <div className={classes.header}>
            <HomeIcon onClick={() => Router.push("/")} className="icon" />
            <h3>{currentUser.name ? currentUser.name : currentUser.phone}</h3>
            {currentUser.permission === "patient" && <Person4Icon />}
            {currentUser.permission === "doctor" && <LocalHospitalIcon />}
            {currentUser.permission === "admin" && (
              <MilitaryTechIcon
                sx={{ color: adminColorCode[currentUser["_id"]] }}
              />
            )}
          </div>
          <div className={classes.portal}>
            <div className={classes.analytics}>
              <h4>نوبت‌ها</h4>
              {currentUser.permission === "admin" && (
                <div className={classes.refresh}>
                  <RefreshIcon
                    className="icon"
                    onClick={() => {
                      router.reload();
                    }}
                  />
                </div>
              )}
              {currentUser.permission === "admin" && (
                <div className={classes.row}>
                  <p>
                    {
                      users.filter((user) => user.permission === "patient")
                        .length
                    }
                  </p>
                  <p
                    className={
                      visitTypes === "all" ? classes.itemActive : classes.item
                    }
                    onClick={() => {
                      filterDisplayVisits("all");
                    }}
                  >
                    بیمارها
                  </p>
                </div>
              )}
              <Fragment>
                <div className={classes.row}>
                  <p>{activeCount}</p>
                  <p
                    className={
                      visitTypes === "active"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      filterDisplayVisits("active");
                    }}
                  >
                    فعال
                  </p>
                </div>
                {(currentUser.permission === "admin" ||
                  currentUser.permission === "doctor") && (
                  <Fragment>
                    <div className={classes.row}>
                      <p>{todayCount}</p>
                      <p
                        className={
                          visitTypes === "today"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          filterDisplayVisits("today");
                        }}
                      >
                        امروز
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p>{tomorrowCount}</p>
                      <p
                        className={
                          visitTypes === "tomorrow"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          filterDisplayVisits("tomorrow");
                        }}
                      >
                        فردا
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p>{afterTomorrowCount}</p>
                      <p
                        className={
                          visitTypes === "afterTomorrow"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          filterDisplayVisits("afterTomorrow");
                        }}
                      >
                        پس‌فردا
                      </p>
                    </div>
                  </Fragment>
                )}
                <div className={classes.row}>
                  <p>{completeCount}</p>
                  <p
                    className={
                      visitTypes === "complete"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      filterDisplayVisits("complete");
                    }}
                  >
                    تکمیل شده
                  </p>
                </div>
                <div className={classes.row}>
                  <p>{cancelCount}</p>
                  <p
                    className={
                      visitTypes === "cancel"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      filterDisplayVisits("cancel");
                    }}
                  >
                    لغو شده
                  </p>
                </div>
                <div className={classes.logout} onClick={() => logOut()}>
                  <p>خروج از پورتال</p>
                </div>
              </Fragment>
            </div>
            {(currentUser.permission === "admin" ||
              displayVisits.filter(
                (visit) => !visit.completed && !visit.canceled
              ).length === 0) &&
              visitTypes !== "afterTomorrow" && (
                <div className={classes.buttonContainer}>
                  <button
                    className={classes.booking}
                    onClick={() => {
                      Router.push("/booking");
                      setSelectDoctor("دکتر فراهانی");
                    }}
                  >
                    دکتر فراهانی
                  </button>
                  <button
                    className={classes.booking}
                    onClick={() => {
                      Router.push("/booking");
                      setSelectDoctor("دکتر گنجه");
                    }}
                  >
                    دکتر گنجه
                  </button>
                </div>
              )}
            {currentUser.permission === "patient" &&
              displayVisits.filter(
                (visit) => !visit.completed && !visit.canceled
              ).length > 0 && (
                <div className={classes.message}>
                  <p className={classes.text}>شما یک نوبت فعال دارید</p>
                  <p className={classes.text}>
                    برای تغییر نوبت{" "}
                    <span
                      className={classes.call}
                      onClick={() => window.open("tel:+989333363411", "_self")}
                    >
                      تماس
                    </span>{" "}
                    بگیرید
                  </p>
                </div>
              )}
            {currentUser.permission === "admin" &&
              (visitTypes === "active" ||
                visitTypes === "today" ||
                visitTypes === "tomorrow") && (
                <div className={classes.buttonContainer}>
                  <button
                    onClick={() => {
                      filterDoctorsVisits("دکتر فراهانی");
                      scrollToDiv();
                    }}
                  >
                    لیست فراهانی
                  </button>
                  <button
                    onClick={() => {
                      filterDoctorsVisits("دکتر گنجه");
                      scrollToDiv();
                    }}
                  >
                    لیست گنجه
                  </button>
                </div>
              )}
            {currentUser.permission === "admin" &&
              visitTypes === "afterTomorrow" && (
                <div className={classes.buttonContainer}>
                  <button
                    className={classes.reminder}
                    onClick={() => sendAfterTomorrowReminder()}
                  >
                    ارسال پیامک یادآوری گروهی
                  </button>
                </div>
              )}
            {visitTypes === "all" && (
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>جستجو</p>
                  <CloseIcon
                    className="icon"
                    onClick={() => {
                      setPhone("");
                      setFilterVisits(displayVisits);
                    }}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  placeholder="09123456789"
                  type="tel"
                  id="phone"
                  name="phone"
                  maxLength={11}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    let phoneEnglish = isEnglishNumber(e.target.value)
                      ? e.target.value
                      : toEnglishNumber(e.target.value);
                    setFilterVisits(
                      displayVisits.filter(
                        (visit) => visit.user?.phone === phoneEnglish
                      )
                    );
                  }}
                  value={phone}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
            )}
            {currentUser.permission !== "doctor" && (
              <div className={classes.table} ref={targetDivRef}>
                {filterVisits
                  .map((item, index) => (
                    <div
                      className={classes.item}
                      key={index}
                      style={
                        checkEachVisitForPast(index) && visitTypes === "active"
                          ? canceleStyle
                          : {}
                      }
                    >
                      <div className={classes.row} style={margin}>
                        {currentUser.permission === "admin" && (
                          <div
                            className={classes.colorCode}
                            style={{ background: item.adminColor }}
                            onClick={() => expandInformation(item["_id"])}
                          ></div>
                        )}
                        {currentUser.permission === "admin" && (
                          <p
                            className={classes.title}
                            onClick={() =>
                              window.open(
                                `tel:+98${item.user?.phone.substring(1)}`,
                                "_self"
                              )
                            }
                          >
                            {item.user?.phone}
                          </p>
                        )}
                        <p
                          className={classes.time}
                          onClick={() => expandInformation(item["_id"])}
                        >
                          {item.time}
                        </p>
                        {expandedItem === item["_id"] ? (
                          <ExpandLessIcon
                            className="icon"
                            onClick={() => expandInformation(item["_id"])}
                          />
                        ) : (
                          <ExpandMoreIcon
                            className="icon"
                            onClick={() => expandInformation(item["_id"])}
                          />
                        )}
                      </div>
                      {expandedItem === item["_id"] && (
                        <Fragment>
                          <div className={classes.row}>
                            {item.canceled ? (
                              <div className={classes.row}>
                                <div className={classes.subRow}>
                                  <CloseIcon
                                    className={classes.icon}
                                    sx={{ color: "#d40d12" }}
                                  />
                                  <p style={{ color: "#d40d12" }}>
                                    نوبت لغو شده
                                  </p>
                                </div>
                                <p>{convertDate(item.updatedAt)}</p>
                              </div>
                            ) : (
                              <Fragment>
                                {item.completed ? (
                                  <div className={classes.row}>
                                    <div className={classes.subRow}>
                                      <TaskAltIcon
                                        className={classes.icon}
                                        sx={{ color: "#57a361" }}
                                      />
                                      <p style={{ color: "#57a361" }}>
                                        نوبت تکمیل شده
                                      </p>
                                    </div>
                                    <p>{convertDate(item.updatedAt)}</p>
                                  </div>
                                ) : (
                                  <div className={classes.infoBox}>
                                    {currentUser.permission === "admin" && (
                                      <div
                                        className={classes.row}
                                        style={margin}
                                      >
                                        <p
                                          className={classes.title}
                                          onClick={() =>
                                            Router.push({
                                              pathname: `/patient`,
                                              query: {
                                                id: item.user?._id,
                                              },
                                            })
                                          }
                                        >
                                          {item.user?.name}
                                        </p>
                                      </div>
                                    )}
                                    <div className={classes.row}>
                                      <p className={classes.doctor}>
                                        {item.doctor}
                                      </p>
                                      <p>{item.title}</p>
                                    </div>
                                  </div>
                                )}
                              </Fragment>
                            )}
                          </div>
                          {currentUser.permission === "admin" &&
                            !item.canceled &&
                            !item.completed && (
                              <div
                                className={classes.row}
                                style={{
                                  marginTop: "8px",
                                }}
                              >
                                <ModeIcon
                                  className="icon"
                                  sx={{ fontSize: 20, color: "#2d2b7f" }}
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      item.user?.phone
                                    )
                                  }
                                />
                                <div
                                  className={classes.row}
                                  style={{ width: "70px" }}
                                  onClick={() =>
                                    actionVisit(
                                      item["_id"],
                                      item.user?.phone,
                                      item.time,
                                      "complete"
                                    )
                                  }
                                >
                                  <TaskAltIcon
                                    className="icon"
                                    sx={{ color: "#57a361" }}
                                  />
                                  <p style={{ color: "#57a361" }}>تکمیل</p>
                                </div>
                                <div
                                  style={{ width: "50px" }}
                                  onClick={() =>
                                    actionVisit(
                                      item["_id"],
                                      item.user?.phone,
                                      item.time,
                                      "cancel"
                                    )
                                  }
                                  className={classes.row}
                                >
                                  <CloseIcon
                                    className="icon"
                                    sx={{ color: "#d40d12" }}
                                  />
                                  <p style={{ color: "#d40d12" }}>لغو</p>
                                </div>
                              </div>
                            )}
                        </Fragment>
                      )}
                    </div>
                  ))
                  .slice(0, reqNumber)}
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

let cachedVisitsData = null;
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let id = context.query.id;
    let permission = context.query.p;

    // Check if data is already cached
    if (cachedVisitsData) {
      return {
        props: cachedVisitsData,
      };
    }

    const users = await userModel.find();
    let visits = [];
    let activeVisits = [];
    const doctorIdTagName = {
      "66eb1dc863ab34979e6dd0a3": "دکتر فراهانی",
      "66f3129d0207273bf017248d": "دکتر گنجه",
    };
    let activeCount = 0;
    let completeCount = 0;
    let cancelCount = 0;
    let todayCount = 0;
    let tomorrowCount = 0;
    let afterTomorrowCount = 0;
    let activeFilter = { completed: false, canceled: false };
    let completeFilter = { completed: true };
    let canceledFilter = { canceled: true };

    switch (permission) {
      case "patient":
        activeFilter.userId = id;
        completeFilter.userId = id;
        canceledFilter.userId = id;
        visits = await visitModel.find({ userId: id });
        break;
      case "doctor":
        const doctorName = doctorIdTagName[id];
        activeFilter.doctor = doctorName;
        completeFilter.doctor = doctorName;
        canceledFilter.doctor = doctorName;
        visits = await visitModel.find({ doctor: doctorName });
        break;
      case "admin":
        visits = await visitModel.find();
        activeVisits = await visitModel.find({
          completed: false,
          canceled: false,
        });
        break;
    }

    activeCount = await visitModel.countDocuments(activeFilter);
    completeCount = await visitModel.countDocuments(completeFilter);
    cancelCount = await visitModel.countDocuments(canceledFilter);

    if (permission === "admin" || permission === "doctor") {
      todayCount = filterVisitsByDate(visits).length;
      tomorrowCount = filterVisitsByDate(visits, 1).length;
      afterTomorrowCount = filterVisitsByDate(visits, 2).length;
    }

    visits
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .sort((a, b) => a.completed - b.completed)
      .sort((a, b) => a.canceled - b.canceled);

    const visitsData = await Promise.all(
      visits.map(async (visit) => {
        const userData = await userModel.findOne({ _id: visit.userId });
        return {
          ...visit.toObject(),
          user: userData,
        };
      })
    );

    // Cache the fetched data
    cachedVisitsData = {
      visits: JSON.parse(JSON.stringify(visits)),
      activeVisits: JSON.parse(JSON.stringify(activeVisits)),
      users: JSON.parse(JSON.stringify(users)),
      visitsData: JSON.parse(JSON.stringify(visitsData)),
      activeCount,
      todayCount,
      tomorrowCount,
      afterTomorrowCount,
      completeCount,
      cancelCount,
    };

    return {
      props: cachedVisitsData,
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
