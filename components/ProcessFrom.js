import { Fragment, useContext, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./ProcessFrom.module.scss";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import loaderImage from "@/assets/loader.png";
import { fourGenerator, sixGenerator, uploadMedia } from "@/services/utility";
import { createProcessApi } from "@/services/api";

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
  const [description, setDescription] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [progress, setProgress] = useState(0);
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
    if (!selectCategory) {
      showAlert("دسته‌بندی الزامیست");
      return;
    }

    const uploadImages = uploadImagesAfter.concat(uploadImagesBefore);
    if (uploadImages.length !== 2) {
      showAlert("دو تصویر انتخاب کنید");
      return;
    }

    setDisableButton(true);

    const totalSteps = uploadImages.length;
    const progressIncrement = 100 / totalSteps;

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
      setProgress((prevProgress) => prevProgress + progressIncrement);
    }

    const processObject = {
      title: title,
      description: description,
      category: selectCategory,
      media: mediaLinks,
    };

    await createProcessApi(processObject);
    showAlert("ذخیره شد");
    setProgress(100);
    setDisableButton(false);
    setProgress(0);
    setTitle("");
    setDescription("");
    setSelectCategory("");
    setImagesPreviewBefore([]);
    setUploadImagesBefore([]);
    removeImageInputFile("inputImageBefore");
    setImagesPreviewAfter([]);
    setUploadImagesAfter([]);
    removeImageInputFile("inputImageAfter");
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
      <div className={classes.input}>
        <div className={classes.bar}>
          <p className={classes.label}>توضیحات</p>
          <CloseIcon
            className="icon"
            onClick={() => setDescription("")}
            sx={{ fontSize: 16 }}
          />
        </div>
        <textarea
          type="text"
          id="description"
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          autoComplete="off"
        ></textarea>
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
      {!disableButton ? (
        <button disabled={disableButton} onClick={() => handleSubmit()}>
          ذخیره
        </button>
      ) : (
        <div>
          <p>Uploading {Math.round(progress)}%</p>
          <Image width={50} height={50} src={loaderImage} alt="isLoading" />
        </div>
      )}
    </div>
  );
}
