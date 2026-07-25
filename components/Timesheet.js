import { useContext, useEffect, useState, useCallback } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "@/pages/reservation/reservation.module.scss";
import { updateControlApi, getControlsApi } from "@/services/api";
import { getCurrentDateFarsi, getCurrentTimeFarsi } from "@/services/utility";

const NAVIGATOR_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 60000,
};

export default function Timesheet() {
  const { currentUser } = useContext(StateContext);
  const [checkType, setCheckType] = useState("checkin");
  const [checkDatesComplete, setCheckDatesComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUserAuthorized =
    currentUser?.permission === "admin" || currentUser?.permission === "staff";

  useEffect(() => {
    if (!currentUser || !isUserAuthorized) return;

    let cancelled = false;

    const handleUserVisits = async () => {
      const controlData = await getControlsApi();
      if (cancelled) return;

      const currentDate = getCurrentDateFarsi();
      const currentUserId = currentUser["_id"];
      const userTimesheets = getTimesheets(controlData, currentUserId);

      const todayTimesheet = userTimesheets[currentUserId]?.find(
        (entry) => entry.date === currentDate,
      );
      if (todayTimesheet) {
        const isCheckDatesComplete = Object.values(
          todayTimesheet.timesheet,
        ).every((value) => value !== null);
        setCheckDatesComplete(isCheckDatesComplete);
      }

      const existingEntryIndex = findExistingEntry(
        userTimesheets,
        currentUserId,
      );
      setCheckType(existingEntryIndex === -1 ? "checkin" : "checkout");
    };

    handleUserVisits();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isUserAuthorized]);

  const getTimesheets = (controlData, userId) => {
    const timesheets = { ...(controlData[0].timesheets || {}) };
    if (!timesheets[userId]) {
      timesheets[userId] = [];
    }
    return timesheets;
  };

  const findExistingEntry = (timesheets, userId) => {
    return timesheets[userId].findIndex(
      (entry) => entry.date === getCurrentDateFarsi(),
    );
  };

  // Returns true if the check-in/out was confirmed and applied, false if the
  // user cancelled — callers use this to decide whether to persist/hit the API.
  const handleCheckIn = async (
    currentDate,
    currentTime,
    timesheets,
    userId,
  ) => {
    const confirmed = window.confirm("ثبت ساعت ورود؟");
    if (!confirmed) return false;

    const address = await getUserLocation();
    const newTimesheet = createNewTimesheet(currentDate, currentTime, address);
    timesheets[userId].push(newTimesheet);

    setCheckType("checkout");
    setCheckDatesComplete(false);
    window.alert("ساعت ورود ثبت شد");
    return true;
  };

  const handleCheckOut = async (
    currentTime,
    timesheets,
    userId,
    entryIndex,
  ) => {
    const confirmed = window.confirm("ثبت ساعت اضافه کار؟");
    if (!confirmed) return false;

    const address = await getUserLocation();
    updateExistingTimesheet(
      timesheets,
      userId,
      entryIndex,
      currentTime,
      address,
    );

    setCheckDatesComplete(true);
    window.alert("ساعت اضافه کار ثبت شد");
    return true;
  };

  const getCurrentDateTime = useCallback(async () => {
    if (isSubmitting) return; // guard against double clicks
    setIsSubmitting(true);

    try {
      const currentDate = getCurrentDateFarsi();
      const currentTime = getCurrentTimeFarsi();
      const controlData = await getControlsApi();
      const currentUserId = currentUser["_id"];
      const timesheets = getTimesheets(controlData, currentUserId);
      const existingEntryIndex = findExistingEntry(timesheets, currentUserId);

      const wasConfirmed =
        existingEntryIndex === -1
          ? await handleCheckIn(
              currentDate,
              currentTime,
              timesheets,
              currentUserId,
            )
          : await handleCheckOut(
              currentTime,
              timesheets,
              currentUserId,
              existingEntryIndex,
            );

      // Only write to the API and update local state if the user actually
      // confirmed the dialog. Cancelling now costs zero network calls.
      if (wasConfirmed) {
        await updateControlData(controlData, timesheets);
      }
    } finally {
      setIsSubmitting(false);
    }
    // Local state (checkType / checkDatesComplete) is already correct at this
    // point, so there's no need to force a router refresh/page data refetch.
  }, [currentUser, isSubmitting]);

  const getUserLocation = async () => {
    const apiAddress = await getLocation();
    return apiAddress
      ? `${apiAddress.neighbourhood} ${apiAddress.road}`
      : "مکان ثبت نشده";
  };

  const createNewTimesheet = (date, time, address) => ({
    date,
    timesheet: {
      checkIn: time,
      checkOut: null,
    },
    address: {
      checkIn: address,
      checkOut: null,
    },
  });

  const updateExistingTimesheet = (
    timesheets,
    userId,
    entryIndex,
    currentTime,
    address,
  ) => {
    timesheets[userId][entryIndex].timesheet.checkOut = currentTime;
    timesheets[userId][entryIndex].address.checkOut = address;
  };

  const updateControlData = async (controlData, timesheets) => {
    const controlObject = {
      ...controlData[0],
      timesheets: {
        ...timesheets,
      },
    };
    await updateControlApi(controlObject);
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        window.alert("موقعیت جغرافیایی توسط مرورگر شما پشتیبانی نمی شود");
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const address = await success(pos);
            resolve(address);
          } catch (error) {
            resolve(null);
          }
        },
        (err) => {
          errorHandler(err);
          resolve(null);
        },
        NAVIGATOR_OPTIONS,
      );
    });
  };

  const success = async (pos) => {
    const crd = pos.coords;
    const getAddress = await getAddressApi(crd.latitude, crd.longitude);
    return getAddress;
  };

  const errorHandler = (err) => {
    let errorMessage;
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = "کاربر درخواست موقعیت جغرافیایی را رد کرد";
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = "اطلاعات مکان در دسترس نیست";
        break;
      case err.TIMEOUT:
        errorMessage =
          "زمان درخواست برای دریافت موقعیت مکانی کاربر به پایان رسیده است";
        break;
      case err.UNKNOWN_ERROR:
        errorMessage = "یک خطای ناشناخته رخ داد";
        break;
      default:
        errorMessage = "هنگام بازیابی مکان خطایی رخ داد";
    }
    window.alert(errorMessage);
  };

  const getAddressApi = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        return {
          neighbourhood: data.address.neighbourhood
            ? data.address.neighbourhood
            : "-",
          road: data.address.road ? data.address.road : "-",
        };
      } else {
        window.alert("خطا در بازیابی داده");
      }
    } catch (error) {
      window.alert("خطای شبکه");
    }
  };

  if (checkDatesComplete) return null;

  return (
    <div
      className={classes.checkType}
      onClick={isSubmitting ? undefined : getCurrentDateTime}
      style={{
        background: checkType === "checkin" ? "#15b392" : "#d40d12",
      }}
    >
      {checkType === "checkin" ? "ثبت ساعت ورود" : "ثبت ساعت اضافه کار"}
    </div>
  );
}
