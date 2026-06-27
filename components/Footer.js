import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Footer.module.scss";
import Link from "next/link";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { selectBranch, setSelectBranch } = useContext(StateContext);

  return (
    <div
      className={classes.container}
      style={{
        fontFamily: "Light",
      }}
    >
      <div className={classes.social}>
        <h4>ما را در شبکه‌های اجتماعی دنبال کنید</h4>
        <InstagramIcon
          className={classes.icon}
          sx={{ fontSize: 32 }}
          onClick={() =>
            window.open(
              "https://www.instagram.com/dr.farahani.outline",
              "_ self",
            )
          }
        />
      </div>
      <div className={classes.booking}>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر فراهانی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر فراهانی
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            passHref
            onClick={() => {
              setSelectDoctor("دکتر گنجه");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر گنجه
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر پورقلی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر پورقلی
          </Link>
        </div>
      </div>
      <div className={classes.booking}>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر فراهانی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر فراهانی
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            passHref
            onClick={() => {
              setSelectDoctor("دکتر گنجه");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر گنجه
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر پورقلی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر پورقلی
          </Link>
        </div>
      </div>
      <div className={classes.booking}>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر فراهانی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر فراهانی
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            passHref
            onClick={() => {
              setSelectDoctor("دکتر گنجه");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر گنجه
          </Link>
        </div>
        <div className={classes.link}>
          <Link
            href={currentUser ? "/booking" : "/portal"}
            onClick={() => {
              setSelectDoctor("دکتر پورقلی");
              setSelectBranch("tehran");
            }}
          >
            نوبت دکتر پورقلی
          </Link>
        </div>
      </div>
    </div>
  );
}
