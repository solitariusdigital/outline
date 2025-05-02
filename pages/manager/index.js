import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./manager.module.scss";
import dbConnect from "@/services/dbConnect";
import controlModel from "@/models/Control";
import visitModel from "@/models/Visit";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import {
  getSingleUserApi,
  updateControlApi,
  getControlsApi,
} from "@/services/api";
import {
  calculateTimeDifference,
  getCurrentDateFarsi,
} from "@/services/utility";

export default function Manager({ control, visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [controlData, setControlData] = useState(control[0]);
  const [userData, setUsersData] = useState([]);
  const [allUserData, setAllUserData] = useState(null);
  const [displaySelectedUser, setDisplaySelectedUser] = useState(null);
  const [count, setCount] = useState({});
  const [currentYear, setCurrentYear] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [navigation, setNavigation] = useState("time" || "reminder" || "count");
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
    if (controlData.timesheets && (currentUser?.super || currentUser?.access)) {
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

  return (
    <div className={classes.container}>
      <HomeIcon onClick={() => Router.push("/")} className="icon" />
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
        </Fragment>
      )}
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
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let control = await controlModel.find();
    let visits = await visitModel.find();

    return {
      props: {
        control: JSON.parse(JSON.stringify(control)),
        visits: JSON.parse(JSON.stringify(visits)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
