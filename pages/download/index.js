import { Fragment } from "react";
import classes from "./download.module.scss";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { getMobileOperatingSystem } from "@/services/utility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddToHomeScreenIcon from "@mui/icons-material/AddToHomeScreen";
import Router from "next/router";
import { NextSeo } from "next-seo";

export default function Download() {
  return (
    <Fragment>
      <NextSeo
        title="راهنمای نصب"
        description="وب اپلیکیشن پیشرو بل کلاس"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      {getMobileOperatingSystem() === "ios" && (
        <div className={classes.container}>
          <p className={classes.title}>
            وب اپلیکیشن پیشرو بل کلاس را برای استفاده آسان به صفحه موبایل اضافه
            کنید
          </p>
          <div className={classes.items}>
            <p>را در نوار پایین کلیک کنید Share دکمه - Safari</p>
            <IosShareIcon className="icon" sx={{ fontSize: 18 }} />
          </div>
          <div className={classes.items}>
            <p>را انتخاب کنید Add to Home Screen گزینه</p>
            <AddBoxIcon className="icon" sx={{ fontSize: 18 }} />
          </div>
          <div className={classes.items}>
            <p>کلیک کنید Add روی</p>
            <p>Add</p>
          </div>
          <button onClick={() => Router.push("/")}>متوجه شدم</button>
        </div>
      )}
      {getMobileOperatingSystem() === "android" && (
        <div className={classes.container}>
          <p className={classes.title}>
            وب اپلیکیشن پیشرو بل کلاس را برای استفاده آسان به صفحه موبایل اضافه
            کنید
          </p>
          <div className={classes.items}>
            <p>را کلیک کنید Menu دکمه - Chrome</p>
            <MoreVertIcon className="icon" sx={{ fontSize: 18 }} />
          </div>
          <div className={classes.items}>
            <p>را انتخاب کنید Add to Home Screen گزینه</p>
            <AddToHomeScreenIcon className="icon" sx={{ fontSize: 18 }} />
          </div>
          <div className={classes.items}>
            <p>کلیک کنید Add روی</p>
            <p>Add</p>
          </div>
          <button onClick={() => Router.push("/")}>متوجه شدم</button>
        </div>
      )}
    </Fragment>
  );
}
