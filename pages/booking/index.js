import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import DatePicker from "@/components/DatePicker";
import classes from "./booking.module.scss";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Router from "next/router";
import { NextSeo } from "next-seo";
import Register from "@/components/Register";
import { getDoctorApi } from "@/services/api";

export default function Booking() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const [doctorName, setDoctorName] = useState("");

  const router = useRouter();
  const doctorId = router.query.id;
  const recordId = router.query.record;

  useEffect(() => {
    const fetchData = async () => {
      let doctorData = await getDoctorApi(doctorId);
      setDoctorName(doctorData.name);
    };
    fetchData().catch(console.error);
  }, [doctorId]);

  useEffect(() => {
    let route = "/doctors";
    navigationTopBar.map((nav) => {
      if (nav.link === route) {
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setNavigationTopBar([...navigationTopBar]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <NextSeo
        title="رزرو مراجعه حضوری"
        description="رزرو مراجعه حضوری پزشک زیبایی"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://belleclass.com",
          siteName: "Belle Class",
        }}
      />
      {!currentUser ? (
        <div className="register">
          <Register></Register>
        </div>
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>
            <ArrowBackIosNewIcon
              className="icon"
              onClick={() => Router.push("/doctors")}
            />
            <h2 className={classes.title}>{doctorName}</h2>
          </div>
          <DatePicker doctorId={doctorId} recordId={recordId} />
        </div>
      )}
    </Fragment>
  );
}
