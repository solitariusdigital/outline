import { useContext, useEffect, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import Router from "next/router";
import classes from "./followup.module.scss";
import HomeIcon from "@mui/icons-material/Home";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  const router = useRouter();

  useEffect(() => {
    const handleFollows = async () => {
      if (currentUser?.permission !== "admin") {
        return;
      }
      const followsData = await getFollowsApi();
      let activeFollows = followsData.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
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
      <div className={classes.row}>
        <HomeIcon onClick={() => Router.push("/")} className="icon" />
        <h4
          style={{
            margin: "0px 8px",
          }}
        >
          {
            displayFollows?.filter(
              (visit) => !visit.completed && !visit.canceled,
            ).length
          }
        </h4>
        <RefreshIcon
          className="icon"
          onClick={() => {
            router.reload(router.asPath);
          }}
        />
      </div>
      <h3
        style={{
          margin: "8px",
        }}
      >
        نوبت Follow Up
      </h3>
      <div className={classes.row}>
        <h4
          style={{
            margin: "0px 8px",
            color: "#57a361",
          }}
        >
          تکمیل {displayFollows?.filter((visit) => visit.completed).length}
        </h4>
        <h4
          style={{
            margin: "0px 8px",
            color: "#d40d12",
          }}
        >
          لغو {displayFollows?.filter((visit) => visit.canceled).length}
        </h4>
      </div>
      <div className={classes.cards}>
        <>
          {displayFollows
            ?.filter((visit) => !visit.completed && !visit.canceled)
            .map((item, index) => (
              <div className={classes.item} key={index}>
                <div className={classes.row}>
                  <h4>{item.name}</h4>
                  <h4
                    className={classes.phone}
                    onClick={() =>
                      window.open(`tel:+98${item.phone.substring(1)}`, "_self")
                    }
                  >
                    {item.phone}
                  </h4>
                </div>
                <div className={classes.row}>
                  <p>{item.doctor}</p>
                  {/* <p>{item.branch === "tehran" ? "شعبه تهران" : "شعبه کیش"}</p> */}
                  <p>{item.time}</p>
                </div>
                <div className={classes.row}>
                  <p
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {item.title}
                  </p>
                </div>
                <div className={classes.row}>
                  <div
                    className={classes.row}
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => actionFollow(item["_id"], "complete")}
                  >
                    <TaskAltIcon sx={{ color: "#57a361" }} />
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
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => actionFollow(item["_id"], "cancel")}
                  >
                    <CloseIcon sx={{ color: "#d40d12" }} />
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
