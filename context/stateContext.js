import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  // application user context
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuMobile, setMenuMobile] = useState(false);

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
    currentUser,
    setCurrentUser,
    appUsers,
    setAppUsers,
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
