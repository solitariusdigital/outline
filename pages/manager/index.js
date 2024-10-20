import { useState, useEffect } from "react";
import classes from "./manager.module.scss";
import dbConnect from "@/services/dbConnect";
import controlModel from "@/models/Control";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import { getSingleUserApi } from "@/services/api";
import { calculateTimeDifference } from "@/services/utility";

export default function Manager({ control }) {
  const [controlData, setControlData] = useState(control[0]);
  const [userData, setUsersData] = useState([]);
  const [displaySelectedUser, setDisplaySelectedUser] = useState(null);
  const [filterSelectedUser, setFilterSelectedUser] = useState(null);

  const months = [
    "۰۱",
    "۰۲",
    "۰۳",
    "۰۴",
    "۰۵",
    "۰۶",
    "۰۷",
    "۰۸",
    "۰۹",
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
    fetchUserData();
  }, [controlData]);

  const filterDisplayMonths = (monthNumber, typeNumber) => {
    setDisplaySelectedUser(displaySelectedUser);
    let filtered = displaySelectedUser.timesheets.filter((data) => {
      const parts = data.date.split("/");
      return parts[typeNumber] === monthNumber;
    });
    setFilterSelectedUser((prevData) => ({
      ...prevData,
      timesheets: filtered,
    }));
  };

  const assignUserData = (index) => {
    setFilterSelectedUser(userData[index]);
    setDisplaySelectedUser(userData[index]);
  };

  return (
    <div className={classes.container}>
      <HomeIcon onClick={() => Router.push("/")} className="icon" />
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
      <h2>{filterSelectedUser?.userData?.name}</h2>
      {filterSelectedUser && (
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
      {filterSelectedUser?.timesheets
        .map((sheet, index) => (
          <div key={index} value={index} className={classes.timesheetCard}>
            <div className={classes.row}>
              <h4>{sheet.date}</h4>
              <div
                className={classes.row}
                style={{
                  width: "110px",
                }}
              >
                <p>
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
                </p>
                <p>
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
                </p>
              </div>
            </div>
            <div className={classes.row}>
              <p>ورود</p>
              <p>{sheet.timesheet.checkIn}</p>
              <p>{sheet.address.checkIn}</p>
            </div>
            <div className={classes.row}>
              <p>خروج</p>
              <p>{sheet.timesheet.checkOut}</p>
              <p>{sheet.address.checkOut}</p>
            </div>
          </div>
        ))
        .reverse()}
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