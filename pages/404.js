import { useContext, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./home.module.scss";

export default function NotFoundPage() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { menuDisplay, setMenuDisplay } = useContext(StateContext);
  const { footerDisplay, setFooterDisplay } = useContext(StateContext);

  useEffect(() => {
    setMenuDisplay(false);
    setFooterDisplay(false);
    setMenuMobile(true);
  }, []);

  return (
    <div className={classes.notFound}>
      <h2>صفحه یافت نشد</h2>
      <p>صفحه مورد نظر وجود ندارد</p>
    </div>
  );
}
