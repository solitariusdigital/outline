import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import secureLocalStorage from "react-secure-storage";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import {
  getSingleUserApi,
  getControlsApi,
  updateControlApi,
} from "@/services/api";
import { getCurrentDateFarsi } from "@/services/utility";

export default function RootLayout({ children }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const [appLoader, setAppLoader] = useState(false);

  const handleResize = () => {
    let element = document.getElementById("detailsInformation");
    if (element) {
      let elemHeight = element.getBoundingClientRect().height;
      setHeroHeight(elemHeight);
    }
    const width = window.innerWidth;
    const height = window.innerHeight;

    let screenSize;
    if (width < 700) {
      screenSize = "mobile";
    } else if (width >= 700 && width < 1400) {
      screenSize = width > height ? "tablet-landscape" : "tablet-portrait";
    } else {
      screenSize = "desktop";
    }
    setScreenSize(screenSize);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (await checkReminderFutureSent()) {
        return;
      }

      const now = new Date();
      if (now.getUTCHours() >= 8) {
        const res = await fetch("/api/cron/reminder");

        if (res.ok) {
          const controlData = await getControlsApi();
          const currentDate = getCurrentDateFarsi();
          const controlObject = {
            ...controlData[0],
            reminderFuture: {
              ...controlData[0].reminderFuture,
              [currentDate]: true,
            },
          };
          await updateControlApi(controlObject);
        }
      }
    };
    fetchData();
  }, []);

  const checkReminderFutureSent = async () => {
    const controlData = await getControlsApi();
    const currentDate = getCurrentDateFarsi();
    return controlData[0]?.reminderFuture?.[currentDate] === true;
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // checks user login and set user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = JSON.parse(
          secureLocalStorage.getItem("currentUser"),
        );
        if (currentUser) {
          const userData = await getSingleUserApi(currentUser["_id"]);
          setCurrentUser(userData);
          secureLocalStorage.setItem("currentUser", JSON.stringify(userData));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    setTimeout(() => {
      setAppLoader(true);
    }, 500);
  }, [setCurrentUser]);

  return (
    <Fragment>
      {appLoader ? (
        <Fragment>
          <div className="main">
            <main>{children}</main>
          </div>
        </Fragment>
      ) : (
        <div className="appload">
          <Image width={200} height={140} src={logo} alt="logo" priority />
        </div>
      )}
    </Fragment>
  );
}
