import { useState, useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./FaceDiagram.module.scss";
import Image from "next/legacy/image";
import faceDiagram from "@/assets/faceDiagram.png";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { updateRecordApi } from "@/services/api";

const defaultInjections = {
  فیلر: [],
  بوتاکس: [],
  مزوتراپی: [],
  جوانساز: [],
  "پی آر پی": [],
  آنزیم: [],
  سونوگرافی: [],
  "لیزر سرجیکال": [],
  "لیزر فرکشنال": [],
};
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
    "گردن",
    "خط غم",
    "قاب صورت",
    "دست",
  ],
  بوتاکس: [
    "اوت‌لاین",
    "بینی",
    "مستر",
    "زیربغل",
    "کف دست",
    "گامی اسمایل",
    "خط اخم",
    "دورچشم",
    "چانه",
    "گردن",
    "میگرن",
  ],
  مزوتراپی: ["مو", "زیرچشم", "فول فیس", "گردن", "چربی سوز"],
  جوانساز: [
    "پروفایلو فیس",
    "پروفایلو استراکچر",
    "فول فیس",
    "گردن",
    "دست",
    "Sline زیرچشم",
    "Sline فیس",
  ],
  "پی آر پی": ["مو", "صورت"],
  آنزیم: ["آنزیم"],
  سونوگرافی: ["سونوگرافی"],
  "لیزر سرجیکال": [
    "پیشانی",
    "زیرچشم",
    "میدفیس",
    "بینی",
    "ساب مالار",
    "پری اورال",
    "چانه",
  ],
  "لیزر فرکشنال": [
    "پیشانی",
    "زیرچشم",
    "میدفیس",
    "بینی",
    "ساب مالار",
    "پری اورال",
    "چانه",
    "گردن",
  ],
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
  گردن: "#C6DEFF",
  "خط غم": "",
  "قاب صورت": "",
  دست: "",
};

