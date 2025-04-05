import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "../portal.module.scss";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import logo from "@/assets/logo.png";
import faceDiagram from "@/assets/faceDiagram.jpg";
import dbConnect from "@/services/dbConnect";
import recordModel from "@/models/Record";
import Router from "next/router";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { getCurrentDateFarsi, convertPersianDate } from "@/services/utility";
import { getSingleRecordApi, updateRecordApi } from "@/services/api";

export default function Reception({ records }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [receptionCards, setReceptionCards] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandRecords, setExpandRecords] = useState(null);
  const [message, setMessage] = useState(null);
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

  const expandInformation = (id) => {
    setExpandedItem(id);
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  const completeRecord = async (id) => {
    const confirm = window.confirm("تکمیل نوبت، مطمئنی؟");
    if (confirm) {
      let recordData = await getSingleRecordApi(id);
      const recordsArray = recordData.records;
      if (recordsArray.length > 0) {
        const lastRecordIndex = recordsArray.length - 1;
        const lastRecord = recordsArray[lastRecordIndex];
        lastRecord.message = message;
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
            <div key={index} className={classes.card}>
              <div
                className={classes.row}
                onClick={() => expandInformation(record["_id"])}
              >
                <h3>{record.name}</h3>
                {currentUser?.permission === "admin" && (
                  <Fragment>
                    {expandedItem === record["_id"] ? (
                      <ExpandLessIcon className="icon" />
                    ) : (
                      <ExpandMoreIcon className="icon" />
                    )}
                  </Fragment>
                )}
              </div>
              <div className={classes.row}>
                <p>{record.birthDate}</p>
                <p>{record.age}</p>
              </div>
              <div
                className={classes.row}
                onClick={() => setExpandRecords(!expandRecords)}
              >
                <div className={classes.row}>
                  <span>مراجعه</span>
                  <MoreHorizIcon sx={{ color: "#999999" }} />
                </div>
                <p>{record.records.length}</p>
              </div>
              {currentUser?.permission === "admin" && (
                <Fragment>
                  <div className={classes.row}>
                    <span>موبایل</span>
                    <p>{record.phone}</p>
                  </div>
                  <div className={classes.row}>
                    <span>کد ملی</span>
                    <p>{record.idMeli}</p>
                  </div>
                  <div className={classes.input}>
                    <div className={classes.bar}>
                      <CloseIcon
                        className="icon"
                        onClick={() => setMessage("")}
                        sx={{ fontSize: 16 }}
                      />
                      <p className={classes.label}>توضیحات تکمیلی</p>
                    </div>
                    <textarea
                      type="text"
                      id="message"
                      name="message"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      autoComplete="off"
                      dir="rtl"
                    />
                    <button
                      className={classes.button}
                      onClick={() => completeRecord(record["_id"])}
                    >
                      تکمیل مراجعه
                    </button>
                  </div>
                  {expandedItem === record["_id"] && (
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
                </Fragment>
              )}
              {currentUser?.permission === "doctor" && (
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
                  <div className={classes.image}>
                    <div
                      className={classes.zone}
                      style={{
                        backgroundColor: "#E6B2BA",
                        height: "20%",
                      }}
                    ></div>
                    <div
                      className={classes.zone}
                      style={{
                        backgroundColor: "#C7D9DD",
                        height: "12%",
                      }}
                    ></div>
                    <div
                      className={classes.zone}
                      style={{
                        backgroundColor: "#F2E2B1",
                        height: "20%",
                      }}
                    ></div>
                    <div
                      className={classes.zone}
                      style={{
                        backgroundColor: "#FDB7EA",
                        height: "20%",
                      }}
                    ></div>
                    <div
                      className={classes.zone}
                      style={{
                        backgroundColor: "#BAD8B6",
                        height: "12%",
                      }}
                    ></div>
                    <Image
                      src={faceDiagram}
                      blurDataURL={faceDiagram}
                      alt="faceDiagram"
                      placeholder="blur"
                      layout="fill"
                      objectFit="contain"
                      as="image"
                      unoptimized
                    />
                  </div>
                </Fragment>
              )}
              {expandRecords && (
                <Fragment>
                  {record.records.map((item, index) => (
                    <div key={index} className={classes.row}>
                      <p className={classes.recordText}>{item.date}</p>
                      <p>{item.doctor}</p>
                    </div>
                  ))}
                </Fragment>
              )}
            </div>
          ))}
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
