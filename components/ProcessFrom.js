import { useContext, useState, useEffect } from "react";
import { StateContext } from "@/context/stateContext";
import classes from "./ProcessFrom.module.scss";
import Router from "next/router";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import loaderImage from "@/assets/loader.png";
import { fourGenerator, sixGenerator, uploadMedia } from "@/services/utility";
import {
  createProcessApi,
  getSingleProcessApi,
  updateProcessApi,
} from "@/services/api";

export default function ProcessFrom() {
  const { editProcess, setEditProcess } = useContext(StateContext);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadImage, setUploadImage] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const sourceLink = "https://bucket.outlinecommunity.com";

  useEffect(() => {
    const fetchData = async () => {
      let processData = await getSingleProcessApi(editProcess);
      setTitle(processData.title);
      setDescription(processData.description);
      setImagePreview([
        {
          link: processData.media[0].link,
        },
      ]);
    };
    if (editProcess) {
      fetchData();
    }
  }, []);

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
    if (!editProcess && uploadImage.length !== 1) {
      showAlert("انتخاب تصویر");
      return;
    }

    setDisableButton(true);

    if (!editProcess) {
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
      }
    }

    const processObject = {
      title: title,
      description: description,
      media: editProcess ? imagePreview : mediaLinks,
    };

    if (editProcess) {
      processObject._id = editProcess;
      await updateProcessApi(processObject);
    } else {
      await createProcessApi(processObject);
    }

    showAlert("ذخیره شد");
    setTitle("");
    setDescription("");
    setImagePreview([]);
    setUploadImage([]);
    removeImageInputFile("inputImage");
    setDisableButton(false);

    if (editProcess) {
      setEditProcess("");
      Router.push("/gallery");
    }
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
          placeholder="..."
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
          placeholder="..."
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
          {!editProcess && (
            <>
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
            </>
          )}
          {imagePreview.length > 0 && (
            <div className={classes.preview}>
              {imagePreview.map((image, index) => (
                <Image
                  key={index}
                  src={image.link}
                  layout="fill"
                  objectFit="cover"
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
          <Image width={50} height={50} src={loaderImage} alt="isLoading" />
        </div>
      )}
    </div>
  );
}
