import { useState, createContext } from "react";
export const StateContext = createContext();

export const StateProvider = (props) => {
  const [appUsers, setAppUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [kavenegarKey, setKavenegarKey] = useState(
    "684E475442526B426237454A7836434D42394F3368324463527569754F4453616B386B2F573756303439413D"
  );
  const [screenSize, setScreenSize] = useState(
    "desktop" || "tablet" || "mobile"
  );
  const [selectDoctor, setSelectDoctor] = useState("");
  const [notification, setNotification] = useState(false);
  const [adminColorCode, setAdminColorCode] = useState({
    // khosro
    "66d56cc9a4b0b0760f625b03": "#257180",
    // tanaz
    "66ea71d0afe30bf2eefc387a": "#F05A7E",
    // diako
    "66ea71f7afe30bf2eefc387b": "#478CCF",
    // outline
    "66ea721bafe30bf2eefc387c": "#2d2b7f",
    // outline
    "66f80a002772d93db43ee424": "#2d2b7f",
    // azar
    "679215b3e64177ca1ccdb8d0": "#FF9D23",
  });
  const stateContext = {
    currentUser,
    setCurrentUser,
    appUsers,
    setAppUsers,
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
  };
  return (
    <StateContext.Provider value={stateContext}>
      {props.children}
    </StateContext.Provider>
  );
};
