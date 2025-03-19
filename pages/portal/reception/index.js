import { useState, useContext, Fragment, useEffect, useRef } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "../portal.module.scss";
import { NextSeo } from "next-seo";
import logo from "@/assets/logo.png";
import dbConnect from "@/services/dbConnect";
import recordModel from "@/models/Record";
import Router from "next/router";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getCurrentDateFarsi, convertPersianDate } from "@/services/utility";

export default function Reception({ records }) {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const [receptionCards, setReceptionCards] = useState([]);
  const [navigation, setNavigation] = useState(
    "دکتر فراهانی" || "دکتر گنجه" || "دکتر حاجیلو"
  );
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.permission !== "admin") {
      Router.push("/");
    } else {
      filterReceptionCards(navigation);
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
          <div
            className={classes.row}
            onClick={() => {
              router.reload(router.asPath);
            }}
          >
            <h4>{receptionCards.length}</h4>
            <RefreshIcon />
          </div>
        </div>
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
        <div className={classes.records}>
          {receptionCards.map((record, index) => (
            <div key={index} className={classes.card}>
              <h3>{record.name}</h3>
              <p>{record.phone}</p>
              <p>{record.idMeli}</p>
              <p>{record.birthDate}</p>
              <p>{record.tel}</p>
              <p>{record.address}</p>
              <p>{record.occupation}</p>
              <p>{record.referral}</p>
              <p>
                {record.sharePermission
                  ? "عکس اشتراک گذاشته شود"
                  : "عکس اشتراک گذاشته نشود"}
              </p>
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
