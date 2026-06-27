import React from "react";
import classes from "./Cover.module.scss";
import GridBox from "@/components/GridBox";

export default function Cover() {
  return (
    <div className={classes.container}>
      <div className={classes.infoBox}>Content</div>
      <div className={classes.imageBox}>
        <GridBox />
      </div>
    </div>
  );
}
