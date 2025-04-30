import { useState, useContext, Fragment, useEffect } from "react";
import classes from "./FaceDiagram.module.scss";
import Image from "next/legacy/image";
import faceDiagram from "@/assets/faceDiagram.png";

export default function FaceDiagram() {
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
  const [selectedSubcategories, setSelectedSubcategories] = useState({
    فیلر: [],
    بوتاکس: [],
    مزوتراپی: [],
    جوانساز: [],
    "پی آر پی": [],
  });
  const fillerColor = [
    "#FFE7D0",
    "#BCEDA7",
    "#FECD5B",
    "#B54EFF",
    "#9099FD",
    "#DBDDDD",
    "#99F0FA",
    "#EEFB84",
    "#F07474",
    "#F4B1E1",
    "#CBA374",
  ];

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
          <div className={classes.navigationTypes}>
            {categories[navigation].map((item, index) => (
              <p
                className={classes.nav}
                style={{ fontWeight: "bold" }}
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
          <div className={classes.navigationTypes}>
            {categories[navigation].map((item, index) => (
              <p
                key={index}
                className={classes.nav}
                style={{
                  fontWeight: "bold",
                  background: fillerColor[index],
                  color: "#1b1b1b",
                }}
                onClick={() => handleSubcategoryToggle(item)}
              >
                {item}
              </p>
            ))}
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
