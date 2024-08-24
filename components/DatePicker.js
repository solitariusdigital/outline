import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./DatePicker.module.scss";
import { toFarsiNumber } from "@/services/utility";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
// import { Calendar, utils } from "react-modern-calendar-datepicker";
// import "react-modern-calendar-datepicker/lib/DatePicker.css";
import CloseIcon from "@mui/icons-material/Close";
import {
  createVisitApi,
  getDoctorApi,
  updateDoctorApi,
  getUserApi,
  getUsersApi,
  updateUserApi,
  createUserApi,
} from "@/services/api";
import Kavenegar from "kavenegar";

export default function DatePicker({ doctorId, recordId }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
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

  const createVisit = async () => {
    if (!day || !time) {
      showAlert("روز و زمان الزامیست");
      return;
    }
    if (!name || !title) {
      showAlert("نام و موضوع الزامیست");
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
      doctorId: doctorId,
      recordId: recordId ? recordId : "",
      time: selectedDate,
      completed: false,
      canceled: false,
    };
    let newVisit = await createVisitApi(visit);
    await updateDoctorObject(newVisit["_id"]);
    await updateUserObject(userId);

    let reserveDate = `${toFarsiNumber(day.year)}/${toFarsiNumber(
      day.month
    )}/${toFarsiNumber(day.day)}`;
    let reserveTime = `${
      toFarsiNumber(time).slice(0, 2) + ":" + toFarsiNumber(time).slice(2)
    }`;

    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    api.VerifyLookup(
      {
        receptor: phone,
        token: reserveDate,
        token2: reserveTime,
        template: "confirmation",
      },
      function (response, status) {}
    );
    window.location.assign("/portal");
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
      }
      return userData["_id"];
    } else {
      return currentUser["_id"];
    }
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const updateDoctorObject = async (id) => {
    // add new visit and user to doctor object
    let doctor = await getDoctorApi(doctorId);
    doctor.visits.push(id);
    if (!doctor.users.includes(currentUser["_id"])) {
      doctor.users.push(currentUser["_id"]);
    }
    await updateDoctorApi(doctor);
  };

  const updateUserObject = async (id) => {
    // add new doctor to user object
    let user = await getUserApi(id);
    user.name = name;
    if (!user.doctors.includes(doctorId)) {
      user.doctors.push(doctorId);
    }
    await updateUserApi(user);
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
        <div className={classes.bar}>
          <p className={classes.label}>
            موضوع مراجعه
            <span>*</span>
          </p>
          <CloseIcon
            className="icon"
            onClick={() => setTitle("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          placeholder="فیلر صورت"
          type="text"
          id="title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoComplete="off"
          dir="rtl"
        />
      </div>
      {alert && <p className="alert">{alert}</p>}
      {selectedDate && <p className={classes.message}>{selectedDate} ساعت</p>}
      <button
        className={classes.button}
        disabled={disableButton}
        onClick={() => createVisit()}
      >
        ثبت
      </button>
    </div>
  );
}