export default function FaceDiagram() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { popupDiagramData, setPopupDiagramData } = useContext(StateContext);
  const [selectedSubcategories, setSelectedSubcategories] = useState(
    popupDiagramData.lastRecord?.visitHistory
  );
  const [selectedInjections, setSelectedInjections] = useState(
    popupDiagramData.lastRecord?.injectHistory ?? defaultInjections
  );
  const [extraFiller, setExtraFiller] = useState(
    popupDiagramData.lastRecord.extraFiller || []
  );
  const [comment, setComment] = useState(popupDiagramData.lastRecord?.comment);
  const activeFunctionality =
    currentUser?.permission === "doctor" ? true : false;
  const [displayGuide, setDisplayGuide] = useState(false);
  const [navigation, setNavigation] = useState(
    "فیلر" ||
      "بوتاکس" ||
      "مزوتراپی" ||
      "جوانساز" ||
      "پی آر پی" ||
      "آنزیم" ||
      "سونوگرافی" ||
      "لیزر سرجیکال" ||
      "لیزر فرکشنال"
  );
  const router = useRouter();

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
    setSelectedInjections((prevState) => {
      return {
        ...prevState,
        [navigation]: prevState[navigation].map((item) =>
          item.name === subcategory ? { ...item, active: false } : item
        ),
      };
    });
  };

  const handleChangeInjections = (key, value) => {
    setSelectedInjections((prevState) => {
      const currentCategory = prevState[key] || [];
      const index = currentCategory.findIndex((item) => item.name === value); // Find the index of the item
      if (index !== -1) {
        // If the item exists, toggle its active state
        const updatedItem = {
          ...currentCategory[index],
          active: !currentCategory[index].active,
        };
        return {
          ...prevState,
          [key]: [
            ...currentCategory.slice(0, index), // Items before the index
            updatedItem, // Updated item
            ...currentCategory.slice(index + 1), // Items after the index
          ],
        };
      } else {
        // If the item does not exist, add it with active set to true
        return {
          ...prevState,
          [key]: [
            ...currentCategory,
            { name: value, amount: "", active: true },
          ],
        };
      }
    });
  };

  const handleSaveData = async () => {
    let allRecords = popupDiagramData.record.records;
    let currentRecord = popupDiagramData.lastRecord;
    currentRecord.visitHistory = selectedSubcategories;
    currentRecord.injectHistory = selectedInjections;
    currentRecord.extraFiller = extraFiller;
    currentRecord.comment = comment;
    let updatedRecords = [...allRecords];
    if (updatedRecords.length > 0) {
      updatedRecords[updatedRecords.length - 1] = currentRecord;
    }
    let updateRecordObject = {
      ...popupDiagramData.record,
      checkup: true,
      records: updatedRecords,
    };
    await updateRecordApi(updateRecordObject);
    router.reload(router.asPath);
  };

  const getFillerColor = (value) => {
    return (
      <div
        className={classes.row}
        style={{
          backgroundColor: fillerColor[value],
          borderRadius: "5px",
          padding: "4px",
          justifyContent: "space-around",
        }}
      >
        {currentUser?.permission === "doctor" && (
          <Tooltip title="Extra">
            <AddCircleOutlineIcon
              className="icon"
              onClick={() => {
                addExtraFiller(value);
              }}
              sx={{ fontSize: 20 }}
            />
          </Tooltip>
        )}
        <h4>{value}</h4>
      </div>
    );
  };

  const addExtraFiller = (value) => {
    setExtraFiller((prevState) => {
      if (prevState.includes(value)) {
        return prevState.filter((item) => item !== value);
      }
      return [...prevState, value];
    });
  };

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.text}>
          <h4>جدول مشاوره</h4>
        </div>
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
            <div className={classes.grid}>
              {values.map((value, index) => (
                <Fragment key={index}>
                  {key === "فیلر" ? getFillerColor(value) : <h4>{value}</h4>}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
        {navigation !== "فیلر" && activeFunctionality && (
          <div className={classes.navigationTypes}>
            {categories[navigation].map((item, index) => (
              <p
                key={index}
                className={classes.nav}
                style={{
                  fontWeight: "bold",
                  border: "1px solid #2d2b7f",
                }}
                onClick={() => handleSubcategoryToggle(item)}
              >
                {item}
              </p>
            ))}
          </div>
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
                      border: `1px solid ${
                        !fillerColor[item] ? "#2d2b7f" : "none"
                      }`,
                    }}
                    onClick={() => handleSubcategoryToggle(item)}
                  >
                    {item}
                  </p>
                ))}
              </div>
            )}
            {!activeFunctionality && (
              <div className={classes.comment}>
                <span>نظر پزشک</span>
                <h4>{comment ? comment : "-"}</h4>
              </div>
            )}
            <button
              className={classes.buttonGuide}
              onClick={() => setDisplayGuide(!displayGuide)}
            >
              راهنما فیلر
            </button>
            {displayGuide && (
              <div className={classes.text}>
                {!activeFunctionality && (
                  <p>
                    برای اعمال تزریق روی صورت بیمار به جدول مشاوره مراجعه کنید
                  </p>
                )}
                <p>مناطق روی صورت جهت راهنما فیلر نشان داده شده</p>
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
              </div>
            )}
          </Fragment>
        )}
        {currentUser?.permission === "doctor" && (
          <div className={classes.textarea}>
            <div className={classes.bar}>
              <CloseIcon
                className="icon"
                onClick={() => setComment("")}
                sx={{ fontSize: 16 }}
              />
            </div>
            <textarea
              placeholder="نظر پزشک"
              type="text"
              name="comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              autoComplete="off"
              dir="rtl"
            />
            <button className={classes.button} onClick={() => handleSaveData()}>
              تکمیل مشاوره
            </button>
          </div>
        )}
      </div>
      <div>
        <div className={classes.text}>
          <h4>جدول تزریق</h4>
          <p>تزریق انجام شده را انتخاب کنید</p>
        </div>
        {Object.entries(selectedSubcategories).map(([key, values]) => (
          <Fragment key={key}>
            {values.length > 0 && (
              <div className={classes.selectedInjections}>
                <p>{key}</p>
                <div className={classes.grid}>
                  {values.map((value, index) => (
                    <div
                      key={`${key}-${value}-${index}`}
                      className={classes.row}
                      onClick={() => handleChangeInjections(key, value)}
                    >
                      {key === "فیلر" && extraFiller.includes(value) && (
                        <Tooltip title="Extra">
                          <AddCircleOutlineIcon
                            className="icon"
                            sx={{ fontSize: 20 }}
                          />
                        </Tooltip>
                      )}
                      <h4>{value}</h4>
                      {!!selectedInjections[key].find(
                        (item) => item.name === value
                      )?.active ? (
                        <RadioButtonCheckedIcon
                          sx={{ fontSize: 28 }}
                          className="icon"
                        />
                      ) : (
                        <RadioButtonUncheckedIcon
                          sx={{ fontSize: 28 }}
                          className="icon"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Fragment>
        ))}
        <button className={classes.button} onClick={() => handleSaveData()}>
          تکمیل تزریق
        </button>
      </div>
    </div>
  );
}
