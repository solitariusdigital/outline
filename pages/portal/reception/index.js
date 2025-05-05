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
import Kavenegar from "kavenegar";
import { getCurrentDateFarsi, convertPersianDate } from "@/services/utility";
import {
  getSingleRecordApi,
  updateRecordApi,
  getSingleVisitApi,
  updateVisitApi,
} from "@/services/api";

export default function Reception({ records }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { popupDiagramData, setPopupDiagramData } = useContext(StateContext);
  const { kavenegarKey, setKavenegarKey } = useContext(StateContext);
  const [receptionCards, setReceptionCards] = useState([]);
  const [expandInformation, setExpandInformation] = useState(null);
  const [expandRecords, setExpandRecords] = useState(null);
  const [messages, setMessages] = useState([]);
  const [recordObject, setRecordObject] = useState(null);
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

  useEffect(() => {
    const messagesValue = receptionCards.map((record) => {
      const recordsArray = record.records;
      const lastRecord = recordsArray[recordsArray.length - 1];
      return lastRecord.message;
    });
    setMessages(messagesValue);
  }, [receptionCards]);

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

  const updateLastRecordMessage = async (id, message, completed = false) => {
    let recordData = await getSingleRecordApi(id);
    const recordsArray = recordData.records;
    if (recordsArray.length > 0) {
      const lastRecordIndex = recordsArray.length - 1;
      const lastRecord = recordsArray[lastRecordIndex];
      lastRecord.message = message;
      recordData.completed = completed;
      await updateRecordApi(recordData);
    }
  };

  const handleMessageChange = async (id, index, value) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
    await updateLastRecordMessage(id, newMessages[index]);
  };

  const completeRecord = async (id, index) => {
    const confirm = window.confirm("تکمیل مراجعه، مطمئنی؟");
    if (confirm) {
      await updateLastRecordMessage(id, messages[index], true);
      await completePatientVisit(id);
      setTimeout(() => {
        router.reload(router.asPath);
      }, 500);
    }
  };

  const completePatientVisit = async (id) => {
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    let recordData = await getSingleRecordApi(id);
    await api.VerifyLookup({
      receptor: recordData.phone,
      token: getCurrentDateFarsi(),
      template: "completeOutline",
    });
    let visitData = await getSingleVisitApi(recordData.visitId);
    if (visitData) {
      visitData.completed = true;
      await updateVisitApi(visitData);
    }
  };

  const completeVisit = async (id) => {
    const confirm = window.confirm("تکمیل ویزیت، مطمئنی؟");
    if (confirm) {
      let recordData = await getSingleRecordApi(id);
      recordData.checkup = true;
      await updateRecordApi(recordData);
      router.reload(router.asPath);
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
          {!popupDiagramData && !recordObject && (
            <Fragment>
              {receptionCards.map((record, index) => (
                <div key={index} className={classes.card}>
                  <div className={classes.row}>
                    <p
                      style={{
                        color: record.checkup ? "#15b392" : "#999999",
                      }}
                    >
                      {record.checkup ? "انجام مشاوره" : "در انتظار"}
                    </p>
                    <p
                      style={{
                        color: "#999999",
                      }}
                    >
                      {record.time ? record.time : "بدون نوبت"}
                    </p>
                  </div>
                  <div
                    className={classes.row}
                    style={{ cursor: "pointer" }}
                    onClick={() => expandInformationAction(record["_id"])}
                  >
                    <h3
                      onClick={() => navigator.clipboard.writeText(record.name)}
                    >
                      {record.name}
                    </h3>
                    {expandInformation === record["_id"] ? (
                      <ExpandLessIcon
                        className="icon"
                        sx={{ color: "#2d2b7f" }}
                      />
                    ) : (
                      <ExpandMoreIcon
                        className="icon"
                        sx={{ color: "#2d2b7f" }}
                      />
                    )}
                  </div>
                  <div className={classes.row}>
                    <p>{record.birthDate}</p>
                    <p>{record.age}</p>
                  </div>
                  <div
                    className={classes.row}
                    style={{ cursor: "pointer" }}
                    onClick={() => expandRecordsAction(record["_id"])}
                  >
                    <div className={classes.row}>
                      <span className={classes.more}>سابقه بیمار</span>
                      <MoreHorizIcon sx={{ color: "#2d2b7f" }} />
                    </div>
                    <p>{record.records.length}</p>
                  </div>
                  {expandRecords === record["_id"] && (
                    <Fragment>
                      {record.records.map((item, index) => (
                        <div
                          key={index}
                          className={classes.recordBox}
                          style={{ cursor: "pointer" }}
                          onClick={() => setRecordObject(item)}
                        >
                          <div className={classes.recordRow}>
                            <p className={classes.recordText}>{item.date}</p>
                            <p className={classes.recordText}>{item.doctor}</p>
                          </div>
                        </div>
                      ))}
                    </Fragment>
                  )}
                  {currentUser?.permission === "admin" && (
                    <Fragment>
                      {(() => {
                        const lastRecord =
                          record.records[record.records.length - 1];
                        return (
                          <>
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
                            <div className={classes.row}>
                              <span>شماره پرونده</span>
                              <p
                                onClick={() =>
                                  navigator.clipboard.writeText(record.recordId)
                                }
                              >
                                {record.recordId}
                              </p>
                            </div>
                            {expandInformation === record["_id"] && (
                              <Fragment>
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
                                  onClick={() =>
                                    handleMessageChange(
                                      record["_id"],
                                      index,
                                      ""
                                    )
                                  }
                                  sx={{ fontSize: 16 }}
                                />
                              </div>
                              <textarea
                                placeholder="توضیحات"
                                type="text"
                                id={`message-${index}`}
                                name={`message-${index}`}
                                onChange={(e) =>
                                  handleMessageChange(
                                    record["_id"],
                                    index,
                                    e.target.value
                                  )
                                }
                                value={messages[index]}
                                autoComplete="off"
                                dir="rtl"
                              />
                              {record.checkup && (
                                <button
                                  className={classes.buttonCheck}
                                  onClick={() =>
                                    setPopupDiagramData({
                                      record: record,
                                      lastRecord: lastRecord,
                                    })
                                  }
                                >
                                  مناطق تزریق صورت
                                </button>
                              )}
                              <button
                                className={classes.button}
                                onClick={() =>
                                  completeRecord(record["_id"], index)
                                }
                              >
                                تکمیل مراجعه
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </Fragment>
                  )}
                  {currentUser?.permission === "doctor" && (
                    <Fragment>
                      {(() => {
                        const lastRecord =
                          record.records[record.records.length - 1];
                        return (
                          <>
                            <button
                              className={classes.button}
                              onClick={() =>
                                setPopupDiagramData({
                                  record: record,
                                  lastRecord: lastRecord,
                                })
                              }
                            >
                              تجویز تزریق
                            </button>
                            {expandInformation === record["_id"] && (
                              <Fragment>
                                <div className={classes.info}>
                                  <span>تاریخچه پزشکی</span>
                                  <div className={classes.item}>
                                    {lastRecord.medical
                                      .filter((item) => item.active)
                                      .map((item) => (
                                        <h5 key={item.label}>{item.label}</h5>
                                      ))}
                                  </div>
                                  <p>{lastRecord.medicalDescription}</p>
                                </div>
                                <div className={classes.info}>
                                  <span>سابقه دارویی</span>
                                  <p>{lastRecord.medicineDescription}</p>
                                </div>
                                <div className={classes.info}>
                                  <span>عادات بیمار</span>
                                  <div className={classes.item}>
                                    {lastRecord.habits
                                      .filter((item) => item.active)
                                      .map((item) => (
                                        <h5 key={item.label}>{item.label}</h5>
                                      ))}
                                  </div>
                                </div>
                                <div className={classes.info}>
                                  <span>تاریخچه پزشکی اعضاء خانواده</span>
                                  <div className={classes.item}>
                                    {lastRecord.medicalFamily
                                      .filter((item) => item.active)
                                      .map((item) => (
                                        <h5 key={item.label}>{item.label}</h5>
                                      ))}
                                  </div>
                                  <p>{lastRecord.medicalFamilyDescription}</p>
                                </div>
                              </Fragment>
                            )}
                          </>
                        );
                      })()}
                    </Fragment>
                  )}
                </div>
              ))}
            </Fragment>
          )}
          {recordObject && (
            <div className={classes.popup}>
              <CloseIcon
                className="icon"
                onClick={() => setRecordObject(null)}
              />
              <p>{recordObject.doctor}</p>
              <p>{recordObject.date}</p>
              <div className={classes.card}>
                <div className={classes.info}>
                  <span>تاریخچه پزشکی</span>
                  <div className={classes.item}>
                    {recordObject.medical
                      .filter((item) => item.active)
                      .map((item) => (
                        <h5 key={item.label}>{item.label}</h5>
                      ))}
                  </div>
                  <p>{recordObject.medicalDescription}</p>
                </div>
                <div className={classes.info}>
                  <span>سابقه دارویی</span>
                  <p>{recordObject.medicineDescription}</p>
                </div>
                <div className={classes.info}>
                  <span>عادات بیمار</span>
                  <div className={classes.item}>
                    {recordObject.habits
                      .filter((item) => item.active)
                      .map((item) => (
                        <h5 key={item.label}>{item.label}</h5>
                      ))}
                  </div>
                </div>
                <div className={classes.info}>
                  <span>تاریخچه پزشکی اعضاء خانواده</span>
                  <div className={classes.item}>
                    {recordObject.medicalFamily
                      .filter((item) => item.active)
                      .map((item) => (
                        <h5 key={item.label}>{item.label}</h5>
                      ))}
                  </div>
                  <p>{recordObject.medicalFamilyDescription}</p>
                </div>
                <div className={classes.historyItem}>
                  <span>سابقه تزریق</span>
                  {Object.entries(recordObject.visitHistory).map(
                    ([key, items]) => {
                      if (items.length > 0) {
                        return (
                          <div key={key} className={classes.historyRow}>
                            <span>{key}</span>
                            {items.map((item, index) => (
                              <h5 key={index}>{item}</h5>
                            ))}
                          </div>
                        );
                      }
                    }
                  )}
                </div>
                {recordObject.comment && (
                  <div className={classes.info}>
                    <span>نظر پزشک</span>
                    <p>{recordObject.comment}</p>
                  </div>
                )}
                {recordObject.message && (
                  <div className={classes.info}>
                    <span>توضیحات</span>
                    <p>{recordObject.message}</p>
                  </div>
                )}
                <div className={classes.info}>
                  <p
                    style={{
                      color: recordObject.sharePermission
                        ? "#15b392"
                        : "#d40d12",
                    }}
                  >
                    {recordObject.sharePermission
                      ? "عکس اشتراک گذاشته شود"
                      : "عکس اشتراک گذاشته نشود"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {popupDiagramData && (
            <div className={classes.popup}>
              <div className={classes.row}>
                <CloseIcon
                  className="icon"
                  onClick={() => setPopupDiagramData(null)}
                />
                <h4>{popupDiagramData.record.name}</h4>
                <h4>
                  {
                    popupDiagramData.record.records[
                      popupDiagramData.record.records.length - 1
                    ].date
                  }
                </h4>
              </div>
              <FaceDiagram />
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
    records.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    records.sort((a, b) => {
      return a.checkup === b.checkup ? 0 : a.checkup ? 1 : -1;
    });
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
