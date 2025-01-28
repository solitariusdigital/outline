import { useContext, useState, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./manager.module.scss";
import dbConnect from "@/services/dbConnect";
import controlModel from "@/models/Control";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import { getSingleUserApi } from "@/services/api";
import { calculateTimeDifference } from "@/services/utility";

export default function Manager({ control }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [controlData, setControlData] = useState(control[0]);
  const [userData, setUsersData] = useState([]);
  const [allUserData, setAllUserData] = useState(null);
  const [displaySelectedUser, setDisplaySelectedUser] = useState(null);
  const [navigation, setNavigation] = useState("time" || "reminder");

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
          <div className={classes.header}>
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

      {navigation === "reminder" && (
        <div className={classes.reminder}>
          {Object.keys(controlData.reminder)
            .map((time, index) => (
              <p key={index} className={classes.timesheetCard}>
                {time}
              </p>
            ))
            .reverse()}
        </div>
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
