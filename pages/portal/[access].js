import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./portal.module.scss";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import HomeIcon from "@mui/icons-material/Home";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import { convertDate, filterTomorrowVisits } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi, getUserApi } from "@/services/api";
import Kavenegar from "kavenegar";

export default function Access({ visits, users }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { selectDoctor, setSelectDoctor } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);
  const [filterVisits, setFilterVisits] = useState([]);

  const [visitTypes, setVisitTypes] = useState(
    "all" || "active" || "tomorrow" || "done" || "cancel"
  );

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      Router.push("/");
    } else {
      const fetchData = async () => {
        // inject user info into visit object
        const visitsData = await Promise.all(
          visits.map(async (visit) => {
            const [userData] = await Promise.all([getUserApi(visit.userId)]);
            return {
              ...visit,
              user: userData,
            };
          })
        );
        setDisplayVisits(visitsData);
        setFilterVisits(
          visitsData.filter((visit) => !visit.completed && !visit.canceled)
        );
      };
      fetchData().catch(console.error);
    }
    setVisitTypes("active");
  }, [currentUser, visits]);

  const margin = {
    margin: "4px 0px",
  };

  const actionVisit = async (id, type) => {
    const message = `${
      type === "done" ? "تکمیل نوبت، مطمئنی؟" : "لغو نوبت، مطمئنی؟"
    }`;
    const confirm = window.confirm(message);
    if (confirm) {
      let visitData = await getVisitApi(id);
      switch (type) {
        case "done":
          visitData.completed = true;
          break;
        case "cancel":
          visitData.canceled = true;
          break;
      }
      await updateVisitApi(visitData);
      router.replace(router.asPath);
    }
  };

  const sendTomorrowSms = () => {
    const confirmationMessage = "ارسال پیام یادآوری، مطمئنی؟";
    const confirm = window.confirm(confirmationMessage);
    const tomorrowVisits = filterTomorrowVisits(displayVisits);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    if (confirm) {
      tomorrowVisits.forEach((visit) => {
        api.VerifyLookup(
          {
            receptor: visit.user.phone,
            token: visit.time.split(" - ")[1].trim(),
            template: "registerverify",
          },
          function (response, status) {}
        );
      });
    }
  };

  const logOut = () => {
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <Fragment>
      <NextSeo
        title="پورتال بیمار اوت لاین"
        description="رزرو نوبت آنلاین"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
        }}
      />
      {currentUser && (
        <div className={classes.container}>
          <div className={classes.header}>
            <HomeIcon onClick={() => Router.push("/")} className="icon" />
            <p>{currentUser.name ? currentUser.name : currentUser.phone}</p>
            {currentUser.permission === "patient" && <Person4Icon />}
            {currentUser.permission === "admin" && <LocalHospitalIcon />}
          </div>
          <div className={classes.portal}>
            <div className={classes.analytics}>
              {currentUser.permission === "admin" && (
                <div className={classes.row}>
                  <p>
                    {users.length} / {displayVisits.length}
                  </p>
                  <p
                    className={
                      visitTypes === "all" ? classes.itemActive : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(displayVisits);
                      setVisitTypes("all");
                    }}
                  >
                    نوبت‌ها / بیمارها
                  </p>
                </div>
              )}
              <Fragment>
                <div className={classes.row}>
                  <p>
                    {
                      displayVisits.filter(
                        (visit) => !visit.completed && !visit.canceled
                      ).length
                    }
                  </p>
                  <p
                    className={
                      visitTypes === "active"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter(
                          (visit) => !visit.completed && !visit.canceled
                        )
                      );
                      setVisitTypes("active");
                    }}
                  >
                    نوبت فعال
                  </p>
                </div>
                <div className={classes.row}>
                  <p>{filterTomorrowVisits(displayVisits).length}</p>
                  <p
                    className={
                      visitTypes === "tomorrow"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(filterTomorrowVisits(displayVisits));
                      setVisitTypes("tomorrow");
                    }}
                  >
                    نوبت فردا
                  </p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.completed).length}
                  </p>
                  <p
                    className={
                      visitTypes === "done" ? classes.itemActive : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter((visit) => visit.completed)
                      );
                      setVisitTypes("done");
                    }}
                  >
                    نوبت تکمیل شده
                  </p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.canceled).length}
                  </p>
                  <p
                    className={
                      visitTypes === "cancel"
                        ? classes.itemActive
                        : classes.item
                    }
                    onClick={() => {
                      setFilterVisits(
                        displayVisits.filter((visit) => visit.canceled)
                      );
                      setVisitTypes("cancel");
                    }}
                  >
                    نوبت لغو شده
                  </p>
                </div>
                <div className={classes.logout} onClick={() => logOut()}>
                  <p className={classes.item}>خروج از پورتال</p>
                </div>
              </Fragment>
            </div>
            {visitTypes !== "tomorrow" && (
              <div className={classes.button}>
                <button
                  onClick={() => {
                    Router.push("/booking");
                    setSelectDoctor("");
                  }}
                >
                  رزرو نوبت آنلاین
                </button>
              </div>
            )}
            {currentUser.permission === "admin" &&
              visitTypes === "tomorrow" && (
                <div className={classes.button}>
                  <button onClick={() => sendTomorrowSms()}>
                    ارسال پیام یادآوری
                  </button>
                </div>
              )}
            {visitTypes === "all" && <h3>نوبت‌ها / بیمارها</h3>}
            {visitTypes === "active" && <h3>نوبت فعال</h3>}
            {visitTypes === "tomorrow" && <h3>نوبت فردا</h3>}
            {visitTypes === "done" && <h3>نوبت تکمیل شده</h3>}
            {visitTypes === "cancel" && <h3>نوبت لغو شده</h3>}
            <div className={classes.cards}>
              <Fragment>
                {filterVisits.map((item, index) => (
                  <div className={classes.item} key={index}>
                    {currentUser.permission === "admin" && (
                      <Fragment>
                        <div
                          className={classes.row}
                          style={margin}
                          onClick={() =>
                            Router.push({
                              pathname: `/patient`,
                              query: {
                                id: item.user?._id,
                              },
                            })
                          }
                        >
                          <p className={classes.greyTitle}>بیمار</p>
                          <p className={classes.title}>{item.user?.name}</p>
                        </div>
                        <div
                          className={classes.row}
                          style={margin}
                          onClick={() =>
                            window.open(
                              `tel:+98${item.user?.phone.substring(1)}`,
                              "_self"
                            )
                          }
                        >
                          <p className={classes.greyTitle}>موبایل</p>
                          <p className={classes.title}>{item.user?.phone}</p>
                        </div>
                      </Fragment>
                    )}
                    <div className={classes.row} style={margin}>
                      <p className={classes.greyTitle}>دکتر</p>
                      <p>{item.doctor}</p>
                    </div>
                    <div className={classes.row} style={margin}>
                      <p className={classes.greyTitle}>موضوع</p>
                      <p>{item.title}</p>
                    </div>
                    <div className={classes.row} style={margin}>
                      <p className={classes.greyTitle}>تاریخ ثبت</p>
                      <p>{convertDate(item.createdAt)}</p>
                    </div>
                    <div className={classes.row} style={margin}>
                      {item.canceled ? (
                        <div className={classes.row}>
                          <div className={classes.subRow}>
                            <CloseIcon
                              className={classes.icon}
                              sx={{ color: "#d40d12" }}
                            />
                            <p style={{ color: "#d40d12" }}>نوبت لغو شده</p>
                          </div>
                          <p>{convertDate(item.updatedAt)}</p>
                        </div>
                      ) : (
                        <Fragment>
                          {item.completed ? (
                            <div className={classes.row}>
                              <div className={classes.subRow}>
                                <TaskAltIcon
                                  className={classes.icon}
                                  sx={{ color: "#57a361" }}
                                />
                                <p style={{ color: "#57a361" }}>
                                  نوبت تکمیل شده
                                </p>
                              </div>
                              <p>{convertDate(item.updatedAt)}</p>
                            </div>
                          ) : (
                            <div className={classes.row}>
                              <div className={classes.subRow}>
                                <TimelapseIcon
                                  className={classes.icon}
                                  sx={{ color: "#2d2b7f" }}
                                />
                                <p>زمان نوبت</p>
                              </div>
                              <p className={classes.time}>{item.time}</p>
                            </div>
                          )}
                        </Fragment>
                      )}
                    </div>
                    {currentUser.permission === "admin" &&
                      !item.canceled &&
                      !item.completed && (
                        <div className={classes.action}>
                          <div
                            className={classes.row}
                            onClick={() => actionVisit(item["_id"], "done")}
                          >
                            <TaskAltIcon sx={{ color: "#57a361" }} />
                            <p style={{ color: "#57a361" }}>تکمیل</p>
                          </div>
                          <div
                            className={classes.row}
                            onClick={() => actionVisit(item["_id"], "cancel")}
                          >
                            <CloseIcon sx={{ color: "#d40d12" }} />
                            <p style={{ color: "#d40d12" }}>لغو</p>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </Fragment>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let id = context.query.id;
    let permission = context.query.p;

    const users = await userModel.find();
    let visits = null;
    switch (permission) {
      case "patient":
        visits = await visitModel.find({ userId: id });
        break;
      case "admin":
        visits = await visitModel.find();
        break;
    }
    visits
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .sort((a, b) => a.completed - b.completed)
      .sort((a, b) => a.canceled - b.canceled);

    return {
      props: {
        visits: JSON.parse(JSON.stringify(visits)),
        users: JSON.parse(JSON.stringify(users)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
