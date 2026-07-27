import { useContext, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";

export default function NotFoundPage() {
  const { language, setLanguage } = useContext(StateContext);

  return (
    <div
      className={classes.notFound}
      style={{
        fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
      }}
    >
      {language ? (
        <Fragment>
          <h2>صفحه یافت نشد</h2>
          <p>صفحه مورد نظر وجود ندارد</p>
        </Fragment>
      ) : (
        <Fragment>
          <h2>Page Not Found</h2>
          <p>The desired page does not exist</p>
        </Fragment>
      )}
    </div>
  );
}
