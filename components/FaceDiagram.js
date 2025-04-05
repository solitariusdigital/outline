import classes from "./FaceDiagram.module.scss";
import Image from "next/legacy/image";
import faceDiagram from "@/assets/faceDiagram.jpg";

export default function FaceDiagram({ zones }) {
  return (
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
  );
}
