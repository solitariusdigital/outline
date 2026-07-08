import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import secureLocalStorage from "react-secure-storage";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import {
  getSingleUserApi,
  getControlsApi,
  updateControlApi,
} from "@/services/api";
import { getCurrentDateFarsi } from "@/services/utility";

export default function RootLayout({ children }) {
  const { language, setLanguage } = useContext(StateContext);
  const { languageType, setLanguageType } = useContext(StateContext);
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
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
    if (secureLocalStorage.getItem("languageBrowser")) {
      setLanguageType("en");
      setLanguage(false);
    } else {
      setLanguageType("fa");
      setLanguage(true);
    }
  }, [setLanguage, setLanguageType]);

  useEffect(() => {
    let prevScrollY = window.scrollY;
    const handleScroll = () => {
      if (menuMobile) return;

      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) {
        setMenuDisplay(true);
      } else if (currentScrollY > prevScrollY) {
        setMenuDisplay(false);
      }
      prevScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuMobile]);

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
          {menuDisplay && (
            <section className="menu animate__animated animate__slideInDown">
              <Menu />
            </section>
          )}
          <section
            className="main"
            style={{
              fontFamily: "Vazir-Regular",
            }}
          >
            <main>{children}</main>
          </section>
          {footerDisplay && (
            <section className="footer">
              <Footer />
            </section>
          )}
        </Fragment>
      ) : (
        <div className="appload">
          <Image width={200} height={140} src={logo} alt="logo" priority />
        </div>
      )}
    </Fragment>
  );
}
