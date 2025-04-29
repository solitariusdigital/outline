import { useState, useContext, Fragment, useEffect } from "react";
import classes from "./FaceDiagram.module.scss";
import Image from "next/legacy/image";
import faceDiagram from "@/assets/faceDiagram.jpg";

export default function FaceDiagram({ zones }) {
  const [navigation, setNavigation] = useState(
    "فیلر" || "بوتاکس" || "مزوتراپی" || "جوانساز" || "پی آر پی"
  );
  const categories = {
    فیلر: [""],
    بوتاکس: ["اوت لاین", "بینی", "مستر"],
    مزوتراپی: ["مو", "زیرچشم", "فول فیس", "گردن"],
    جوانساز: ["پروفایلو فیس", "پروفایلو استراکچر", "فول فیس", "گردن", "دست"],
    "پی آر پی": ["مو", "صورت"],
  };
  const [selectedSubcategories, setSelectedSubcategories] = useState({
    فیلر: [],
    بوتاکس: [],
    مزوتراپی: [],
    جوانساز: [],
    "پی آر پی": [],
  });

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

  const handleCategories = () => {
    console.log(selectedSubcategories);
  };

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        {Object.entries(categories).map(([category, items]) => (
          <div key={category}>
            <p
              className={
                navigation === category ? classes.activeNav : classes.nav
              }
              onClick={() => setNavigation(category)}
            >
              {category}
            </p>
          </div>
        ))}
      </div>
      {navigation !== "فیلر" && (
        <Fragment>
          <div className={classes.navigation}>
            {categories[navigation].map((item, index) => (
              <p
                className={classes.nav}
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
        <div className={classes.diagram}>
          <div
            className={classes.zone}
            style={{
              backgroundColor: zones.one ? "#E6B2BA" : "",
              height: "20%",
            }}
          ></div>
          <div
            className={classes.zone}
            style={{
              backgroundColor: zones.two ? "#C7D9DD" : "",
              height: "12%",
            }}
          ></div>
          <div
            className={classes.zone}
            style={{
              backgroundColor: zones.three ? "#F2E2B1" : "",
              height: "20%",
            }}
          ></div>
          <div
            className={classes.zone}
            style={{
              backgroundColor: zones.four ? "#FDB7EA" : "",
              height: "20%",
            }}
          ></div>
          <div
            className={classes.zone}
            style={{
              backgroundColor: zones.five ? "#BAD8B6" : "",
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
      )}
      {Object.entries(selectedSubcategories).map(([key, values]) => (
        <div className={classes.selectedSubcategories} key={key}>
          <p>{key}</p>
          {values.map((value, index) => (
            <h4 key={index}>{value}</h4>
          ))}
        </div>
      ))}
      <button className={classes.button} onClick={() => handleCategories()}>
        تکمیل
      </button>
    </div>
  );
}
