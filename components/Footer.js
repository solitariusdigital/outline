import { useContext, Fragment } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./Footer.module.scss";
import Link from "next/link";
import Router from "next/router";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <div className={classes.container}>
      <h3>ما را در شبکه‌های اجتماعی دنبال کنید</h3>
      <Link href="" target="_blank" rel="noopener noreferrer" passHref>
        <InstagramIcon className={classes.icon} />
      </Link>
    </div>
  );
}
