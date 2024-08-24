import { useState, useContext, useRef, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Register.module.scss";
import { fourGenerator } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import Router from "next/router";
import { createUserApi, getUsersApi } from "@/services/api";
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
    if (phone.length === 0) {
      showAlert("موبایل خالی");
      return;
    }

    if (phone.length === 11 && phone.slice(0, 2) === "09") {
      setDisplayCounter(true);
      let tokenId = fourGenerator();
      setToken(tokenId);
      const api = Kavenegar.KavenegarApi({
        apikey: kavenegarKey,
      });
      api.VerifyLookup(
        {
          receptor: phone,
          token: tokenId.toString(),
          template: "registerverify",
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

  const handleRegister = async () => {
    if (token === Number(checkToken)) {
      // Check if user already exists in the database
      const userData = appUsers.find((user) => user.phone === phone);
      if (userData) {
        setCurrentUser(userData);
        secureLocalStorage.setItem("currentUser", JSON.stringify(userData));
        Router.push("/portal");
      } else {
        await createUser();
      }
    } else {
      showAlert("کد تایید اشتباه");
    }
    setToken("");
    setCheckToken("");
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  // create new user into db/state/localstorage
  const createUser = async () => {
    const user = {
      name: "",
      phone: phone.trim(),
      permission: "patient",
    };
    try {
      const userData = await createUserApi(user);
      if (userData.hasOwnProperty("error")) {
        showAlert("خطا در برقراری ارتباط");
      } else {
        setCurrentUser(userData);
        secureLocalStorage.setItem("currentUser", JSON.stringify(userData));
        Router.push("/portal");
      }
    } catch (error) {
      showAlert("خطا در برقراری ارتباط");
    }
    setDisplayCounter(false);
    resetCounter();
    setCounter(59);
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <p className={classes.title}>پرتال بل کلاس</p>
        <p className="message">ورود به خدمات آنلاین</p>
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
            value={phone}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        {displayCounter ? (
          <div className={classes.activationContainer}>
            <div className={classes.activationCode}>
              <p className="alert">{counter}</p>
              <p className="alert">ثانیه تا درخواست مجدد کد</p>
            </div>
          </div>
        ) : (
          <div className={classes.activationContainer}>
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
            onChange={(e) => setCheckToken(e.target.value)}
            value={checkToken}
            autoComplete="off"
            dir="rtl"
          />
        </div>
        <div className={classes.formAction}>
          <p className="alert">{alert}</p>
          {checkToken.length === 4 && (
            <button onClick={() => handleRegister()}>ورود / ​ثبت نام</button>
          )}
        </div>
      </div>
    </Fragment>
  );
}
