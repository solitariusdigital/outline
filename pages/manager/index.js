import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./manager.module.scss";
import dbConnect from "@/services/dbConnect";
import controlModel from "@/models/Control";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StarIcon from "@mui/icons-material/Star";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSingleUserApi,
  updateControlApi,
  getControlsApi,
  getRecordsApi,
  getVisitsApi,
} from "@/services/api";
import {
  calculateTimeDifference,
  getCurrentDateFarsi,
  toEnglishNumber,
  isEnglishNumber,
} from "@/services/utility";

export default function Manager({ control }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [controlData, setControlData] = useState(control[0]);
  const [userData, setUsersData] = useState([]);
  const [allUserData, setAllUserData] = useState(null);
  const [displaySelectedUser, setDisplaySelectedUser] = useState(null);
  const [count, setCount] = useState({});
  const [currentYear, setCurrentYear] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [expandInformation, setExpandInformation] = useState(null);
  const [expandRecords, setExpandRecords] = useState(null);
  const [recordObject, setRecordObject] = useState(null);
  const [displayRecords, setDisplayRecords] = useState([]);
  const [filterRecords, setFilterRecords] = useState([]);
  const [navigation, setNavigation] = useState(
    "time" || "reminder" || "count" || "reception"
  );
  const [displayReception, setDisplayReception] = useState(false);
  const [phone, setPhone] = useState("");
  const [reqNumber, setReqNumber] = useState(52);
  const [totalHours, setTotalHours] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("default");
  const router = useRouter();
  const adminsName = {
    "#EAD8B1": "Site",
    "#F05A7E": "Tanaz",
    "#478CCF": "Diako",
    "#FF9D23": "Ana",
    "#B771E5": "Niloufar",
    "#2d2b7f": "Outline",
  };
  const months = [
    "۱",
    "۲",
    "۳",
    "۴",
    "۵",
    "۶",
    "۷",
    "۸",
    "۹",
    "۱۰",
    "۱۱",
    "۱۲",
  ];
  const years = [
    "۱۴۰۳",
    "۱۴۰۴",
    "۱۴۰۵",
    "۱۴۰۶",
    "۱۴۰۷",
    "۱۴۰۸",
    "۱۴۰۹",
    "۱۴۱۰",
  ];

  useEffect(() => {
    const loadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement.scrollHeight
      ) {
        setReqNumber(reqNumber + 52);
      }
    };
    window.addEventListener("scroll", loadMore);
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, [reqNumber, setReqNumber]);

  useEffect(() => {
    const [year, month] = getCurrentDateFarsi().split("/");
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let recordsData = await getRecordsApi();
      recordsData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setDisplayRecords(recordsData);
      setFilterRecords(recordsData);
    };
    if (navigation === "reception") {
      fetchData();
    }
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      let usersId = Object.keys(controlData.timesheets);
      try {
        const data = await Promise.all(
          usersId.map(async (userId) => {
            let userData = await getSingleUserApi(userId);
            return {
              userData,
              timesheets: controlData.timesheets[userId],
            };
          })
        );
        const filteredData = data.filter((user) => !user.userData.super);
        setUsersData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    if (controlData.timesheets && currentUser?.super) {
      fetchData();
    } else if (
      currentUser?.permission === "admin" ||
      currentUser?.permission === "doctor"
    ) {
      setNavigation("reception");
    } else {
      Router.push("/");
    }
  }, [controlData]);

  useEffect(() => {
    const fetchData = async () => {
      let visits = await getVisitsApi();
      const sortedColorValues = countColorOccurrences(
        visits,
        currentYear,
        currentMonth
      );
      setCount(sortedColorValues);
    };
    if (navigation === "count") {
      fetchData();
    }
  }, [navigation, currentYear, currentMonth]);

  useEffect(() => {
    const handleControl = async () => {
      const controlData = await getControlsApi();
      setDisplayReception(controlData[0].reception);
    };
    if (currentUser?.super) {
      handleControl();
    }
  }, []);

  const countColorOccurrences = (visits, currentYear, currentMonth) => {
    const colorCounts = {};
    visits
      .filter((visit) => {
        const [year, month] = visit.time.split("/");
        return year === currentYear && month === currentMonth;
      })
      .forEach((visit) => {
        const colorKey = visit.adminColor;
        if (colorKey) {
          if (!colorCounts[colorKey]) {
            colorCounts[colorKey] = 0;
          }
          colorCounts[colorKey]++;
        }
      });
    delete colorCounts["#257180"];
    return Object.fromEntries(
      Object.entries(colorCounts).sort(
        ([, valueA], [, valueB]) => valueB - valueA
      )
    );
  };

  const filterDisplayMonths = (monthNumber) => {
    setAllUserData(allUserData);
    let filtered = allUserData.timesheets.filter((data) => {
      const parts = data.date.split("/");
      return parts[1] === monthNumber;
    });
    setDisplaySelectedUser((prevData) => ({
      ...prevData,
      timesheets: filtered,
    }));
    calculateTotalHours(filtered);
  };

  const calculateTotalHours = (data) => {
    const totalMinutes = data
      .filter((item) => item.timesheet.checkOut)
      .reduce((sum, item) => {
        const { hours, minutes } = calculateTimeDifference(
          item.timesheet.checkOut
        );
        return sum + hours * 60 + minutes;
      }, 0);
    setTotalHours(convertMinutesToHours(totalMinutes));
  };

  const convertMinutesToHours = (totalMinutes) => ({
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  });

  const assignUserData = (index) => {
    setTotalHours(null);
    setSelectedMonth("default");
    setAllUserData(userData[index]);
    setDisplaySelectedUser(userData[index]);
  };

  const updateReception = async (type) => {
    const message = `${
      type === "active" ? "پذیرش فعال، مطمئنی؟" : "پذیرش غیرفعال، مطمئنی؟"
    }`;
    const confirm = window.confirm(message);
    if (confirm) {
      const controlData = await getControlsApi();
      switch (type) {
        case "disable":
          controlData[0].reception = false;
          break;
        case "active":
          controlData[0].reception = true;
          break;
      }
      await updateControlApi(controlData[0]);
      router.reload(router.asPath);
    }
  };

  const expandInformationAction = (id) => {
    setExpandInformation(id);
    if (expandInformation === id) {
      setExpandInformation(null);
    }
  };
  const expandRecordsAction = (id) => {
    setExpandRecords(id);
    if (expandRecords === id) {
      setExpandRecords(null);
    }
  };

  const searchUserRecord = (e) => {
    let phone = e.target.value;
    setPhone(phone);
    if (phone.length === 11) {
      let phoneEnglish = isEnglishNumber(phone)
        ? phone
        : toEnglishNumber(phone);
      setFilterRecords(
        displayRecords.filter((record) => record?.phone === phoneEnglish)
      );
    }
  };

  const getVIP = () => {
    setFilterRecords(
      displayRecords.filter((record) => record?.status === "vip")
    );
  };

  return (
    <div className={classes.container}>
      <HomeIcon onClick={() => Router.push("/")} className="icon" />
      {currentUser?.super && (
        <div className={classes.navigation}>
          <p
            className={navigation === "time" ? classes.activeNav : classes.nav}
            onClick={() => setNavigation("time")}
          >
            زمان
          </p>
          <p
            className={navigation === "count" ? classes.activeNav : classes.nav}
            onClick={() => setNavigation("count")}
          >
            شمارش
          </p>
          <p
            className={
              navigation === "reminder" ? classes.activeNav : classes.nav
            }
            onClick={() => setNavigation("reminder")}
          >
            یادآوری
          </p>
          <p
            className={
              navigation === "reception" ? classes.activeNav : classes.nav
            }
            onClick={() => setNavigation("reception")}
          >
            پرونده
          </p>
        </div>
      )}
      {navigation === "time" && (
        <Fragment>
          <div className={classes.selector}>
            <div className={classes.input}>
              <select
                defaultValue={"default"}
                onChange={(e) => {
                  assignUserData(e.target.value);
                }}
              >
                <option value="default" disabled>
                  انتخاب
                </option>
                {userData?.map((user, index) => {
                  return (
                    <option key={index} value={index}>
                      {user.userData.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {displaySelectedUser && (
              <div className={classes.input}>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    filterDisplayMonths(e.target.value);
                  }}
                >
                  <option value="default" disabled>
                    ماه
                  </option>
                  {months.map((month, index) => {
                    return (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          {totalHours && (
            <div
              className={classes.row}
              style={{
                marginBottom: "12px",
              }}
            >
              <h4
                style={{
                  margin: "4px",
                }}
              >
                کل اضافه کار
              </h4>
              <h4>
                {totalHours.hours}
                <span
                  style={{
                    margin: "4px",
                  }}
                >
                  ساعت
                </span>
              </h4>
              <h4>
                {totalHours.minutes}
                <span
                  style={{
                    margin: "4px",
                  }}
                >
                  دقیقه
                </span>
              </h4>
            </div>
          )}
          <div className={classes.cards}>
            {displaySelectedUser?.timesheets
              .filter(
                (sheet) => toEnglishNumber(sheet.date.split("/")[0]) > 1403
              )
              .map((sheet, index) => (
                <div
                  key={index}
                  value={index}
                  className={classes.timesheetCard}
                >
                  <div className={classes.row}>
                    <h4>{sheet.date}</h4>
                    {sheet.timesheet.checkOut && (
                      <div
                        className={classes.row}
                        style={{
                          width: "110px",
                        }}
                      >
                        <h5>
                          {
                            calculateTimeDifference(sheet.timesheet.checkOut)
                              .hours
                          }
                          <span
                            style={{
                              margin: "4px",
                            }}
                          >
                            ساعت
                          </span>
                        </h5>
                        <h5>
                          {
                            calculateTimeDifference(sheet.timesheet.checkOut)
                              .minutes
                          }
                          <span
                            style={{
                              margin: "4px",
                            }}
                          >
                            دقیقه
                          </span>
                        </h5>
                      </div>
                    )}
                  </div>
                  <div className={classes.row}>
                    <p>ورود</p>
                    <h4>{sheet.timesheet.checkIn}</h4>
                    <p
                      style={{
                        width: "170px",
                      }}
                    >
                      {sheet.address.checkIn}
                    </p>
                  </div>
                  <div className={classes.row}>
                    {sheet.timesheet.checkOut ? (
                      <p>خروج</p>
                    ) : (
                      <p>اضافه کار ندارد</p>
                    )}
                    <h4>{sheet.timesheet.checkOut}</h4>
                    <p
                      style={{
                        width: "170px",
                      }}
                    >
                      {sheet.address.checkOut}
                    </p>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </Fragment>
      )}
      {navigation === "count" && (
        <Fragment>
          <div className={classes.selector}>
            <div className={classes.inputCount}>
              <div className={classes.input}>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                >
                  <option value="default" disabled>
                    سال
                  </option>
                  {years.map((year, index) => {
                    return (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className={classes.input}>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(e.target.value)}
                >
                  <option value="default" disabled>
                    ماه
                  </option>
                  {months.map((month, index) => {
                    return (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className={classes.reminder}>
            {Object.entries(count).map(([color, value], index) => (
              <div
                key={index}
                className={classes.timesheetCard}
                style={{ border: `1px solid ${color}`, color: color }}
              >
                <p>{adminsName[color]}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </Fragment>
      )}
      {navigation === "reminder" && (
        <div className={classes.reminder}>
          {Object.keys(controlData.reminder)
            .map((time, index) => (
              <p key={index} className={classes.timesheetCard}>
                {time}
              </p>
            ))
            .reverse()
            .slice(0, 30)}
        </div>
      )}
      {navigation === "reception" && (
        <Fragment>
          {currentUser?.super && (
            <Fragment>
              {displayReception ? (
                <button
                  className={classes.activeButton}
                  onClick={() => updateReception("disable")}
                >
                  پذیرش فعال
                </button>
              ) : (
                <button
                  className={classes.disableButton}
                  onClick={() => updateReception("active")}
                >
                  پذیرش غیرفعال
                </button>
              )}
              <button className={classes.button} onClick={() => getVIP()}>
                Get VIP
              </button>
            </Fragment>
          )}
          <div className={classes.input}>
            <div className={classes.bar}>
              <p className={classes.label}>جستجو</p>
              <CloseIcon
                className="icon"
                onClick={() => {
                  setPhone("");
                  setFilterRecords(displayRecords);
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
              onChange={searchUserRecord}
              value={phone}
              autoComplete="off"
              dir="rtl"
            />
          </div>
          <div className={classes.records}>
            {!recordObject && (
              <Fragment>
                {filterRecords
                  ?.map((record, index) => (
                    <div key={index} className={classes.card}>
                      <div
                        className={classes.row}
                        style={{ cursor: "pointer" }}
                        onClick={() => expandInformationAction(record["_id"])}
                      >
                        <div className={classes.row}>
                          {record?.status === "vip" && (
                            <Tooltip title="VIP">
                              <StarIcon sx={{ fontSize: 16 }} />
                            </Tooltip>
                          )}
                          <h4
                            style={{
                              marginRight: "4px",
                            }}
                            onClick={() =>
                              navigator.clipboard.writeText(record.name)
                            }
                          >
                            {record.name}
                          </h4>
                        </div>

                        {expandInformation === record["_id"] ? (
                          <ExpandLessIcon
                            className="icon"
                            sx={{ color: "#2d2b7f" }}
                          />
                        ) : (
                          <ExpandMoreIcon
                            className="icon"
                            sx={{ color: "#2d2b7f" }}
                          />
                        )}
                      </div>
                      <div className={classes.row}>
                        <p>{record.birthDate}</p>
                        <p>{record.age}</p>
                      </div>
                      <div className={classes.row}>
                        <span>موبایل</span>
                        <p
                          onClick={() =>
                            navigator.clipboard.writeText(record.phone)
                          }
                        >
                          {record.phone}
                        </p>
                      </div>
                      <div className={classes.row}>
                        <span>کدملی</span>
                        <p
                          onClick={() =>
                            navigator.clipboard.writeText(record.idMeli)
                          }
                        >
                          {record.idMeli}
                        </p>
                      </div>
                      <div className={classes.row}>
                        <span>شماره پرونده</span>
                        <p
                          onClick={() =>
                            navigator.clipboard.writeText(record.recordId)
                          }
                        >
                          {record.recordId}
                        </p>
                      </div>
                      {expandInformation === record["_id"] && (
                        <Fragment>
                          <div className={classes.row}>
                            <span>شغل</span>
                            <p>{record.occupation}</p>
                          </div>
                          <div className={classes.row}>
                            <span>معرف</span>
                            <p>{record.referral}</p>
                          </div>
                          <p>{record.address}</p>
                        </Fragment>
                      )}
                      <div
                        className={classes.row}
                        style={{ cursor: "pointer" }}
                        onClick={() => expandRecordsAction(record["_id"])}
                      >
                        <div className={classes.row}>
                          <span className={classes.more}>سابقه بیمار</span>
                          <MoreHorizIcon sx={{ color: "#2d2b7f" }} />
                        </div>
                        <p>{record.records.length}</p>
                      </div>
                      {expandRecords === record["_id"] && (
                        <Fragment>
                          {record.records.map((item, index) => (
                            <div
                              key={index}
                              className={classes.recordBox}
                              style={{ cursor: "pointer" }}
                              onClick={() => setRecordObject(item)}
                            >
                              <div className={classes.recordRow}>
                                <p className={classes.recordText}>
                                  {item.date}
                                </p>
                                <p className={classes.recordText}>
                                  {item.doctor}
                                </p>
                              </div>
                            </div>
                          ))}
                        </Fragment>
                      )}
                    </div>
                  ))
                  .slice(0, reqNumber)}
              </Fragment>
            )}
            {recordObject && (
              <div className={classes.popup}>
                <CloseIcon
                  className="icon"
                  onClick={() => setRecordObject(null)}
                />
                <p>{recordObject.doctor}</p>
                <p>{recordObject.date}</p>
                <div className={classes.card}>
                  <div className={classes.info}>
                    <span>تاریخچه پزشکی</span>
                    <div className={classes.item}>
                      {recordObject.medical
                        .filter((item) => item.active)
                        .map((item) => (
                          <h5 key={item.label}>{item.label}</h5>
                        ))}
                    </div>
                    <p>{recordObject.medicalDescription}</p>
                  </div>
                  <div className={classes.info}>
                    <span>سابقه دارویی</span>
                    <p>{recordObject.medicineDescription}</p>
                  </div>
                  <div className={classes.info}>
                    <span>عادات بیمار</span>
                    <div className={classes.item}>
                      {recordObject.habits
                        .filter((item) => item.active)
                        .map((item) => (
                          <h5 key={item.label}>{item.label}</h5>
                        ))}
                    </div>
                  </div>
                  <div className={classes.info}>
                    <span>تاریخچه پزشکی اعضاء خانواده</span>
                    <div className={classes.item}>
                      {recordObject.medicalFamily
                        .filter((item) => item.active)
                        .map((item) => (
                          <h5 key={item.label}>{item.label}</h5>
                        ))}
                    </div>
                    <p>{recordObject.medicalFamilyDescription}</p>
                  </div>
                  <div className={classes.historyItem}>
                    <span>سابقه مشاوره</span>
                    {Object.entries(recordObject.visitHistory).map(
                      ([key, items]) => {
                        if (items.length > 0) {
                          return (
                            <div key={key} className={classes.historyRow}>
                              <span>{key}</span>
                              {items.map((item, index) => (
                                <div key={index} className={classes.row}>
                                  <h5>{item}</h5>
                                  {recordObject.extraFiller?.includes(item) && (
                                    <p>+</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        }
                      }
                    )}
                  </div>
                  {recordObject.injectHistory && (
                    <div className={classes.historyItem}>
                      <span>سابقه تزریق</span>
                      {Object.entries(recordObject.injectHistory).map(
                        ([key, items]) => {
                          if (items.length > 0) {
                            // Filter the items to only include those that are active
                            const activeItems = items.filter(
                              (item) => item.active
                            );
                            // Check if there are any active items to render
                            if (activeItems.length > 0) {
                              return (
                                <div key={key} className={classes.historyRow}>
                                  <span>{key}</span>
                                  {activeItems.map((item, index) => (
                                    <div key={index} className={classes.row}>
                                      <h5>{item.name}</h5>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          }
                        }
                      )}
                    </div>
                  )}
                  <div className={classes.info}>
                    <p>
                      {recordObject.pregnant ? "باردار است" : "باردار نیست"}
                    </p>
                  </div>
                  <div className={classes.info}>
                    <p>
                      {recordObject.breastfeeding
                        ? "دوران شیردهی است"
                        : "دوران شیردهی نیست"}
                    </p>
                  </div>
                  {recordObject.comment && (
                    <div className={classes.info}>
                      <span>نظر پزشک</span>
                      <p>{recordObject.comment}</p>
                    </div>
                  )}
                  {recordObject.message && (
                    <div className={classes.info}>
                      <span>توضیحات</span>
                      <p>{recordObject.message}</p>
                    </div>
                  )}
                  <div className={classes.info}>
                    <p
                      style={{
                        fontSize: "small",
                        color: recordObject.sharePermission
                          ? "#15b392"
                          : "#d40d12",
                      }}
                    >
                      {recordObject.sharePermission
                        ? "عکس اشتراک گذاشته شود"
                        : "عکس اشتراک گذاشته نشود"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let control = await controlModel.find();

    return {
      props: {
        control: JSON.parse(JSON.stringify(control)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
