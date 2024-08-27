import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./portal.module.scss";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import HomeIcon from "@mui/icons-material/Home";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import { convertDate } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi, getUserApi } from "@/services/api";

export default function Access({ visits, users }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      Router.push("/portal");
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
      };
      fetchData().catch(console.error);
    }
  }, [currentUser, visits]);

  const margin = {
    margin: "8px 0px",
  };

  const actionVisit = async (id, type) => {
    const message = `${
      type === "done" ? "تکمیل نوبت مطمئنی؟" : "لغو نوبت مطمئنی؟"
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
          url: "https://outline.com",
          siteName: "Outline",
        }}
      />
      {currentUser && (
        <div className={classes.container}>
          <div className={classes.headerHero}>
            <HomeIcon onClick={() => Router.push("/")} className="icon" />
            <p>{currentUser.name ? currentUser.name : currentUser.phone}</p>
            {currentUser.permission === "patient" && <Person4Icon />}
            {currentUser.permission === "admin" && <MilitaryTechIcon />}
          </div>
          <div className={classes.portal}>
            <div className={classes.analytics}>
              {currentUser.permission === "admin" && (
                <div className={classes.row}>
                  <p>{users.length}</p>
                  <p className={classes.grey}>کل بیمارها</p>
                </div>
              )}
              <Fragment>
                <div className={classes.row}>
                  <p>{displayVisits.length}</p>
                  <p className={classes.grey}>تعداد نوبت</p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.completed).length}
                  </p>
                  <p className={classes.grey}>نوبت تکمیل شده</p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((visit) => visit.canceled).length}
                  </p>
                  <p className={classes.grey}>نوبت لغو شده</p>
                </div>
              </Fragment>
            </div>
            <div className={classes.button}>
              <button onClick={() => Router.push("/booking")}>
                رزرو نوبت آنلاین
              </button>
            </div>
            <div className={classes.cards}>
              <Fragment>
                {displayVisits.map((item, index) => (
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
                      <p className={classes.greyTitle}>موضوع</p>
                      <p className={classes.title}>{item.title}</p>
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
                            <p>نوبت لغو شده</p>
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
                                <p>نوبت تکمیل شده</p>
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
                          <TaskAltIcon
                            onClick={() => actionVisit(item["_id"], "done")}
                            className={classes.icon}
                            sx={{ color: "#57a361" }}
                          />
                          <CloseIcon
                            onClick={() => actionVisit(item["_id"], "cancel")}
                            className={classes.icon}
                            sx={{ color: "#d40d12" }}
                          />
                        </div>
                      )}
                  </div>
                ))}
              </Fragment>
            </div>
          </div>
          <div className={classes.logout} onClick={() => logOut()}>
            <p>خروج از پورتال</p>
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
