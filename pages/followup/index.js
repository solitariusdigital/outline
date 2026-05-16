import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./followup.module.scss";
import HomeIcon from "@mui/icons-material/Home";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Router from "next/router";
import CloseIcon from "@mui/icons-material/Close";
import {
  getFollowsApi,
  getSingleFollowApi,
  updateFollowApi,
} from "@/services/api";

export default function Followup() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [displayFollows, setDisplayFollows] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleFollows = async () => {
      if (currentUser?.permission !== "admin") {
        return;
      }
      const followsData = await getFollowsApi();
      let activeFollows = followsData
        .filter((visit) => !visit.completed && !visit.canceled)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setDisplayFollows(activeFollows);
    };
    handleFollows();
  }, [refreshKey]);

  const actionFollow = async (id, type) => {
    const message = `${
      type === "complete" ? "تکمیل نوبت، مطمئنی؟" : "لغو نوبت، مطمئنی؟"
    }`;
    const confirm = window.confirm(message);
    let followData = await getSingleFollowApi(id);
    if (confirm) {
      switch (type) {
        case "complete":
          followData.completed = true;
          break;
        case "cancel":
          followData.canceled = true;
          break;
      }
      await updateFollowApi(followData);
      setRefreshKey((prev) => prev + 1);
    }
  };

  return (
    <section className={classes.container}>
      <HomeIcon onClick={() => Router.push("/")} className="icon" />
      <h3
        style={{
          marginTop: "12px",
        }}
      >
        نوبت Follow Up
      </h3>
      <div className={classes.cards}>
        <>
          {displayFollows?.map((item, index) => (
            <div className={classes.item} key={index}>
              <div
                className={classes.row}
                style={{
                  margin: "2px 0px",
                }}
              >
                <h4>{item.name}</h4>
                <h4
                  onClick={() =>
                    window.open(`tel:+98${item.phone.substring(1)}`, "_self")
                  }
                >
                  {item.phone}
                </h4>
              </div>
              <div
                className={classes.row}
                style={{
                  margin: "2px 0px",
                }}
              >
                <p>{item.title}</p>
                <p>{item.time}</p>
              </div>
              <div
                className={classes.row}
                style={{
                  margin: "2px 0px",
                  color: "#999999",
                }}
              >
                <p>{item.doctor}</p>
                <p>{item.branch === "tehran" ? "شعبه تهران" : "شعبه کیش"}</p>
              </div>
              <div
                className={classes.row}
                style={{
                  margin: "2px 0px",
                }}
              >
                <div
                  className={classes.row}
                  onClick={() => actionFollow(item["_id"], "complete")}
                >
                  <TaskAltIcon className="icon" sx={{ color: "#57a361" }} />
                  <p
                    style={{
                      marginRight: "2px",
                      color: "#57a361",
                    }}
                  >
                    تکمیل
                  </p>
                </div>
                <div
                  className={classes.row}
                  onClick={() => actionFollow(item["_id"], "cancel")}
                >
                  <CloseIcon className="icon" sx={{ color: "#d40d12" }} />
                  <p
                    style={{
                      marginRight: "2px",
                      color: "#d40d12",
                    }}
                  >
                    لغو
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </section>
  );
}
