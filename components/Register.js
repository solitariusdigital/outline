import { useState, useContext, useRef, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Register.module.scss";
import {
  fourGenerator,
  isEnglishNumber,
  toEnglishNumber,
} from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import Router from "next/router";
import { createUserApi, getUsersApi } from "@/services/api";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";
import Progress from "./Progress";
import Kavenegar from "kavenegar";

export default function Register() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { appUsers, setAppUsers } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);

  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [checkToken, setCheckToken] = useState("");
  const [alert, setAlert] = useState("");
  const [displayCounter, setDisplayCounter] = useState(false);
  let [counter, setCounter] = useState(59);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsersApi();
      setAppUsers(data);
    };
    fetchData().catch(console.error);
  }, [setAppUsers]);

  let intervalRef = useRef(null);
  const startCounter = () => {
    intervalRef.current = setInterval(() => {
      setCounter(counter--);
      if (counter < 0) {
        resetCounter();
        setDisplayCounter(false);
        setCounter(59);
        setToken("");
        setCheckToken("");
      }
    }, 1200);
  };

  const resetCounter = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const verifyPhone = () => {
    if (!phone) {
      showAlert("موبایل الزامیست");
      return;
    }
    let phoneEnglish = isEnglishNumber(phone) ? phone : toEnglishNumber(phone);
    if (phoneEnglish.length === 11 && phoneEnglish.startsWith("09")) {
      setDisplayCounter(true);
      let tokenId = fourGenerator();
      setToken(tokenId);
      const api = Kavenegar.KavenegarApi({
        apikey: kavenegarKey,
      });
      api.VerifyLookup(
        {
          receptor: phoneEnglish,
          token: tokenId.toString(),
          template: "registerOutline",
        },
        function (response, status) {
          if (status === 200) {
            showAlert("کد تایید ارسال شد");
          } else {
            showAlert("خطا در سامانه ارسال کد تایید");
          }
          startCounter();
        }
      );
    } else {
      showAlert("موبایل اشتباه");
    }
  };

  const handleRegister = async (receivedToken) => {
    setCheckToken(receivedToken);
    if (receivedToken.length !== 4) {
      return;
    }
    let phoneEnglish = isEnglishNumber(phone) ? phone : toEnglishNumber(phone);
    if (token === Number(receivedToken)) {
      // Check if user already exists in the database
      const userData = appUsers.find((user) => user.phone === phoneEnglish);
      if (userData) {
        setCurrentUser(userData);
        secureLocalStorage.setItem("currentUser", JSON.stringify(userData));
        Router.push({
          pathname: `/portal/${userData.permission}`,
          query: { id: userData["_id"], p: userData.permission },
        });
      } else {
        await createUser(phoneEnglish);
      }
      setToken("");
    } else {
      showAlert("کد تایید اشتباه");
    }
    setCheckToken("");
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  // create new user into db/state/localstorage
  const createUser = async (phoneEnglish) => {
    const user = {
      name: "",
      phone: phoneEnglish,
      permission: "patient",
    };
    try {
      const userData = await createUserApi(user);
      if (userData.hasOwnProperty("error")) {
        showAlert("خطا در برقراری ارتباط");
      } else {
        setCurrentUser(userData);
        secureLocalStorage.setItem("currentUser", JSON.stringify(userData));
        Router.push("/booking");
      }
    } catch (error) {
      showAlert("خطا در برقراری ارتباط");
    }
    setDisplayCounter(false);
    resetCounter();
    setCounter(59);
  };

  const calculatePercentage = (index) => {
    return ((index + 1) / 59) * 100;
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <h2>پورتال اوت لاین</h2>
        <h3 className="message">ثبت نوبت آنلاین</h3>
        <div className={classes.input}>
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
            maxLength={11}
            value={phone}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        {displayCounter ? (
          <div className={classes.activation}>
            <p>{counter}</p>
            <Progress
              color={"#2d2b7f"}
              completed={calculatePercentage(counter)}
            />
          </div>
        ) : (
          <div className={classes.activation}>
            <button onClick={() => verifyPhone()}>کد تایید</button>
          </div>
        )}
        <div className={classes.input}>
          <div className={classes.bar}>
            <p className={classes.label}>
              کد تایید
              <span>*</span>
            </p>
            <CloseIcon
              className="icon"
              onClick={() => setCheckToken("")}
              sx={{ fontSize: 16 }}
            />
          </div>
          <input
            type="tel"
            id="number"
            name="number"
            maxLength={4}
            onChange={(e) => handleRegister(e.target.value)}
            value={checkToken}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        <p className="alert">{alert}</p>
      </div>
      <div className={classes.logo} onClick={() => Router.push("/")}>
        <Image width={200} height={140} src={logo} alt="logo" priority />
        <HomeIcon sx={{ color: "#2d2b7f" }} />
      </div>
    </Fragment>
  );
}
