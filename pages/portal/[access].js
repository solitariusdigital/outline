import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./portal.module.scss";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Router from "next/router";
import ModeIcon from "@mui/icons-material/Mode";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import {
  convertDate,
  filterVisitsByDate,
  toEnglishNumber,
  isEnglishNumber,
} from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi, getUserApi } from "@/services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Kavenegar from "kavenegar";
import logo from "@/assets/logo.png";

export default function Access({ visits, users }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);
  const [filterVisits, setFilterVisits] = useState([]);
  const [phone, setPhone] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const [visitTypes, setVisitTypes] = useState(
    "all" ||
      "active" ||
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
      const fetchData = async () => {
        // inject user info into visit object
        const visitsData = await Promise.all(
          visits.map(async (visit) => {
            const [userData] = await Promise.all([getUserApi(visit.userId)]);
            return {
              ...visit,
              user: userData,
            };
          })
        );
        setDisplayVisits(visitsData);
        setFilterVisits(
          visitsData.filter((visit) => !visit.completed && !visit.canceled)
        );
      };
      fetchData().catch(console.error);
    }
    setVisitTypes("active");
  }, [currentUser, visits]);

  const margin = {
    marginBottom: "8px",
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
      let visitData = await getVisitApi(id);
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

  const sendTomorrowReminder = () => {
    const confirmationMessage = "پیام یادآوری گروهی، مطمئنی؟";
    const confirm = window.confirm(confirmationMessage);
    const tomorrowVisits = filterVisitsByDate(displayVisits, 2);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    if (confirm) {
      tomorrowVisits.forEach((visit) => {
        api.VerifyLookup(
          {
            receptor: visit.user.phone,
            token: visit.time.split(" - ")[0].trim(),
            token2: visit.time.split(" - ")[1].trim(),
            template: "reminderOutline",
          },
          function (response, status) {}
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
          <div className={classes.header}>
            <HomeIcon onClick={() => Router.push("/")} className="icon" />
            <h3>{currentUser.name ? currentUser.name : currentUser.phone}</h3>
            {currentUser.permission === "patient" && <Person4Icon />}
            {currentUser.permission === "admin" && <LocalHospitalIcon />}
          </div>
          <div className={classes.portal}>
            <div className={classes.analytics}>
              {currentUser.permission === "admin" && (
                <div className={classes.row}>
                  <p>
                    {
                      users.filter((user) => user.permission === "patient")
                        .length
                    }{" "}
                    / {displayVisits.length}
                  </p>
                  <p
                    className={
                      visitTypes === "all" ? classes.itemActive : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(displayVisits);
                      setVisitTypes("all");
                      scrollToDiv();
                    }}
                  >
                    نوبت‌ها / بیمارها
                  </p>
                </div>
              )}
              <Fragment>
                <div className={classes.row}>
                  <p>
                    {
                      displayVisits.filter(
                        (visit) => !visit.completed && !visit.canceled
                      ).length
                    }
                  </p>
                  <p
                    className={
                      visitTypes === "active"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter(
                          (visit) => !visit.completed && !visit.canceled
                        )
                      );
                      setVisitTypes("active");
                      scrollToDiv();
                    }}
                  >
                    نوبت فعال
                  </p>
                </div>
                {currentUser.permission === "admin" && (
                  <Fragment>
                    <div className={classes.row}>
                      <p>{filterVisitsByDate(displayVisits).length}</p>
                      <p
                        className={
                          visitTypes === "today"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          setFilterVisits(filterVisitsByDate(displayVisits));
                          setVisitTypes("today");
                          scrollToDiv();
                        }}
                      >
                        نوبت امروز
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p>{filterVisitsByDate(displayVisits, 1).length}</p>
                      <p
                        className={
                          visitTypes === "tomorrow"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          setFilterVisits(filterVisitsByDate(displayVisits, 1));
                          setVisitTypes("tomorrow");
                          scrollToDiv();
                        }}
                      >
                        نوبت فردا
                      </p>
                    </div>
                    <div className={classes.row}>
                      <p>{filterVisitsByDate(displayVisits, 2).length}</p>
                      <p
                        className={
                          visitTypes === "afterTomorrow"
                            ? classes.itemActive
                            : classes.item
                        }
                        onClick={() => {
                          setFilterVisits(filterVisitsByDate(displayVisits, 2));
                          setVisitTypes("afterTomorrow");
                          scrollToDiv();
                        }}
                      >
                        نوبت پس‌فردا
                      </p>
                    </div>
                  </Fragment>
                )}
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.completed).length}
                  </p>
                  <p
                    className={
                      visitTypes === "complete"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter((visit) => visit.completed)
                      );
                      setVisitTypes("complete");
                      scrollToDiv();
                    }}
                  >
                    نوبت تکمیل شده
                  </p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.canceled).length}
                  </p>
                  <p
                    className={
                      visitTypes === "cancel"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter((visit) => visit.canceled)
                      );
                      setVisitTypes("cancel");
                      scrollToDiv();
                    }}
                  >
                    نوبت لغو شده
                  </p>
                </div>
                <div className={classes.logout} onClick={() => logOut()}>
                  <p className={classes.item}>خروج از پورتال</p>
                </div>
              </Fragment>
            </div>
            {currentUser.permission === "admin" ||
            displayVisits.filter((visit) => !visit.completed && !visit.canceled)
              .length < 1 ? (
              <div className={classes.button}>
                <button
                  onClick={() => {
                    Router.push("/booking");
                    setSelectDoctor("");
                  }}
                >
                  ثبت نوبت آنلاین
                </button>
              </div>
            ) : (
              <p className="message">
                شما یک نوبت فعال دارید و نمی‌توانید نوبت جدید ثبت کنید
              </p>
            )}
            {currentUser.permission === "admin" &&
              visitTypes === "afterTomorrow" && (
                <div className={classes.button}>
                  <button onClick={() => sendTomorrowReminder()}>
                    پیام یادآوری گروهی
                  </button>
                </div>
              )}
            {visitTypes === "all" && (
              <div className={classes.input}>
                <div className={classes.bar}>
                  <p className={classes.label}>جستجو بیمار</p>
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
                        (visit) => visit.user.phone === phoneEnglish
                      )
                    );
                  }}
                  value={phone}
                  autoComplete="off"
                  dir="rtl"
                />
              </div>
            )}
            <div className={classes.table} ref={targetDivRef}>
              {filterVisits.map((item, index) => (
                <div className={classes.item} key={index}>
                  <div className={classes.row} style={margin}>
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
                              <p style={{ color: "#d40d12" }}>نوبت لغو شده</p>
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
                                  <div className={classes.row} style={margin}>
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
                                  <p>{item.doctor}</p>
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
                                navigator.clipboard.writeText(item.user?.phone)
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
              ))}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let id = context.query.id;
    let permission = context.query.p;

    const users = await userModel.find();
    let visits = null;
    switch (permission) {
      case "patient":
        visits = await visitModel.find({ userId: id });
        break;
      case "admin":
        visits = await visitModel.find();
        break;
    }
    visits
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .sort((a, b) => a.completed - b.completed)
      .sort((a, b) => a.canceled - b.canceled);

    return {
      props: {
        visits: JSON.parse(JSON.stringify(visits)),
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
