import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  const [language, setLanguage] = useState(null);
  const [languageType, setLanguageType] = useState(null);
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [kavenegarKey, setKavenegarKey] = useState(
    "684E475442526B426237454A7836434D42394F3368324463527569754F4453616B386B2F573756303439413D",
  );
  const [screenSize, setScreenSize] = useState(
    "desktop" || "tablet-landscape" || "tablet-portrait" || "mobile",
  );
  const [selectDoctor, setSelectDoctor] = useState("");
  const [editProcess, setEditProcess] = useState("");
  const [selectBranch, setSelectBranch] = useState("tehran" || "kish");
  const [notification, setNotification] = useState(false);
  const [menuDisplay, setMenuDisplay] = useState(true);
  const [footerDisplay, setFooterDisplay] = useState(true);
  const [menuMobile, setMenuMobile] = useState(false);
  const [menuBackground, setMenuBackground] = useState(false);
  const [cachedVisitsData, setCachedVisitsData] = useState(null);
  const [popupDiagramData, setPopupDiagramData] = useState(null);
  const [adminColorCode, setAdminColorCode] = useState({
    "66d56cc9a4b0b0760f625b03": { name: "Khosro", color: "#257180" },
    "66ea71d0afe30bf2eefc387a": { name: "Tanaz", color: "#F05A7E" },
    "66ea71f7afe30bf2eefc387b": { name: "Diako", color: "#478CCF" },
    "67966a985c39c3b40bb907bf": { name: "Ana", color: "#FF9D23" },
    "67bc30fe0753de6301fd6a41": { name: "Niloufar", color: "#B771E5" },
    "66f80a002772d93db43ee424": { name: "Outline", color: "#2d2b7f" },
  });
  const [navigationTopBar, setNavigationTopBar] = useState([
    {
      title: {
        fa: "گالری",
        en: "GALLERY",
      },
      link: "/gallery",
      active: false,
      nav: true,
    },
    {
      title: {
        fa: "متد اوت‌لاین",
        en: "OUTLINE METHOD",
      },
      link: "/method",
      active: false,
      nav: true,
    },
    {
      title: {
        fa: "درباره ما",
        en: "ABOUT US",
      },
      link: "/about",
      active: false,
      nav: true,
    },
    {
      title: {
        fa: "تماس با ما",
        en: "CONTACT US",
      },
      link: "/contact",
      active: false,
      nav: true,
    },
    {
      title: {
        fa: "پورتال نوبت",
        en: "PORTAL",
      },
      link: "/reservation",
      active: false,
      nav: false,
    },
  ]);

  // types filter based on index
  const [methodTypes, setMethodTypes] = useState([
    {
      item: {
        fa: "تزریق شقیقه",
        en: "Temple Injection",
      },
    },
    {
      item: {
        fa: "تزریق میدفیس",
        en: "Midface Injection",
      },
    },
    {
      item: {
        fa: "اصلاح خط خنده و خط غم",
        en: "Laugh Line & Marionette Line Correction",
      },
    },
    {
      item: {
        fa: "اصلاح چانه و زاویه فک",
        en: "Chin & Jawline Correction",
      },
    },
    {
      item: {
        fa: "جوان‌ساز",
        en: "Rejuvenation",
      },
    },
    {
      item: {
        fa: "لیفت صورت با نخ",
        en: "Thread Face Lift",
      },
    },
    {
      item: {
        fa: "لیفت نان‌سرجیکال",
        en: "Non-surgical Lift",
      },
    },
    {
      item: {
        fa: "لیزر فرکشنال CO₂",
        en: "Fractional CO₂ Laser",
      },
    },
    {
      item: {
        fa: "لیزر Helios III Q-Switched",
        en: "Helios III Q-Switched Laser",
      },
    },
  ]);

  const stateContext = {
    language,
    setLanguage,
    languageType,
    setLanguageType,
    currentUser,
    setCurrentUser,
    menuBackground,
    setMenuBackground,
    navigationTopBar,
    setNavigationTopBar,
    footerDisplay,
    setFooterDisplay,
    appUsers,
    setAppUsers,
    menuMobile,
    setMenuMobile,
    kavenegarKey,
    setKavenegarKey,
    screenSize,
    setScreenSize,
    selectDoctor,
    setSelectDoctor,
    notification,
    setNotification,
    adminColorCode,
    setAdminColorCode,
    cachedVisitsData,
    setCachedVisitsData,
    popupDiagramData,
    setPopupDiagramData,
    selectBranch,
    setSelectBranch,
    menuDisplay,
    setMenuDisplay,
    editProcess,
    setEditProcess,
    methodTypes,
    setMethodTypes,
  };
  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
