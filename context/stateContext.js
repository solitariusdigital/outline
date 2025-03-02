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
    "66d56cc9a4b0b0760f625b03": { name: "Khosro", color: "#257180" },
    "66ea71d0afe30bf2eefc387a": { name: "Tanaz", color: "#F05A7E" },
    "66ea71f7afe30bf2eefc387b": { name: "Diako", color: "#478CCF" },
    "67966a985c39c3b40bb907bf": { name: "Ana", color: "#FF9D23" },
    "67bc30fe0753de6301fd6a41": { name: "Niloufar", color: "#B771E5" },
    "66f80a002772d93db43ee424": { name: "Outline", color: "#2d2b7f" },
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
