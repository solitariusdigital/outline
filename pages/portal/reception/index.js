import { useState, useContext, Fragment, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "../portal.module.scss";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import dbConnect from "@/services/dbConnect";
import recordModel from "@/models/Record";
import Router from "next/router";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import FaceDiagram from "@/components/FaceDiagram";
import { getCurrentDateFarsi, convertPersianDate } from "@/services/utility";
import { getSingleRecordApi, updateRecordApi } from "@/services/api";

export default function Reception({ records }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [receptionCards, setReceptionCards] = useState([]);
  const [expandInformation, setExpandInformation] = useState(null);
  const [expandRecords, setExpandRecords] = useState(null);
  const [messages, setMessages] = useState(Array(records.length).fill(""));
  const [popupObject, setPopupObject] = useState(null);
  const [navigation, setNavigation] = useState(
    "دکتر فراهانی" || "دکتر گنجه" || "دکتر حاجیلو"
  );
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.permission === "admin") {
      filterReceptionCards(navigation);
    } else if (currentUser?.permission === "doctor") {
      filterReceptionCards(currentUser?.name);
    } else {
      Router.push("/");
    }
  }, []);

  const filterReceptionCards = (doctor) => {
    setNavigation(doctor);
    let filteredRecords = records.filter((record) => {
      const recordsArray = record.records;
      if (recordsArray.length > 0) {
        const lastRecord = recordsArray[recordsArray.length - 1];
        return lastRecord.doctor === doctor;
      }
      return false;
    });
    setReceptionCards(filteredRecords);
  };

  const expandInformationAction = (id) => {
    setExpandInformation(id);
    if (expandInformation === id) {
      setExpandInformation(null);
    }
  };
  const expandRecordsAction = (id) => {
    setExpandRecords(id);
    if (expandRecords === id) {
      setExpandRecords(null);
    }
  };

  const handleMessageChange = (index, value) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const completeRecord = async (id, index) => {
    const confirm = window.confirm("تکمیل مراجعه، مطمئنی؟");
    if (confirm) {
      let recordData = await getSingleRecordApi(id);
      const recordsArray = recordData.records;
      if (recordsArray.length > 0) {
        const lastRecordIndex = recordsArray.length - 1;
        const lastRecord = recordsArray[lastRecordIndex];
        lastRecord.message = messages[index];
        recordData.completed = true;
        await updateRecordApi(recordData);
        router.reload(router.asPath);
      }
    }
  };

  return (
    <Fragment>
      <NextSeo
        title="پورتال پذیرش"
        description="پورتال پذیرش"
        canonical="https://outlinecommunity.com/portal/reception"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/portal/reception",
          title: "پورتال پذیرش",
          description: "پورتال پذیرش",
          siteName: "Outline Community",
          images: {
            url: logo,
            width: 1200,
            height: 630,
            alt: "اوت‌لاین",
          },
        }}
        robotsProps={{
          maxSnippet: -1,
          maxImagePreview: "large",
          maxVideoPreview: -1,
        }}
      />
      <div className={classes.container}>
        <div className={classes.dataRefresh}>
          <h3>{getCurrentDateFarsi()}</h3>
          <div className={classes.row}>
            <RefreshIcon
              className="icon"
              onClick={() => {
                router.reload(router.asPath);
              }}
            />
            <h4>{receptionCards.length}</h4>
            <HomeIcon onClick={() => Router.push("/")} className="icon" />
          </div>
        </div>
        {currentUser?.permission === "admin" && (
          <div className={classes.navigation}>
            <p
              className={
                navigation === "دکتر فراهانی" ? classes.activeNav : classes.nav
              }
              onClick={() => {
                filterReceptionCards("دکتر فراهانی");
              }}
            >
              دکتر فراهانی
            </p>
            <p
              className={
                navigation === "دکتر گنجه" ? classes.activeNav : classes.nav
              }
              onClick={() => {
                filterReceptionCards("دکتر گنجه");
              }}
            >
              دکتر گنجه
            </p>
            <p
              className={
                navigation === "دکتر حاجیلو" ? classes.activeNav : classes.nav
              }
              onClick={() => {
                filterReceptionCards("دکتر حاجیلو");
              }}
            >
              دکتر حاجیلو
            </p>
          </div>
        )}
        <div className={classes.records}>
          {receptionCards.map((record, index) => (
            <Fragment key={index}>
              <div className={classes.card}>
                <div
                  className={classes.row}
                  onClick={() => expandInformationAction(record["_id"])}
                >
                  <h3
                    onClick={() => navigator.clipboard.writeText(record.name)}
                  >
                    {record.name}
                  </h3>
                  {expandInformation === record["_id"] ? (
                    <ExpandLessIcon className="icon" />
                  ) : (
                    <ExpandMoreIcon className="icon" />
                  )}
                </div>
                <div className={classes.row}>
                  <p>{record.birthDate}</p>
                  <p>{record.age}</p>
                </div>
                <div
                  className={classes.row}
                  onClick={() => expandRecordsAction(record["_id"])}
                >
                  <div className={classes.row}>
                    <span>مراجعه</span>
                    <MoreHorizIcon sx={{ color: "#999999" }} />
                  </div>
                  <p>{record.records.length}</p>
                </div>
                {expandRecords === record["_id"] && (
                  <Fragment>
                    {record.records.map((item, index) => (
                      <div key={index} className={classes.recordBox}>
                        <div className={classes.recordRow}>
                          <p className={classes.recordText}>{item.date}</p>
                          <p className={classes.recordText}> {item.doctor}</p>
                        </div>
                        <p className={classes.recordMessage}>{item.message}</p>
                      </div>
                    ))}
                  </Fragment>
                )}
                {currentUser?.permission === "admin" && (
                  <Fragment>
                    <div className={classes.row}>
                      <span>موبایل</span>
                      <p
                        onClick={() =>
                          navigator.clipboard.writeText(record.phone)
                        }
                      >
                        {record.phone}
                      </p>
                    </div>
                    <div className={classes.row}>
                      <span>کد ملی</span>
                      <p
                        onClick={() =>
                          navigator.clipboard.writeText(record.idMeli)
                        }
                      >
                        {record.idMeli}
                      </p>
                    </div>
                    {expandInformation === record["_id"] && (
                      <Fragment>
                        <div className={classes.row}>
                          <span>ثابت</span>
                          <p>{record.tel}</p>
                        </div>
                        <p>{record.address}</p>
                        <div className={classes.row}>
                          <span>شغل</span>
                          <p>{record.occupation}</p>
                        </div>
                        <div className={classes.row}>
                          <span>معرف</span>
                          <p>{record.referral}</p>
                        </div>
                      </Fragment>
                    )}
                    <div className={classes.input}>
                      <div className={classes.bar}>
                        <CloseIcon
                          className="icon"
                          onClick={() => handleMessageChange(index, "")}
                          sx={{ fontSize: 16 }}
                        />
                      </div>
                      <textarea
                        placeholder="توضیحات تکمیلی"
                        type="text"
                        id={`message-${index}`}
                        name={`message-${index}`}
                        onChange={(e) =>
                          handleMessageChange(index, e.target.value)
                        }
                        value={messages[index]}
                        autoComplete="off"
                        dir="rtl"
                      />
                      <button
                        className={classes.button}
                        onClick={() => completeRecord(record["_id"], index)}
                      >
                        تکمیل مراجعه
                      </button>
                    </div>
                  </Fragment>
                )}
                {currentUser?.permission === "doctor" && (
                  <Fragment>
                    <button
                      className={classes.button}
                      style={{ margin: "10px 0px" }}
                      onClick={() =>
                        setPopupObject({
                          name: record.name,
                          zones: {
                            one: true,
                            two: true,
                            three: true,
                            four: true,
                            five: true,
                          },
                        })
                      }
                    >
                      دیاگرام صورت جدید
                    </button>
                    {expandInformation === record["_id"] && (
                      <Fragment>
                        <div className={classes.info}>
                          <span>تاریخچه پزشکی</span>
                          <div className={classes.item}>
                            {record.medical
                              .filter((item) => item.active)
                              .map((item) => (
                                <h4 key={item.label}>{item.label}</h4>
                              ))}
                          </div>
                          <p>{record.medicalDescription}</p>
                        </div>
                        <div className={classes.info}>
                          <span>سابقه دارویی</span>
                          <p>{record.medicineDescription}</p>
                        </div>
                        <div className={classes.info}>
                          <span>عادات بیمار</span>
                          <div className={classes.item}>
                            {record.habits
                              .filter((item) => item.active)
                              .map((item) => (
                                <h4 key={item.label}>{item.label}</h4>
                              ))}
                          </div>
                        </div>
                        <div className={classes.info}>
                          <span>تاریخچه پزشکی اعضاء خانواده</span>
                          <div className={classes.item}>
                            {record.medicalFamily
                              .filter((item) => item.active)
                              .map((item) => (
                                <h4 key={item.label}>{item.label}</h4>
                              ))}
                          </div>
                          <p>{record.medicalFamilyDescription}</p>
                        </div>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </div>
            </Fragment>
          ))}
          {popupObject && (
            <div className={classes.popup}>
              <CloseIcon
                className="icon"
                onClick={() => setPopupObject(null)}
              />
              <h3>{popupObject.name}</h3>
              <FaceDiagram zones={popupObject.zones} />
              <button
                className={classes.button}
                onClick={() => setPopupObject(null)}
              >
                تکمیل
              </button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    await dbConnect();

    let records = await recordModel.find({
      date: { $regex: `^${convertPersianDate(getCurrentDateFarsi())}` },
    });
    records.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    let activeRecords = records.filter((record) => !record.completed);

    return {
      props: {
        records: JSON.parse(JSON.stringify(activeRecords)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
