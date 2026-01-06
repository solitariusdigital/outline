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
import StarIcon from "@mui/icons-material/Star";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import FaceDiagram from "@/components/FaceDiagram";
import Kavenegar from "kavenegar";
import secureLocalStorage from "react-secure-storage";
import {
  getCurrentDateFarsi,
  convertPersianDate,
  toEnglishNumber,
  isEnglishNumber,
} from "@/services/utility";
import {
  getSingleRecordApi,
  updateRecordApi,
  getSingleVisitApi,
  updateVisitApi,
} from "@/services/api";

const receptionDoctor = JSON.parse(
  secureLocalStorage.getItem("receptionDoctor")
);

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
    receptionDoctor || "دکتر فراهانی" || "دکتر گنجه" || "دکتر پورقلی"
  );
  const doctors = ["دکتر فراهانی", "دکتر گنجه", "دکتر پورقلی"];
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const router = useRouter();

  // variables to edit user info
  const [editFormData, setEditFormData] = useState(null);
  const [name, setName] = useState("");
  const [idMeli, setIdMeli] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [referral, setReferral] = useState("");
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    if (editFormData) {
      setName(editFormData.name);
      setIdMeli(editFormData.idMeli);
      setPhone(editFormData.phone);
      setAddress(editFormData.address);
      setOccupation(editFormData.occupation);
      setReferral(editFormData.referral);
      const [year, month, day] = editFormData.birthDate.split("/");
      setBirthDate({
        day,
        month,
        year,
      });
    }
  }, [editFormData]);

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
    secureLocalStorage.setItem("receptionDoctor", JSON.stringify(doctor));
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
    }
  };

  const completePatientVisit = async (id) => {
    let recordData = await getSingleRecordApi(id);
    const api = Kavenegar.KavenegarApi({
      apikey: kavenegarKey,
    });
    api.VerifyLookup({
      receptor: recordData.phone,
      token: getCurrentDateFarsi(),
      template: "completeOutline",
    });
    if (recordData.visitId) {
      let visitData = await getSingleVisitApi(recordData.visitId);
      visitData.completed = true;
      await updateVisitApi(visitData);
    }
    setTimeout(() => {
      router.reload(router.asPath);
    }, 700);
  };

  const checkConvertNumber = (number) => {
    return isEnglishNumber(number) ? number : toEnglishNumber(number);
  };

  const handleEditFormData = async () => {
    setDisableButton(true);

    const fields = [
      { value: name, message: "نام الزامیست" },
      { value: idMeli, message: "کدملی الزامیست" },
      { value: birthDate.year, message: "سال تولد الزامیست" },
      { value: birthDate.month, message: "ماه تولد الزامیست" },
      { value: birthDate.day, message: "روز تولد الزامیست" },
      { value: phone, message: "موبایل الزامیست" },
      { value: address, message: "آدرس الزامیست" },
      { value: occupation, message: "شغل الزامیست" },
      { value: referral, message: "معرف الزامیست" },
    ];
    for (const field of fields) {
      if (!field.value) {
        showAlert(field.message);
        setDisableButton(false);
        return;
      }
    }

    const [currentYear] = getCurrentDateFarsi().split("/");
    let phoneEnglish = checkConvertNumber(phone);
    let idEnglish = checkConvertNumber(idMeli);
    let birthYear = checkConvertNumber(birthDate.year);

    if (birthYear.length !== 4 || !birthYear.startsWith("13")) {
      showAlert("سال تولد اشتباه");
      setDisableButton(false);
      return;
    }
    if (phoneEnglish.length !== 11 || !phoneEnglish.startsWith("09")) {
      showAlert("موبایل اشتباه");
      setDisableButton(false);
      return;
    }
    if (idEnglish.length !== 9 && idEnglish.length !== 10) {
      showAlert("کدملی اشتباه");
      setDisableButton(false);
      return;
    }

    let recordData = {
      ...editFormData,
      name: name.trim(),
      birthDate: `${birthYear}/${checkConvertNumber(
        birthDate.month
      )}/${checkConvertNumber(birthDate.day)}`,
      age: toEnglishNumber(currentYear) - birthYear,
      idMeli: idEnglish,
      phone: phoneEnglish,
      address: address.trim(),
      occupation: occupation.trim(),
      referral: referral.trim(),
    };
    await updateRecordApi(recordData);
    setEditFormData(null);
    router.reload(router.asPath);
  };

  const switchDoctor = async (recordData, changeDoctor) => {
    const message = `ارجاع بیمار به ${changeDoctor}`;
    const confirm = window.confirm(message);
    if (confirm) {
      const recordsArray = recordData.records;
      if (recordsArray.length > 0) {
        const lastRecordIndex = recordsArray.length - 1;
        const lastRecord = recordsArray[lastRecordIndex];
        lastRecord.doctor = changeDoctor;
        await updateRecordApi(recordData);
      }
      router.reload(router.asPath);
    }
  };

  const manageVIP = async (id, status) => {
    const message = status === "vip" ? "Make VIP?" : "Remove VIP?";
    const confirm = window.confirm(message);
    if (confirm) {
      const recordData = await getSingleRecordApi(id);
      const record = {
        ...recordData,
        status: status,
      };
      await updateRecordApi(record);
      router.reload(router.asPath);
    }
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
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
                navigation === "دکتر پورقلی" ? classes.activeNav : classes.nav
              }
              onClick={() => {
                filterReceptionCards("دکتر پورقلی");
              }}
            >
              دکتر پورقلی
            </p>
          </div>
        )}
        <div className={classes.records}>
          {!editFormData && !popupDiagramData && !recordObject && (
            <Fragment>
              {receptionCards.map((record, index) => (
                <div key={index} className={classes.card}>
                  {!record.completed ? (
                    <div className={classes.row}>
                      <div className={classes.row}>
                        <p
                          style={{
                            color: record.checkup ? "#15b392" : "#999999",
                            marginLeft: "4px",
                          }}
                        >
                          {record.checkup ? "انجام مشاوره" : "انتظار"}
                        </p>
                        <p
                          style={{
                            color: "#999999",
                          }}
                        >
                          {record.time}
                        </p>
                      </div>
                      <div className={classes.row}>
                        <p
                          style={{
                            color: "#999999",
                            marginLeft: "4px",
                          }}
                        >
                          ثبت
                        </p>
                        <p
                          style={{
                            color: "#999999",
                          }}
                        >
                          {record.entryTime.split(":").slice(0, 2).join(":")}
                        </p>
                      </div>
                      {currentUser?.permission === "admin" && (
                        <EditIcon
                          className="icon"
                          sx={{ fontSize: 20 }}
                          onClick={() => setEditFormData(record)}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className={classes.row}
                      style={{
                        color: "#999999",
                      }}
                    >
                      <p>مراجعه تکمیل</p>
                      <DoneOutlineIcon sx={{ fontSize: 20 }} />
                    </div>
                  )}
                  <div
                    className={classes.row}
                    style={{ cursor: "pointer" }}
                    onClick={() => expandInformationAction(record["_id"])}
                  >
                    <div className={classes.row}>
                      {record?.status === "vip" && (
                        <Tooltip title="VIP">
                          <StarIcon sx={{ fontSize: 16 }} />
                        </Tooltip>
                      )}
                      <h4
                        onClick={() =>
                          navigator.clipboard.writeText(record.name)
                        }
                        style={{
                          marginRight: "4px",
                        }}
                      >
                        {record.name}
                      </h4>
                    </div>
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
                    style={{ cursor: "pointer" }}
                    onClick={() => expandRecordsAction(record["_id"])}
                  >
                    <div className={classes.row}>
                      <span className={classes.more}>سابقه بیمار</span>
                      <MoreHorizIcon className="icon" />
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
                              <span>کدملی</span>
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
                                <div className={classes.row}>
                                  <span>شغل</span>
                                  <p>{record.occupation}</p>
                                </div>
                                <div className={classes.row}>
                                  <span>معرف</span>
                                  <p>{record.referral}</p>
                                </div>
                                <p>{record.address}</p>
                              </Fragment>
                            )}
                            {!record.completed && (
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
                            )}
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
                            {!record.completed && (
                              <Fragment>
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
                                <div
                                  className={classes.row}
                                  style={{
                                    marginTop: "4px",
                                  }}
                                >
                                  <div
                                    className={classes.input}
                                    style={{
                                      width: "50%",
                                    }}
                                  >
                                    <select
                                      defaultValue={"default"}
                                      onChange={(e) => {
                                        switchDoctor(record, e.target.value);
                                      }}
                                    >
                                      <option value="default" disabled>
                                        ارجاع بیمار
                                      </option>
                                      {doctors
                                        .filter(
                                          (doctor) =>
                                            currentUser.name !== doctor
                                        )
                                        .map((doctor, index) => {
                                          return (
                                            <option key={index} value={doctor}>
                                              {doctor}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                  {record.status !== "vip" ? (
                                    <button
                                      className={classes.buttonVip}
                                      onClick={() =>
                                        manageVIP(record["_id"], "vip")
                                      }
                                    >
                                      Make VIP
                                    </button>
                                  ) : (
                                    <button
                                      className={classes.buttonVip}
                                      onClick={() =>
                                        manageVIP(record["_id"], "regular")
                                      }
                                    >
                                      Remove VIP
                                    </button>
                                  )}
                                </div>
                              </Fragment>
                            )}
                            {expandInformation === record["_id"] && (
                              <Fragment>
                                <div className={classes.info}>
                                  <div className={classes.row}>
                                    <span>شغل</span>
                                    <p>{record.occupation}</p>
                                  </div>
                                  <div className={classes.row}>
                                    <span>معرف</span>
                                    <p>{record.referral}</p>
                                  </div>
                                  <p>{record.address}</p>
                                </div>
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
                  {currentUser?.permission === "admin" &&
                  record.status !== "vip" ? (
                    <button
                      className={classes.buttonVip}
                      onClick={() => manageVIP(record["_id"], "vip")}
                    >
                      Make VIP
                    </button>
                  ) : (
                    <button
                      className={classes.buttonVip}
                      onClick={() => manageVIP(record["_id"], "regular")}
                    >
                      Remove VIP
                    </button>
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
                  <span>سابقه مشاوره</span>
                  {Object.entries(recordObject.visitHistory).map(
                    ([key, items]) => {
                      if (items.length > 0) {
                        return (
                          <div key={key} className={classes.historyRow}>
                            <span>{key}</span>
                            {items.map((item, index) => (
                              <div key={index} className={classes.row}>
                                <h5>{item}</h5>
                                {recordObject.extraFiller?.includes(item) && (
                                  <p>+</p>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      }
                    }
                  )}
                </div>
                {recordObject.injectHistory && (
                  <div className={classes.historyItem}>
                    <span>سابقه تزریق</span>
                    {Object.entries(recordObject.injectHistory).map(
                      ([key, items]) => {
                        if (items.length > 0) {
                          // Filter the items to only include those that are active
                          const activeItems = items.filter(
                            (item) => item.active
                          );
                          // Check if there are any active items to render
                          if (activeItems.length > 0) {
                            return (
                              <div key={key} className={classes.historyRow}>
                                <span>{key}</span>
                                {activeItems.map((item, index) => (
                                  <div key={index} className={classes.row}>
                                    <h5>{item.name}</h5>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                        }
                      }
                    )}
                  </div>
                )}
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
                      fontSize: "small",
                      color: recordObject.pregnant ? "#d40d12" : "#15b392",
                    }}
                  >
                    {recordObject.pregnant ? "باردار است" : "باردار نیست"}
                  </p>
                </div>
                <div className={classes.info}>
                  <p
                    style={{
                      fontSize: "small",
                      color: recordObject.breastfeeding ? "#d40d12" : "#15b392",
                    }}
                  >
                    {recordObject.breastfeeding
                      ? "دوران شیردهی است"
                      : "دوران شیردهی نیست"}
                  </p>
                </div>
                <div className={classes.info}>
                  <p
                    style={{
                      fontSize: "small",
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
          {editFormData && (
            <div className={classes.popup}>
              <CloseIcon
                className="icon"
                onClick={() => setEditFormData(null)}
              />
              <section className={classes.form}>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      نام و نام خانوادگی
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setName("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    placeholder="فارسی وارد کنید"
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    autoComplete="off"
                    dir="rtl"
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      کدملی
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setIdMeli("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    type="tel"
                    id="idMeli"
                    name="idMeli"
                    onChange={(e) => setIdMeli(e.target.value)}
                    value={idMeli}
                    autoComplete="off"
                    dir="rtl"
                    maxLength={10}
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      موبایل
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setPhone("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    placeholder="09123456789"
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    autoComplete="off"
                    dir="rtl"
                    maxLength={11}
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      تاریخ تولد
                    </p>
                  </div>
                  <div className={classes.inputBirth}>
                    <input
                      placeholder="15"
                      type="tel"
                      id="day"
                      name="day"
                      onChange={(e) =>
                        setBirthDate((prev) => ({
                          ...prev,
                          day: e.target.value,
                        }))
                      }
                      value={birthDate.day}
                      autoComplete="off"
                      dir="rtl"
                      maxLength={2}
                    />
                    <input
                      placeholder="05"
                      type="tel"
                      id="month"
                      name="month"
                      onChange={(e) =>
                        setBirthDate((prev) => ({
                          ...prev,
                          month: e.target.value,
                        }))
                      }
                      value={birthDate.month}
                      autoComplete="off"
                      dir="rtl"
                      maxLength={2}
                    />
                    <input
                      placeholder="1365"
                      type="tel"
                      id="year"
                      name="year"
                      onChange={(e) =>
                        setBirthDate((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                      value={birthDate.year}
                      autoComplete="off"
                      dir="rtl"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      آدرس محل سکونت
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setAddress("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    autoComplete="off"
                    dir="rtl"
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      شغل
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setOccupation("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    onChange={(e) => setOccupation(e.target.value)}
                    value={occupation}
                    autoComplete="off"
                    dir="rtl"
                  />
                </div>
                <div className={classes.input}>
                  <div className={classes.bar}>
                    <p className={classes.label}>
                      <span>*</span>
                      معرف
                    </p>
                    <CloseIcon
                      className="icon"
                      onClick={() => setReferral("")}
                      sx={{ fontSize: 16 }}
                    />
                  </div>
                  <input
                    type="text"
                    id="referral"
                    name="referral"
                    onChange={(e) => setReferral(e.target.value)}
                    value={referral}
                    autoComplete="off"
                    dir="rtl"
                  />
                </div>
                <div className={classes.input}>
                  <p className={classes.alert}>{alert}</p>
                  <button
                    disabled={disableButton}
                    onClick={() => handleEditFormData()}
                  >
                    ذخیره
                  </button>
                </div>
              </section>
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
    records.sort((a, b) => {
      // Sort by completed (false first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Sort by checkup (false first)
      if (a.checkup !== b.checkup) {
        return a.checkup ? 1 : -1;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return {
      props: {
        records: JSON.parse(JSON.stringify(records)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
