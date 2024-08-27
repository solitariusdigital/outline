import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./portal.module.scss";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Image from "next/legacy/image";
import Person4Icon from "@mui/icons-material/Person4";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import { convertDate } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import secureLocalStorage from "react-secure-storage";
import Kavenegar from "kavenegar";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi, getUserApi } from "@/services/api";

export default function Access({ visits, doctors, users }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);

  const [alert, setAlert] = useState("");
  const doctorDefault =
    "https://belleclass.storage.iran.liara.space/doctors/belleclass.png";

  useEffect(() => {
    if (!currentUser) {
      Router.push("/portal");
    } else {
      const fetchData = async () => {
        // inject doctor/user info into visit object
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

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  const actionVisit = async (id, type) => {
    const message = `${
      type === "done" ? "تکمیل مراجعه مطمئنی؟" : "لغو مراجعه مطمئنی؟"
    }`;
    const confirm = window.confirm(message);
    if (confirm) {
      let recordData = await getVisitApi(id);
      switch (type) {
        case "done":
          recordData.completed = true;
          break;
        case "cancel":
          recordData.canceled = true;
          break;
      }
      await updateVisitApi(recordData);
      Router.push("/portal");
    }
  };

  const logOut = () => {
    secureLocalStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <Fragment>
      <NextSeo
        title="پرتال بیمار اوت لاین"
        description="رزرو مراجعه حضوری"
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
            <p>{currentUser.name ? currentUser.name : currentUser.phone}</p>
            {currentUser.permission === "patient" && <Person4Icon />}
            {currentUser.permission === "doctor" && <HealthAndSafetyIcon />}
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
                  <p className={classes.grey}>تعداد مراجعه</p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((record) => record.completed).length}
                  </p>
                  <p className={classes.grey}>مراجعه تکمیل</p>
                </div>
                <div className={classes.row}>
                  <p>
                    {displayVisits.filter((record) => record.canceled).length}
                  </p>
                  <p className={classes.grey}>مراجعه لغو</p>
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
                    <div className={classes.subRow} style={margin}>
                      <div className={classes.image}>
                        <Image
                          className={classes.image}
                          src={
                            item.doctor?.image
                              ? item.doctor?.image
                              : doctorDefault
                          }
                          placeholder="blur"
                          blurDataURL={
                            item.doctor?.image
                              ? item.doctor?.image
                              : doctorDefault
                          }
                          alt="image"
                          width={70}
                          height={70}
                          objectFit="cover"
                          loading="eager"
                        />
                      </div>
                      <div>
                        <h2 className={classes.title}>{item.doctor?.name}</h2>
                        <p>{item.doctor?.education}</p>
                      </div>
                    </div>
                    <div className={classes.row} style={margin}>
                      <p className={classes.greyTitle}>ثبت</p>
                      <p>{convertDate(item.createdAt)}</p>
                    </div>
                    <div className={classes.row} style={margin}>
                      <p className={classes.greyTitle}>موضوع</p>
                      <p className={classes.title}>{item.title}</p>
                    </div>
                    {(currentUser.permission === "admin" ||
                      currentUser.permission === "doctor") && (
                      <Fragment>
                        <div className={classes.row} style={margin}>
                          <p className={classes.greyTitle}>بیمار</p>
                          <p className={classes.title}>{item.user?.name}</p>
                        </div>
                        <div className={classes.row} style={margin}>
                          <p className={classes.greyTitle}>موبایل</p>
                          <p className={classes.title}>{item.user?.phone}</p>
                        </div>
                      </Fragment>
                    )}
                    <div className={classes.row} style={margin}>
                      {item.canceled ? (
                        <div className={classes.row}>
                          <div className={classes.subRow}>
                            <CloseIcon
                              className={classes.icon}
                              sx={{ color: "#d40d12" }}
                            />
                            <p>مراجعه لغو</p>
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
                                <p>مراجعه تکمیل</p>
                              </div>
                              <p>{convertDate(item.updatedAt)}</p>
                            </div>
                          ) : (
                            <div className={classes.row}>
                              <div className={classes.subRow}>
                                <TimelapseIcon
                                  className={classes.icon}
                                  sx={{ color: "#b69119" }}
                                />
                                <p>زمان مراجعه</p>
                              </div>
                              <p className={classes.time}>{item.time}</p>
                            </div>
                          )}
                        </Fragment>
                      )}
                    </div>
                    {(currentUser.permission === "admin" ||
                      currentUser.permission === "doctor") &&
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
            <p>خروج از پرتال</p>
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
