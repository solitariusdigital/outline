import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
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
  tehranBranch,
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
  const { selectBranch, setSelectBranch } = useContext(StateContext);
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
    "13:00": { display: true, active: false, count: 0 },
    "13:30": { display: true, active: false, count: 0 },
    "14:00": { display: true, active: false, count: 0 },
    "14:30": { display: true, active: false, count: 0 },
    "15:00": { display: true, active: false, count: 0 },
    "15:30": { display: true, active: false, count: 0 },
    "16:00": { display: true, active: false, count: 0 },
    "16:30": { display: true, active: false, count: 0 },
    "17:00": { display: true, active: false, count: 0 },
    "17:30": { display: true, active: false, count: 0 },
    "18:00": { display: true, active: false, count: 0 },
    "18:30": { display: true, active: false, count: 0 },
  };
  let topics = ["بوتاکس", "فیلر", "مشاوره", "ترمیم", "سایر"];
  const doctors = ["دکتر فراهانی", "دکتر گنجه"];
  const targetInputBox = useRef(null);

  const router = useRouter();

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
    if (!name) {
      showAlert("نام الزامیست");
      setDisableButton(false);
      return;
    }
    if (currentUser.permission === "patient" && !title) {
      showAlert("موضوع الزامیست");
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
      let checkBooking = await checkActiveBooking(phoneEnglish);
      if (checkBooking.hasConflict) {
        window.alert(`بیمار نوبت فعال دارد ${checkBooking.conflictingTime}`);
        setDisableButton(false);
        return;
      }
    }

    let colorCode = adminColorCode[currentUser["_id"]]?.color ?? "#EAD8B1";
    let userId = await setUserId(phoneEnglish);
    let visit = {
      title: title ? title.trim() : "-",
      userId: userId,
      doctor: selectDoctor,
      time: selectedDate,
      date: dateObject,
      adminId: currentUser["_id"],
      adminColor: colorCode,
      branch: selectBranch,
      completed: false,
      canceled: false,
    };

    await createVisitApi(visit);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    api.VerifyLookup({
      receptor: phoneEnglish,
      token: selectedDate.split(" - ")[0].trim(),
      token2: selectedDate.split(" - ")[1].trim(),
      template: "confirmationOutline",
    });
    if (currentUser.permission === "admin") {
      router.reload(router.asPath);
    } else {
      Router.push({
        pathname: `/portal/${currentUser.permission}`,
        query: { id: currentUser["_id"], p: currentUser.permission },
      });
    }
  };

  // Helper function to get visit data for a user
  const getUserVisits = async (phoneEnglish) => {
    try {
      const users = await getUsersApi();
      let userData = users.find((user) => user.phone === phoneEnglish);
      if (userData) {
        const visits = await getVisitsApi();
        return visits.filter((visit) => visit.userId === userData["_id"]);
      }
      return [];
    } catch (error) {
      return [];
    }
  };
  // Check for active visit
  const checkActiveBooking = async (phoneEnglish) => {
    const visitData = await getUserVisits(phoneEnglish);
    const conflictingVisit = visitData.find(
      (visit) => !visit.canceled && !visit.completed
    );
    const hasConflict = !!conflictingVisit; // Convert to boolean
    return {
      hasConflict,
      conflictingTime: conflictingVisit ? conflictingVisit.time : null,
    };
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
      tehranBranch(day),
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

  const setOriginalTimes = (doctor, branch) => {
    const times = {
      "دکتر گنجه": {
        "11:00": { display: false, active: false, count: 0 },
        "11:30": { display: false, active: false, count: 0 },
        "12:00": { display: false, active: false, count: 0 },
        "12:30": { display: false, active: false, count: 0 },
        "13:00": { display: true, active: false, count: 0 },
        "13:30": { display: true, active: false, count: 0 },
        "14:00": { display: true, active: false, count: 0 },
        "14:30": { display: true, active: false, count: 0 },
        "15:00": { display: true, active: false, count: 0 },
        "15:30": { display: true, active: false, count: 0 },
        "16:00": { display: true, active: false, count: 0 },
        "16:30": { display: true, active: false, count: 0 },
        "17:00": { display: true, active: false, count: 0 },
        "17:30": { display: true, active: false, count: 0 },
        "18:00": { display: true, active: false, count: 0 },
        "18:30": { display: true, active: false, count: 0 },
      },
      "دکتر فراهانی": {
        tehran: {
          "10:30": { display: false, active: false, count: 0 },
          "11:00": { display: false, active: false, count: 0 },
          "11:30": { display: false, active: false, count: 0 },
          "12:00": { display: false, active: false, count: 0 },
          "12:30": { display: false, active: false, count: 0 },
          "13:00": { display: true, active: false, count: 0 },
          "13:30": { display: true, active: false, count: 0 },
          "14:00": { display: true, active: false, count: 0 },
          "14:30": { display: true, active: false, count: 0 },
          "15:00": { display: true, active: false, count: 0 },
          "15:30": { display: true, active: false, count: 0 },
          "16:00": { display: true, active: false, count: 0 },
          "16:30": { display: true, active: false, count: 0 },
          "17:00": { display: true, active: false, count: 0 },
          "17:30": { display: true, active: false, count: 0 },
          "18:00": { display: true, active: false, count: 0 },
          "18:30": { display: true, active: false, count: 0 },
        },
        kish: {
          "10:30": { display: false, active: false, count: 0 },
          "11:00": { display: false, active: false, count: 0 },
          "11:30": { display: false, active: false, count: 0 },
          "12:00": { display: false, active: false, count: 0 },
          "12:30": { display: false, active: false, count: 0 },
          "13:00": { display: false, active: false, count: 0 },
          "13:30": { display: false, active: false, count: 0 },
          "14:00": { display: false, active: false, count: 0 },
          "14:30": { display: false, active: false, count: 0 },
          "15:00": { display: false, active: false, count: 0 },
          "15:30": { display: false, active: false, count: 0 },
          "16:00": { display: true, active: false, count: 0 },
          "16:30": { display: true, active: false, count: 0 },
          "17:00": { display: true, active: false, count: 0 },
          "17:30": { display: true, active: false, count: 0 },
          "18:00": { display: true, active: false, count: 0 },
          "18:30": { display: false, active: false, count: 0 },
          "19:00": { display: false, active: false, count: 0 },
          "19:30": { display: false, active: false, count: 0 },
          "20:00": { display: false, active: false, count: 0 },
        },
      },
    };
    if (doctor === "دکتر گنجه") {
      return times["دکتر گنجه"];
    } else if (doctor === "دکتر فراهانی") {
      return times["دکتر فراهانی"][branch] || {};
    }
    return {};
  };

  const updateDisplayTime = (
    selectedDate,
    isSelectedDateFriday,
    ganjeDays,
    tehranBranch,
    day
  ) => {
    if (selectDoctor === "دکتر گنجه" && ganjeDays) {
      setTimes({});
      setDisplayForm(false);
      return;
    }
    if (
      selectDoctor === "دکتر فراهانی" &&
      selectBranch === "tehran" &&
      tehranBranch
    ) {
      setTimes({});
      setDisplayForm(false);
      return;
    }
    if (
      selectDoctor === "دکتر فراهانی" &&
      selectBranch === "kish" &&
      !tehranBranch
    ) {
      setTimes({});
      setDisplayForm(false);
      return;
    }
    originalTimes = setOriginalTimes(selectDoctor, selectBranch);
    setDisplayForm(true);

    let timeToUse;
    if (isSelectedDateFriday) {
      const numberSlice = 9;
      timeToUse = Object.fromEntries(
        Object.entries(originalTimes).slice(numberSlice)
      );
    } else {
      timeToUse = originalTimes;
    }
    let updatedTimes = { ...timeToUse };
    Object.keys(timeCountPerDate).forEach((date) => {
      if (date === selectedDate) {
        Object.keys(timeCountPerDate[date]).forEach((time) => {
          const limitCount = selectBranch === "tehran" ? 3 : 4;
          const timeCount = timeCountPerDate[date][time];
          updatedTimes[time].count = timeCountPerDate[date][time];
          if (
            (currentUser.permission === "patient" ||
              currentUser.permission === "staff") &&
            timeCount >= limitCount
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
    setTimes(updatedTimes);
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

  return (
    <div className={classes.container}>
      {selectBranch === "tehran" && <h5>نوبت‌دهی شعبه تهران</h5>}
      {selectBranch === "kish" && (
        <h5>پنجشنبه و جمعه نوبت‌دهی شعبه کیش فعال است</h5>
      )}
      <div className={classes.input}>
        {selectBranch === "tehran" && (
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
        )}
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
      {day && displayForm && currentUser.permission === "admin" && (
        <h3 className={classes.totalCount}>
          {Object.values(times).reduce((acc, time) => acc + time.count, 0)}
        </h3>
      )}
      <div className={classes.timeContainer}>
        {Object.keys(times).map((time, index) => {
          return times[time]["display"] ? (
            <div key={index} className={classes.timeBox}>
              {currentUser.permission === "admin" && (
                <p className={classes.count}>{times[time]["count"]}</p>
              )}
              <p
                className={
                  times[time].active ? classes.activeTime : classes.time
                }
                onClick={() => displayDate(time)}
              >
                {toFarsiNumber(time).slice(0, 2) +
                  ":" +
                  toFarsiNumber(time).slice(2)}
              </p>
            </div>
          ) : null;
        })}
      </div>
      {day && Object.keys(times).length === 0 && (
        <p className={classes.message}>در این روز امکان نوبت‌دهی وجود ندارد</p>
      )}
      {selectDoctor && displayForm && (
        <Fragment>
          <div className={classes.input} ref={targetInputBox}>
            <div className={classes.bar}>
              <p className={classes.label}>
                نام و نام خانوادگی
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
                <div className={classes.input}>
                  <select
                    defaultValue={"default"}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  >
                    <option value="default" disabled>
                      موضوع
                    </option>
                    {topics.map((topic, index) => {
                      return (
                        <option key={index} value={topic}>
                          {topic}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Fragment>
            )}
            {currentUser.permission === "patient" && (
              <Fragment>
                <div className={classes.bar}>
                  <p className={classes.label}>
                    موضوع الزامی
                    <span>*</span>
                  </p>
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
              </Fragment>
            )}
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
          {alert && <p className="alert">{alert}</p>}
        </Fragment>
      )}
    </div>
  );
}
