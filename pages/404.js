import { useContext, useEffect, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";

export default function NotFoundPage() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);
  const { menuMobile, setMenuMobile } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);

  useEffect(() => {
    setMenuMobile(true);
    setTimeout(() => {
      setMenuDisplay(false);
      setFooterDisplay(false);
    }, 100);
  }, []);

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
          <h2>Page not found</h2>
          <p>The desired page does not exist</p>
        </Fragment>
      )}
    </div>
  );
}
