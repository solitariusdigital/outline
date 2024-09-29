import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./DatePicker.module.scss";
import {
  toFarsiNumber,
  convertPersianToGregorian,
  isSelectedDateFriday,
  toEnglishNumber,
  isEnglishNumber,
  isNotThursday,
} from "@/services/utility";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  createVisitApi,
  getUsersApi,
  createUserApi,
  updateUserApi,
} from "@/services/api";
import Router from "next/router";
import Kavenegar from "kavenegar";

export default function DatePicker({ visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const { adminColorCode, setAdminColorCode } = useContext(StateContext);
  const [name, setName] = useState(
    currentUser.permission === "admin" ? "" : currentUser.name
  );
  const [title, setTitle] = useState("");
  const [phone, setPhone] = useState(
    currentUser.permission === "admin" ? "" : currentUser.phone
  );
  const [day, setDay] = useState(null);
  const [time, setTime] = useState("");
  const [dateObject, setDateObject] = useState("");
  const [disableDates, setDisableDates] = useState([]);
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [times, setTimes] = useState({});
  const [timeCountPerDate, setTimeCountPerDate] = useState(null);
  const originalTimes = {
    "13:00": { active: false, count: 0 },
    "13:30": { active: false, count: 0 },
    "14:00": { active: false, count: 0 },
    "14:30": { active: false, count: 0 },
    "15:00": { active: false, count: 0 },
    "15:30": { active: false, count: 0 },
    "16:00": { active: false, count: 0 },
    "16:30": { active: false, count: 0 },
    "17:00": { active: false, count: 0 },
    "17:30": { active: false, count: 0 },
    "18:00": { active: false, count: 0 },
    "18:30": { active: false, count: 0 },
  };
  const doctors = ["دکتر فراهانی", "دکتر گنجه"];
  const targetInputBox = useRef(null);

  useEffect(() => {
    countFullDateTime(selectDoctor);
    if (currentUser.permission !== "admin") {
      setDisableDates([{ day: 13, month: 7, year: 1403 }]);
    }
  }, []);

  const scrollToDivInputBox = () => {
    if (targetInputBox.current) {
      targetInputBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createVisit = async () => {
    if (!day || !time) {
      showAlert("روز و زمان الزامیست");
      return;
    }
    if (!name || !selectDoctor) {
      showAlert("نام و موبایل الزامیست");
      return;
    }
    if (currentUser.permission === "admin" && !phone) {
      showAlert("موبایل الزامیست");
      return;
    }
    let phoneEnglish = isEnglishNumber(phone) ? phone : toEnglishNumber(phone);
    if (
      (currentUser.permission === "admin" && phoneEnglish.length !== 11) ||
      !phoneEnglish.startsWith("09")
    ) {
      showAlert("موبایل اشتباه");
      return;
    }
    setDisableButton(true);
    let colorCode = adminColorCode[currentUser["_id"]] ?? "#EAD8B1";
    let userId = await setUserId(phoneEnglish);
    // create a new visit object
    let visit = {
      title: title ? title.trim() : "-",
      userId: userId,
      doctor: selectDoctor,
      time: selectedDate,
      date: dateObject,
      adminId: currentUser["_id"],
      adminColor: colorCode,
      completed: false,
      canceled: false,
    };
    await createVisitApi(visit);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    api.VerifyLookup(
      {
        receptor: phoneEnglish,
        token: selectedDate.split(" - ")[0].trim(),
        token2: selectedDate.split(" - ")[1].trim(),
        template: "confirmationOutline",
      },
      function (response, status) {}
    );
    Router.push({
      pathname: `/portal/${currentUser.permission}`,
      query: { id: currentUser["_id"], p: currentUser.permission },
    });
  };

  const setUserId = async (phoneEnglish) => {
    if (currentUser.permission === "admin") {
      let userData = null;
      const users = await getUsersApi();
      userData = users.find((user) => user.phone === phoneEnglish);
      if (!userData) {
        const user = {
          name: name.trim(),
          phone: phoneEnglish,
          permission: "patient",
        };
        userData = await createUserApi(user);
      } else {
        const user = {
          ...userData,
          name: name,
        };
        await updateUserApi(user);
      }
      return userData["_id"];
    } else {
      const user = {
        ...currentUser,
        name: name,
      };
      let userData = await updateUserApi(user);
      setCurrentUser(userData);
      return currentUser["_id"];
    }
  };

  const resetTime = () => {
    let updatedTime = { ...times };
    Object.keys(updatedTime).forEach((v) => (updatedTime[v] = false));
    setTimes(updatedTime);
  };

  const assingDay = (day) => {
    setDay(day);
    resetTime();
    setSelectedDate("");
    setTime("");

    updateDisplayTime(
      `${toFarsiNumber(day.year)}/${toFarsiNumber(day.month)}/${toFarsiNumber(
        day.day
      )}`,
      isSelectedDateFriday(day),
      isNotThursday(day)
    );
  };

  const displayDate = (time) => {
    scrollToDivInputBox();
    let gregorian = convertPersianToGregorian(day, time);
    setDateObject(gregorian);
    let updatedTime = { ...times };
    Object.keys(times).forEach((item) => {
      updatedTime[item].active = item === time;
    });
    setTimes(updatedTime);
    setTime(time);
    setSelectedDate(
      `${toFarsiNumber(day.year)}/${toFarsiNumber(day.month)}/${toFarsiNumber(
        day.day
      )} - ${
        toFarsiNumber(time).slice(0, 2) + ":" + toFarsiNumber(time).slice(2)
      }`
    );
  };

  // Count occurrences of each date and time
  const countFullDateTime = (selectDoctor) => {
    const dateCount = {};
    const timeCountPerDate = {};
    visits
      .filter((visit) => visit.doctor === selectDoctor)
      .forEach((visit) => {
        let dateString = visit.time.split(" - ")[0].trim();
        let timeString = visit.time.split(" - ")[1].trim();
        // Count occurrences of dates
        dateCount[dateString] = (dateCount[dateString] || 0) + 1;
        // Initialize time count for the specific date
        if (!timeCountPerDate[dateString]) {
          timeCountPerDate[dateString] = {};
        }
        // Count occurrences of times for the specific date
        timeCountPerDate[dateString][convertFullTimeToEnglish(timeString)] =
          (timeCountPerDate[dateString][convertFullTimeToEnglish(timeString)] ||
            0) + 1;
      });
    setTimeCountPerDate(timeCountPerDate);
  };

  const updateDisplayTime = (
    selectedDate,
    isSelectedDateFriday,
    isNotThursday
  ) => {
    if (selectDoctor === "دکتر گنجه" && isNotThursday) {
      setTimes({});
      return;
    }
    let timeToUse;
    if (isSelectedDateFriday) {
      timeToUse = Object.entries(originalTimes)
        .slice(4)
        .reduce((acc, [key, value]) => {
          acc[key] = value; // Convert back to object
          return acc;
        }, {});
    } else {
      timeToUse = originalTimes;
    }
    let updatedTimes = { ...timeToUse };
    Object.keys(timeCountPerDate).forEach((date) => {
      if (date === selectedDate) {
        Object.keys(timeCountPerDate[date]).forEach((time) => {
          const timeCount = timeCountPerDate[date][time];
          updatedTimes[time].count = timeCountPerDate[date][time];
          if (currentUser.permission === "patient" && timeCount >= 3) {
            delete updatedTimes[time];
          }
        });
      }
    });
    setTimes(updatedTimes);
  };

  // Function to convert Farsi time strings to English
  const convertFullTimeToEnglish = (fullTime) => {
    let splitTime = fullTime.split(":");
    return `${toEnglishNumber(splitTime[0])}:${toEnglishNumber(splitTime[1])}`;
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <div className={classes.container}>
      <div className={classes.input}>
        <select
          defaultValue={"default"}
          onChange={(e) => {
            setSelectDoctor(e.target.value);
            countFullDateTime(e.target.value);
            setSelectedDate("");
            setDay(null);
            setTimes({});
          }}
        >
          <option value="default" disabled>
            {selectDoctor ? selectDoctor : "انتخاب دکتر"}
          </option>
          {doctors.map((doctor, index) => {
            return (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            );
          })}
        </select>
      </div>
      {selectDoctor && (
        <Calendar
          value={day}
          onChange={(day) => assingDay(day)}
          shouldHighlightWeekends
          minimumDate={utils("fa").getToday()}
          locale="fa"
          disabledDays={disableDates}
        />
      )}
      {day && currentUser.permission === "admin" && (
        <h3 className={classes.totalCount}>
          {Object.values(times).reduce((acc, time) => acc + time.count, 0)}
        </h3>
      )}
      <div className={classes.timeContainer}>
        {Object.keys(times).map((time, index) => (
          <div key={index} className={classes.timeBox}>
            {currentUser.permission === "admin" && (
              <p className={classes.count}>{times[time]["count"]}</p>
            )}
            <p
              className={times[time].active ? classes.activeTime : classes.time}
              onClick={() => displayDate(time)}
            >
              {toFarsiNumber(time).slice(0, 2) +
                ":" +
                toFarsiNumber(time).slice(2)}
            </p>
          </div>
        ))}
      </div>
      {day && Object.keys(times).length === 0 && (
        <Fragment>
          {selectDoctor === "دکتر فراهانی" && (
            <p className={classes.message}>
              نوبت در این روز پر است. روز دیگر انتخاب کنید
            </p>
          )}
          {selectDoctor === "دکتر گنجه" && !isNotThursday(day) && (
            <p className={classes.message}>
              نوبت در این روز پر است. روز دیگر انتخاب کنید
            </p>
          )}
          {selectDoctor === "دکتر گنجه" && isNotThursday(day) && (
            <p className={classes.message}>
              نوبت با دکتر گنجه روزهای پنجشنبه فراهم است
            </p>
          )}
        </Fragment>
      )}
      {selectDoctor && (
        <Fragment>
          <div className={classes.input} ref={targetInputBox}>
            <div className={classes.bar}>
              <p className={classes.label}>
                نام
                <span>*</span>
              </p>
              <CloseIcon
                className="icon"
                onClick={() => setName("")}
                sx={{ fontSize: 16 }}
              />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoComplete="off"
              dir="rtl"
            />
            {currentUser.permission === "admin" && (
              <Fragment>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    موبایل
                    <span>*</span>
                  </p>
                  <CloseIcon
                    className="icon"
                    onClick={() => setPhone("")}
                    sx={{ fontSize: 16 }}
                  />
                </div>
                <input
                  placeholder="09123456789"
                  type="tel"
                  id="phone"
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                  value={phone}
                  autoComplete="off"
                  dir="rtl"
                />
              </Fragment>
            )}
            <div className={classes.bar}>
              <p className={classes.label}>موضوع اختیاری</p>
              <CloseIcon
                className="icon"
                onClick={() => setTitle("")}
                sx={{ fontSize: 16 }}
              />
            </div>
            <input
              placeholder="بوتاکس"
              type="text"
              id="title"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              autoComplete="off"
              dir="rtl"
            />
          </div>
          {selectedDate && (
            <p className={classes.message}>{selectedDate} ساعت</p>
          )}
          <button
            className={classes.button}
            disabled={disableButton}
            onClick={() => createVisit()}
          >
            ثبت نوبت
          </button>
        </Fragment>
      )}
      {alert && <p className="alert">{alert}</p>}
    </div>
  );
}
