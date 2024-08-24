import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  // application user context
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuMobile, setMenuMobile] = useState(false);
  const [navigationTopBar, setNavigationTopBar] = useState([
    {
      title: "بل کلاس",
      link: "/",
      active: false,
    },
    {
      title: "پرتال",
      link: "/portal",
      active: false,
    },
    {
      title: "پزشکان",
      link: "/doctors",
      active: false,
    },
    {
      title: "خدمات کلینیک",
      link: "/expertises",
      active: false,
    },
  ]);
  const [expertiseAreas, setExpertiseAreas] = useState([
    {
      title: "فیلر",
      active: false,
    },
    {
      title: "نوتریژنومیکس",
      active: false,
    },
    {
      title: "لیزر",
      active: false,
    },
    {
      title: "کاشت مو و ابرو",
      active: false,
    },
    {
      title: "بوتاکس",
      active: false,
    },
    {
      title: "پلاسمای غنی از پلاکت",
      active: false,
    },
    {
      title: "درمان با فرکانس رادویی",
      active: false,
    },
    {
      title: "هایفوتراپی",
      active: false,
    },
    {
      title: "کرایوتراپی",
      active: false,
    },
    {
      title: "لیفت با نخ",
      active: false,
    },
  ]);
  const [displayExpertise, setDisplayExpertise] = useState("فیلر");
  const [kavenegarKey, setKavenegarKey] = useState(
    "78766C6A30637772692B3758716579425A45592B3562304D65784A6F6A754B43594D7239774A7A635752633D"
  );
  const [screenSize, setScreenSize] = useState(
    "desktop" || "tablet" || "mobile"
  );

  const stateContext = {
    menuMobile,
    setMenuMobile,
    navigationTopBar,
    setNavigationTopBar,
    currentUser,
    setCurrentUser,
    appUsers,
    setAppUsers,
    expertiseAreas,
    setExpertiseAreas,
    displayExpertise,
    setDisplayExpertise,
    kavenegarKey,
    setKavenegarKey,
    screenSize,
    setScreenSize,
  };
  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
