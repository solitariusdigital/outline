import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "../portal/portal.module.scss";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import Router from "next/router";
import dbConnect from "@/services/dbConnect";
import visitModel from "@/models/Visit";
import userModel from "@/models/User";
import { convertDate, filterVisitsByDate } from "@/services/utility";
import CloseIcon from "@mui/icons-material/Close";
import { NextSeo } from "next-seo";
import { getVisitApi, updateVisitApi } from "@/services/api";

export default function Patient({ user, visits }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [displayVisits, setDisplayVisits] = useState([]);
  const [filterVisits, setFilterVisits] = useState([]);

  const [visitTypes, setVisitTypes] = useState(
    "active" || "tomorrow" || "done" || "cancel"
  );

  const router = useRouter();

  const margin = {
    margin: "4px 0px",
  };

  useEffect(() => {
    setDisplayVisits(visits);
    setFilterVisits(
      visits.filter((visit) => !visit.completed && !visit.canceled)
    );
    setVisitTypes("active");
  }, [visits]);

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

  return (
    <Fragment>
      <NextSeo
        title="پورتال بیمار"
        description="پورتال بیمار"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com",
          siteName: "Outline Community",
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
          <h3>{user.name ? user.name : user.phone}</h3>
          <ContentCutIcon
            className="icon"
            sx={{ fontSize: 20, color: "#2d2b7f" }}
            onClick={() => navigator.clipboard.writeText(user.phone)}
          />
        </div>
        <div className={classes.portal}>
          <div className={classes.analytics}>
            <Fragment>
              <div
                className={classes.row}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open(`tel:+98${user?.phone.substring(1)}`, "_self")
                }
              >
                <p>{user.phone}</p>
                <p>{user.name}</p>
              </div>
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
                    visitTypes === "active" ? classes.itemActive : classes.item
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
                <p>{filterVisitsByDate(displayVisits).length}</p>
                <p
                  className={
                    visitTypes === "today" ? classes.itemActive : classes.item
                  }
                  onClick={() => {
                    setFilterVisits(filterVisitsByDate(displayVisits));
                    setVisitTypes("today");
                  }}
                >
                  نوبت امروز
                </p>
              </div>
              <div className={classes.row}>
                <p>{filterVisitsByDate(displayVisits, 1).length}</p>
                <p
                  className={
                    visitTypes === "tomorrow"
                      ? classes.itemActive
                      : classes.item
                  }
                  onClick={() => {
                    setFilterVisits(filterVisitsByDate(displayVisits, 1));
                    setVisitTypes("tomorrow");
                  }}
                >
                  نوبت فردا
                </p>
              </div>
              <div className={classes.row}>
                <p>{displayVisits.filter((visit) => visit.completed).length}</p>
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
                <p>{displayVisits.filter((visit) => visit.canceled).length}</p>
                <p
                  className={
                    visitTypes === "cancel" ? classes.itemActive : classes.item
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
            </Fragment>
          </div>
          {visitTypes === "active" && <h3>نوبت فعال</h3>}
          {visitTypes === "today" && <h3>نوبت امروز</h3>}
          {visitTypes === "tomorrow" && <h3>نوبت فردا</h3>}
          {visitTypes === "done" && <h3>نوبت تکمیل شده</h3>}
          {visitTypes === "cancel" && <h3>نوبت لغو شده</h3>}
          <div className={classes.cards}>
            <Fragment>
              {filterVisits.map((item, index) => (
                <div className={classes.item} key={index}>
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
                              <p style={{ color: "#57a361" }}>نوبت تکمیل شده</p>
                            </div>
                            <p>{convertDate(item.updatedAt)}</p>
                          </div>
                        ) : (
                          <div className={classes.row} style={margin}>
                            <div className={classes.subRow}>
                              <TimelapseIcon
                                className={classes.icon}
                                sx={{ color: "#2d2b7f" }}
                              />
                              <p style={{ color: "#2d2b7f" }}>زمان نوبت</p>
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
                      <div className={classes.row}>
                        <div
                          className={classes.row}
                          style={{ width: "70px" }}
                          onClick={() => actionVisit(item["_id"], "done")}
                        >
                          <TaskAltIcon
                            className="icon"
                            sx={{ color: "#57a361" }}
                          />
                          <p style={{ color: "#57a361" }}>تکمیل</p>
                        </div>
                        <div
                          className={classes.row}
                          style={{ width: "50px" }}
                          onClick={() => actionVisit(item["_id"], "cancel")}
                        >
                          <CloseIcon
                            className="icon"
                            sx={{ color: "#d40d12" }}
                          />
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
      .sort((a, b) => new Date(a.date) - new Date(b.date))
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
