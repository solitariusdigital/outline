import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./FaceDiagram.module.scss";
import Image from "next/legacy/image";
import faceDiagram from "@/assets/faceDiagram.png";
import { updateRecordApi } from "@/services/api";

export default function FaceDiagram() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { popupDiagramData, setPopupDiagramData } = useContext(StateContext);
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    popupDiagramData.lastRecord?.visitHistory
  );
  const activeFunctionality =
    currentUser?.permission === "doctor" ? true : false;
  const [navigation, setNavigation] = useState(
    "فیلر" || "بوتاکس" || "مزوتراپی" || "جوانساز" || "پی آر پی"
  );
  const categories = {
    فیلر: [
      "پیشانی",
      "شقیقه",
      "زیرچشم",
      "میدفیس",
      "بینی",
      "خط خنده",
      "ساب مالار",
      "زاویه فک",
      "میکرو",
      "لب",
      "چانه",
    ],
    بوتاکس: ["اوت لاین", "بینی", "مستر"],
    مزوتراپی: ["مو", "زیرچشم", "فول فیس", "گردن"],
    جوانساز: ["پروفایلو فیس", "پروفایلو استراکچر", "فول فیس", "گردن", "دست"],
    "پی آر پی": ["مو", "صورت"],
  };
  const fillerColor = {
    پیشانی: "#FFE7D0",
    شقیقه: "#BCEDA7",
    زیرچشم: "#FECD5B",
    میدفیس: "#B54EFF",
    بینی: "#9099FD",
    "خط خنده": "#DBDDDD",
    "ساب مالار": "#99F0FA",
    "زاویه فک": "#EEFB84",
    میکرو: "#F07474",
    لب: "#F4B1E1",
    چانه: "#CBA374",
  };

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prevSelected) => {
      const currentSubcategories = prevSelected[navigation];
      if (currentSubcategories.includes(subcategory)) {
        return {
          ...prevSelected,
          [navigation]: currentSubcategories.filter(
            (item) => item !== subcategory
          ),
        };
      } else {
        return {
          ...prevSelected,
          [navigation]: [...currentSubcategories, subcategory],
        };
      }
    });
  };

  const handleCategories = async () => {
    let allRecords = popupDiagramData.record.records;
    let currentRecord = popupDiagramData.lastRecord;
    currentRecord.visitHistory = selectedSubcategories;
    let updatedRecords = [...allRecords];
    if (updatedRecords.length > 0) {
      updatedRecords[updatedRecords.length - 1] = currentRecord;
    }
    let updateRecordObject = {
      ...popupDiagramData.record,
      records: updatedRecords,
    };
    await updateRecordApi(updateRecordObject);
    setPopupDiagramData(null);
  };

  const getFillerColor = (key) => {
    if (fillerColor[key]) {
      return (
        <div
          style={{
            backgroundColor: fillerColor[key],
            backgroundColor: fillerColor[key],
            borderRadius: "50px",
            padding: "4px 8px",
            margin: "0px 2px",
            fontWeight: "bold",
            minWidth: "80px",
          }}
        >
          {key}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classes.container}>
      {Object.entries(selectedSubcategories).map(([key, values]) => (
        <div
          key={key}
          className={classes.selectedSubcategories}
          style={{
            background:
              key === navigation && activeFunctionality ? "#ffffff" : "",
            border:
              key === navigation && activeFunctionality
                ? "1px solid #2d2b7f"
                : "1px solid #d6d6d6",
            pointerEvents: activeFunctionality ? "auto" : "none",
          }}
          onClick={() => {
            activeFunctionality ? setNavigation(key) : null;
          }}
        >
          <p
            style={{
              color:
                key === navigation && activeFunctionality ? " #2d2b7f" : "",
            }}
          >
            {key}
          </p>
          {values.map((value, index) => (
            <div key={index} className={classes.row}>
              {key === "فیلر" ? getFillerColor(value) : <h4>{value}</h4>}
            </div>
          ))}
        </div>
      ))}
      {navigation !== "فیلر" && activeFunctionality && (
        <Fragment>
          <div className={classes.navigationTypes}>
            {categories[navigation].map((item, index) => (
              <p
                className={classes.nav}
                style={{
                  fontWeight: "bold",
                  border: "1px solid #2d2b7f",
                }}
                onClick={() => handleSubcategoryToggle(item)}
                key={index}
              >
                {item}
              </p>
            ))}
          </div>
        </Fragment>
      )}
      {navigation === "فیلر" && (
        <Fragment>
          {activeFunctionality && (
            <div className={classes.navigationTypes}>
              {categories[navigation].map((item, index) => (
                <p
                  key={index}
                  className={classes.nav}
                  style={{
                    fontWeight: "bold",
                    background: fillerColor[item],
                    color: "#1b1b1b",
                  }}
                  onClick={() => handleSubcategoryToggle(item)}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
          <div
            style={{
              margin: "8px 0px",
              color: "#999999",
            }}
          >
            {!activeFunctionality && (
              <p>برای اعمال تزریق روی صورت بیمار به جدول بالا مراجعه کنید</p>
            )}
            <p>مناطق روی صورت جهت راهنمای فیلر نشان داده شده</p>
          </div>
          <div className={classes.diagram}>
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
      {currentUser?.permission === "doctor" && (
        <button className={classes.button} onClick={() => handleCategories()}>
          تکمیل
        </button>
      )}
    </div>
  );
}
