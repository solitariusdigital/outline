import { useContext } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Expertise.module.scss";
import Router from "next/router";
import Image from "next/legacy/image";
import Belle33 from "@/assets/Belle-33.png";
import Belle34 from "@/assets/Belle-34.png";
import Belle31 from "@/assets/Belle-31.png";
import Belle38 from "@/assets/Belle-38.png";
import Belle29 from "@/assets/Belle-29.png";
import Belle30 from "@/assets/Belle-30.png";
import Belle32 from "@/assets/Belle-32.png";
import Belle36 from "@/assets/Belle-36.png";
import Belle35 from "@/assets/Belle-35.png";
import Belle37 from "@/assets/Belle-37.png";

export default function Expertise() {
  const { expertiseAreas, setExpertiseAreas } = useContext(StateContext);
  const { navigationTopBar, setNavigationTopBar } = useContext(StateContext);
  const { displayExpertise, setDisplayExpertise } = useContext(StateContext);

  const images = [
    {
      title: "فیلر",
      image: Belle33,
    },
    {
      title: "نوتریژنومیکس",
      image: Belle34,
    },
    {
      title: "لیزر",
      image: Belle31,
    },
    {
      title: "کاشت مو و ابرو",
      image: Belle38,
    },
    {
      title: "بوتاکس",
      image: Belle29,
    },
    {
      title: "پلاسمای غنی از پلاکت",
      image: Belle30,
    },
    {
      title: "درمان با فرکانس رادویی",
      image: Belle32,
    },
    {
      title: "هایفوتراپی",
      image: Belle36,
    },
    {
      title: "کرایوتراپی",
      image: Belle37,
    },
    {
      title: "لیفت با نخ",
      image: Belle35,
    },
  ];

  const expertisesPage = (title) => {
    let route = "/expertises";
    Router.push(route);
    expertiseAreas.map((item) => {
      item.title === title ? (item.active = true) : (item.active = false);
    });
    navigationTopBar.map((nav) => {
      if (nav.link === route) {
        nav.active = true;
      } else {
        nav.active = false;
      }
    });
    setDisplayExpertise(title);
    setExpertiseAreas([...expertiseAreas]);
  };

  return (
    <div className={classes.items}>
      {expertiseAreas.map((item, index) => (
        <div
          className={item.active ? classes.active : ""}
          key={index}
          onClick={() => expertisesPage(item.title)}
        >
          <Image
            width={100}
            height={100}
            src={images[index].image}
            alt="image"
          />
          <p>{item.title}</p>
        </div>
      ))}
    </div>
  );
}
