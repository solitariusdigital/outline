import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "../portal/portal.module.scss";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Person4Icon from "@mui/icons-material/Person4";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import { convertDate } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi } from "@/services/api";

export default function Patient({ user, visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState(visits);
  const [filterVisits, setFilterVisits] = useState(visits);

  const router = useRouter();

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
      <div className={classes.container}>
        <div className={classes.header}>
          <SwitchAccountIcon
            className="icon"
            onClick={() =>
              Router.push({
                pathname: `/portal/${currentUser.permission}`,
                query: { id: currentUser["_id"], p: currentUser.permission },
              })
            }
          />
          <p
            className="icon"
            onClick={() =>
              window.open(`tel:+98${user?.phone.substring(1)}`, "_self")
            }
          >
            {user.name ? user.name : user.phone}
          </p>
          <Person4Icon
            className="icon"
            onClick={() =>
              window.open(`tel:+98${user?.phone.substring(1)}`, "_self")
            }
          />
        </div>
        <div className={classes.portal}>
          <div className={classes.analytics}>
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
                  className={classes.grey}
                  onClick={() =>
                    setFilterVisits(
                      displayVisits.filter(
                        (visit) => !visit.completed && !visit.canceled
                      )
                    )
                  }
                >
                  نوبت‌ها فعال
                </p>
              </div>
              <div className={classes.row}>
                <p>{displayVisits.filter((visit) => visit.completed).length}</p>
                <p
                  className={classes.grey}
                  onClick={() =>
                    setFilterVisits(
                      displayVisits.filter((visit) => visit.completed)
                    )
                  }
                >
                  نوبت تکمیل شده
                </p>
              </div>
              <div className={classes.row}>
                <p>{displayVisits.filter((visit) => visit.canceled).length}</p>
                <p
                  className={classes.grey}
                  onClick={() =>
                    setFilterVisits(
                      displayVisits.filter((visit) => visit.canceled)
                    )
                  }
                >
                  نوبت لغو شده
                </p>
              </div>
            </Fragment>
          </div>
          <div className={classes.cards}>
            <Fragment>
              {filterVisits.map((item, index) => (
                <div className={classes.item} key={index}>
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
                          className="icon"
                          sx={{ color: "#57a361" }}
                        />
                        <CloseIcon
                          onClick={() => actionVisit(item["_id"], "cancel")}
                          className="icon"
                          sx={{ color: "#d40d12" }}
                        />
                      </div>
                    )}
                </div>
              ))}
            </Fragment>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

// initial connection to db
export async function getServerSideProps(context) {
  try {
    await dbConnect();
    let id = context.query.id;

    const user = await userModel.findOne({ _id: id });
    const visits = await visitModel.find({ userId: id });

    visits
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .sort((a, b) => a.completed - b.completed)
      .sort((a, b) => a.canceled - b.canceled);

    return {
      props: {
        visits: JSON.parse(JSON.stringify(visits)),
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
