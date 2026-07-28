import { Fragment, useContext, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./ProcessFrom.module.scss";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import loaderImage from "@/assets/loader.png";
import { fourGenerator, sixGenerator, uploadMedia } from "@/services/utility";

const categories = [
  "fillers",
  "botox",
  "mesotherapy",
  "skin rejuvenation",
  "PRP",
  "enzyme",
  "ultrasound",
  "surgical laser",
  "fractional laser",
];

export default function ProcessFrom() {
  const [imagesPreviewBefore, setImagesPreviewBefore] = useState([]);
  const [imagesPreviewAfter, setImagesPreviewAfter] = useState([]);
  const [uploadImagesBefore, setUploadImagesBefore] = useState([]);
  const [uploadImagesAfter, setUploadImagesAfter] = useState([]);
  const [title, setTitle] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [alert, setAlert] = useState("");
  const [loader, setLoader] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const sourceLink = "https://bucket.outlinecommunity.com";
  const router = useRouter();

  const removeImageInputFile = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.value = null;
  };

  const handleImageChange = (event, type) => {
    const array = Array.from(event.target.files);
    const preview = array.map((item) => ({
      file: item,
      link: URL.createObjectURL(item),
      type: type,
    }));

    if (type === "before") {
      setUploadImagesBefore(preview);
      setImagesPreviewBefore(preview);
    } else {
      setUploadImagesAfter(preview);
      setImagesPreviewAfter(preview);
    }
  };

  const handleSubmit = async () => {
    if (!title || !selectCategory) {
      showAlert("عنوان و دسته‌بندی الزامیست");
      return;
    }

    const uploadImages = uploadImagesAfter.concat(uploadImagesBefore);
    if (uploadImages.length !== 2) {
      showAlert("دو تصویر انتخاب کنید");
      return;
    }

    setLoader(true);
    setDisableButton(true);

    let mediaLinks = [];
    const mediaFolder = "process";
    const processId = `prc${sixGenerator()}`;
    const imageFormat = ".jpg";

    for (const media of uploadImages) {
      const mediaId = `img${fourGenerator()}`;
      const mediaLink = `${sourceLink}/${mediaFolder}/${processId}/${mediaId}${imageFormat}`;
      await uploadMedia(
        media.file,
        mediaId,
        mediaFolder,
        processId,
        imageFormat,
      );
      mediaLinks.push({
        link: mediaLink,
        type: media.type,
        active: true,
      });
    }

    const processObject = {
      title: title,
      category: selectCategory,
      media: mediaLinks,
    };

    showAlert("ذخیره شد");
    router.reload(router.asPath);
  };

  const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => {
      setAlert("");
    }, 3000);
  };

  return (
    <div className={classes.form}>
      <div className={classes.input}>
        <select
          defaultValue={"default"}
          onChange={(e) => {
            setSelectCategory(e.target.value);
          }}
        >
          <option value="default" disabled>
            انتخاب دسته‌بندی
          </option>
          {categories.map((category, index) => {
            return (
              <option key={index} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>عنوان</p>
          <CloseIcon
            className="icon"
            onClick={() => setTitle("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          maxLength={11}
          value={title}
          autoComplete="off"
          dir="rtl"
        />
      </div>
      <div className={classes.mediaContainer}>
        <div className={classes.media}>
          <CloseIcon
            className="icon"
            onClick={() => {
              setImagesPreviewAfter([]);
              setUploadImagesAfter([]);
              removeImageInputFile("inputImageAfter");
            }}
            sx={{ fontSize: 16 }}
          />
          <label className="file">
            <input
              onChange={(e) => handleImageChange(e, "after")}
              id="inputImageAfter"
              type="file"
              accept="image/*"
            />
            <p>After</p>
          </label>
          {imagesPreviewAfter.length > 0 && (
            <div className={classes.preview}>
              {imagesPreviewAfter.map((image, index) => (
                <Image
                  key={index}
                  layout="fill"
                  objectFit="cover"
                  src={image.link}
                  alt="image"
                  priority
                />
              ))}
            </div>
          )}
        </div>
        <div className={classes.media}>
          <CloseIcon
            className="icon"
            onClick={() => {
              setImagesPreviewBefore([]);
              setUploadImagesBefore([]);
              removeImageInputFile("inputImageBefore");
            }}
            sx={{ fontSize: 16 }}
          />
          <label className="file">
            <input
              onChange={(e) => handleImageChange(e, "before")}
              id="inputImageBefore"
              type="file"
              accept="image/*"
            />
            <p>Before</p>
          </label>
          {imagesPreviewBefore.length > 0 && (
            <div className={classes.preview}>
              {imagesPreviewBefore.map((image, index) => (
                <Image
                  key={index}
                  layout="fill"
                  objectFit="cover"
                  src={image.link}
                  alt="image"
                  priority
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <p className={classes.alert}>{alert}</p>
      {loader && (
        <div>
          <Image width={50} height={50} src={loaderImage} alt="isLoading" />
        </div>
      )}
      <button disabled={disableButton} onClick={() => handleSubmit()}>
        ذخیره
      </button>
    </div>
  );
}
