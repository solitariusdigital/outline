import { Fragment, useContext, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./ProcessFrom.module.scss";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import loaderImage from "@/assets/loader.png";
import { fourGenerator, sixGenerator, uploadMedia } from "@/services/utility";
import { createProcessApi } from "@/services/api";

export default function ProcessFrom() {
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [progress, setProgress] = useState(0);
  const sourceLink = "https://bucket.outlinecommunity.com";
  const router = useRouter();

  const removeImageInputFile = (inputId) => {
    const input = document.getElementById(inputId);
    if (input) input.value = null;
  };

  const handleImageChange = (event) => {
    const array = Array.from(event.target.files);
    const preview = array.map((item) => ({
      file: item,
      link: URL.createObjectURL(item),
    }));
    setUploadImage(preview);
    setImagePreview(preview);
  };

  const handleSubmit = async () => {
    if (uploadImage.length !== 1) {
      showAlert("تصویر انتخاب کنید");
      return;
    }

    setDisableButton(true);

    const totalSteps = uploadImage.length;
    const progressIncrement = 100 / totalSteps;

    let mediaLinks = [];
    const mediaFolder = "process";
    const processId = `prc${sixGenerator()}`;
    const imageFormat = ".jpg";

    for (const media of uploadImage) {
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
        active: true,
      });
      setProgress((prevProgress) => prevProgress + progressIncrement);
    }

    const processObject = {
      title: title,
      description: description,
      media: mediaLinks,
    };

    await createProcessApi(processObject);

    showAlert("ذخیره شد");
    setProgress(100);
    setDisableButton(false);
    setProgress(0);
    setTitle("");
    setDescription("");
    setImagePreview([]);
    setUploadImage([]);
    removeImageInputFile("inputImage");
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
              setImagePreview([]);
              setUploadImage([]);
              removeImageInputFile("inputImage");
            }}
            sx={{ fontSize: 16 }}
          />
          <label className="file">
            <input
              onChange={(e) => handleImageChange(e)}
              id="inputImage"
              type="file"
              accept="image/*"
            />
            <p>Select Image</p>
          </label>
          {imagePreview.length > 0 && (
            <div className={classes.preview}>
              {imagePreview.map((image, index) => (
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
