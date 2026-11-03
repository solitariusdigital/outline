import { useContext, Fragment, useEffect, useRef, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { NextSeo } from "next-seo";
import classes from "./gallery.module.scss";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Router from "next/router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getProcessApi, deleteProcessApi } from "@/services/api";

export default function Gallery() {
  const { currentUser, setCurrentUser } = useContext(StateContext);
  const { language, setLanguage } = useContext(StateContext);
  const { screenSize, setScreenSize } = useContext(StateContext);
  const { editProcess, setEditProcess } = useContext(StateContext);
  const { methodTypes, setMethodTypes } = useContext(StateContext);
  const [displayProcess, setDisplayProcess] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const fullSizeScreen = screenSize === "desktop";

  const targetBox = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let process = await getProcessApi();
        process.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDisplayProcess(process);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    let confirmationMessage = "حذف مطمئنی؟";
    let confirm = window.confirm(confirmationMessage);
    if (confirm) {
      await deleteProcessApi(id);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleEdit = async (id) => {
    setEditProcess(id);
    Router.push("/manager");
  };

  const scrollToDivBox = () => {
    if (targetBox.current) {
      targetBox.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Fragment>
      <NextSeo
        title={language ? "گالری مراجعین" : "Patient Gallery"}
        description={language ? "کلینیک پزشکی" : "Medical Clinic"}
        canonical="https://outlinecommunity.com/gallery"
        openGraph={{
          type: "website",
          locale: "fa_IR",
          url: "https://outlinecommunity.com/gallery",
          title: language ? "گالری مراجعین" : "Patient Gallery",
          description: language ? "کلینیک پزشکی" : "Medical Clinic",
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
      <section
        className={classes.container}
        style={{
          fontFamily: language ? "Yekan-Regular" : "Titillium-Light",
          direction: "ltr",
        }}
      >
        <div className={classes.imageBox}>
          <div className="fadeOverlayTop"></div>
          <Image
            src="https://bucket.outlinecommunity.com/resources/smoke.jpg"
            alt="Gallery"
            fill
            style={{ objectFit: "cover" }}
            as="image"
            priority
          />
          <div className={classes.title}>
            <h1>{language ? "گالری مراجعین" : "Patient Gallery"}</h1>
          </div>
          <div className={classes.scrollDown} onClick={() => scrollToDivBox()}>
            <KeyboardArrowDownIcon
              className="iconSite"
              sx={{ fontSize: 50, color: "white" }}
            />
          </div>
          <div className="fadeOverlayBottom"></div>
        </div>
        <div className={classes.gallery} ref={targetBox}>
          {displayProcess.map((pair, index) => (
            <div
              key={index}
              className={classes.pair}
              onMouseEnter={() => setHoveredId(pair._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {currentUser?.super && (
                <div className={classes.control}>
                  <Tooltip title="Edit">
                    <EditIcon
                      className="iconSite"
                      sx={{ fontSize: 20, color: "white" }}
                      onClick={() => handleEdit(pair._id)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteOutlineIcon
                      className="iconSite"
                      sx={{ fontSize: 20, color: "white" }}
                      onClick={() => handleDelete(pair._id)}
                    />
                  </Tooltip>
                </div>
              )}
              <div className={classes.swiper}>
                <div className="custom-prev" ref={navigationPrevRef}>
                  <ArrowBackIosNewIcon sx={{ fontSize: 24 }} />
                </div>
                <div className="custom-next" ref={navigationNextRef}>
                  <ArrowForwardIosIcon sx={{ fontSize: 24 }} />
                </div>
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={0}
                  mousewheel={true}
                  loop={true}
                  modules={[Navigation, Pagination]}
                  pagination={true}
                  navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                    swiper.params.navigation.nextEl = navigationNextRef.current;
                  }}
                >
                  {pair.media.map((image, index) => {
                    return (
                      <SwiperSlide key={index}>
                        <div className={classes.image}>
                          <Image
                            src={image.link}
                            alt={methodTypes[pair.type].item.fa}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div
                className={classes.info}
                style={{
                  fontFamily: "Titillium-Thin",
                }}
              >
                <h4>BEFORE</h4>
                <h4>AFTER</h4>
              </div>
              {fullSizeScreen && hoveredId === pair._id && (
                <div
                  className={classes.overlay}
                  style={{
                    fontFamily: "Yekan-Regular",
                  }}
                >
                  <h3>{methodTypes[pair.type].item.fa}</h3>
                  <p>{pair.description}</p>
                </div>
              )}
              {!fullSizeScreen && (
                <div
                  className={classes.overlay}
                  style={{
                    fontFamily: "Yekan-Regular",
                  }}
                >
                  <h3>{methodTypes[pair.type].item.fa}</h3>
                  <p>{pair.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={classes.scrollUp} onClick={() => scrollToDivBox()}>
          <KeyboardArrowUpIcon
            className="iconSite"
            sx={{ fontSize: 50, color: "white" }}
          />
        </div>
      </section>
    </Fragment>
  );
}
