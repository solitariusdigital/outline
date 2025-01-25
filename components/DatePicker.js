import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./DatePicker.module.scss";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";
import Kavenegar from "kavenegar";
import {
  toFarsiNumber,
  convertPersianToGregorian,
  isSelectedDateFriday,
  toEnglishNumber,
  isEnglishNumber,
  ganjeDays,
  hajiluDays,
  getCurrentDate,
} from "@/services/utility";
import {
  createVisitApi,
  getUsersApi,
  getVisitsApi,
  createUserApi,
  updateUserApi,
  updateControlApi,
  getControlsApi,
} from "@/services/api";

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
  const [isDateDisabled, setIsDateDisabled] = useState(false);
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [times, setTimes] = useState({});
  const [timeCountPerDate, setTimeCountPerDate] = useState(null);
  let originalTimes = {
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
  const doctors = ["دکتر فراهانی", "دکتر گنجه", "دکتر حاجیلو"];
  const targetInputBox = useRef(null);

  useEffect(() => {
    countFullDateTime(selectDoctor);
    const fetchData = async () => {
      try {
        let controls = await getControlsApi();
        const disableDatesArray = Object.keys(
          controls[0].disableDates[selectDoctor]
        ).map((dateString) => {
          const [year, month, day] = dateString.split("-").map(Number);
          return { day, month, year };
        });
        setDisableDates(disableDatesArray);
      } catch (error) {
        console.error(error);
      }
    };
    if (!currentUser.super) {
      fetchData();
    }
  }, [day, selectDoctor]);

  useEffect(() => {
    const checkDate = async () => {
      if (day) {
        const result = await checkDisableDate(day);
        setIsDateDisabled(result);
      } else {
        setIsDateDisabled(false);
      }
    };

    checkDate();
  }, [day]);

  const scrollToDivInputBox = () => {
    if (targetInputBox.current) {
      targetInputBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createVisit = async () => {
    setDisableButton(true);

    if (!day || !time) {
      showAlert("روز و زمان الزامیست");
      setDisableButton(false);
      return;
    }
    if (!name || !selectDoctor) {
      showAlert("نام و موبایل الزامیست");
      setDisableButton(false);
      return;
    }
    if (currentUser.permission === "admin" && !phone) {
      showAlert("موبایل الزامیست");
      setDisableButton(false);
      return;
    }
    let phoneEnglish = isEnglishNumber(phone) ? phone : toEnglishNumber(phone);
    if (
      (currentUser.permission === "admin" && phoneEnglish.length !== 11) ||
      !phoneEnglish.startsWith("09")
    ) {
      showAlert("موبایل اشتباه");
      setDisableButton(false);
      return;
    }
    if (currentUser.permission === "admin") {
      let hasConflict = await checkExistingBooking(phoneEnglish);
      if (hasConflict) {
        window.alert("نوبت در زمان مشابه ثبت شده");
        setDisableButton(false);
        return;
      }
    }

    let colorCode = adminColorCode[currentUser["_id"]] ?? "#EAD8B1";
    let userId = await setUserId(phoneEnglish);
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

  // Check for existing visit on the selected date time
  const checkExistingBooking = async (phoneEnglish) => {
    try {
      const users = await getUsersApi();
      let userData = users.find((user) => user.phone === phoneEnglish);
      if (userData) {
        const visits = await getVisitsApi();
        let visitData = visits.filter(
          (visit) => visit.userId === userData["_id"]
        );
        const hasConflict = visitData.some(
          (visit) => visit.time === selectedDate
        );
        return hasConflict;
      }
      return false;
    } catch (error) {
      return false;
    }
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
          name: name.trim(),
        };
        await updateUserApi(user);
      }
      return userData["_id"];
    } else {
      const user = {
        ...currentUser,
        name: name.trim(),
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
      ganjeDays(day),
      hajiluDays(day),
      day
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
    ganjeDays,
    hajiluDays,
    day
  ) => {
    if (selectDoctor === "دکتر حاجیلو" && !hajiluDays) {
      setTimes({});
      setDisplayForm(false);
      return;
    }
    if (
      selectDoctor === "دکتر فراهانی" &&
      (day.month > 11 || (day.day > 15 && day.month === 11) || day.year > 1403)
    ) {
      originalTimes = {
        "10:30": { active: false, count: 0 },
        "11:00": { active: false, count: 0 },
        "11:30": { active: false, count: 0 },
        "12:00": { active: false, count: 0 },
        "12:30": { active: false, count: 0 },
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
      setTimes(originalTimes);
      setDisplayForm(true);
    }
    setDisplayForm(true);
    let timeToUse;
    if (isSelectedDateFriday) {
      timeToUse = Object.entries(originalTimes)
        .slice(9)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
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
          if (
            (currentUser.permission === "patient" ||
              currentUser.permission === "staff") &&
            timeCount >= 3
          ) {
            delete updatedTimes[time];
          }
        });
      }
    });
    if (
      (currentUser.permission === "patient" ||
        currentUser.permission === "staff") &&
      compareDates(day)
    ) {
      // Loop through the times and delete any time that has past
      for (const time in updatedTimes) {
        if (time < getCurrentFormattedTime()) {
          delete updatedTimes[time];
        }
      }
    }
    if (selectDoctor === "دکتر گنجه" && ganjeDays) {
      setTimes({});
      setDisplayForm(false);
      if (selectDoctor === "دکتر گنجه" && day.day === 8 && day.month === 11) {
        setTimes(originalTimes);
        setDisplayForm(true);
        return;
      }
      return;
    }
    if (selectDoctor === "دکتر حاجیلو") {
      // Remove last available hour from the time object
      const keys = Object.keys(updatedTimes);
      const lastKey = keys[keys.length - 1];
      delete updatedTimes[lastKey];
      setTimes(updatedTimes);
    } else {
      setTimes(updatedTimes);
    }
  };

  // to compare today's date with the selected date
  const compareDates = (day) => {
    let currentDate = getCurrentDate();
    let gregorianDate = convertPersianToGregorian(day);
    const currentSelectedDate = new Date(gregorianDate);
    // Format to 'YYYY-MM-DD' for comparison
    const currentDateFormatted = currentDate.toISOString().split("T")[0];
    const selectedDateFormatted = currentSelectedDate
      .toISOString()
      .split("T")[0];
    return currentDateFormatted === selectedDateFormatted;
  };

  const getCurrentFormattedTime = () => {
    const options = {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    return formatter.format(new Date());
  };

  // Function to convert Farsi time strings to English
  const convertFullTimeToEnglish = (fullTime) => {
    let splitTime = fullTime.split(":");
    return `${toEnglishNumber(splitTime[0])}:${toEnglishNumber(splitTime[1])}`;
  };

  const updateDisableDays = async (dayObject, type) => {
    const message = `${
      type === "disable" ? "بستن روز، مطمئنی؟" : "باز کردن روز، مطمئنی؟"
    }`;
    const confirm = window.confirm(message);
    if (confirm) {
      const formatDateKey = `${dayObject.year}-${dayObject.month}-${dayObject.day}`;
      let controls = await getControlsApi();
      switch (type) {
        case "disable":
          controls[0].disableDates = {
            ...controls[0].disableDates,
            [selectDoctor]: {
              ...controls[0].disableDates[selectDoctor],
              [formatDateKey]: true,
            },
          };
          break;
        case "active":
          if (
            controls[0].disableDates[selectDoctor].hasOwnProperty(formatDateKey)
          ) {
            delete controls[0].disableDates[selectDoctor][formatDateKey];
          }
          break;
      }
      await updateControlApi(controls[0]);
      setDay(dateObject);
      setTimes({});
    }
  };

  const checkDisableDate = async (dayObject) => {
    let controls = await getControlsApi();
    let disableDatesObject = controls[0].disableDates[selectDoctor];
    if (disableDatesObject) {
      const dateString = `${dayObject.year}-${dayObject.month}-${dayObject.day}`;
      const isDateDisabled = dateString in disableDatesObject;
      return isDateDisabled;
    }
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const renderMessage = () => {
    if (selectDoctor === "دکتر فراهانی") {
      return <p className={classes.message}>نوبت در این روز پر است</p>;
    }
    if (selectDoctor === "دکتر گنجه") {
      if (day.day === 8 && day.month === 11) {
        return;
      }
      if (!ganjeDays(day)) {
        return <p className={classes.message}>نوبت در این روز پر است</p>;
      } else {
        return (
          <p className={classes.message}>
            نوبت دکتر گنجه شنبه و سه‌شنبه و پنجشنبه
          </p>
        );
      }
    }
    if (selectDoctor === "دکتر حاجیلو") {
      if (hajiluDays(day)) {
        return <p className={classes.message}>نوبت در این روز پر است</p>;
      } else {
        return (
          <p className={classes.message}>نوبت دکتر حاجیلو شنبه تا چهارشنبه</p>
        );
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.input}>
        <select
          defaultValue={"default"}
          onChange={(e) => {
            setSelectDoctor(e.target.value);
            countFullDateTime(e.target.value);
            setDisplayForm(false);
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
      {day &&
        currentUser.super &&
        (isDateDisabled ? (
          <button
            className={classes.activeButton}
            onClick={() => updateDisableDays(day, "active")}
          >
            باز کردن روز
          </button>
        ) : (
          <button
            className={classes.disableButton}
            onClick={() => updateDisableDays(day, "disable")}
          >
            بستن روز
          </button>
        ))}
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
        <Fragment>{renderMessage()}</Fragment>
      )}
      {selectDoctor && displayForm && (
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
