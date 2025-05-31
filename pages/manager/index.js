import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./manager.module.scss";
import dbConnect from "@/services/dbConnect";
import controlModel from "@/models/Control";
import visitModel from "@/models/Visit";
import recordModel from "@/models/Record";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSingleUserApi,
  updateControlApi,
  getControlsApi,
} from "@/services/api";
import {
  calculateTimeDifference,
  getCurrentDateFarsi,
} from "@/services/utility";

export default function Manager({ control, visits, records }) {
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
  const [navigation, setNavigation] = useState(
    "time" || "reminder" || "count" || "reception"
  );
  const [displayReception, setDisplayReception] = useState(false);
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
    const [year, month] = getCurrentDateFarsi().split("/");
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
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
      fetchUserData();
    } else {
      Router.push("/");
    }
  }, [controlData]);

  useEffect(() => {
    if (navigation === "count") {
      const sortedColorValues = countColorOccurrences(
        visits,
        currentYear,
        currentMonth
      );
      setCount(sortedColorValues);
    }
  }, [navigation, visits, currentYear, currentMonth]);

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

  const filterDisplayMonths = (monthNumber, typeNumber) => {
    setAllUserData(allUserData);
    let filtered = allUserData.timesheets.filter((data) => {
      const parts = data.date.split("/");
      return parts[typeNumber] === monthNumber;
    });
    setDisplaySelectedUser((prevData) => ({
      ...prevData,
      timesheets: filtered,
    }));
  };

  const assignUserData = (index) => {
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
          {currentUser?.super && (
            <p
              className={
                navigation === "reception" ? classes.activeNav : classes.nav
              }
              onClick={() => setNavigation("reception")}
            >
              پذیرش
            </p>
          )}
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
                  defaultValue={"default"}
                  onChange={(e) => {
                    filterDisplayMonths(e.target.value, 1);
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
          <div className={classes.cards}>
            {displaySelectedUser?.timesheets
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
                            calculateTimeDifference(
                              sheet.timesheet.checkIn,
                              sheet.timesheet.checkOut
                            ).hours
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
                            calculateTimeDifference(
                              sheet.timesheet.checkIn,
                              sheet.timesheet.checkOut
                            ).minutes
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
                    <p
                      style={{
                        width: "30px",
                      }}
                    >
                      ورود
                    </p>
                    <h4
                      style={{
                        width: "70px",
                      }}
                    >
                      {sheet.timesheet.checkIn}
                    </h4>
                    <p
                      style={{
                        width: "170px",
                      }}
                    >
                      {sheet.address.checkIn}
                    </p>
                  </div>
                  <div className={classes.row}>
                    <p
                      style={{
                        width: "30px",
                      }}
                    >
                      خروج
                    </p>
                    <h4
                      style={{
                        width: "70px",
                      }}
                    >
                      {sheet.timesheet.checkOut}
                    </h4>
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
          <div className={classes.records}>
            {!recordObject && (
              <Fragment>
                {records?.map((record, index) => (
                  <div key={index} className={classes.card}>
                    <div
                      className={classes.row}
                      style={{ cursor: "pointer" }}
                      onClick={() => expandInformationAction(record["_id"])}
                    >
                      <h4
                        onClick={() =>
                          navigator.clipboard.writeText(record.name)
                        }
                      >
                        {record.name}
                      </h4>
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
                        <p>{record.address}</p>
                        <div className={classes.row}>
                          <span>شغل</span>
                          <p>{record.occupation}</p>
                        </div>
                        <div className={classes.row}>
                          <span>معرف</span>
                          <p>{record.referral}</p>
                        </div>
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
                              <p className={classes.recordText}>{item.date}</p>
                              <p className={classes.recordText}>
                                {item.doctor}
                              </p>
                            </div>
                          </div>
                        ))}
                      </Fragment>
                    )}
                  </div>
                ))}
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
                    <span>سابقه تزریق</span>
                    {Object.entries(recordObject.visitHistory).map(
                      ([key, items]) => {
                        if (items.length > 0) {
                          return (
                            <div key={key} className={classes.historyRow}>
                              <span>{key}</span>
                              {items.map((item, index) => (
                                <h5 key={index}>{item}</h5>
                              ))}
                            </div>
                          );
                        }
                      }
                    )}
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
    let visits = await visitModel.find();
    let records = await recordModel.find();
    records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      props: {
        control: JSON.parse(JSON.stringify(control)),
        visits: JSON.parse(JSON.stringify(visits)),
        records: JSON.parse(JSON.stringify(records)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
