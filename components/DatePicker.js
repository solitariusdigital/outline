import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./DatePicker.module.scss";
import { toFarsiNumber, convertPersianToGregorian } from "@/services/utility";
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

export default function DatePicker() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);

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

  const [alert, setAlert] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [times, setTimes] = useState({
    "10:00": false,
    "11:00": false,
    "12:00": false,
    "13:00": false,
    "14:00": false,
    "15:00": false,
    "16:00": false,
    "17:00": false,
    "18:00": false,
    "19:00": false,
    "20:00": false,
  });
  const [disableButton, setDisableButton] = useState(false);

  const doctors = ["دکتر فراهانی", " دکتر گنجه"];

  const createVisit = async () => {
    if (!day || !time) {
      showAlert("روز و زمان الزامیست");
      return;
    }
    if (!name || !title || !selectDoctor) {
      showAlert("همه موارد الزامیست");
      return;
    }
    if (currentUser.permission === "admin" && !phone) {
      showAlert("موبایل الزامیست");
      return;
    }
    if (
      (currentUser.permission === "admin" && phone.length !== 11) ||
      !phone.startsWith("09")
    ) {
      showAlert("موبایل اشتباه");
      return;
    }
    setDisableButton(true);
    let userId = await setUserId();
    // create a new visit object
    let visit = {
      title: title,
      userId: userId,
      doctor: selectDoctor,
      time: selectedDate,
      date: dateObject,
      completed: false,
      canceled: false,
    };
    await createVisitApi(visit);

    let reserveDate = `${toFarsiNumber(day.year)}/${toFarsiNumber(
      day.month
    )}/${toFarsiNumber(day.day)}`;
    let reserveTime = `${
      toFarsiNumber(time).slice(0, 2) + ":" + toFarsiNumber(time).slice(2)
    }`;

    // const api = Kavenegar.KavenegarApi({
    //   apikey: kavenegarKey,
    // });
    // api.VerifyLookup(
    //   {
    //     receptor: phone,
    //     token: reserveDate,
    //     token2: reserveTime,
    //     template: "confirmation",
    //   },
    //   function (response, status) {}
    // );
    Router.push({
      pathname: `/portal/${currentUser.permission}`,
      query: { id: currentUser["_id"], p: currentUser.permission },
    });
  };

  const setUserId = async () => {
    if (currentUser.permission === "admin") {
      let userData = null;
      const users = await getUsersApi();
      userData = users.find((user) => user.phone === phone);
      if (!userData) {
        const user = {
          name: name,
          phone: phone.trim(),
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

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
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
  };

  const displayDate = (time) => {
    let gregorian = convertPersianToGregorian(day);
    setDateObject(gregorian);

    let updatedTime = { ...times };
    Object.keys(times).forEach((item) =>
      item === time ? (updatedTime[item] = true) : (updatedTime[item] = false)
    );
    setTimes(updatedTime);
    if (day) {
      setTime(time);
      setSelectedDate(
        `${toFarsiNumber(day.year)}/${toFarsiNumber(day.month)}/${toFarsiNumber(
          day.day
        )} - ${
          toFarsiNumber(time).slice(0, 2) + ":" + toFarsiNumber(time).slice(2)
        }`
      );
    } else {
      setAlert("روز انتخاب کنید");
      resetTime();
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  };

  return (
    <div className={classes.container}>
      <h2>{selectDoctor}</h2>
      <Calendar
        value={day}
        onChange={(day) => assingDay(day)}
        shouldHighlightWeekends
        minimumDate={utils("fa").getToday()}
        locale="fa"
      />
      <div className={classes.timeContainer}>
        {Object.keys(times).map((time, index) => (
          <p
            key={index}
            className={times[time] ? classes.activeTime : classes.time}
            onClick={() => displayDate(time)}
          >
            {toFarsiNumber(time).slice(0, 2) +
              ":" +
              toFarsiNumber(time).slice(2)}
          </p>
        ))}
      </div>
      <div className={classes.input}>
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
              value={phone}
              autoComplete="off"
              dir="rtl"
            />
          </Fragment>
        )}
        <div className={classes.input}>
          <div className={classes.bar}>
            <p className={classes.label}>
              دکتر
              <span>*</span>
            </p>
          </div>
          <select
            defaultValue={"default"}
            onChange={(e) => setSelectDoctor(e.target.value)}
          >
            <option value="default" disabled>
              {selectDoctor ? selectDoctor : "انتخاب"}
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
        <div className={classes.bar}>
          <p className={classes.label}>
            موضوع نوبت
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
      </div>
      {selectedDate && <p className={classes.message}>{selectedDate} ساعت</p>}
      <button
        className={classes.button}
        disabled={disableButton}
        onClick={() => createVisit()}
      >
        ثبت نوبت
      </button>
      {alert && <p className="alert">{alert}</p>}
    </div>
  );
}
