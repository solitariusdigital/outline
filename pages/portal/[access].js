import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./portal.module.scss";
import Image from "next/legacy/image";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Router from "next/router";
import ModeIcon from "@mui/icons-material/Mode";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import { NextSeo } from "next-seo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Kavenegar from "kavenegar";
import logo from "@/assets/logo.png";
import loaderImage from "@/assets/loader.png";
import {
  getSingleVisitApi,
  getUsersApi,
  getVisitsApi,
  updateVisitApi,
  getControlsApi,
  updateControlApi,
} from "@/services/api";
import {
  convertDate,
  filterVisitsByDate,
  toEnglishNumber,
  isEnglishNumber,
  getCurrentDate,
  getCurrentDateFarsi,
} from "@/services/utility";

export default function Access() {
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
  const [reminderSent, setReminderSent] = useState(false);
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

  const targetDivRef = useRef(null);
  const router = useRouter();
  const [cachedVisitsData, setCachedVisitsData] = useState({});
  const [loadPage, setLoadPage] = useState(false);

  const margin = {
    marginBottom: "8px",
  };
  const canceleStyle = {
    border: "1px solid #d40d12",
    borderRadius: "12px",
  };

  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    } else {
      fetchRefreshData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.permission === "admin") {
      setReminderSent(checkReminderSent());
    }
  }, []);

  useEffect(() => {
    if (loadPage) {
      setDisplayVisits(cachedVisitsData.visitsData);
      setFilterVisits(
        cachedVisitsData.visitsData.filter(
          (visit) => !visit.completed && !visit.canceled
        )
      );
    }
  }, [loadPage, cachedVisitsData]);

  useEffect(() => {
    if (loadPage) {
      setNotification(checkAllVisitsForPast(cachedVisitsData.activeVisits));
    }
  }, [loadPage, cachedVisitsData]);

  useEffect(() => {
    window.addEventListener("scroll", loadMore);
  });

  const fetchRefreshData = async () => {
    try {
      let visitsFetchData = await getVisitsApi();
      let visits = [];
      let users = [];
      const doctorIdTagName = {
        "66eb1dc863ab34979e6dd0a3": "دکتر فراهانی",
        "66f3129d0207273bf017248d": "دکتر گنجه",
        "67582f5e6cf19cb68b17c00b": "دکتر حاجیلو",
      };

      switch (currentUser.permission) {
        case "admin":
          visits = visitsFetchData;
          users = await getUsersApi();
          break;
        case "patient":
          visits = visitsFetchData.filter(
            (visit) => visit.userId === currentUser["_id"]
          );
          break;
        case "staff":
          visits = visitsFetchData.filter(
            (visit) => visit.userId === currentUser["_id"]
          );
          break;
        case "doctor":
          const doctorName = doctorIdTagName[currentUser["_id"]];
          visits = visitsFetchData.filter(
            (visit) => visit.doctor === doctorName
          );
          break;
      }

      visits = sortVisits(visits);
      const visitsData = await enrichVisitsWithUserData(visits, users);
      const activeVisits = visitsData.filter(
        (visit) => !visit.completed && !visit.canceled
      );

      setCachedVisitsData({
        visits,
        activeVisits,
        visitsData,
        users,
      });
      setLoadPage(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to enrich visits with user data
  const enrichVisitsWithUserData = async (visits, users) => {
    return await Promise.all(
      visits.map(async (visit) => {
        const userData = users.find((user) => user["_id"] === visit.userId);
        return {
          ...visit,
          user: userData,
        };
      })
    );
  };

  // Helper function to sort visits
  const sortVisits = (visits) => {
    return visits
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .sort((a, b) => a.completed - b.completed)
      .sort((a, b) => a.canceled - b.canceled);
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
    let visitData = await getSingleVisitApi(id);
    if (confirm) {
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

      let visits = await getVisitsApi();
      let users = await getUsersApi();
      visits = sortVisits(visits);
      const activeVisits = visits.filter(
        (visit) => !visit.completed && !visit.canceled
      );
      const visitsData = await enrichVisitsWithUserData(visits, users);

      setCachedVisitsData((prevData) => ({
        ...prevData,
        visits,
        activeVisits,
        visitsData,
      }));
    }
  };

  const searchUserVisits = (phone) => {
    setPhone(phone);
    if (phone.length === 11) {
      let phoneEnglish = isEnglishNumber(phone)
        ? phone
        : toEnglishNumber(phone);
      setFilterVisits(
        displayVisits.filter((visit) => visit.user?.phone === phoneEnglish)
      );
    }
  };

  const checkReminderSent = async () => {
    const controlData = await getControlsApi();
    const reminders = controlData[0]?.reminder;
    const currentDate = getCurrentDateFarsi();
    setReminderSent(reminders.hasOwnProperty(currentDate));
  };

  const sendAfterTomorrowReminder = async () => {
    const controlData = await getControlsApi();
    const currentDate = getCurrentDateFarsi();
    const controlObject = {
      ...controlData[0],
      reminder: {
        ...controlData[0].reminder,
        [currentDate]: true,
      },
    };
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
          async (response, status) => {
            if (index === afterTomorrowVisits.length - 1) {
              if (status === 200) {
                await updateControlApi(controlObject);
                window.alert("پیامک گروهی ارسال شد");
                checkReminderSent();
              } else {
                window.alert("خطا در ارسال پیامک");
              }
            }
          }
        );
      });
    }
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
      router.reload(router.asPath);
    } else {
      setDisableButton(false);
    }
  };

  const logOut = () => {
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
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
      {loadPage && currentUser ? (
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
            {currentUser.permission === "staff" && <Person4Icon />}
            {currentUser.permission === "doctor" && <LocalHospitalIcon />}
            {currentUser.permission === "admin" && (
              <MilitaryTechIcon
                sx={{ color: adminColorCode[currentUser["_id"]]?.color }}
              />
            )}
          </div>
          <div className={classes.portal}>
            <div className={classes.analytics}>
              <h4>نوبت‌ها</h4>
              {currentUser.permission === "admin" && (
                <div className={classes.row}>
                  <p>
                    {
                      cachedVisitsData.users.filter(
                        (user) => user.permission === "patient"
                      ).length
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
                  <p>{cachedVisitsData.activeVisits.length}</p>
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
                      <p>
                        {filterVisitsByDate(cachedVisitsData.visits).length}
                      </p>
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
                      <p>
                        {filterVisitsByDate(cachedVisitsData.visits, 1).length}
                      </p>
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
                      <p>
                        {filterVisitsByDate(cachedVisitsData.visits, 2).length}
                      </p>
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
                  <p>
                    {
                      cachedVisitsData.visitsData.filter(
                        (visit) => visit.completed
                      ).length
                    }
                  </p>
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
                  <p>
                    {
                      cachedVisitsData.visitsData.filter(
                        (visit) => visit.canceled
                      ).length
                    }
                  </p>
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
                  <button
                    className={classes.booking}
                    onClick={() => {
                      Router.push("/booking");
                      setSelectDoctor("دکتر حاجیلو");
                    }}
                  >
                    دکتر حاجیلو
                  </button>
                </div>
              )}
            {(currentUser.permission === "patient" ||
              currentUser.permission === "staff") &&
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
                  <button
                    onClick={() => {
                      filterDoctorsVisits("دکتر حاجیلو");
                      scrollToDiv();
                    }}
                  >
                    لیست حاجیلو
                  </button>
                </div>
              )}
            {currentUser.permission === "admin" &&
              visitTypes === "afterTomorrow" && (
                <div className={classes.buttonContainer}>
                  <button
                    disabled={reminderSent}
                    className={classes.reminder}
                    onClick={() => sendAfterTomorrowReminder()}
                  >
                    {reminderSent ? "ارسال شده" : "ارسال پیامک یادآوری گروهی"}
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
                    searchUserVisits(e.target.value);
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
      ) : (
        <div className={classes.loader}>
          <Image width={50} height={50} src={loaderImage} alt="isLoading" />
        </div>
      )}
    </Fragment>
  );
}
